angular.module('bitclip.viewTabsController', [])

.controller('viewTabsController', ['$scope', function($scope) {
  $scope.activeTab = 'send';
  $scope.setActiveTab = function(tab) {
    $scope.activeTab = tab;
  };
}]);
