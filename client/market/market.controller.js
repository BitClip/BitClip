angular.module('bitclip.marketController', [])

.controller('marketController', ['$scope', 'marketFactory', 
  function($scope, marketFactory){

  chrome.runtime.getBackgroundPage(function(bg){
    console.log('background', bg)
  });
    var drawGraph = function(){
      // var data = data || marketFactory.emptyGraphData();
      // marketFactory.getGraphData();
      
      if (background && background.google && background.google.visualization) {
        var data = new background.google.visualization.DataTable();
        data.addColumn('string', 'Year');
        data.addColumn('number', 'Sales');
        data.addColumn('number', 'Expenses');
        data.addRows(4);
        data.setValue(0, 0, '2004');
        data.setValue(0, 1, 1000);
        data.setValue(0, 2, 400);
        data.setValue(1, 0, '2005');
        data.setValue(1, 1, 1170);
        data.setValue(1, 2, 460);
        data.setValue(2, 0, '2006');
        data.setValue(2, 1, 860);
        data.setValue(2, 2, 580);
        data.setValue(3, 0, '2007');
        data.setValue(3, 1, 1030);
        data.setValue(3, 2, 540);
        
        var chart = new background.google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, {width: 400, height: 240, title: 'Company Performance'});      
      } else {
        // Google Visualization API have not been loaded yet by the background page.
        // Deal with it.
      }
    }

    $scope.redrawGraph = function(interval){
      // marketFactory.getGraphData.then(function(data){

        // drawGraph(data)

      
    }
    
  }
]);