describe('HeaderController', function () {
  // Load the module with MainController
  beforeEach(module('bitclip'));

  var $scope, $rootScope, $location, $window, createController, HeaderDetails;

  beforeEach(inject(function($injector) {
    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    //$window = $injector.get('$window');//////////////////////this might have to be chrome storage
    HeaderDetails = $injector.get('HeaderDetails');
    $scope = $rootScope.$new();
    $window = $injector.get('$window');

    $window.chrome = {
                      storage:{
                        local: sinon.stub({
                            set: function(){ },
                            get: function(){ },
                            remove: function(){ },
                            clear: function(){ }
                        })
                      }
                    };

    var $controller = $injector.get('$controller');

    //used to create our AuthController for testing
    createController = function () {
      return $controller('HeaderController', {
        $scope: $scope,
       // $window: $window, ////////////////////might have to be chrome storage
        $location: $location,
        HeaderDetails: HeaderDetails
      });
    };

    createController();
  }));

  afterEach(function() {
    //$window.localStorage.removeItem('com.shortly'); //something like this but for chrome storage
  });

  it('tacos', function () {
    expect(true).to.equal(true);
  });
  it('tacos', function () {
    expect(true).to.equal(true);
  });
  it('tacos', function () {
    expect(true).to.equal(true);
  });
  it('tacos', function () {
    expect(true).to.equal(true);
  });
  it('tacos', function () {
    expect(true).to.equal(true);
  });
  it('tacos', function () {
    expect(true).to.equal(true);
  });
  it('tacos', function () {
    expect(true).to.equal(true);
  })
  ;it('tacos', function () {
    expect(true).to.equal(true);
  });
  it('tacos', function () {
    expect(true).to.equal(true);
  });
  // it('findAddress and newAddress should exists', function () {
  //   expect(Address.findAddress).to.be.a('function');
  //   expect(Address.newAddress).to.be.a('function');
  // });

  // it('findAddress should return a blank string if local storage is empty', function () {
  //   console.log("address: " + Address.findAddress());
  //   expect(Address.findAddress()).to.equal("");
  // });

  // it('does something else', function () {
  //   expect(true).to.equal(false);
  // });
})