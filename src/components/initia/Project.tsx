import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaSyncAlt } from 'react-icons/fa';
import { Compiler } from './Compiler';

import axios from 'axios';
import JSZip from 'jszip';
import wrapPromise from '../../utils/wrapPromise';
import { sendCustomEvent } from '../../utils/sendCustomEvent';
import { COMPILER_API_ENDPOINT } from '../../const/endpoint';
import { PROJECT_NAME } from '../../const';
import { Client } from '@remixproject/plugin';
import { Api } from '@remixproject/plugin-utils';
import { IRemixApi } from '@remixproject/plugin-api';
import { log } from '../../utils/logger';

interface InterfaceProps {
  wallet: string;
  account: string;
  client: Client<Api, Readonly<IRemixApi>>;
  dapp: any;
}

export const Project: React.FunctionComponent<InterfaceProps> = ({
  wallet,
  account,
  dapp,
  client,
}) => {
  const [projectName, setProjectName] = useState<string>('basic-coin');
  const [projectList, setProjectList] = useState<string[]>([]);
  const [compileTarget, setCompileTarget] = useState<string>('');
  const [template, setTemplate] = useState<string>('basic-coin');
  const templateList = ['basic-coin', 'dex', 'nft-controller', 'math', 'liquid-staking'];

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const list = await getProjectList();
    setProjectList(list);
    list?.length > 0 && setCompileTarget(list[0]);
  };

  const wrappedGetList = () => wrapPromise(getList(), client);

  const setProject = (e: { target: { value: React.SetStateAction<string> } }) => {
    setProjectName(e.target.value);
  };

  const setTarget = (e: { target: { value: React.SetStateAction<string> } }) => {
    setCompileTarget(e.target.value);
  };

  const setTargetTemplate = (e: { target: { value: React.SetStateAction<string> } }) => {
    setTemplate(e.target.value);
  };

  const createProject = async () => {
    sendCustomEvent('new_project', {
      event_category: PROJECT_NAME,
      method: 'new_project',
    });
    if (await wrappedIsExists(projectName)) {
      await client.terminal.log({
        type: 'error',
        value: 'The folder "initia/' + projectName + '" already exists',
      });
      return;
    }

    try {
      const path = `browser/${PROJECT_NAME}/${projectName}`;
      await client?.fileManager.mkdir(path + '/sources');
      await client?.fileManager.writeFile(path + '/Move.toml', '');
      wrappedGetList();
    } catch (e: any) {
      client.terminal.log(e.message);
    }
  };
  const wrappedCreateProject = () => wrapPromise(createProject(), client);

  const getProjectList = async () => {
    try {
      const list = await client?.fileManager.readdir('browser/initia/');
      return Object.keys(list || []);
    } catch (e) {
      log.error(e);
    }
    return [];
  };

  // const wrappedGetProjectList = () => wrapPromise(getProjectList(), client);

  const isExists = async (dir: string) => {
    try {
      log.debug(await client.fileManager.readdir('browser/initia/' + dir));
      return true;
    } catch (e) {
      log.error(e);
      return false;
    }
  };

  const wrappedIsExists = (dir: string) => wrapPromise(isExists(dir), client);

  const createTemplate = async () => {
    sendCustomEvent('create_template', {
      event_category: PROJECT_NAME,
      method: 'create_template',
    });

    if (await wrappedIsExists(template)) {
      await client.terminal.log({
        type: 'error',
        value: `The folder "initia/${template} already exists`,
      });
      return;
    }

    const res = await axios.request({
      method: 'GET',
      url:
        `${COMPILER_API_ENDPOINT}/s3Proxy?bucket=initia-code-template&fileKey=${template}.zip`,
      responseType: 'arraybuffer',
      responseEncoding: 'null',
    });

    const jsZip = new JSZip();
    const zip = await jsZip.loadAsync(res.data);

    let content: any;
    try {
      Object.keys(zip.files).map(async (key) => {
        log.debug(`@@@ key=${key}`);
        if (zip.files[key].dir) {
          await client?.fileManager.mkdir(`browser/${PROJECT_NAME}/${key}`);
        } else if (!key.startsWith('_') && key !== template + '/.DS_Store') {
          content = await zip.file(key)?.async('string');
          await client?.fileManager.writeFile('browser/initia/' + key, content);
        }
      });
      await wrappedGetList();
      await client.terminal.log({ type: 'info', value: template + ' is created successfully.' });
    } catch (e) {
      log.error(e);
    }
  };

  const wrappedCreateTemplate = () => wrapPromise(createTemplate(), client);

  return (
    <div>
      <Form>
        <Form.Group style={mt8}>
          <Form.Text className="text-muted" style={mb4}>
            <small>NEW PROJECT</small>
          </Form.Text>
          <InputGroup>
            <Form.Control type="text" placeholder="Project Name" size="sm" onChange={setProject} />
            <Button variant="success" size="sm" onClick={wrappedCreateProject}>
              <small>Create</small>
            </Button>
          </InputGroup>
        </Form.Group>
        <Form.Group style={mt8}>
          <Form.Text className="text-muted" style={mb4}>
            <small>SELECT A TEMPLATE</small>
          </Form.Text>
          <InputGroup>
            <Form.Control className="custom-select" as="select" value={template} onChange={setTargetTemplate}>
              {templateList.map((temp, idx) => {
                return (
                  <option value={temp} key={idx}>
                    {temp}
                  </option>
                );
              })}
            </Form.Control>
            <Button variant="success" size="sm" onClick={wrappedCreateTemplate}>
              <small>Create</small>
            </Button>
          </InputGroup>
        </Form.Group>
        <Form.Group style={mt8}>
          <Form.Text className="text-muted" style={mb4}>
            <small>TARGET PROJECT </small>
            <span onClick={wrappedGetList}>
              <FaSyncAlt />
            </span>
          </Form.Text>
          <InputGroup>
            <Form.Control
              className="custom-select"
              as="select"
              value={compileTarget}
              onChange={setTarget}
            >
              {projectList?.map((projectName, idx) => {
                return (
                  <option value={projectName} key={idx}>
                    {projectName}
                  </option>
                );
              })}
            </Form.Control>
          </InputGroup>
        </Form.Group>
      </Form>

      <hr />
      <Compiler compileTarget={compileTarget} accountID={account} dapp={dapp} client={client} />
    </div>
  );
};

const mt8 = {
  marginTop: '8px',
};

const mb4 = {
  marginBottom: '4px',
};
