angular.module('bitclip.utilitiesFactory', [])

.factory('Utilities', ['$http', '$q', function($http, $q) {
  var InitObj = function() {
    this.currentAddress = '';
    this.currentPrivateKey = '';
    this.allAddressesAndKeys = [];
  };

  // If local storage structure has not been created (when first running app)
  // then create shell used to store addresses, keys, etc.
  var initialize = function() {
    var deferred = $q.defer();
    chrome.storage.local.get(['isMainNet', 'mainNet', 'testNet'], function(obj) {
      if (obj.isMainNet === undefined) {
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

  var httpGet = function(url, callback, options) {
    $http.get(url, options)
      .success(function(data) {
        callback(data);
      })
      .error(function(data, status, headers, config) {
        callback('HTTP GET request failed: ', data, status, headers, config);
      });
  };

  var isMainNet = function() {
    var deferred = $q.defer();
    chrome.storage.local.get('isMainNet', function(obj) {
      deferred.resolve(obj.isMainNet);
    });
    return deferred.promise;
  };

  // Abstracted function used to fetch data from local storage
  var getNetworkData = function(request) {
    var deferred = $q.defer();
    chrome.storage.local.get(['isMainNet', 'mainNet', 'testNet'], function(obj) {
      if (obj.isMainNet === true) {
        deferred.resolve(obj.mainNet[request]);
      } else if (obj.isMainNet === false) {
        deferred.resolve(obj.testNet[request]);
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

  // Query Helloblock for balance information
  // Accepts array of addresses
  var getBalances = function(addresses) {
    var deferred = $q.defer();
    isMainNet().then(function(bool) {
      var baseUrl = 'http://' + (bool ? 'mainnet' : 'testnet') + '.helloblock.io/v1/addresses?addresses=';
      var requestString = '';
      if (addresses.length > 1) {
        requestString += addresses.join('&addresses=');
      } else if (addresses.length === 1) {
        if (!addresses[0]) {
          deferred.resolve([]);
          return deferred.promise;
        }
        requestString = addresses[0];
      } else {
        deferred.resolve([]);
        return deferred.promise;
      }
      baseUrl += requestString;
      httpGet(baseUrl, function(obj) {
        deferred.resolve(obj.data.addresses);
      });
    });
    return deferred.promise;
  };

  // Tracks sockets used to fetch balance information for current address
  var openSocketsList = [];

  var openSocketToGetLiveBalance = function(url, currentAddress, callback) {
    var ws = new WebSocket(url);
    openSocketsList.push(ws);
    ws.onopen = function() {
      ws.send(JSON.stringify({
        'op': 'subscribe',
        'channel': 'addresses',
        'filters': [currentAddress]
      }));

      ws.onmessage = function(e) {
        var data = JSON.parse(e.data);
        if (data.data) {
          callback(null, data.data);
        }
      };

      ws.onerror = function(err) {
        callback(err.message, null);
      };
    };
  };

  var closeExistingSocketsPermanently = function() {
    openSocketsList.forEach(function(websocket) {
      websocket.onclose = function() {};
      websocket.close();
    });
    openSocketsList.splice(0, openSocketsList.length);
  };

  var getLiveBalanceForCurrentAddress = function(callback) {
    isMainNet().then(function(bool) {
      getCurrentAddress().then(function(currentAddress) {
        var url = 'wss://socket-' + (bool ? 'mainnet' : 'testnet') + '.helloblock.io';
        closeExistingSocketsPermanently();
        openSocketToGetLiveBalance(url, currentAddress, callback);
      });
    });
  };

  // Add TestNet Bitcoins for given address
  var getTestNetCoins = function(address, value, callback) {
    $http({
      method: 'POST',
      url: 'http://testnet.helloblock.io/v1/faucet/withdrawal',
      data: {
        value: value,
        toAddress: address
      }
    })
      .success(function(data, status, headers, config) {
        callback(data, status, headers, config);
      })
      .error(function(data, status, headers, config) {
        callback(data, status, headers, config);
      });
  };

  return {
    initialize: initialize,
    isMainNet: isMainNet,
    httpGet: httpGet,
    getCurrentAddress: getCurrentAddress,
    getCurrentPrivateKey: getCurrentPrivateKey,
    getAllAddresses: getAllAddresses,
    getBalances: getBalances,
    openSocketsList: openSocketsList,
    getLiveBalanceForCurrentAddress: getLiveBalanceForCurrentAddress,
    getTestNetCoins: getTestNetCoins
  };
}]);
