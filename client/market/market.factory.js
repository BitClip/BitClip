angular.module('bitclip.marketFactory', [])

.factory('marketFactory', ['$http', function($http){

  var dataOptions = { 
    interval:'24hr'
     };

  var getGraphData = function(){
    return $http.get('/api/marketData');
  };

  return {
    dataOptions:dataOptions,
    getGraphData:getGraphData
  };

}])