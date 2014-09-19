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

    //check what network the user was last using
    //to determine whether Use Mainnet or Use TestNet should
    //be displayed in the settingsDropDown menue

  }
])
