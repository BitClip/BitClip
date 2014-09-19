angular.module('bitclip.headerServices', [])

.factory('GetBalance', ['$http', '$q', 'Address',
  function($http, $q, Address) {

    //we need to link isMainNet to a variable persisted
    //in chrome storage
    var isMainNet = true;

    //query the helloblock api to get confirmed balance
    //in all addresses
    var httpGetToHB = function(url, callback) {
      $http({
        method: 'GET',
        url: url
      })
        .success(function(data, status, headers, config) {
          callback(data);
        })
        .error(function(data, status, headers, config) {
          callback('Error: ', data);
        });
    };

    //find all addresses in wallet, push into array
    //to prepare for checking of balance

    var getAllAddresses = function() {
      var deferred = $q.defer();
      chrome.storage.local.get('userHistory', function(data) {
        var keyAddressArray = data.userHistory;
        var addressArray = [];
        keyAddressArray.forEach(function(pair) {
          addressArray.push(pair[0]);
        });
        deferred.resolve(addressArray);
      });
      return deferred.promise;
    };

    //get balance of from a batch of addresses

    var getBatchBalance = function(array, isMainNet, callback) {
      var addressParam = array.join('&addresses=');
      var network = (isMainNet) ? "mainnet" : "testnet";
      var url = 'http://' + network + '.helloblock.io/v1/addresses?addresses=' + addressParam;
      console.log("address: ", addressParam);
      httpGetToHB(url, function(data) {
        callback(data);
      });
    };

    //get overall balance from all addresses in the wallet

    var getBalanceForAllAddresses = function() {
      var deferred = $q.defer();
      getAllAddresses().then(function(addressArray) {
        getBatchBalance(addressArray, isMainNet,
          function(data) {
            console.log("helloblock returned balance obj: ", data);
            var balanceArray = data.data.addresses;
            var sum = balanceArray.reduce(function(prevValue, currentObj, index) {
              return prevValue + currentObj.confirmedBalance;
            }, 0);
            deferred.resolve(sum);
          });
      }).catch(function(error) {
        console.error(error);
      });
      return deferred.promise;
    };

    //query the helloblock api to get confirmed balance
    //in single address
    var getBalanceForSingleAddress = function(address, isMainNet) {
      var network = (isMainNet) ? "mainnet" : "testnet";
      var deferred = $q.defer();
      var url = 'http://' + network + '.helloblock.io/v1/addresses/' + address;
      httpGetToHB(url, function(data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    };

    //get currentAddress from chrome local storage

    var getBalanceForCurrentAddress = function(callback) {
      var deferred = $q.defer();
      Address.findAddress()
        .then(function(address) {
          console.log("current address: ", address);
          getBalanceForSingleAddress(address, isMainNet)
            .then(function(data) {
              var confirmedBalance = data.data.address.confirmedBalance;
              deferred.resolve(confirmedBalance);
            })
        })
      return deferred.promise;
    };

    return {
      getBalanceForAllAddresses: getBalanceForAllAddresses,
      getBalanceForCurrentAddress: getBalanceForCurrentAddress
    }
  }
])
