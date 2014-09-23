angular.module('bitclip.headerController', [])

.controller('headerController', ['$scope', '$state', 'Header', 'Utilities', function($scope, $state, Header, Utilities) {
  Utilities.initialize().then(function(resolveMessage) {
    var setBalance = function() {
      $scope.balanceMessage = 'Loading balance ...';
      Header.getBalanceForCurrentAddress().then(function(confirmedBalance) {
        if (typeof confirmedBalance === 'string') {
          $scope.balanceMessage = confirmedBalance;
        } else {
          $scope.balanceMessage = 'Balance: ' + confirmedBalance + ' BTC';
        }
      });
    };

    $scope.getNetworkStatus = function() {
      Utilities.isMainNet().then(function(isMainNet) {
        $scope.isMainNet = isMainNet;
        $state.reload();
        setBalance();
      });
    };
    $scope.getNetworkStatus();

    $scope.toggleNetwork = function() {
      Header.setNetwork(!$scope.isMainNet, $scope.getNetworkStatus);
    };
  });
}]);
