angular.module('bitclip.utilitiesFactory', [])

.factory('Utilities', ['$http', '$q', function($http, $q) {
  var InitObj = function() {
    this.currentAddress = '';
    this.currentPrivateKey = '';
    this.allAddressesAndKeys = [];
  };

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

  var httpGet = function(url, callback) {
    $http.get(url)
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

  var getNetworkData = function(request) {
    var deferred = $q.defer();
    chrome.storage.local.get(['isMainNet', 'mainNet', 'testNet'], function(obj) {
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
        var requestString = '';
        if (arr.length > 1) {
          requestString += arr.join('&addresses=');
        } else {
          requestString = arr[0];
        }
        baseUrl += requestString;
        httpGet(baseUrl, function(obj) {
          deferred.resolve(obj.data.addresses);
        });
      });
    });
    return deferred.promise;
  };

  // use websocket to emit events when there is a change
  // in balance on the currentAddress
  var getLiveBalanceForCurrentAddress = function(callback){
    isMainNet().then(function(bool) {
      getCurrentAddress().then(function(currentAddress){
        var url = "wss://socket-" + (bool ? 'mainnet' : 'testnet') + ".helloblock.io";
        console.log("socket url: ", url);
        var ws = new WebSocket(url);
        ws.onopen = function() {
          ws.send(JSON.stringify({
            "op": "subscribe",
            "channel": "addresses",
            "filters": [currentAddress]
          }));

          ws.onmessage = function(e) {
            console.log("SOCKET RECEIVED MESSAGE: \n", e.data);
            var data = JSON.parse(e.data);
            if (data.data){
              callback(null, data.data);
            }
          };

          // we automatically reconnect if connection drops
          ws.onclose = function(e) {
            console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(function() {
              connect();
            }, 1000);
          };

          //possible reason for error: invalid bitcoin address submited
          //or if socket hosted by HelloBlock goes down
          ws.onerror = function(err) {
            console.error('Socket encountered error: ', err.message, 'Closing socket');
            callback(err.message, null);
            ws.close();
          };
        };
      });
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
    getLiveBalanceForCurrentAddress: getLiveBalanceForCurrentAddress
  };
}]);
