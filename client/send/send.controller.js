angular.module('bitclip.sendController', [
  'ngMorph'
])

.controller('sendController', ['$scope', 'persistentTransaction', 'sendTransactionBuilder',
  function($scope, persistentTransaction, sendTransactionBuilder) {

    //  ng morph modal
    $scope.send = {
      closeEl: '.close',
      modal: {
        templateUrl: 'send/send.btn.html',
        position: {
          top: '85%',
          left: '0%'
        },
        fade: false
      }
    };

    //initialize transaction details (amount, destination)
    $scope.transactionDetails = persistentTransaction.transactionDetails;

    //update the transaction details with input field values
    $scope.updateTransactionDetails = function() {
      persistentTransaction.updateTransaction($scope.transactionDetails)
    };

    //TODO: sendPayment Functionality
    $scope.sendPayment = function() {
      chrome.storage.local.get(['currentPrivateKey', 'isMainNet'], function(data) {
        sendTransactionBuilder.sendTransaction(data.currentPrivateKey, $scope.transactionDetails, data.isMainNet);
      });
    };

    //TODO: ng-validate destination input : starts with 1, base58, 52length
  }
]);
