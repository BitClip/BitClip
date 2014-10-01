angular.module('bitclip.receiveController', [])

.controller('receiveController', ['$scope', 'Receive', 'Utilities', function($scope, Receive, Utilities) {
  Utilities.getCurrentAddress().then(function(currentAddress) {
    $scope.currentAddress = currentAddress;
  });
  Utilities.getAllAddresses().then(function(allAddresses) {
    $scope.allAddresses = allAddresses;
    Utilities.getBalances(allAddresses).then(function(allBalances) {
      Receive.prepareBalances(allAddresses, allBalances).then(function(allAddressesAndBalances) {
        $scope.allAddressesAndBalances = allAddressesAndBalances;
      });
    });
  });
  $scope.newAddress = Receive.newAddress;
  $scope.setAsCurrentAddress = Receive.setAsCurrentAddress;
}]);
