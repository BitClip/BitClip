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
  }

  //TODO: sendPayment logic

  return {
    transactionDetails: transactionDetails,
    updateTransaction: updateTransaction
  };
})
