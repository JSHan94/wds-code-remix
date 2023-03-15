import { STAGE } from './stage';

const COMPILER_API_ENDPOINT_POOL = {
  local: 'http://localhost:3060',
  dev: 'https://dev.compiler.welldonestudio.io',
  prod: 'https://api.welldonestudio.io/compiler',
};
export const COMPILER_API_ENDPOINT = COMPILER_API_ENDPOINT_POOL[STAGE];

const APTOS_COMPILER_CONSUMER_ENDPOINT_POOL = {
  local: 'ws://localhost:3060',
  dev: 'wss://dev.compiler.welldonestudio.io',
  // prod: 'wss://prod.aptos.compiler.welldonestudio.io',
  prod: 'wss://prod.near.compiler.welldonestudio.io',
};
export const APTOS_COMPILER_CONSUMER_ENDPOINT = APTOS_COMPILER_CONSUMER_ENDPOINT_POOL[STAGE];
