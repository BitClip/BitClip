describe('Unit: viewTabsController', function () {
  beforeEach(module('bitclip'));

  var $scope, $rootScope, $location, $window, createController;

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $scope = $rootScope.$new();
    $window = $injector.get('$window');

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('viewTabsController', {
        $scope: $scope,
        $window: $window,
        $location: $location
      });
    };
    createController();
  }));

  it('$scope.activeTab should default to send', function () {
    expect($scope.activeTab).to.equal('send');
  });

  it('$scope.setActiveTab should be able to set new $scope.activeTab variables', function () {
    $scope.setActiveTab('receive');
    expect($scope.activeTab).to.equal('receive');
  });
});