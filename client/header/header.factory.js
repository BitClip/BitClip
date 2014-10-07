angular.module('bitclip.headerFactory', [])

.factory('Header', ['$http', '$q', 'Utilities', function($http, $q, Utilities) {
  var setNetwork = function(isMainNet, callback) {
    chrome.storage.local.set({
      isMainNet: isMainNet
    }, callback);
  };

  var getBalanceForCurrentAddress = function() {
    var deferred = $q.defer();
    Utilities.getCurrentAddress().then(function(currentAddress) {
      Utilities.getBalances([currentAddress]).then(function(arr) {
        if (!arr.length) {
          deferred.resolve('No address found.');
          return deferred.promise;
        } else {
          deferred.resolve(arr[0].balance);
        }
      });
    });
    return deferred.promise;
  };

  return {
    setNetwork: setNetwork,
    getBalanceForCurrentAddress: getBalanceForCurrentAddress
  };
}]);
