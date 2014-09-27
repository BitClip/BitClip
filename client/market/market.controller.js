angular.module('bitclip.marketController', ['nvd3ChartDirectives'])
.controller('marketController', ['$scope', 'Market', '$http', function($scope, Market, $http){
    
    $scope.getGraphData = function(hours){
        Market.getGraphData(hours, function(data){
            console.log(data);
            if (data !== "Error with HTTP request"){
                $scope.transactions = Market.parseTxIntoTwoDecimals(data.transactions);
                $scope.updateTime = data.time || 1411777376752;
                $scope.vwap = data.vwap || '400';
                $scope.stdDeviation = data.stdDeviation || '15';
                $scope.max = data.max || '500';
                $scope.min = data.min || '200';
                $scope.volume = data.volume || '2000';
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


}]);
