import ethers from 'ethers';
const providerUrl = 'https://dev-node-rpc.elysiumchain.tech';

const provider = new ethers.providers.JsonRpcProvider(providerUrl);

const wallet = ethers.Wallet.createRandom();

console.log(`Account Public Address ${wallet.address}`);
console.log(`Account Private Address ${wallet.privateKey}`);
