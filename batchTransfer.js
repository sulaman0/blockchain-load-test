import Web3 from 'web3';

const web3 = new Web3('http://127.0.0.1:9930');
const addressA = '0x1E5cFE48224Cf345989E2B38135c067bc5f91cf5';
const privateKeyA = '6ef51fc17f4aa8a37c365710a8cac100b9e2abb8c78c4eff953993e77bf8ccf6';
const addressB = '0xD286FA11C32812f1a90ba623B702841869E97D39';
const privateKeyB = '4c06d2a3ecdb370e3b728cb7af92d6926fe2e145fe1cc808870c7ce5204137f5';

async function transfer(fromAddress, toAddress, privateKey) {
    const gasLimit = 21204;
    const nonce = await web3.eth.getTransactionCount(fromAddress, 'latest'); // get the latest nonce
    console.log('nonce: ',nonce);

    

    
    const tx = {
        'from': fromAddress,
        'to': toAddress,
        'value': "1000000000000000",
        // 'nonce': nonce,
        maxPriorityFeePerGas: web3.utils.toWei('2', 'gwei'),
        maxFeePerGas: web3.utils.toWei('100', 'gwei'),
        gas: web3.utils.toHex(gasLimit),
        data: '0x',
    };
    const gasPrice = await web3.eth.getGasPrice();
    var balance = web3.eth.getBalance(fromAddress);
    var transactionObject = {
        from: fromAddress,
        to: toAddress,
        gasPrice: gasPrice
      }

      var gas_Limit = await web3.eth.estimateGas(transactionObject); 
      

    // const gas = await web3.eth.estimateGas({
    //     to: toAddress,
    //     data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
    // });

    console.info('gas_Limit: ', gas_Limit);
    var transactionFee = gasPrice * gas_Limit; 

    transactionObject.gas = gas_Limit;
transactionObject.value = balance - transactionFee; 

// const signedTx = await web3.eth.accounts.signTransaction(transactionObject, privateKey);
// web3.eth.sendTransaction(transactionObject, myCallbackFunction);


   // const gas = await tx.estimateGas({ from: addressA });
    
    // console.log('gas: ',gas);

    console.log('gasPrice: ',gasPrice);

    
    return web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('receipt', console.log);
}

// Function to alternate transfers
async function alternateTransfers() {
    try {
        while (true) {
            console.log("Transferring from A to B...");
            let res = await transfer(addressA, addressB, privateKeyA);
            // console.log("Transferred from A to B. Now transferring back from B to A...");
            // await transfer(addressB, addressA, privateKeyB);
        }
    } catch (error) {
        console.error("Error occurred:", error);
    }
}

// Start the continuous transfer process
alternateTransfers();
