angular.module('bitclip.receiveController', [])

.controller('receiveController', ['$scope', 'currentAddress', 'Address',
  function($scope, currentAddress, Address) {
    $scope.currentAddress = currentAddress;
    $scope.newAddress = Address.newAddress;

    if (!$scope.currentAddress) $scope.newAddress();
  }
]);
