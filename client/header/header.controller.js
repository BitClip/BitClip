angular.module('bitclip.headerController', [])

.controller('HeaderController', ['$scope', 'HeaderDetails', 'Utilities',
  function($scope, HeaderDetails, Utilities) {
    Utilities.initialize().then(function(resolveMessage) {
      //queries HelloBlock to get Balance of Current Address;
      $scope.balanceMessage = "Loading Bitcoin address";
      HeaderDetails.getBalanceForCurrentAddress().then(function(data) {
        console.log("I am data returned: ", data);
        var confirmedBalance = data.data.address.confirmedBalance;
        $scope.balanceMessage = confirmedBalance + " BTC";
      }).catch(function(error) {
        //handles when HelloBlock returns error from HTTP request
        $scope.balanceMessage = "No addresses found";
      });

      //Checks what network the user was last using
      var getNetworkStatus = function(){
        Utilities.isMainNet().then(function(isMainNet) {
            $scope.isMainNet = isMainNet;
        });
      };

      getNetworkStatus();
      //when user click change to MainNet/TestNet
      //toggle the isMainNet variable in chrome local storage
      //and then update the $scope.isMainNet variable
      $scope.toggleNetwork = function() {
        HeaderDetails.setNetwork(!$scope.isMainNet, getNetworkStatus);
      };
    });
}]);
