angular.module('bitclip.receiveFactory', [
])

.factory('Address', function() {
  var address = chrome.storage.local.get('currentAddress', function(address) {
    if (!address) {
      return newAddress();
    }
    return address;
  });

  var newAddress = function() {
    key = bitcoin.ECKey.makeRandom();

    // Print your private key (in WIF format)
    key.toWIF();

    // Print your public key (toString defaults to a Bitcoin address)
    bitcoinAddress = key.pub.getAddress().toString();
    console.log(bitcoinAddress);

    chrome.storage.local.set({currentAddress: bitcoinAddress}, function(err) {
      if (err) {
        console.log('Failed to write to Chrome local storage', err);
      }
      return bitcoinAddress;
    });
  };

  return {
    address: address,
    newAddress: newAddress
  };
});
