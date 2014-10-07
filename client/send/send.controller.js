angular.module('bitclip.sendController', [
  'ngFx'
])

.controller('sendController', ['$rootScope', '$scope', '$timeout', 'TxBuilder', 'Utilities', function($rootScope, $scope, $timeout, TxBuilder, Utilities) {
  var displayError = function() {
    if ($scope.sendForm.destination.$invalid && $scope.sendForm.amount.$invalid) {
      $scope.notification = 'Invalid destination and transaction amount.';
    } else if ($scope.sendForm.destination.$invalid) {
      $scope.notification = 'Invalid destination.';
    } else if ($scope.sendForm.amount.$invalid) {
      $scope.notification = 'Invalid transaction amount.';
    }

    if ($scope.notification) {
      $timeout(function() {
        $scope.notification = false
      }, 2000);
    } else {
      $scope.morph();
    } 
  };

  $scope.loading;
  $scope.transactionDetails = {};
  $scope.network = $rootScope.isMainNet;

  $scope.morph = function() {
    $scope.confirmed = !$scope.confirmed;
  };

  $scope.validateInput = function() {
    TxBuilder.updateTx($scope.transactionDetails);
    $scope.transactionDetails = TxBuilder.getTransactionDetails();
    displayError();
  };

  $scope.sendPayment = function() {
    $scope.loading = true;
    var updatedTxDetails = TxBuilder.getTransactionDetails();
    Utilities.getCurrentPrivateKey().then(function(currentPrivateKey) {
      TxBuilder.sendTransaction(currentPrivateKey, updatedTxDetails, $scope.network)
        .then(function(message) {
          $scope.notification = message;
          $timeout(function() {
            $scope.notification = false
          }, 2000);
          $scope.loading = false;
        })
        .catch(function(err) {
          $scope.notification = 'Transaction failed: ' + err.message;
          $timeout(function() {
            $scope.notification = false
          }, 2000);
          $scope.loading = false;
        });
    });
    $scope.morph();
  };
}]);
