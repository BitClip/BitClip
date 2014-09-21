angular.module('bitclip.headerFactory', [])

.factory('HeaderDetails', ['$http', '$q', 'Utilities',
  function($http, $q, Utilities) {

    var setNetwork = function(isMainNet, callback) {
      chrome.storage.local.set({ isMainNet: isMainNet }, callback);
    };

    //get currentAddress from chrome local storage

    var getBalanceForCurrentAddress = function() {
      var deferred = $q.defer();
        Utilities.getCurrentAddress().then(function(currentAddress){
          var isMainNet = (currentAddress[0] === '1') ? true : false;
          var url = 'http://' + (isMainNet ? 'mainnet' : 'testnet') + '.helloblock.io/v1/addresses/'+ currentAddress;
          Utilities.httpGet(url, function(data){
            deferred.resolve(data);
          });
        });
      return deferred.promise;
    };

    return {
      getBalanceForCurrentAddress: getBalanceForCurrentAddress,
      setNetwork: setNetwork
    };
}])
