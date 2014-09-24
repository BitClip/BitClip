angular.module('bitclip.headerController', [])

.controller('headerController', ['$scope', '$state', 'Header', 'Utilities', function($scope, $state, Header, Utilities) {
  Utilities.initialize().then(function(resolveMessage) {
    $scope.activeTab = 'send';
    $scope.setActiveTab = function(tab) {
      $scope.activeTab = tab;
    };

    var setBalance = function() {
      $scope.balanceMessage = 'Loading balance ...';
      Header.getBalanceForCurrentAddress().then(function(balance) {
        if (typeof confirmedBalance === 'string') {
          $scope.balanceMessage = balance;
        } else {
          $scope.balanceMessage = 'Bal: ' + balance / 100000000 + ' BTC';
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
