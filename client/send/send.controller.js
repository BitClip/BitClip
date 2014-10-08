angular.module('bitclip.sendController', [
  'ngFx'
])

.controller('sendController', ['$rootScope', '$scope', '$timeout', 'TxBuilder', 'Utilities', function($rootScope, $scope, $timeout, TxBuilder, Utilities) {
  $scope.validateInput = function() {
    if ($scope.sendForm.destination.$invalid && $scope.sendForm.amount.$invalid) {
      $scope.notification = 'Invalid destination and transaction amount.';
    } else if ($scope.sendForm.destination.$invalid) {
      $scope.notification = 'Invalid destination.';
    } else if ($scope.sendForm.amount.$invalid) {
      $scope.notification = 'Invalid transaction amount.';
    }
    if ($scope.notification) {
      $timeout(function() {
        $scope.notification = false;
      }, 2000);
    } else {
      $scope.morph();
    } 
  };

  $scope.transactionDetails = {};

  $rootScope.$watch('isMainNet', function() {
    $scope.addressPlaceholder = $rootScope.isMainNet ? 'e.g. 1EgT3c4hbPEtSRY66rTMcbXDeScCsJ7xXV' : 'e.g. mjjeyn6Vs4TAtMFKJEwpMPJsAVysxL4nYG';
    $scope.amountPlaceholder = $rootScope.isMainNet ? '0.0001 BTC will be added as a transaction fee' : 'minimum 0.0001 BTC';
  });

  $scope.morph = function() {
    $scope.confirmed = !$scope.confirmed;
  };

  $scope.sendPayment = function() {
    $scope.loading = true;
    Utilities.getCurrentPrivateKey().then(function(currentPrivateKey) {
      TxBuilder.sendTransaction(currentPrivateKey, $scope.transactionDetails, $rootScope.isMainNet)
        .then(function(message) {
          $scope.notification = message;
          $timeout(function() {
            $scope.notification = false;
          }, 2000);
          $scope.loading = false;
        })
        .catch(function(err) {
          $scope.notification = 'Transaction failed: ' + err.message + '.';
          $timeout(function() {
            $scope.notification = false;
          }, 2000);
          $scope.loading = false;
        });
    });
    $scope.morph();
  };
}]);
