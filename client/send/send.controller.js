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
        $scope.amountError = 'Invalid Destination and Transaction Amount';
        $scope.destinationError = true;
      } else {
        if ($scope.sendForm.destination.$invalid) $scope.destinationError = 'Invalid Destination';
        if ($scope.sendForm.amount.$invalid) $scope.amountError = 'Invalid Transaction Amount';
      }

      if($scope.destinationError || $scope.amountError){
        $timeout(function() { 
          $scope.destinationError = false;
          $scope.amountError = false;
        }, 4000);
      }
    };

    //initialize transaction details (amount, destination)
    $scope.transactionDetails = {};

    $scope.clearAmount = function(){
      $scope.transactionDetails.amount = "";
      $scope.morph();
    }

    Utilities.isMainNet().then(function(isMainNet){
      $scope.network = isMainNet;
    });

    //TODO: sending animation
    $scope.sendPayment = function() {
      Utilities.isMainNet().then(function(isMainNet){
        Utilities.getCurrentPrivateKey().then(function(currentPrivateKey){
          TxBuilder.sendTransaction(currentPrivateKey, $scope.transactionDetails, isMainNet).then(function(message){
            $scope.txSuccessMessage = message;
            $scope.$apply();
            $timeout(function() { $scope.txSuccessMessage = false }, 2000);
            $scope.morph();
          })
          .catch(function(err){
            $scope.txErrorMessage = "Transaction Failed: "+ err.message;
            $scope.$apply();
            $timeout(function() { $scope.txErrorMessage = false }, 2000);
            $scope.morph();
          });
        });
      });
  };
}]);
