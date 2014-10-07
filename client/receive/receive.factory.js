angular.module('bitclip.receiveFactory', [])

.factory('Receive', ['$q', '$rootScope', 'Utilities', function($q, $rootScope, Utilities) {
  var newAddress = function(scope) {
    var isMainNet = $rootScope.isMainNet;
    var network = isMainNet ? 'bitcoin' : 'testnet';
    var location = isMainNet ? 'mainNet' : 'testNet';
    var key = bitcoin.ECKey.makeRandom();
    var currentPrivateKey = key.toWIF(bitcoin.networks[network]);
    var currentAddress = key.pub.getAddress(bitcoin.networks[network]).toString();

    chrome.storage.local.get(location, function(obj) {
      obj[location].currentAddress = currentAddress;
      obj[location].currentPrivateKey = currentPrivateKey;
      chrome.storage.local.set(obj, function() {
        chrome.storage.local.get(location, function(obj) {
          obj[location].allAddressesAndKeys.unshift([currentAddress, currentPrivateKey]);
          chrome.storage.local.set(obj, function() {
            if (network === 'testnet') {
              Utilities.getTestNetCoins(currentAddress, 99000000, function() {
                applyCurrentAddress(currentAddress);
                scope.renderBalances();
              });
            } else {
              applyCurrentAddress(currentAddress);
              scope.renderBalances();
            }
          });
        });
      });
    });
  };

  var setAsCurrentAddress = function(address) {
    applyCurrentAddress(address);
    var isMainNet = $rootScope.isMainNet;
    var location = isMainNet ? 'mainNet' : 'testNet';

    chrome.storage.local.get(location, function(obj) {
      for (var i = 0, l = obj[location].allAddressesAndKeys.length; i < l; i++) {
        if (address === obj[location].allAddressesAndKeys[i][0]) {
          obj[location].currentAddress = obj[location].allAddressesAndKeys[i][0];
          obj[location].currentPrivateKey = obj[location].allAddressesAndKeys[i][1];
          chrome.storage.local.set(obj);
        }
      }
    });
  };

  var applyCurrentAddress = function(address) {
    $rootScope.currentAddress = address;
  };

  var prepareDefault = function(allAddresses) {
    var result = {};
    for (var i = 0, l = allAddresses.length; i < l; i++) {
      result[i] = {address: allAddresses[i], balance: ''};
    }
    return result;
  };

  var prepareBalances = function(allAddresses, allBalances) {
    var deferred = $q.defer();
    var result = {};
    for (var i = 0, l = allAddresses.length; i < l; i++) {
      result[i] = {address: allAddresses[i], balance: allBalances[i].balance / 100000000};
    }
    deferred.resolve(result);
    return deferred.promise;
  };

  return {
    newAddress: newAddress,
    setAsCurrentAddress: setAsCurrentAddress,
    applyCurrentAddress: applyCurrentAddress,
    prepareDefault: prepareDefault,
    prepareBalances: prepareBalances
  };
}]);
