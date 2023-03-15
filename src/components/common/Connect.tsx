import { Dispatch, useState } from 'react';
import Welldone from '../../assets/dsrv_wallet_icon.png';
import { Client } from '@remixproject/plugin';
import { Api } from '@remixproject/plugin-utils';
import { IRemixApi } from '@remixproject/plugin-api';
import { ListGroup, Alert } from 'react-bootstrap';
import AlertCloseButton from '../common/AlertCloseButton';

interface InterfaceProps {
  client: Client<Api, Readonly<IRemixApi>>;
  active: boolean;
  setActive: Dispatch<React.SetStateAction<boolean>>;
  chain: string;
  setWallet: Function;
  wallet: string;
}

export const Connect: React.FunctionComponent<InterfaceProps> = ({ client, active, setActive, chain, setWallet, wallet }) => {
  const [error, setError] = useState<string>('');
  return (
    <ListGroup>
      <ListGroup.Item
        as="li"
        action
        active={active && (wallet === 'welldone')}
        onClick={async () => {
          console.log("clicked ! ", window.initia)
          if (!window.initia) {
            await client.terminal.log({
              value:
                'Please Install WELLDONE Wallet http://abit.ly/install-welldone-wallet . If you have installed it, please press the refresh button.',
              type: 'error',
            });
            setError('Install WELLDONE Wallet');
          } else {
            console.log("wallet connect success!")
            setActive(true);
            setWallet('welldone')
          }
        }}
      >
        <img src={Welldone} style={{ width: '25px', marginRight: '10px' }} alt="WELLDONE logo" />
        <b>Connect to WELLDONE</b>
      </ListGroup.Item>
      <Alert style={{ marginTop: '10px' }} variant="danger" hidden={error === ''}>
        <AlertCloseButton onClick={() => setError('')} />
        <div>{error}</div>
      </Alert>
    </ListGroup>
  );
};
