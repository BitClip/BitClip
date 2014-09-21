angular.module('bitclip.headerController', [])

.controller('HeaderController', ['$scope', 'GetBalance', 'Utilities',
  function($scope, GetBalance, Utilities) {
    Utilities.initialize().then(function(resolveMessage) {
      GetBalance.getBalanceForCurrentAddress().then(function(data) {
        //handles the case where there is a
        //valid address and corresponding network selection
        if (typeof data.data.address.confirmedBalance === 'number') {
          var confirmedBalance = data.data.address.confirmedBalance;
          $scope.balanceMessage = "Balance: " + confirmedBalance + " BTC";
        } else {
          //handles the case where there is no network selection made
          console.log("no network selection");
          $scope.balanceMessage = data;
        }
      }).catch(function(error) {
        //handles the case when there is valid address
        //but the network selection does not corresponde with
        //type of the address
        //this error can be handled by implementing a setting
        //object
        console.log("I am in error");
        $scope.balanceMessage = "No addresses found";
      });
      $scope.balanceMessage = "Loading Bitcoin address";

      //this function checks what network the user was last using
      //to determine whether Use Mainnet or Use TestNet should
      //be displayed in the settingsDropDown menu

      var setNetworkInScope = function() {
        Utilities.isMainNet().then(function(isMainNet) {
          //if network has not been set, we default to MainNet
          if (isMainNet === undefined) {
            $scope.isMainNet = true;
            GetBalance.setNetwork($scope.isMainNet);
          } else {
            $scope.isMainNet = isMainNet;
          };
        })
      };
      setNetworkInScope();

      //when user click change to MainNet/TestNet
      //toggle the isMainNet variable in chrome local storage
      //and then update the $scope.isMainNet variable
      $scope.toggleNetwork = function() {
        GetBalance.setNetwork(!$scope.isMainNet).then(function() {
          $scope.isMainNet = !$scope.isMainNet;
        });
      }
    });
  }
]);
