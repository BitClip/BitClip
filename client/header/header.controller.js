angular.module('bitclip.header', [])

.controller('HeaderController', ['$scope', 'GetBalance',
  function($scope, GetBalance) {

    //get overall balance for all addresses
    GetBalance.getBalanceForCurrentAddress().then(function(sum) {
      $scope.balanceMessage = "Balance: " + sum + " BTC";
    }).catch(function(error) {
      console.error(error);
    });
    $scope.balanceMessage = "Loading Bitcoin address";
  }
])
