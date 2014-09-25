angular.module('bitclip.historyController', [])

.controller('historyController', ['$scope','Utilities', 'History',
  function($scope, Utilities, History) {

    Utilities.getCurrentAddress().then(function(currentAddress) {
      $scope.currentAddress = currentAddress;

      History.getTransactionHist(currentAddress).then(function(trans){
      var transaction = [];

      for(var i = 0; i < trans.length; i++){
        console.log(History.getUsableTransData(trans[i]));
        transaction.push(History.getUsableTransData(trans[i]));
      }
        console.log($scope.transaction);
       $scope.transactions = transaction;
    });
    });

    

  }]);

//time direct amount stuff