import React, { useState } from 'react';
import { Button, Card, InputGroup, Form as ReactForm } from 'react-bootstrap';
import { FaSyncAlt } from 'react-icons/fa';
import { sendCustomEvent } from '../../utils/sendCustomEvent';
import { Client } from '@remixproject/plugin';
import { Api } from '@remixproject/plugin-utils';
import { IRemixApi } from '@remixproject/plugin-api';
import { log } from '../../utils/logger';
import { genRawTx, getAccountResources, waitForTransactionWithResult } from './initia-helper';
import { MsgPublish } from '@initia/initia.js'
import { MsgPublish as MsgPublishProto } from "@initia/initia.proto/initia/move/v1/tx"
import { SigningStargateClient } from "@cosmjs/stargate"
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx"
import {PROJECT_NAME} from '../../const'

import copy from 'copy-to-clipboard';
import { isNotEmptyList } from '../../utils/ListUtil';

interface DeployProps {
  wallet: string;
  accountID: string;
  moduleBase64s: string[];
  dapp: any;
  client: Client<Api, Readonly<IRemixApi>>;
  setDeployedContract: Function;
  setAtAddress: Function;
  setAccountResources: Function;
  setTargetResource: Function;
  setParameters: Function;
  getAccountModulesFromAccount: Function;
}

export const Deploy: React.FunctionComponent<DeployProps> = ({
  client,
  accountID,
  moduleBase64s,
  wallet,
  dapp,
  setDeployedContract,
  setAtAddress,
  setAccountResources,
  setTargetResource,
  setParameters,
  getAccountModulesFromAccount,
}) => {
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [deployIconSpin, setDeployIconSpin] = useState<string>('');
  const [abi, setABI] = useState<any>({});
  const [param, setParam] = useState<string>('');
  const [resource, setResource] = useState<string>('');

  const checkExistContract = async () => {
    if (!dapp) {
      throw new Error('Wallet is not installed');
    }

    if (!accountID) {
      throw new Error('No accountID');
    }

    if (!(moduleBase64s.length > 0)) {
      throw new Error('Not prepared module');
    }

    await dsrvProceed();
  };

  const dsrvProceed = async () => {
    setInProgress(true);
    sendCustomEvent('deploy', {
      event_category: PROJECT_NAME,
      method: 'deploy',
    });

    if (!dapp) {
      return;
    }

    try {
      setDeployIconSpin('fa-spin');

      const msg = new MsgPublish(accountID, moduleBase64s, 0)
      const messages = [
        {
          typeUrl: msg.toData()["@type"],
          value: msg.toProto(),
        }
      ]
      const memo = "test deploy"
      const { transactionHash } = await dapp.signAndBroadcast({ messages, memo })
      await client.terminal.log({ value: "Deploy Success: " + transactionHash, type: 'info'  });
      setDeployedContract(accountID);

      /**
       * Config for creating raw transactions.
       */
      // interface ABIBuilderConfig {
      //   sender: MaybeHexString | AccountAddress;
      //   sequenceNumber: Uint64 | string;
      //   gasUnitPrice: Uint64 | string;
      //   maxGasAmount?: Uint64 | string;
      //   expSecFromNow?: number | string;
      //   chainId: Uint8 | string;
      // }

      // const result = (await waitForTransactionWithResult(txnHash, chainId)) as any;
      // log.debug(result);
      // if (result.success) {
      //   await client.terminal.log({
      //     type: 'info',
      //     value: {
      //       version: result.version,
      //       hash: result.hash,
      //       gas_unit_price: result.gas_unit_price,
      //       gas_used: result.gas_used,
      //       sender: result.sender,
      //       sequence_number: result.sequence_number,
      //       timestamp: result.timestamp,
      //       vm_status: result.vm_status,
      //     },
      //   });
      //   setDeployedContract(accountID);
      //   setAtAddress('');
      //   const moveResources = await getAccountResources(accountID, dapp.networks.aptos.chain);
      //   log.info(`@@@ moveResources`, moveResources);
      //   setAccountResources([...moveResources]);
      //   if (isNotEmptyList(moveResources)) {
      //     setTargetResource(moveResources[0].type);
      //   } else {
      //     setTargetResource('');
      //   }
      //   setParameters([]);

      //   getAccountModulesFromAccount(accountID, dapp.networks.aptos.chain);
      // } else {
      //   log.error((result as any).vm_status);
      //   await client.terminal.log({ type: 'error', value: (result as any).vm_status });
      // }
    } catch (e: any) {
      log.error(e);
      await client.terminal.log({ type: 'error', value: e?.message?.toString() });
    }
    setInProgress(false);
    setDeployIconSpin('');
    setInProgress(false);
  };

  // aptosClient.getAccountResources(accountID).then((res) => {
  //   console.log('getAccountResources', res)
  //   res.map(async (accountResource: any)=>{
  //     if(accountResource.type === accountID+"::"+abi.name+"::"+resource){
  //       console.log(accountResource.data)
  //       await client.terminal.log({
  //         type: 'info',
  //         value: accountResource.data
  //       });
  //     }
  //   })
  // })

  return (
    <>
      <div className="d-grid gap-2">
        <Button
          variant="warning"
          disabled={inProgress}
          onClick={async () => {
            try {
              await checkExistContract();
            } catch (e) {
              log.error(e);
              setInProgress(false);
            }
          }}
          className="btn btn-primary btn-block d-block w-100 text-break remixui_disabled mb-1 mt-3"
        >
          <span> Deploy</span>
        </Button>
        {Object.keys(abi).length ? (
          <div style={{ textAlign: 'right', marginBottom: '3px' }}>
            {'ABI   '}
            <i
              className="far fa-copy"
              onClick={() => {
                copy(JSON.stringify(abi, null, 4));
              }}
            />
          </div>
        ) : (
          false
        )}
      </div>
      <hr />
    </>
  );
};
