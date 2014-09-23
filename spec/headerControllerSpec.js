describe('headerController', function () {
  // Load the module with MainController
  beforeEach(module('bitclip'));

  var $scope, $rootScope, $location, $window, createController, Header, Utilities;

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $scope = $rootScope.$new();
    $window = $injector.get('$window');

    Header = $injector.get('Header');
    Utilities = $injector.get('Utilities');

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
      return $controller('headerController', {
        $scope: $scope,
       // $window: $window, ////////////////////might have to be chrome storage
        $location: $location,
        Header: Header,
        Utilities: Utilities
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