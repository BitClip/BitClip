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
        //TODO: must use Networks.getNetwork to
        //fetch isMainNet first
        getBatchBalance(addressArray, isMainNet,
          function(data) {
            console.log("helloblock returned balance obj: ", data);
            //balanceArray is array of objects returned from
            //HB that contains a property called confirmedBalance
            //which gives the balance of that address
            var balanceArray = data.data.addresses;

            //use reduce to sum up the individual balance
            //in each address object
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
      getBalanceForAllAddresses: getBalanceForAllAddresses,
      getBalanceForCurrentAddress: getBalanceForCurrentAddress
    }
  }
])
