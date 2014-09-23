describe('headerController', function () {
  // Load the module with MainController
  beforeEach(module('bitclip'));

  var $scope, $rootScope, $location, $window, createController, Header, Utilities, tempStore;

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $scope = $rootScope.$new();
    $window = $injector.get('$window');

    Header = $injector.get('Header');
    Utilities = $injector.get('Utilities');

    $window.chrome = {
                      storage:{
                        local: {
                            set: function(obj , callback){ 
                              tempStore = obj;
                              callback();
                            },
                            get: function(propStrOrArray, callback){ 
                              console.log("GET JUST GOT INVOKED");
                              var result = {};
                              //must also handle case when it is undefined
                              if (typeof propStrOrArray === 'string'){
                                result[propStrOrArray] = tempStore[propStrOrArray];
                              } else if (Array.isArray(propStrOrArray)){
                                propStrOrArray.forEach(function(propName){
                                  result[propName] = tempStore[propName];
                                });
                              }
                              callback(result);
                            },
                            remove: function(){ },
                            clear: function(){ }
                        }
                      }
                    };
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

    var $controller = $injector.get('$controller');

    console.log("$window window, xxxxxxxxxxx", $window.chrome.storage.local);

    $window.chrome.storage.local.get('isMainNet', function(data){
      console.log("THIS IS RETURN OF ISMAINNET", data);
    })
    //used to create our AuthController for testing
    createController = function () {
      return $controller('headerController', {
        $scope: $scope,
        $window: $window,
        $location: $location,
        Header: Header,
        Utilities: Utilities,
        tempStore: tempStore
      });
    };

    createController();
  }));

  afterEach(function() {
    //$window.localStorage.removeItem('com.shortly'); //something like this but for chrome storage
  });

  it('setNetwork should be a function', function () {
    expect(Header.setNetwork).to.be.a('function');
  });
  it.only('setNetwork should save something into local storage', function () {
    Header.setNetwork({hello:"world"}, function(){
      console.log("finished setting");
    });
    console.log("AHAHAHAHHA: ", tempStore);
    expect(tempStore.hello).to.equal("world");
  });
  // it('tacos', function () {
  //   expect(true).to.equal(true);
  // });
  // it('tacos', function () {
  //   expect(true).to.equal(true);
  // });
  // it('tacos', function () {
  //   expect(true).to.equal(true);
  // });
  // it('tacos', function () {
  //   expect(true).to.equal(true);
  // });
  // it('tacos', function () {
  //   expect(true).to.equal(true);
  // })
  // ;it('tacos', function () {
  //   expect(true).to.equal(true);
  // });
  // it('tacos', function () {
  //   expect(true).to.equal(true);
  // });
  // // it('findAddress and newAddress should exists', function () {
  // //   expect(Address.findAddress).to.be.a('function');
  // //   expect(Address.newAddress).to.be.a('function');
  // // });

  // // it('findAddress should return a blank string if local storage is empty', function () {
  // //   console.log("address: " + Address.findAddress());
  // //   expect(Address.findAddress()).to.equal("");
  // // });

  // // it('does something else', function () {
  // //   expect(true).to.equal(false);
  // // });
})