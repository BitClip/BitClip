angular.module('bitclip.receiveController', [])

.controller('receiveController', ['$scope', 'Receive', 'Utilities', function($scope, Receive, Utilities) {
  Utilities.getCurrentAddress().then(function(currentAddress) {
    $scope.currentAddress = currentAddress;
  });
  Utilities.getAllAddresses().then(function(allAddresses) {
    $scope.allAddresses = allAddresses;
  });
  $scope.newAddress = Receive.newAddress;
  $scope.setAsCurrentAddress = Receive.setAsCurrentAddress;
}]);
