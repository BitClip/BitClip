angular.module('bitclip.marketController', ['nvd3ChartDirectives'])
.controller('marketController', ['$scope', 'Market', function($scope, Market){

    $scope.getGraphData = function(hours){
    	//first parameter is base url of our server
    	//do NOT end the url with '/'
    	console.log(hours);
    	Market.getGraphData("http://localhost:3000", hours, function(data){
    		data = JSON.parse(data);
    		$scope.mktData = data.transactions;
    	});
    };
  }
]);