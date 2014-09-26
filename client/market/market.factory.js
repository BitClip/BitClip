angular.module('bitclip.marketFactory', [])

.factory('Market', ['Utilities', function(Utilities){

  var getGraphData = function(baseUrl, numHrs , callback){
    var url = baseUrl + "/api/marketdata";
    var dataObj = {
      timePeriod: numHrs*3600000,
      time: new Date().getTime() //get current time in milliseconds
    };
    var options = JSON.stringify({
      data:dataObj
    });
    Utilities.httpGet(url, callback, options);
  };

  return {
    getGraphData:getGraphData
  };

}])