angular.module('bitclip.receiveFactory', [])

.factory('Address', ['$q',
  function($q) {

    var findCurrentAddress = function() {
      var deferred = $q.defer();
      chrome.storage.local.get('currentAddress', function(currentAddress) {
        var address = currentAddress.currentAddress || '';
        deferred.resolve(address);
      });
      return deferred.promise;
    };

    var findAllAddresses = function() {
      var deferred = $q.defer();
      chrome.storage.local.get('userHistory', function(userHistory) {
        var addresses = userHistory.userHistory || [];
        deferred.resolve(addresses);
      });
      return deferred.promise;
    };

    var newAddress = function() {
      var key = bitcoin.ECKey.makeRandom();
      var currentPrivateKey = key.toWIF();
      var currentAddress = key.pub.getAddress().toString();

      var that = this;
      chrome.storage.local.set({
        currentAddress: currentAddress,
        currentPrivateKey: currentPrivateKey
      }, function() {
        that.$apply(function() {
          that.currentAddress = currentAddress;
        });
        chrome.storage.local.get(['currentAddress', 'currentPrivateKey', 'userHistory'], function(userInfo) {
          if (!userInfo.userHistory) {
            chrome.storage.local.set({
              userHistory: [
                [userInfo.currentAddress, userInfo.currentPrivateKey]
              ]
            }, function() {
              that.$apply(function() {
                that.allAddresses = [
                  [userInfo.currentAddress, userInfo.currentPrivateKey]
                ];
              });
            });
          } else {
            userInfo.userHistory.unshift([currentAddress, currentPrivateKey]);
            chrome.storage.local.set({
              userHistory: userInfo.userHistory
            }, function() {
              that.$apply(function() {
                that.allAddresses.unshift([currentAddress, currentPrivateKey]);
              });
            });
          }
        });
      });
    };

    //////////////////////////////////////////////////////

    /*
     var createKeyAddressPair = function(isMainNet){
        create address and key based on isMainNet
        return [address, key]
     };

     var updateNetWorkObj = function(isMainNet, keyPairArray, callback){
      LocalStorage.getSpecificNetworkObj(isMainNet).then(function(data){
        var saveObj = {
          currentAddress = keyPairArray[0];
          ...and [1] for key
          ...and update UserHistory
        };
        LocalStorage.updateSpecificNetworkObj(isMainNet, saveObj, callback);
      })
     };

     */

    return {
      findCurrentAddress: findCurrentAddress,
      findAllAddresses: findAllAddresses,
      newAddress: newAddress
    };
  }
]);
