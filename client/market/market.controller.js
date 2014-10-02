angular.module('bitclip.marketController', ['nvd3ChartDirectives'])

.controller('marketController', ['$scope', 'Market', '$http', function($scope, Market, $http){
  $scope.getGraphData = function(hours){
    Market.getGraphData(hours, function(data){
      if (data !== "Error with HTTP request"){
        $scope.transactions = Market.parseTxIntoTwoDecimals(data.transactions);
        $scope.updateTime = data.time || 1411777376752;
        $scope.vwap = +(data.vwap).toFixed(2) || '400';
        $scope.stdDeviation = +data.stdDeviation.toFixed(2) || '15';
        $scope.max = +data.max.toFixed(2) || '500';
        $scope.min = +data.min.toFixed(2) || '200';
        $scope.volume = +data.volume.toFixed(2) || '2000';
        $scope.lastTrade = Market.getLastTrade(data.transactions);
      }
    });
  };

  $scope.toolTipContentFunction = function(){
    return function(exchangeName, date, price, e, graph) {
      var template = "<div> <h4 class='toolTipHeader'><b>" + exchangeName +"</b></h4>" + "<p class='toolTip'>$"+ price + " @ "+ date +"</p> </div>" 
      return template;
    };
  };

  $scope.xAxisTickValuesFunction = function(){
    return function(d){
      var tickVals = [];
      var values = d[0].values;
      var valLength = values.length;
      var mid = Math.ceil(valLength/2)
      tickVals.push(values[mid][0])

      return tickVals;
    };
  };

  $scope.xAxisTickFormatFunction = function(){
    return function(d){
      var time = new Date(d);
      time = time.slice(0, 4) + time.slice(7, time.length);
      return time;
    }
  };

  $scope.setActiveTab = function(tab) {
    $scope.activeTab = tab;
  };

  $scope.getGraphData(8);
  $scope.activeTab = 'eightHour';

}]);
