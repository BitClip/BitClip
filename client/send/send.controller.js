angular.module('bitclip.sendController', [
  'ngFx'
])

.controller('sendController', ['$rootScope', '$scope', '$timeout', 'TxBuilder', 'Utilities', function($rootScope, $scope, $timeout, TxBuilder, Utilities) {
  //Displays a transaction warning if send data is invalid
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

  //sets text input placeholder message
  $rootScope.$watch('isMainNet', function() {
    $scope.addressPlaceholder = $rootScope.isMainNet ? 'e.g. 1EgT3c4hbPEtSRY66rTMcbXDeScCsJ7xXV' : 'e.g. mjjeyn6Vs4TAtMFKJEwpMPJsAVysxL4nYG';
    $scope.amountPlaceholder = $rootScope.isMainNet ? '0.0001 BTC will be added as a transaction fee' : 'minimum 0.0001 BTC';
  });

  //restores send view back to default (if there was an error)
  $scope.morph = function() {
    $scope.confirmed = !$scope.confirmed;
  };

  //Innitiates transaction
  $scope.sendPayment = function() {
    $scope.loading = true;
    Utilities.getCurrentPrivateKey().then(function(currentPrivateKey) {
      //Builds transaction, displays spinner, and displays error messages if error
      TxBuilder.sendTransaction(currentPrivateKey, $scope.transactionDetails, $rootScope.isMainNet)
        .then(function(message) {
          $scope.notification = message;
          $timeout(function() {
            $scope.notification = false;
          }, 2000);
          $scope.loading = false;
        })
        .catch(function(err) {
          $scope.notification = 'Transaction failed: ' + (err.message.length > 30 ? err.message.slice(0, 30) + ' ...' : err.message + '.');
          $timeout(function() {
            $scope.notification = false;
          }, 2000);
          $scope.loading = false;
        });
    });
    $scope.morph();
  };
}]);
