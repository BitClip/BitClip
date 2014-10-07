angular.module('bitclip.receiveController', [])

.controller('receiveController', ['$rootScope', '$scope', 'Receive', 'Utilities', function($rootScope, $scope, Receive, Utilities) {
  $scope.renderBalances = function() {
    Utilities.getAllAddresses().then(function(allAddresses) {
      $scope.allAddressesAndBalances = Receive.prepareDefault(allAddresses);
      Utilities.getBalances(allAddresses).then(function(allBalances) {
        Receive.prepareBalances(allAddresses, allBalances).then(function(allAddressesAndBalances) {
          $scope.allAddressesAndBalances = allAddressesAndBalances;
          if ($scope.loading) $scope.loading = false;
        });
      });
    });
  };
  $scope.renderBalances();

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
