describe('Unit: Utilities Factory', function () {
  beforeEach(module('bitclip'));

  var $scope, $rootScope, $location, $window, $q, $timeout, Utilities, tempStore;

  beforeEach(inject(function($injector) {

    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $scope = $rootScope.$new();
    $window = $injector.get('$window');
    $timeout = $injector.get('$timeout');
    Utilities = $injector.get('Utilities');
    $q = $injector.get('$q');


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
                  currentAddress: "mainNetAddress",
                  currentPrivateKey: "mainNetPrivateKey",
                  allAddressesAndKeys: [["mainNetAddress","mainNetPrivateKey"],["m1", "m2"],["m3", "m4"]]
               },
      testNet: {
                  currentAddress: "mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf",
                  currentPrivateKey: "cRqGMD3MDfkEJit4HTtA3tUDcAtQkmogqrLAnuu4aBaefXCp1J79",
                  allAddressesAndKeys: [["mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf","cRqGMD3MDfkEJit4HTtA3tUDcAtQkmogqrLAnuu4aBaefXCp1J79"],[1,2],[3,4],[5,6]]
               }
    };
  }));

  afterEach(function() {
    //$window.localStorage.removeItem('com.shortly'); //something like this but for chrome storage
  });


  //This test is pattern for mocked up async functions, 
  //e.g. All chrome setters and getters
  it('initialize should be a function that instantiates empty testNet/mainNet object pseudoclassically', function (done) {
    tempStore = {};
    console.log("in InitOb");
    expect(Utilities.initialize).to.be.a('function');
    Utilities.initialize()
    .then(function(message){
      expect(message).to.be("Initialization complete.");
      expect(tempStore.isMainNet).to.equal(true);
      expect(tempStore.mainNet.currentAddress).to.be("");
      expect(tempStore.mainNet.currentPrivateKey).to.be("");
      expect(tempStore.mainNet.allAddressesAndKeys).to.be.empty();
      expect(tempStore.testNet.currentAddress).to.be("");
      expect(tempStore.testNet.currentPrivateKey).to.be("");
      expect(tempStore.testNet.allAddressesAndKeys).to.be.empty();
      done();
    })
    .catch(function(err){
      console.log("I am in the catch");
      done();
    })
    $rootScope.$apply();
  });

  it('isMainNet is a function that returns isMainNet property in local storage', function (done) {
    console.log("isMainNet");
    tempStore.isMainNet = true;
    expect(Utilities.isMainNet).to.be.a('function');
    Utilities.isMainNet()
    .then(function(isMainNet){
      console.log("In the then");
      expect(isMainNet).to.equal(true);
      done();
    });
    $rootScope.$apply();
  })

  it('getCurrentAddress returns correct currentPrivateKey for testNet', function (done) {
    tempStore.isMainNet = false;

    expect(Utilities.getCurrentAddress).to.be.a('function');

    Utilities.getCurrentAddress()
    .then(function(currentAddress){
      console.log("in the then");
      expect(currentAddress).to.equal("mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf");
      done();
    })
    .catch(function(error){
      console.log("in the catch");
      done();
    })
    $rootScope.$apply();
  });

  it('getCurrentPrivateKey returns correct currentPrivateKey for testNet', function (done) {
    tempStore.isMainNet = false;
    expect(Utilities.getCurrentPrivateKey).to.be.a('function');

    Utilities.getCurrentPrivateKey()
    .then(function(currentPrivateKey){
      console.log("in the then");
      expect(currentPrivateKey).to.equal("cRqGMD3MDfkEJit4HTtA3tUDcAtQkmogqrLAnuu4aBaefXCp1J79");
      done();
    })
    .catch(function(error){
      console.log("in the catch");
      done();
    })
    $rootScope.$apply();
  });


  it('getCurrentAddress returns correct currentPrivateKey for mainNet', function (done) {
    tempStore.isMainNet = true;

    expect(Utilities.getCurrentAddress).to.be.a('function');

    Utilities.getCurrentAddress()
    .then(function(currentAddress){
      console.log("in the then");
      expect(currentAddress).to.equal("mainNetAddress");
      done();
    })
    .catch(function(error){
      console.log("in the catch");
      done();
    })
    $rootScope.$apply();
  });

  it('getCurrentPrivateKey returns correct currentPrivateKey for mainNet', function (done) {
    tempStore.isMainNet = true;

    expect(Utilities.getCurrentPrivateKey).to.be.a('function');

    Utilities.getCurrentPrivateKey()
    .then(function(currentPrivateKey){
      console.log("in the then");
      expect(currentPrivateKey).to.equal("mainNetPrivateKey");
      done();
    })
    .catch(function(error){
      console.log("in the catch");
      done();
    })
    $rootScope.$apply();
  });


  it('getAllAddresses returns correct addresses and keys for testNet', function (done) {
    
    var result = [ 'mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf', 1, 3, 5 ];
    
    expect(Utilities.getCurrentPrivateKey).to.be.a('function');

    Utilities.getAllAddresses()
    .then(function(allAddressesAndKeys){
      //This is a bit of a hack.
      //Need to test the contents of allAddressAndKeys === result
      for (var i = 0; i < allAddressesAndKeys.length; i ++ ){
        expect(allAddressesAndKeys[i]).to.be(result[i]);
      }
      done();
    })
    .catch(function(error){
      console.log("in the catch");
      done();
    })
    $rootScope.$apply();
  });

  it('getAllAddresses returns correct addresses and keys for mainNet', function (done) {
    tempStore.isMainNet = true;
    var result = ["mainNetAddress","m1","m3"];
    expect(Utilities.getCurrentPrivateKey).to.be.a('function');

    Utilities.getAllAddresses()
    .then(function(allAddressesAndKeys){
      //This is a bit of a hack.
      //Need to test the contents of allAddressAndKeys === result
      for (var i = 0; i < allAddressesAndKeys.length; i ++ ){
        expect(allAddressesAndKeys[i]).to.be(result[i]);
      }
      done();
    })
    .catch(function(error){
      console.log("in the catch");
      done();
    })
    $rootScope.$apply();
  });


  // All methods involving getting balance of address requries
  // mocking up a backend using $httpBackend

  // it.only('getBalances should get return correct Balance', function (done) {
  //   tempStore.isMainNet = false;

  //   //address: morpWFtSj2LBMUxLfxHJ7U4s5dnqn2QBa6
  //   //balance: 0.0134BTC
  //   Utilities.getBalances(["morpWFtSj2LBMUxLfxHJ7U4s5dnqn2QBa6"])
  //   .then(function(addressesArr){
  //     //This is a bit of a hack.
  //     //Need to test the contents of allAddressAndKeys === result
  //     console.log("this is the addressesArr: ", addressesArr);
  //     done();
  //   })
  //   .catch(function(error){
  //     console.log("in the catch: ", error);
  //     done();
  //   });
  //   $rootScope.$apply();
  // });

});