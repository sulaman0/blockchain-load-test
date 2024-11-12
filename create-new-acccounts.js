import ethers from 'ethers';

// Replace with your actual account private key
const privateKeyA = '0xd56c5a72c0b97be36b88f4c428b0fe65f57c0efd52e7f6910da33f304692d567'; // 0x25eC5de1dc51b2510Ec37DD2a8F30069Fda9DE85
const providerUrl = 'https://dev-node-rpc.elysiumchain.tech'; // Replace with your Infura project ID or another provider URL

const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const walletA = new ethers.Wallet(privateKeyA, provider);

// Function to create 100 Ethereum accounts and transfer 100 ETH to each

async function createAndTransfer() {
    const accounts = [];

    for (let i = 0; i < 5; i++) {
        const wallet = ethers.Wallet.createRandom();
        const wallet2 = ethers.Wallet.createRandom();
        accounts.push(wallet);
        accounts.push(wallet2);
        console.log(`public addresses a to b ${wallet.address} ${wallet2.address}`);
        console.log(`node transfer-a-to-b-and-b-to-a ${wallet.privateKey} ${wallet2.privateKey}`);
    }

    const transferAmount = ethers.utils.parseEther('1000000'); // 100 ETH

    for (let i = 0; i < accounts.length; i++) {
        const walletB = accounts[i];

        // Estimate gas fees
        const gasPrice = await provider.getGasPrice();
        const gasLimit = ethers.utils.hexlify(6000000); // Standard gas limit for ETH transfer

        // Total cost = transfer amount + gas fees
        const totalCost = transferAmount.add(gasPrice.mul(gasLimit));

        // Check if Account A has sufficient funds
        let balanceA = await walletA.getBalance();
        console.log(`Balance of Account A: ${ethers.utils.formatEther(balanceA)} ETH`);

        if (balanceA.lt(totalCost)) {
            console.error(`Insufficient funds in Account A for the transfer to Account ${i + 1}`);
            break;
        }

        // Transfer 100 ETH from Account A to the new account
        let tx = await walletA.sendTransaction({
            to: walletB.address,
            value: transferAmount,
            gasPrice: gasPrice,
            gasLimit: gasLimit
        });

        // Wait for the transaction to be mined
        await tx.wait();
        console.log(`Transferred 100 ETH to Account ${i + 1}. Transaction hash: ${tx.hash}`);
    }
}

createAndTransfer().catch(console.error);
