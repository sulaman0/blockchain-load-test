import ethers from 'ethers';
const providerUrl = 'http://127.0.0.1:9933'; // Replace with your Infura project ID or another provider URL

const provider = new ethers.providers.JsonRpcProvider(providerUrl);

const wallet = ethers.Wallet.createRandom();

console.log(`Account Public Address ${wallet.address}`);
console.log(`Account Private Address ${wallet.privateKey}`);
