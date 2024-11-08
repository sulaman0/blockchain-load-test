import ethers from 'ethers';
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error("Please provide wallet addresses as command-line arguments.");
    process.exit(1);
}

// Replace these with your actual accounts and private keys
// const privateKeyA = '713059b3bd2c9c83c3aeda0368c755603f85f8b38af50cad99409d152be6f810';
// const privateKeyB = '78aa2725f2c8984d7120c5c13754afc5042c540a6f1e6205be99cc9191ec2ede';

const privateKeyA = args[0];
const privateKeyB = args[1];
const providerUrl = 'https://dev-node-rpc.elysiumchain.tech'; // Replace with your Infura project ID or another provider URL

const provider = new ethers.providers   .JsonRpcProvider(providerUrl);

const walletA = new ethers.Wallet(privateKeyA, provider);
const walletB = new ethers.Wallet(privateKeyB, provider);
const largeData = '0x' + 'f'.repeat(2); // Example large payload of 500000 hex characters
//const largeData = '0x';

async function transfer() {
    // Amount to transfer (in ethers)
    const transferAmount = ethers.utils.parseEther('0.01');

    // Estimate gas fees
    const gasPrice = await provider.getGasPrice();
    const estimatedGasLimit = await walletA.estimateGas({
        to: walletB.address,
        value: transferAmount,
        data: largeData
    });
    // const latestBlock = await provider.getBlock('latest');
    // const blockGasLimit = latestBlock.gasLimit;
    // console.log(blockGasLimit.toNumber()      , "====    block gas limit of last block =====" )
    // const gasLimit = ethers.utils.hexlify(6000000); // Standard gas limit for ETH transfer
    // Total cost = transfer amount + gas fees
    console.log(estimatedGasLimit.toNumber(), "======")
    const totalCostA = transferAmount.add(gasPrice.mul(estimatedGasLimit));
    let nonceA = await provider.getTransactionCount(walletA.address, "latest");

    // Get the balance of Account A
    let balanceA = await walletA.getBalance();
    console.log(`Balance of Account A before transfer: ${ethers.utils.formatEther(balanceA)} ETH`);

    // Check if Account A has sufficient funds
    if (balanceA.lt(totalCostA)) {
        console.error('Insufficient funds in Account A for the transfer and gas fees');
        return;
    }

    // Transfer ETH from Account A to Account B
    let tx = await walletA.sendTransaction({
        to: walletB.address,
        value: transferAmount,
        gasPrice: gasPrice,
        gasLimit: estimatedGasLimit,
        data: largeData,
        // nonce: nonceA, // Use the latest nonce for Account A
    });

    // Wait for the transaction to be mined
    await tx.wait();
    console.log(`Transferred 0.01 ETH from Account A to Account B. Transaction hash: ${tx.hash}`);

    // Get the balance of Account B
    let balanceB = await walletB.getBalance();
    console.log(`Balance of Account B before transfer back: ${ethers.utils.formatEther(balanceB)} ETH`);

    // Total cost = transfer amount + gas fees (for Account B to transfer back)
    const totalCostB = transferAmount.add(gasPrice.mul(estimatedGasLimit));

    // Check if Account B has sufficient funds
    if (balanceB.lt(totalCostB)) {
        console.error('Insufficient funds in Account B for the transfer back and gas fees');
        return;
    }
    let nonceB = await provider.getTransactionCount(walletB.address, "latest");
    // Transfer ETH from Account B back to Account A
    tx = await walletB.sendTransaction({
        to: walletA.address,
        value: transferAmount,
        gasPrice: gasPrice,
        gasLimit: estimatedGasLimit,
        data: largeData,
        // nonce: nonceB, // Use the latest nonce
    });

    // Wait for the transaction to be mined
    await tx.wait();
    console.log(`Transferred 0.01 ETH from Account B back to Account A. Transaction hash: ${tx.hash}`);

    // Get the final balances
    balanceA = await walletA.getBalance();
    balanceB = await walletB.getBalance();
    console.log(`Final balance of Account A: ${ethers.utils.formatEther(balanceA)} ETH`);
    console.log(`Final balance of Account B: ${ethers.utils.formatEther(balanceB)} ETH`);
    console.log("======================================================================")
}
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// transfer().catch(console.error);

async function main() {
    while (true) {
            // await transfer().catch((error) => console.error(error.message));
        // await sleep(6000); // Sleep for 10 seconds
        await transfer().catch((error) => {
            console.log("Transfer Error:", error);
            if (error.cause) {
                console.error("Cause:", error.cause.desc);
            }
            // console.error(); 
        });       
    }
}

// main().catch((error) => console.error(error.message));
main();
