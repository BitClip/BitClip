angular.module('bitclip.headerServices', [])

.factory('getBalance', ['$http',
  function($http) {
    //query the helloblock api to get confirmed balance
    //in all addresses
    var getBalanceForAllAddresses = function(array) {
      var addressParam = array.join('&addresses=');
      var url = 'http://testnet.helloblock.io/v1/addresses?addresses=' + addressParam;
      console.log("address: ", addressParam);
      $http({
        method: 'GET',
        url: url
      }).
      success(function(data, status, headers, config) {
        console.log('DATA: ', data);
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log('Error: ', data);
      });
    };

    //query the helloblock api to get confirmed balance
    //in single address
    var getBalanceForSingleAddress = function(address) {
      var url = 'http://testnet.helloblock.io/v1/addresses/' + address;

    };
  }
])
