angular.module('bitclip.header', [])

.controller('HeaderController', ['$scope', 'getBalance', function($scope, getBalance){

  

  chrome.storage.local.get('address').then(function(data){
    getBalance.getBalance(address).then(function(data){
      $scope.balance = data.balance;
    })
  }).catch(function(err){
    $scope.balance = null;
  })

  $scope.message = ($scope.balance) ? "Your Balance: " + $scope.balance : "No Address Found";

}])