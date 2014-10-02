angular.module('bitclip.receiveController', [])

.controller('receiveController', ['$scope', 'Receive', 'Utilities', function($scope, Receive, Utilities) {
  Utilities.getCurrentAddress().then(function(currentAddress) {
    $scope.currentAddress = currentAddress;
  });
  Utilities.getAllAddresses().then(function(allAddresses) {
    $scope.allAddressesAndBalances = Receive.prepareDefault(allAddresses);
    Utilities.getBalances(allAddresses).then(function(allBalances) {
      Receive.prepareBalances(allAddresses, allBalances).then(function(allAddressesAndBalances) {
        $scope.allAddressesAndBalances = allAddressesAndBalances;
      });
    });
  });
  $scope.newAddress = Receive.newAddress;
  $scope.setAsCurrentAddress = Receive.setAsCurrentAddress;
}])

.filter('toArray', function() {
  return function(obj) {
    var result = [];
    angular.forEach(obj, function(val, key) {
      result.push(val);
    });
    return result;
  };
});
