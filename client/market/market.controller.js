angular.module('bitclip.marketController', ['nvd3ChartDirectives'])

.controller('marketController', ['$scope', 'Market', '$http', function($scope, Market, $http){
  $scope.getGraphData = function(hours) {
    Market.getGraphData(hours, function(data) {
      $scope.setYAxis = [Math.ceil((+data.min * 0.98)), Math.ceil((+data.max * 1.02))];
      $scope.transactions = Market.parseTxIntoTwoDecimals(data.transactions);
      $scope.updateTime = data.time;
      $scope.vwap = +(data.vwap).toFixed(2);
      $scope.stdDeviation = +data.stdDeviation.toFixed(2);
      $scope.max = +data.max.toFixed(2);
      $scope.min = +data.min.toFixed(2);
      $scope.volume = +data.volume.toFixed(2);
      $scope.lastTrade = Market.getLastTrade(data.transactions);
    });
  };

  $scope.toolTipContentFunction = function() {

    return function(exchangeName, date, price, e, graph) {
      exchangeName = exchangeName.charAt(0).toUpperCase() + exchangeName.slice(1);
      var template = "<div class='graphToolTip'><small class='toolTipHeader'>" + exchangeName + 
        "</small><small class='toolTipPrice'><span>" + price + "</span></small>" + 
        "<small class='toolTipTime'>" + date + "</small></div>";
      return template;
    };
  };

  $scope.xAxisTickValuesFunction = function() {
    return function(d) {
      var tickVals = [];
      var values = d[0].values;
      var valLength = values.length;

      if(valLength < 2) { //default if server hasn't collected enough data
        return [0, 0];
      }

      var mid = Math.ceil(valLength/2)
      tickVals.push(values[mid][0])

      return tickVals;
    };
  };

  $scope.xAxisTickFormatFunction = function() {
    return function(d) {
      var time = new Date(d);
      time = time.toLocaleTimeString()
      return time.slice(0, 4) + time.slice(7, time.length);
    }
  };

  $scope.setActiveTab = function(tab) {
    $scope.activeTab = tab;
  };

  $scope.getGraphData(24);
  $scope.activeTab = 'twentyfourHour';

}]);
