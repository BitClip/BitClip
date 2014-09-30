angular.module('bitclip.historyController', [])

.controller('historyController', ['$scope','Utilities', 'History', function($scope, Utilities, History) {
    Utilities.getCurrentAddress().then(function(currentAddress) {
      $scope.currentAddress = currentAddress;
      History.getTransactionHist(currentAddress).then(function(trans){
        var transaction = [];
        for(var i = 0; i < trans.length; i++){
          transaction.push(History.getUsableTransData(trans[i]));
        }
        $scope.transactions = transaction;
      });
    });
}]);

