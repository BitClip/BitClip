angular.module('bitclip.receive', [])

.factory('Address', function() {
  var address = StorageArea.get('currentAddress', function(address) {
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

    StorageArea.set({
      currentAddress: bitcoinAddress
    }, function(err) {
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
