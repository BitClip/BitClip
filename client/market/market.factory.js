angular.module('bitclip.marketFactory', [])

.factory('Market', ['$http', function($http) {
  //Query's database for market data
  var getGraphData = function(hours, callback) {
    var url = 'http://bitscrape.azurewebsites.net/api/marketdata'; 
    var dataObj = {
      timePeriod: hours * 3600000,
      time: new Date().getTime()
    };

    var config = {
      url: url,
      method: 'GET',
      params: dataObj
    };

    //call callback on returned data.
    $http(config).success(function(data){
      callback(data);
    }).error(function(data, statusCode){
      callback("Error with HTTP request");
    });
  };

  //Determines which transaction was last out of all exchanges
  var getLastTrade = function(txObj) {
    var result = [0,0];
    for (var exchange in txObj) {
      var tradesForExchange = txObj[exchange].values;
      var finalTrade = tradesForExchange[tradesForExchange.length - 1];
      if (finalTrade[0] > result[0]){
        result = finalTrade;
      } 
    };
    result[1] = +result[1].toFixed(2);
    return result[1];
  };

  //Rounds trade values to two decimal places 
  var parseTxIntoTwoDecimals = function(txObj) {
    for (var exchange in txObj) {
      var tradesForExchange = txObj[exchange].values;
      tradesForExchange.forEach(function(tradeArr, index, collection) {
        tradeArr[0] = new Date(tradeArr[0]);
        tradeArr[1] = +tradeArr[1].toFixed(2);
      });
    }
    return txObj;
  };

  //Rounds up and sets time two hours up for graph data max limit.
  var returnNext2Hour = function(msSinceEpoch) {
    return Math.ceil(msSinceEpoch / 7200000) * 7200000;
  };

  //Rounds down and sets time two hours down for graph data min limit.
  var returnLast2Hour = function(msSinceEpoch) {
    return Math.floor(msSinceEpoch / 7200000) * 7200000;
  };

  return {
    getGraphData:getGraphData,
    getLastTrade: getLastTrade,
    parseTxIntoTwoDecimals: parseTxIntoTwoDecimals,
    returnNext2Hour: returnNext2Hour,
    returnLast2Hour: returnLast2Hour
  };
}]);
