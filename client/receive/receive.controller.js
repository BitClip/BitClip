angular.module('bitclip.receiveController', [])

.controller('receiveController', ['$rootScope', '$scope', 'Receive', 'Utilities', function($rootScope, $scope, Receive, Utilities) {
  $scope.renderBalances = function() {
    // Creates object with user addresses as keys and balances as values
    Utilities.getAllAddresses().then(function(allAddresses) {
      // Initiate object with addresses but empty strings for balances while
      // Helloblock query fetches actual balance information
      $scope.allAddressesAndBalances = Receive.prepareDefault(allAddresses);
      Utilities.getBalances(allAddresses).then(function(allBalances) {
        Receive.prepareBalances(allAddresses, allBalances).then(function(allAddressesAndBalances) {
          $scope.allAddressesAndBalances = allAddressesAndBalances;
          // Toggles spinner
          if ($scope.loading) $scope.loading = false;
        });
      });
    });
  };
  $scope.renderBalances();

  // Displays TestNet/MainNet addresses - refreshes whenever we toggle networks in Header
  $scope.regenerateNetworkAddresses = function() {
    $scope.renderBalances();
    Utilities.getCurrentAddress().then(function(currentAddress) {
      Receive.applyCurrentAddress(currentAddress);
    });
  };
  $rootScope.$watch('isMainNet', $scope.regenerateNetworkAddresses);

  $scope.newAddress = function() {
    Utilities.isMainNet().then(function(isMainNet) {
      $scope.loading = !isMainNet;
    });
    Receive.newAddress($scope);
  };

  $scope.setAsCurrentAddress = Receive.setAsCurrentAddress;
}]);
