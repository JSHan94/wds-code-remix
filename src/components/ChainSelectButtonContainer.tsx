import { Badge, Form, ListGroup } from 'react-bootstrap';

import Aptos from '../assets/Aptos-Big.png';
import Near from '../assets/Near-Big.png';
import Celo from '../assets/Celo-Big.png';
import Juno from '../assets/Juno-Big.png';
import Klaytn from '../assets/Klaytn-Big.png';
import RefreshButton from './common/RefreshButton';
import { FunctionComponent } from 'react';
import { EditorClient } from '../utils/editor';
import { IRemixApi } from '@remixproject/plugin-api';
import { Client } from '@remixproject/plugin';
import { Api } from '@remixproject/plugin-utils';

interface InterfaceProps {
  setChain: Function;
  client: Client<Api, Readonly<IRemixApi>>;
}

export const ChainSelectButtonContainer: FunctionComponent<InterfaceProps> = ({
  setChain,
  client,
}) => {
  const handleRefresh = async () => {
    const editorClient = new EditorClient(client);
    await editorClient.discardHighlight();
    await editorClient.clearAnnotations();
    window.location.reload();
  };

  return (
    <div>
      <Form.Group>
        <Form.Text
          className="text-muted"
          style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}
        >
          <span>Select a Chain</span>
          <RefreshButton handleRefresh={handleRefresh} />
        </Form.Text>
        <ListGroup>
          <ListGroup.Item
            as="li"
            action
            onClick={() => {
              setChain('Aptos');
            }}
          >
            <img src={Aptos} style={{ width: '35px', marginRight: '20px' }} alt="Aptos logo" />
            <b>INITIA</b>
            <Badge bg="danger" style={{ position: 'absolute', right: '10px', top: '20px' }}>
              Beta
            </Badge>
          </ListGroup.Item>
        </ListGroup>
      </Form.Group>
    </div>
  );
};
