angular.module('bitclip.sendController', [
  'ngFx'
  ])

.controller('sendController', ['$scope', '$timeout', 'TxBuilder','Utilities',
  function($scope, $timeout, TxBuilder, Utilities) {

    $scope.morph = function(){
      $scope.confirmed = !$scope.confirmed;
    };

    //initialize transaction details (amount, destination)
    $scope.transactionDetails = {};

    //TODO: sendPayment Functionality
    $scope.sendPayment = function() {
      Utilities.isMainNet().then(function(isMainNet){
        Utilities.getCurrentPrivateKey().then(function(currentPrivateKey){
          TxBuilder.sendTransaction(currentPrivateKey, $scope.transactionDetails, isMainNet).then(function(message){
            $scope.txSuccessMessage = message;
            $timeout(function() { $scope.txSuccessMessage = false }, 2000);
          })
          .catch(function(err){
            $scope.txSuccessMessage = "Transaction Failed: "+ err.message;
            $timeout(function() { $scope.txSuccessMessage = false }, 2000);
          });
        });
      });
  };
}]);
