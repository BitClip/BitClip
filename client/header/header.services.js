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
      Address.findCurrentAddress()
        .then(function(address) {
          console.log("current address: ", address);
          //find the network the user is currently using
          NetworkSettings.getNetwork().then(function(isMainNet) {
            //handle the case when the user has no network preference
            //and isMainNet is undefined
            //(this probably occurs when user has not generated
            // an address)
            if (isMainNet === undefined) {
              deferred.resolve("Error! No network specified");
            } else {
              //handles the case where there is a network preference
              //hence can get the balance of the address from HelloBlock
              getBalanceForSingleAddress(address, isMainNet).then(function(data) {
                deferred.resolve(data);
              }).catch(function(error) {
                console.log("xxxxxxxxxxxxxxxxxx: ", error);
                deferred.resolve(error);
              })
            }
          })
        })
      return deferred.promise;
    };

    return {
      getBalanceForCurrentAddress: getBalanceForCurrentAddress
    }
  }
])
