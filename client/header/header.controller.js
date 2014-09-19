angular.module('bitclip.header', [])

.controller('HeaderController', ['$scope', 'GetBalance',
  function($scope, GetBalance) {

    GetBalance.getAllAddresses().then(function(addressArray) {
      GetBalance.getBalanceForAllAddresses(addressArray, true).then(function(data) {
        var balanceArray = data.data.addresses;
        var sum = balanceArray.reduce(function(prevValue, currentObj, index) {
          return prevValue + currentObj.confirmedBalance;
        }, 0);
        $scope.balanceMessage = "Balance: " + sum + " BTC";
      }).catch(function(error) {
        console.error(error);
      })
    }).catch(function(error) {
      console.error(error);
    });
    $scope.balanceMessage = "Loading Bitcoin address";
  }
])
