angular.module('bitclip.send', [
  'ngMorph'
])

.controller('sendController', ['$scope', 'persistentTransaction', function($scope, persistentTransaction) {
  
  //  ng morph modal
  $scope.send = {
    closeEl: '.close',
    modal: {
      templateUrl: 'send/send.btn.html',
      position: {
        top: '85%',
        left: '0%'
      },
      fade: false
    }
  };

  //initialize transaction details (amount, destination)
  $scope.transactionDetails = persistentTransaction.transactionDetails;


  //update the transaction details with input field values
  $scope.updateTransactionDetails = function(){
    persistentTransaction.updateTransaction($scope.transactionDetails)
    console.log('scopin', $scope.transactionDetails);
  };


  var testTransaction = function(){

    console.log("THIS IS HELLOBLOCK ", helloblock);

    var helloblocktx = new helloblock({
      network: 'testnet'
    });
    var testnet = bitcoin.networks.testnet;
    //source addres:
     
    // Path m / 0 '/' / 0 Base58 ms2pdqyQxyWR82DV8BjiQuqUxBt3hbwSPu
    // child private key: tprv8d9nbHThZv8whawuraZNUE7FfXFSsS2pgjH2ziZTTDe5cWpkYQtPnzffAxqWZfDtd7AHmHGmpMdjMBU4fHKoH1nFnyEjn73fLYcm3aWtivY
    // child public key: tpubD9qpjhVwiHpcb3yhkEDxsdmNEYmP2mDjG2spHEbksVSUT15XAohyyVHXM5UpskNXFUmdmAkDuRJ6qajN96LYCeGfSWZvynedRZyYn3W94YY
     
    console.log("hardcoded: ms2pdqyQxyWR82DV8BjiQuqUxBt3hbwSPu");
     
    var privateKey = "tprv8d9nbHThZv8whawuraZNUE7FfXFSsS2pgjH2ziZTTDe5cWpkYQtPnzffAxqWZfDtd7AHmHGmpMdjMBU4fHKoH1nFnyEjn73fLYcm3aWtivY";
    var childNode = bitcoin.HDNode.fromBase58(privateKey);
     
    console.log("childNode \n", childNode);
     
    var ecKey = childNode.privKey;
    var ecKeyAddress = childNode.getAddress().toString();
    console.log("ecKey:  ", ecKey);
     
    console.log("generated: ", ecKeyAddress);
    // var ecKey = new bitcoin.ECKey.fromWIF(privateKey);
    // var ecKeyAddress = new bitcoin.Address.fromBase58Check(privateKey);
    // var ecKeyAddress = ecKey.getAddress(testnet).toString()
     
    var toAddress = 'myPFfEM8GnKdd5afEuHT3CqKpbfpYptf5y';
     
    var txFee = 10000
    var txTargetValue = 200000
     
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
        if (err) throw new Error(err)
     
        console.log('SUCCESS: https://test.helloblock.io/transactions/' + tx.txHash)
      })
    })
  };


  testTransaction();

  //TODO: sendPayment Functionality
  $scope.sendPayment = function(amount){
  }

}]);
