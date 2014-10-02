angular.module('bitclip.sendController', [
  'ngFx'
])

.controller('sendController', ['$scope', '$timeout', 'TxBuilder','Utilities',
  function($scope, $timeout, TxBuilder, Utilities) {
    
    $scope.transactionDetails = {};

    Utilities.isMainNet().then(function(isMainNet){
      $scope.network = isMainNet;
    });

    $scope.updateTransactionDetails = function(){
      TxBuilder.updateTx($scope.transactionDetails);
      $scope.morph();
    };

    $scope.morph = function(){
      $scope.confirmed = !$scope.confirmed;
    };

    $scope.displayError = function(){
      if ($scope.sendForm.destination.$invalid && $scope.sendForm.amount.$invalid){
        $scope.notification = 'Invalid Destination and Transaction Amount';
      } else if ($scope.sendForm.destination.$invalid){
        $scope.notification = 'Invalid Destination';
      } else if ($scope.sendForm.amount.$invalid){
        $scope.notification = 'Invalid Transaction Amount';
      }
      if($scope.notification){
        $timeout(function() { 
          $scope.notification = false;
        }, 2000);
      }
    };

    //TODO: sending animation
    $scope.sendPayment = function() {
      var updatedTxDetails = TxBuilder.getTransactionDetails();
      Utilities.getCurrentPrivateKey().then(function(currentPrivateKey){
        TxBuilder.sendTransaction(currentPrivateKey, updatedTxDetails, $scope.network)
        .then(function(message){
          $scope.notification = message;
          $timeout(function() { $scope.notification = false }, 2000);
        })
        .catch(function(err){
          $scope.notification = "Transaction Failed: "+ err.message;
          $timeout(function() { $scope.notification = false }, 2000);
        });
      });
      $scope.morph();
    };
}]);
