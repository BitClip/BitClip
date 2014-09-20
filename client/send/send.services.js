//not loaded into app.js yet

angular.module('bitclip.sendService', [
  'ui.router'
])

.factory('persistentTransaction', function() {

  //maintain transaction details
  var transactionDetails = {
    amount: 0,
    //destination should be set to 0
    destination: 'mq6c9hhyBmQwFe2k2KQtgSQZeKuPj56iJu'
  };

  //update transaction details with passed in object
  var updateTransaction = function(transactionObj) {
    transactionDetails = transactionObj;
  };

  //TODO: sendPayment logic
  return {
    transactionDetails: transactionDetails,
    updateTransaction: updateTransaction
  };
})

.factory('sendTransactionBuilder', function() {
  var sendTransaction = function(privateKeyWIF, transactionObj, isMainNet) {
    //this variable sets which bitcoin network to propagate
    //the current transaction to
    var networkVar = (isMainNet) ? undefined : {
      network: 'testnet'
    };

    //instantiate a new helloblock transaction object with
    //appropriate network
    //the transaction object defaults to MainNet so undefined
    // can be passed in to use MainNet
    var helloblocktx = new helloblock(networkVar);

    var ecKey = bitcoin.ECKey.fromWIF(privateKeyWIF);
    var network = (isMainNet) ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
    var ecKeyAddress = ecKey.pub.getAddress(network).toString();

    var toAddress = transactionObj.destination;

    //transaction amounts must be specified in satoshis
    var txFee = (isMainNet) ? 10000 : 0;
    var txTargetValue = transactionObj.amount * 100000000;

    //one must get only the unspent transaction records
    //in order to spend them, hence .getUnspents
    helloblocktx.addresses.getUnspents(ecKeyAddress, {
      value: txTargetValue + txFee
    }, function(err, res, unspents) {
      if (err) throw new Error(err)

      var tx = new bitcoin.Transaction()

      var totalUnspentsValue = 0
      unspents.forEach(function(unspent) {
        tx.addInput(unspent.txHash, unspent.index)
        totalUnspentsValue += unspent.value
      })

      tx.addOutput(toAddress, txTargetValue)

      var txChangeValue = totalUnspentsValue - txTargetValue - txFee
      tx.addOutput(ecKeyAddress, txChangeValue)

      tx.ins.forEach(function(input, index) {
        tx.sign(index, ecKey)
      })

      var rawTxHex = tx.toHex();

      helloblocktx.transactions.propagate(rawTxHex, function(err, res, tx) {
        // if (err) throw new Error(err)
        if (err) console.error("Error!");
        //TODO: push success message to modal so that confirmation button morphs
        // to success message
        console.log('SUCCESS: https://test.helloblock.io/transactions/' + tx.txHash)
      });
    })
  }

  return {
    sendTransaction: sendTransaction
  };

})
