
describe('receiveController', function () {
  // Load the module with MainController
  beforeEach(module('bitclip'));

  var $scope, $rootScope, $location, $window, createController, Address;
  //var sinon;
  var window, chromeStorageApi;

  beforeEach(inject(function($injector) {
    // mock out our dependencies
    //sinon = $injector.get('karma-sinon');
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    //$window = $injector.get('$window');//////////////////////this might have to be chrome storage
    Address = $injector.get('Address');
    $scope = $rootScope.$new();
    $window = $injector.get('$window');
    
    console.log("WINDOOOOOOOOOOOW2: " + $window);

    $window.chrome = {
                      storage:{
                        local: ({
                            set: function(){ },
                            get: function(){ },
                            remove: function(){ },
                            clear: function(){ }
                        })
                      }
                    };

    var $controller = $injector.get('$controller');

    //used to create our Controller for testing
    createController = function () {
      return $controller('receiveController', {
        $scope: $scope,
       // $window: $window, ////////////////////might have to be chrome storage
        $location: $location,
        Address: Address
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

  it('findAddress and newAddress should exists', function () {
    expect(Address.findCurrentAddress).to.be.a('function');
    expect(Address.findAllAddresses).to.be.a('function');
    expect(Address.newAddress).to.be.a('function');
  });

  it('findAddress should return a blank string if local storage is empty', function () {
    console.log("address: " + Address.findCurrentAddress());
    expect(Address.findCurrentAddress()).to.equal("");
  });

  // it('does something else', function () {
  //   expect(true).to.equal(false);
  // });
})