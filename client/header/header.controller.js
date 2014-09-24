angular.module('bitclip.headerController', [])

.controller('headerController', ['$scope', '$state', 'Header', 'Utilities', function($scope, $state, Header, Utilities) {
  Utilities.initialize().then(function(resolveMessage) {
    var setBalance = function() {
      $scope.balanceMessage = 'Loading balance ...';
      Header.getBalanceForCurrentAddress().then(function(balance) {
        if (typeof confirmedBalance === 'string') {
          $scope.balanceMessage = balance;
        } else {
          $scope.balanceMessage = 'Bal: ' + balance / 100000000 + ' BTC';
          console.log("balance: ", $scope.balanceMessage);
        }
      });
    };

    $scope.getNetworkStatus = function() {
      Utilities.isMainNet().then(function(isMainNet) {
        $scope.isMainNet = isMainNet;
        setBalance();
        $state.reload();
      });
    };
    $scope.getNetworkStatus();

    Utilities.getLiveBalanceForCurrentAddress(function(err, data){
      if (err){
        console.error(err);
      } else {
        console.log("I am data returned: ", data);
        $scope.balanceMessage = "Bal: " + data.address.balance/100000000 + " BTC";
      }; 
    });

    $scope.toggleNetwork = function() {
      Header.setNetwork(!$scope.isMainNet, $scope.getNetworkStatus);
    };
  });
}]);
