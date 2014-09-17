angular.module('bitclip.receiveController', [
])

.controller('receiveController', ['$scope', 'Address', function($scope, Address) {
  $scope.address = Address.address;
  $scope.newAddress = Address.newAddress;
}]);
