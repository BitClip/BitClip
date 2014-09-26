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
      //open a socket for the current address and
      //close socket for previous address
      Utilities.getLiveBalanceForCurrentAddress(function(err, data){
        if (err){
          console.error(err);
        } else {
          $scope.balanceMessage = "Bal: " + data.address.balance/100000000 + " BTC";
        };
      });
    };

    $scope.getNetworkStatus = function() {
      console.log("getNetworkStatus invoked");
      Utilities.isMainNet().then(function(isMainNet) {
        $scope.isMainNet = isMainNet;
        setBalance();
        $state.go($state.current.name, $state.params, { reload: true });
      });
    };
    $scope.getNetworkStatus();

    $scope.toggleNetwork = function() {
      Header.setNetwork(!$scope.isMainNet, $scope.getNetworkStatus);
    };
  });
}]);
