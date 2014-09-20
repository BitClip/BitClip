angular.module('bitclip.headerServices', [])

.factory('GetBalance', ['$http', '$q', 'Address', 'NetworkSettings',
  function($http, $q, Address, NetworkSettings) {

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
      //find the currentAddress
      //TODO: instead of saving currentAddress and network as
      //separate keys, perhaps we should set a
      //current settings object that contains
      //currentAddress and the Netwrok??
      Address.findAddress()
        .then(function(address) {
          console.log("current address: ", address);
          //find the network the user is currently using
          //TODO: this is buggy for when the user uses the app
          //for the first time and isMainNet is undefined
          NetworkSettings.getNetwork().then(function(isMainNet) {
            getBalanceForSingleAddress(address, isMainNet).then(function(data) {
              var confirmedBalance = data.data.address.confirmedBalance;
              deferred.resolve(confirmedBalance);
            })
          })
        })
      return deferred.promise;
    };

    return {
      getBalanceForCurrentAddress: getBalanceForCurrentAddress
    }
  }
])
