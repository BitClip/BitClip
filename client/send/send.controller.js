angular.module('bitclip.send', [
  'ngMorph'
])

.controller('sendController', ['$scope', 'persistentTransaction', 'sendTransactionBuilder',function($scope, persistentTransaction, sendTransactionBuilder) {
  

  chrome.storage.local.set({'currentPrivateKey': 'cMfVug8eyGmwBY3ZvYCBms2vJrBZQEhRiZsM495ndFbEpBbFrbPW'})

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

  
  //TODO: sendPayment Functionality
  $scope.sendPayment = function(){

    chrome.storage.local.get('currentPrivateKey', function(key){
      console.log('kkeeey', key)
      sendTransactionBuilder.sendTransaction(key.currentPrivateKey, $scope.transactionDetails, false)
    });


  }





  //TODO: ng-validate destination input : starts with 1, base58, 52length
}]);
