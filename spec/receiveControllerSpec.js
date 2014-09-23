
describe('receiveController', function () {
  // Load the module with MainController
  beforeEach(module('bitclip'));

  var $scope, $rootScope, $location, $window, createController, Receive, Utilities;
  var tempStore;
  var window, chromeStorageApi;

  beforeEach(inject(function($injector) {
    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $scope = $rootScope.$new();
    $window = $injector.get('$window');

    Receive = $injector.get('Receive');
    Utilities = $injector.get('Utilities');
    
    tempStore = {
                  isMainNet: true,
                  mainNet: {
                              currentAddress: "",
                              currentPrivateKey: "",
                              allAddressesAndKeys: []
                           },
                  testNet: {
                              currentAddress: "",
                              currentPrivateKey: "",
                              allAddressesAndKeys: []
                           }
                };

    $window.chrome = {
                      storage:{
                        local: {
                            set: function(){ },
                            get: function(){ },
                            remove: function(){ },
                            clear: function(){ }
                        }
                      }
                    };

    var $controller = $injector.get('$controller');

    //used to create our Controller for testing
    createController = function () {
      return $controller('receiveController', {
        $scope: $scope,
        $location: $location,
        Receive: Receive,
        Utilities: Utilities
      });
    };

    createController();
  }));

  afterEach(function() {
    //$window.localStorage.removeItem('com.shortly'); //something like this but for chrome storage
  });

  // it('tacos', function () {
  //   expect(true).to.equal(true);
  // });

  // it('newAddress should exists', function () {
  //   expect(Receive.newAddress).to.be.a('function');
  // });

   // it('newAddress should ', function () {
  //   console.log("address: " + Address.findCurrentAddress());
  //   expect(Address.findCurrentAddress()).to.equal("");
  // });

  // it('does something else', function () {
  //   expect(true).to.equal(false);
  // });
})