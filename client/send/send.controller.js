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


  //TODO: sendPayment Functionality
  $scope.sendPayment = function(amount){
  }

}]);
