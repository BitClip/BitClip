angular.module('bitclip.receiveFactory', [])

.factory('Receive', ['$q', 'Utilities', function($q, Utilities) {
  var newAddress = function() {
    var that = this;
    Utilities.isMainNet().then(function(bool) {
      console.log("In newAddress receive");
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
            obj[location].allAddressesAndKeys.unshift([currentAddress, currentPrivateKey]);
            chrome.storage.local.set(obj, function() {
              that.$apply(function() {
                that.allAddresses.unshift(currentAddress);
              });
              angular.element(document.getElementsByTagName('header-bar')).scope().getNetworkStatus();
            });
          });
        });
      });
    });
  };

  var setAsCurrentAddress = function(address) {
    var that = this;
    Utilities.isMainNet().then(function(bool) {
      var isMainNet = bool;
      var location = isMainNet ? 'mainNet' : 'testNet';

      chrome.storage.local.get(location, function(obj) {
        for (var i = 0, l = obj[location].allAddressesAndKeys.length; i < l; i++) {
          if (address === obj[location].allAddressesAndKeys[i][0]) {
            obj[location].currentAddress = obj[location].allAddressesAndKeys[i][0];
            obj[location].currentPrivateKey = obj[location].allAddressesAndKeys[i][1];
            chrome.storage.local.set(obj, function() {
              angular.element(document.getElementsByTagName('header-bar')).scope().getNetworkStatus();
            });
          }
        }
      });
    });
  };

  return {
    newAddress: newAddress,
    setAsCurrentAddress: setAsCurrentAddress
  };
}]);
