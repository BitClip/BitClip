//not loaded into app.js yet

angular.module('bitclip.sendService', [
  'ui.router'
])


.factory('persistentTransaction', function(){
  
  //maintain transaction details
  var transactionDetails = {
    amount:0,
    destination: undefined
  };
  
  //update transaction details with passed in object
  var updateTransaction = function(transactionObj){
    transactionDetails = transactionObj;
  };


  //TODO: sendPayment logic
  return {
    transactionDetails: transactionDetails,
    updateTransaction: updateTransaction
  };
})

.factory('sendTransactionBuilder', function(){
  
  var sendTransaction = function(privateKeyWIF, transactionObj){
    var amount = transactionObj.amount;
    var destination = transactionObj.destination;
    console.log("TxObj:", amount, destination)
    var ecKey = bitcoin.ECKey.fromWIF(privateKeyWIF);
    var ecKeyAddress = ecKey.pub.getAddress().toString();
    console.log('ecKey..', ecKey);
    console.log('ecKeyAddress..', ecKeyAddress);
  }



  return {
    sendTransaction:sendTransaction
  };

})