angular.module('bitclip.marketFactory', [])

.factory('Market', ['$http', function($http){

  var getGraphData = function(hours, callback){
    var url = "http://localhost:3000/api/marketdata";
    var dataObj = {
          timePeriod: hours * 3600000,
          time: new Date().getTime() //get current time in milliseconds
    };
    var options = {
      data : dataObj,
      'Content-type': 'application/json'
    };

    $http.get(url, options).success(function(data){
      callback(data);
    }).error(function(data, statusCode){
      callback("Error with HTTP request");
    });
  };

  var getLastTrade = function(txObj){
    //first element is time of trade
    //second element is price of trade
    var result = [0,0];
    for (var exchange in txObj){
      var tradesForExchange = txObj[exchange].values;
      var finalTrade = tradesForExchange[tradesForExchange.length-1];
      if (finalTrade[0] > result[0]){
        result = finalTrade;
      }
    };
    result[1] = +result[1].toFixed(2);
    return result[1];
  };

  //round prices to 2 dec
  //need to round time to local timezone
  var parseTxIntoTwoDecimals = function(txObj){
    for (var exchange in txObj){
      var tradesForExchange = txObj[exchange].values;
      tradesForExchange.forEach(function(tradeArr, index, collection){
        tradeArr[0] = new Date(tradeArr[0]);
        tradeArr[1] = +tradeArr[1].toFixed(2);
      });
    }
    return txObj;
  };

  return {
    getGraphData:getGraphData,
    getLastTrade: getLastTrade,
    parseTxIntoTwoDecimals: parseTxIntoTwoDecimals
  };
}])