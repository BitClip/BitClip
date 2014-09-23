angular.module('bitclip.headerController', [])

.controller('headerController', ['$scope', 'Header', 'Utilities', function($scope, Header, Utilities) {
  Utilities.initialize().then(function(resolveMessage) {


    var setBalance = function() {
      $scope.balanceMessage = "Loading balance ...";
      Header.getBalanceForCurrentAddress().then(function(confirmedBalance) {
        $scope.balanceMessage = "Balance: " + confirmedBalance + " BTC";
      }).catch(function(err) {
        $scope.balanceMessage = "No valid addresses found.";
      });
    };
    
    //initialize active tab to send
    $scope.activeTab = "send"
    //set active tab to whichever is clicked
    $scope.setActiveTab = function(tab){
      $scope.activeTab = tab;
    }

    var getNetworkStatus = function() {
      Utilities.isMainNet().then(function(isMainNet) {
        $scope.isMainNet = isMainNet;
        setBalance();
      });
    };
    getNetworkStatus();

    $scope.toggleNetwork = function() {
      Header.setNetwork(!$scope.isMainNet, getNetworkStatus);
    };
  });

}]);
