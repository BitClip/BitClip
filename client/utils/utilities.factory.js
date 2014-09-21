angular.module('bitclip.utilitiesFactory', [])

.factory('Utilities', ['$http', '$q', function($http, $q) {
  //create init object for each network object
  //pseudoclassically instantiated
  //required because assigning obj.testNet to var initObj in initialize
  //was not working
  var InitObj = function(){
    this.currentAddress = "";
    this.currentPrivateKey = "";
    this.allAddressesAndKeys = [];
  };

  var initialize = function() {
    var deferred = $q.defer();
    chrome.storage.local.get(['isMainNet', 'mainNet', 'testNet'], function(obj) {
      console.log("data before init: \n\n", obj)
      if (obj.isMainNet === undefined){
        obj.isMainNet = true;
      }
      if (obj.mainNet === undefined) {
        obj.mainNet = new InitObj();
      }
      if (obj.testNet === undefined) {
        obj.testNet = new InitObj();
      }
      chrome.storage.local.set(obj, function() {
        deferred.resolve('Initialization complete.');
      });
    });
    return deferred.promise;
  };

  var httpGet = function(url, callback) {
    $http.get(url)
      .success(callback(result))
      .error(function(data, status, headers, config) {
        callback('HTTP GET request failed: ', status);
      });
  };

  var isMainNet = function() {
    var deferred = $q.defer();
    chrome.storage.local.get('isMainNet', function(obj) {
      deferred.resolve(obj.isMainNet);
    });
    return deferred.promise;
  };

  var getNetworkData = function(request) {
    var deferred = $q.defer();
    chrome.storage.local.get(['isMainNet', 'mainNet', 'testNet'], function(obj) {
      console.log(obj, 'theseed');
      if (obj.isMainNet === true) {
        var result = obj.mainNet[request];
        deferred.resolve(result);
      } else if (obj.isMainNet === false) {
        var result = obj.testNet[request];
        deferred.resolve(result);
      } else {
        deferred.reject('Network type not defined.');
      }
    });
    return deferred.promise;
  };

  var getCurrentAddress = function() {
    return getNetworkData('currentAddress');
  };

  var getCurrentPrivateKey = function() {
    return getNetworkData('currentPrivateKey');
  };

  var getAllAddresses = function() {
    var deferred = $q.defer();
    getNetworkData('allAddressesAndKeys').then(function(arr) {
      var result = [];
      for (var i = 0, l = arr.length; i < l; i++) {
        result.push(arr[i][0]);
      }
      deferred.resolve(result);
    });
    return deferred.promise;
  };

  var getBalances = function(addresses) {
    var deferred = $q.defer();
    isMainNet().then(function(bool) {
      getAllAddresses().then(function(arr) {
        var baseUrl = 'http://' + (bool ? 'mainnet' : 'testnet') + '.helloblock.io/v1/addresses?addresses=';
        var requestString = arr[0];
        if (arr.length > 1) {
          requestString += arr.join('&addresses=');
        }
        baseUrl += requestString;
        httpGet(baseUrl, function(obj) {
          deferred.resolve(obj.data.addresses);
        });
      });
    });
    return deferred.promise;
  };

  return {
    initialize: initialize,
    isMainNet: isMainNet,
    getCurrentAddress: getCurrentAddress,
    getCurrentPrivateKey: getCurrentPrivateKey,
    getAllAddresses: getAllAddresses,
    getBalances: getBalances
  };
}]);
