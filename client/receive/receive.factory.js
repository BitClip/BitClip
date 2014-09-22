angular.module('bitclip.receiveFactory', [])

.factory('Receive', ['$q', 'Utilities', function($q, Utilities) {
  var newAddress = function() {
    var that = this;
    Utilities.isMainNet().then(function(bool) {
      var isMainNet = bool;
      var network = isMainNet ? 'bitcoin' : 'testnet';
      var key = bitcoin.ECKey.makeRandom();
      var currentPrivateKey = key.toWIF(bitcoin.networks[network]);
      var currentAddress = key.pub.getAddress(bitcoin.networks[network]).toString();

      var location = isMainNet ? 'mainNet' : 'testNet';
      chrome.storage.local.get(location, function(obj) {
        obj[location].currentAddress = currentAddress;
        obj[location].currentPrivateKey = currentPrivateKey;
        chrome.storage.local.set(obj, function() {
          that.$apply(function() {
            that.currentAddress = currentAddress;
          });
          chrome.storage.local.get(location, function(obj) {
            if (!obj[location].allAddressesAndKeys) {
              obj[location].allAddressesAndKeys = [[currentAddress, currentPrivateKey]];
              chrome.storage.local.set(obj, function() {
                that.$apply(function() {
                  that.allAddresses = [currentAddress];
                });
              });
            } else {
              obj[location].allAddressesAndKeys.unshift([currentAddress, currentPrivateKey]);
              chrome.storage.local.set(obj, function() {
                that.$apply(function() {
                  that.allAddresses.unshift(currentAddress);
                });
              });
            }
          });
        });
      });
    });
  };

  return {
    newAddress: newAddress
  };
}]);
