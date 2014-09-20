angular.module('bitclip.sendController', [
  'ngMorph'
])

.controller('sendController', ['$scope', 'persistentTransaction', 'TxBuilder','Utilities',
  function($scope, persistentTransaction, TxBuilder, Utilities) {

  //  ng morph modal
  $scope.confirm = false;
  $scope.morph = function(){
    $scope.confirm = !$scope.confirm;
  }

    //initialize transaction details (amount, destination)
    $scope.transactionDetails = persistentTransaction.transactionDetails;

    //update the transaction details with input field values
    $scope.updateTransactionDetails = function() {
      persistentTransaction.updateTransaction($scope.transactionDetails)
    };

    //TODO: sendPayment Functionality
    $scope.sendPayment = function() {
      Utilities.isMainNet().then(function(isMainNet){
        Utilities.getCurrentPrivateKey().then(function(currentPrivateKey){
          TxBuilder.sendTransaction(currentPrivateKey, $scope.transactionDetails, isMainNet);
        });
      });
    };
  }
]);
