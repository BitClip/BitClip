angular.module('bitclip.marketController', ['nvd3ChartDirectives'])

.controller('marketController', ['$scope', 'Market', '$http', function($scope, Market, $http){    
    $scope.getGraphData = function(hours){
        Market.getGraphData(hours, function(data){
            console.log("DATA FROM SERVER: ", data);
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
            var dateFormatted = date.toLocaleTimeString() + " "+ date.toLocaleDateString(); 
            var template = "<h4 class='toolTipHeader'><b>" + exchangeName +"</b></h4>" + "<p>$"+ price + " @ "+ dateFormatted +"</p>" 
            return template;
        };
    };

    $scope.xAxisTickValuesFunction = function(){
        return function(d){
            var tickVals = [];
            var values = d[0].values;
            var interestedTimeValuesArray = [0, 00, 15, 30, 45];
            for(var i in values){
                if(interestedTimeValuesArray.indexOf(moment.unix(values[i][0]/1000).minute()) >= 0){
                    tickVals.push(values[i][0]);
                }
            }
            console.log('xAxisTickValuesFunction', d);
            return tickVals;
        };
    };

    //took this out of the directive, because otherwise
    //cannot show both tooltip content
    // xAxisTickFormat="xAxisTickFormatFunction()"
    $scope.xAxisTickFormatFunction = function(){
        return function(d){
            return d3.time.format('%H:%M')(moment.unix(d).toDate());
        }
    };


}]);
