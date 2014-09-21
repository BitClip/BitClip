angular.module('bitclip.headerFactory', [])

.factory('GetBalance', ['$http', '$q', 'Utilities',
  function($http, $q, Utilities) {

    var setNetwork = function(isMainNet) {
      var deferred = $q.defer();
      chrome.storage.local.set({
        isMainNet: isMainNet
      }, function() {
        deferred.resolve();
      });
      return deferred.promise;
    };


    //get currentAddress from chrome local storage

    var getBalanceForCurrentAddress = function() {
      var deferred = $q.defer();
        Utilities.getCurrentAddress().then(function(currentAddress){
          var isMainNet = (currentAddress[0] === '1')
          var url = 'http://' + (bool ? 'mainnet' : 'testnet') + '.helloblock.io/v1/addresses/'+ currentAddress;
          Utilities.httpGet(url, function(data){
            deferred.resolve(data);
          });
        });
      return deferred.promise;
    };

    return {
      getBalanceForCurrentAddress: getBalanceForCurrentAddress,
      setNetwork: setNetwork
    }
  }
])
