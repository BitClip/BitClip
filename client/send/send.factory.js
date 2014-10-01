angular.module('bitclip.sendFactory', [])
.factory('TxBuilder', ['$q','$rootScope', function($q,$rootScope) {
  var sendTransaction = function(privateKeyWIF, transactionObj, isMainNet) {
    console.log("sendTransaction invoked");
    var deferred = $q.defer();

    //this variable sets which bitcoin network to propagate
    //the current transaction to
    var networkVar = (isMainNet) ? {
      network:"mainnet",
      debug: true
    } : {
      network: 'testnet',
      debug: true
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
      console.log("in get unspents");
      if (err) {
        console.log('in err')
        deferred.reject(err);
        $rootScope.$apply();
        return;
      };

      var tx = new bitcoin.Transaction();

      var totalUnspentsValue = 0
      unspents.forEach(function(unspent) {
        tx.addInput(unspent.txHash, unspent.index)
        totalUnspentsValue += unspent.value
      })
      tx.addOutput(toAddress, txTargetValue);

      //there is uncaught error if invalid btc address inputed;
      //we need to modify helloblock .addOutput code
      var txChangeValue = totalUnspentsValue - txTargetValue - txFee
      tx.addOutput(ecKeyAddress, txChangeValue)

      tx.ins.forEach(function(input, index) {
        tx.sign(index, ecKey)
      })

      var rawTxHex = tx.toHex();
      helloblocktx.transactions.propagate(rawTxHex, function(err, res, tx) { 
        console.log("in propagate");     
        if (err) {
          deferred.reject(err);
          $rootScope.$apply();
        } else if (tx) {
          console.log("Transaction was successful!");
          deferred.resolve("Transaction successfully propagated");
          $rootScope.$apply();
        }
      });
    });
    return deferred.promise
  }

  return {
    sendTransaction: sendTransaction
  };

 }
])
