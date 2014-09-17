angular.module('bitclip.receive', [
])

.controller('receiveController', function($scope, Address) {
  $scope.address = Address.address;
  $scope.newAddress = Address.newAddress;
});
