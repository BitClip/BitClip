angular.module('bitclip.header', [])

.controller('HeaderController', ['$scope', 'GetBalance', 'NetworkSettings',
  function($scope, GetBalance, NetworkSettings) {
    //get balance for current address
    GetBalance.getBalanceForCurrentAddress().then(function(sum) {
      $scope.balanceMessage = "Balance: " + sum + " BTC";
    }).catch(function(error) {
      console.error(error);
    });
    $scope.balanceMessage = "Loading Bitcoin address";

    //check what network the user was last using
    //to determine whether Use Mainnet or Use TestNet should
    //be displayed in the settingsDropDown menu
    NetworkSettings.getNetwork().then(function(isMainNet) {
      //if network has not been set, we default to MainNet
      if (isMainNet === undefined) {
        $scope.isMainNet = true;
        NetworkSettings.setNetwork($scope.isMainNet)
      } else {
        $scope.isMainNet = isMainNet;
      };
    })

  }
])
