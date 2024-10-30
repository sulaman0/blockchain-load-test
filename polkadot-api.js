 const { ApiPromise, WsProvider } = require('@polkadot/api');
//import { ApiPromise, WsProvider } from '@polkadot/api';
console.log("at here!")
async function main() {
  console.log("running main issue.");
  // Connect to a local or public node
  const wsProvider = new WsProvider('wss://ws.elysiumchain.tech');

  // Create the API instance
  const api = await ApiPromise.create({ provider: wsProvider });
  // // The Substrate address you want to check
  // const address = '5D7mCrqwQzoUhSXJyXbxeFT9QNLtPZECRmCqHygvKTXJUze2';
  // // Fetch the balance
  // const { data: { free: balance } } = await api.query.system.account(address);


  // api.consts.system.blockWeights && api.consts.system.blockWeights.maxBlock && convertWeight(api.consts.system.blockWeights.maxBlock).v2Weight
  console.log( (api.consts.system.blockWeights.maxBlock), "==blockweight");

  // console.log(`The balance for ${address} is ${balance.toHuman()}`);
}

main().catch(console.error);

