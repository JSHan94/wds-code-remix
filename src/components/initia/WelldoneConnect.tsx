import { useEffect, useState } from 'react';
import { Alert, Form, InputGroup } from 'react-bootstrap';
import { Client } from '@remixproject/plugin';
import { Api } from '@remixproject/plugin-utils';
import { IRemixApi } from '@remixproject/plugin-api';
import AlertCloseButton from '../common/AlertCloseButton';
import { log } from '../../utils/logger';

interface InterfaceProps {
  active: boolean;
  setAccount: Function;
  account: string;
  setDapp: Function;
  client: Client<Api, Readonly<IRemixApi>>;
  setActive: Function;
}

declare global {
  interface Window {
    initia: any;
  }
}

export const WelldoneConnect: React.FunctionComponent<InterfaceProps> = ({
  client,
  active,
  account,
  setDapp,
  setAccount,
  setActive,
}) => {
  const [balance, setBalance] = useState<string>('');
  const [error, setError] = useState<String>('');

  const dappProvider = window.initia;
  setDapp(dappProvider);

  // Establish a connection to the Aptos blockchain on component mount
  useEffect(() => {
    const connect = async () => {
      if (active) {
        try {
          if (dappProvider) {
            await client.terminal.log({ type: 'info', value: "initia wallet successfully connected!" });
            const account = await dappProvider.getAddress()
            await client.terminal.log({ type: 'info', value: "initia get account : " + account });
            setAccount(account);
          } else {
            setAccount('');
            setBalance('');
            setActive(false);
          }
        } catch (e: any) {
          log.error("connect err : ", e);
          await client.terminal.log({ type: 'error', value: e?.message?.toString() });
        }
      }
    };
    connect();
  }, [active, dappProvider]);

  return (
    <div>
      <Alert variant="danger" hidden={error === ''}>
        <AlertCloseButton onClick={() => setError('')} />
        <div>{error}</div>
      </Alert>
      <Form>
        <Form.Group>
          <Form.Text className="text-muted" style={mb4}>
            <small>ACCOUNT</small>
          </Form.Text>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Account"
              value={account ? account : ''}
              size="sm"
              readOnly
            />
          </InputGroup>
          <Form.Text className="text-muted" style={mb4}>
            <small>BALANCE</small>
          </Form.Text>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Balance"
              value={account ? balance : ''}
              size="sm"
              readOnly
            />
          </InputGroup>
        </Form.Group>
      </Form>
    </div>
  );
};

const mb4 = {
  marginBottom: '4px',
};
