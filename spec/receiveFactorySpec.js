describe('Unit: receiveFactory', function () {
  beforeEach(module('bitclip'));

  var $scope, $rootScope, $location, $window, createController, Header, Receive, Utilities, tempStore, $http, $timeout;

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $scope = $rootScope.$new();
    $window = $injector.get('$window');
    $timeout = $injector.get('$timeout');

    Header = $injector.get('Header');
    Utilities = $injector.get('Utilities');
    Receive = $injector.get('Receive');

    $window.chrome = {
                      storage:{
                        local: {
                            set: function(obj , callback){ 
                              tempStore = obj;
                              callback();
                            },
                            get: function(propStrOrArray, callback){ 
                              var result = {};
                              //TODO later: must also handle case when key input
                              //has no value in tempstore;
                              if (typeof propStrOrArray === 'string'){
                                result[propStrOrArray] = tempStore[propStrOrArray];
                              } else if (Array.isArray(propStrOrArray)){
                                propStrOrArray.forEach(function(propName){
                                  result[propName] = tempStore[propName];
                                });
                              } else if (propStrOrArray === null) {
                                result = tempStore;
                              }
                              callback(result);
                            },
                            remove: function(){ },
                            clear: function(){ }
                        }
                      }
                    };
    tempStore = {
      isMainNet: false,
      mainNet: {
                  currentAddress: "",
                  currentPrivateKey: "",
                  allAddressesAndKeys: []
               },
      testNet: {
                  currentAddress: "testAddress1",
                  currentPrivateKey: "testPrivateKey1",
                  allAddressesAndKeys: [["testAddress1","testPrivateKey1"],["testAddress2","testPrivateKey2"]]
               }
    };
  }));

  afterEach(function() {
  });

  it('newAddress should be a function', function () {
    expect(Receive.newAddress).to.be.a('function');
  });

  //this doesnt work
  //line 19 that.$apply() is an undefined function
  //must either change factory to $rootScope.$apply();
  //or mock the controller specific $apply() function

  // it('newAddress should generate a new key address pair and save them into local storage', function (done) {
  //   console.log("hello");
  //   Receive.newAddress();
  //   $rootScope.$apply();
  //   expect(tempStore.testNet.currentAddress).to.not.be("testAddress1");
  //   expect(tempStore.testNet.currentPrivateKey).to.not.be("testPrivateKey1");
  //   done();
  // });

  // this does not work
  // angular.element(document.getElementsByTagName('header-bar')).scope().getNetworkStatus();
  // does not run in karma
  // need way to mock this
  
  // it('setAsCurrentAddress should change currentAddress and currentPrivateKey in local storage', function (done) {
  //   console.log("in setAsCurrentAddress");
  //   Receive.setAsCurrentAddress('testAddress2');
  //   $rootScope.$apply();
  //   expect(tempStore.testNet.currentAddress).to.equal('testAddress2');
  //   expect(tempStore.testNet.currentAddress).to.equal('testPrivateKey2');
  //   done();
  // });
});