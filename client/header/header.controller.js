angular.module('bitclip.headerController', [])

.controller('headerController', ['$rootScope', '$scope', '$state', 'Header', 'Utilities', function($rootScope, $scope, $state, Header, Utilities) {
  Utilities.initialize().then(function() {
    $scope.setBalance = function() {
      $scope.balanceMessage = 'Loading balance ...';
      return Header.getBalanceForCurrentAddress().then(function(balance) {
        // If fetching current balance generates an error, we render that as the balance message
        if (typeof balance === 'string') {
          $scope.balanceMessage = balance;
        } else {
          $scope.balanceMessage = 'Bal: ' + balance / 100000000 + ' BTC';
          // Create socket to fetch updated balance information
          Utilities.getLiveBalanceForCurrentAddress(function(err, data) {
            $scope.balanceMessage = 'Bal: ' + data.address.balance / 100000000 + ' BTC';
          });
        }
      });
    };
    // If current address is changed, we reset the balance message and generate a new socket
    $rootScope.$watch('currentAddress', $scope.setBalance);

    $scope.getNetworkStatus = function() {
      return Utilities.isMainNet().then(function(isMainNet) {
        $rootScope.isMainNet = isMainNet;
        $scope.setBalance();
      });
    };
    $scope.getNetworkStatus();

    $scope.menu = function() {
      // Closes settings menu when you click outside of the menu
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    
    $scope.toggleNetwork = function() {
      Header.setNetwork(!$rootScope.isMainNet, $scope.getNetworkStatus);
    };
  });
}]);
