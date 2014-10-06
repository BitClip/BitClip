angular.module('bitclip.marketFactory', [])

.factory('Market', ['$http', function($http){

  var getGraphData = function(hours, callback){
    var url = "http://bitscrape.azurewebsites.net/api/marketdata"; 
    var dataObj = {
      timePeriod: hours * 3600000,
          time: new Date().getTime() //get current time in milliseconds
        };
        var config = {
          url: url,
          method: 'GET',
          params: dataObj
        };
        $http(config).success(function(data){
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

  //returns the next nearest second hour
  //ie 9.24, returns 11:00
  var returnNext2Hour = function(msSinceEpoch){
    return Math.ceil(msSinceEpoch/7200000) * 7200000;
  };

  //returns the immediately previous second last hour
  //ie 9.24, returns 8:00
  var returnLast2Hour = function(msSinceEpoch){
    return Math.floor(msSinceEpoch/7200000) * 7200000;
  }

  return {
    getGraphData:getGraphData,
    getLastTrade: getLastTrade,
    parseTxIntoTwoDecimals: parseTxIntoTwoDecimals,
    returnNext2Hour:returnNext2Hour,
    returnLast2Hour: returnLast2Hour
  };
}])
