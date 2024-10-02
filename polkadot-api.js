// const { ApiPromise, WsProvider } = require('@polkadot/api');
import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
  // Connect to a local or public node
  const wsProvider = new WsProvider('wss://127.0.0.1:9944');

  // Create the API instance
  const api = await ApiPromise.create({ provider: wsProvider });

  // The Substrate address you want to check
  const address = '5D7mCrqwQzoUhSXJyXbxeFT9QNLtPZECRmCqHygvKTXJUze2';
  // Fetch the balance
  const { data: { free: balance } } = await api.query.system.account(address);

  console.log(`The balance for ${address} is ${balance.toHuman()}`);
}

main().catch(console.error);
