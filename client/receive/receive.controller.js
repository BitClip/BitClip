angular.module('bitclip.receiveController', [])

.controller('receiveController', ['$scope', 'Address',
  function($scope, Address) {
	Address.findCurrentAddress().then(function(currentAddress) {
    	$scope.currentAddress = currentAddress;
	});
	Address.findAllAddresses().then(function(allAddresses) {
    	$scope.allAddresses = allAddresses;
	});
    $scope.newAddress = Address.newAddress;
  }
]);
