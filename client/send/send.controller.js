angular.module('bitclip.sendController', [
  'ngFx'
])

.controller('sendController', ['$scope', '$timeout', 'TxBuilder','Utilities',
  function($scope, $timeout, TxBuilder, Utilities) {

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

    $scope.transactionDetails = {};

    Utilities.isMainNet().then(function(isMainNet){
      $scope.network = isMainNet;
    });

    //TODO: sending animation
    $scope.sendPayment = function() {
      Utilities.getCurrentPrivateKey().then(function(currentPrivateKey){
        TxBuilder.sendTransaction(currentPrivateKey, $scope.transactionDetails, $scope.network)
        .then(function(message){
          $scope.notification = message;
          $timeout(function() { $scope.notification = false }, 2000);
          $scope.morph();
        })
        .catch(function(err){
          $scope.notification = "Transaction Failed: "+ err.message;
          $timeout(function() { $scope.notification = false }, 2000);
          $scope.morph();
        });
      });
    };
}]);
