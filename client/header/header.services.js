angular.module('bitclip.headerServices', [])

.factory('GetBalance', ['$http', '$q',
  function($http, $q) {

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
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          callback('Error: ', data);
        });
    };

    var getBalanceForAllAddresses = function(array, isMainNet) {
      var addressParam = array.join('&addresses=');
      var network = (isMainNet) ? "mainnet" : "testnet";
      var deferred = $q.defer();
      var url = 'http://' + network + '.helloblock.io/v1/addresses?addresses=' + addressParam;
      console.log("address: ", addressParam);
      httpGetToHB(url, function(data) {
        deferred.resolve(data);
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

    return {
      getAllAddresses: getAllAddresses,
      getBalanceForAllAddresses: getBalanceForAllAddresses,
      getBalanceForSingleAddress: getBalanceForSingleAddress
    }
  }
])
