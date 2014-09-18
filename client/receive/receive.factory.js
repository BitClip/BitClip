angular.module('bitclip.receiveFactory', [
])

.factory('Address', ['$q', function($q) {
  var findAddress = function() {
    var deferred = $q.defer();
    chrome.storage.local.get('currentAddress', function(currentAddress) {
      var address = currentAddress.currentAddress || '';
      deferred.resolve(address);
    });
    return deferred.promise;
  };

  var newAddress = function() {
    var key = bitcoin.ECKey.makeRandom();

    // Print your private key (in WIF format)
    var currentPrivateKey = key.toWIF();

    // Print your public key (toString defaults to a Bitcoin address)
    var currentAddress = key.pub.getAddress().toString();
    this.currentAddress = currentAddress;

    chrome.storage.local.get(['currentAddress', 'currentPrivateKey', 'userHistory'], function(currentInfo) {
      if (currentInfo.currentAddress) {
        if (!currentInfo.userHistory) {
          chrome.storage.local.set({userHistory: [[currentInfo.currentAddress, currentInfo.currentPrivateKey]]});
        } else {
          currentInfo.userHistory.push([currentInfo.currentAddress, currentInfo.currentPrivateKey]);
          chrome.storage.local.set({
            userHistory: currentInfo.userHistory
          });
        }
      }
    });

    chrome.storage.local.set({
      currentAddress: currentAddress,
      currentPrivateKey: currentPrivateKey
    });
  };

  return {
    findAddress: findAddress,
    newAddress: newAddress
  };
}]);
