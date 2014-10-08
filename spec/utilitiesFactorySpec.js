describe('Unit: Utilities Factory', function () {
  beforeEach(module('bitclip'));

  var $scope, $rootScope, $location, $window, Utilities, tempStore;

  beforeEach(inject(function($injector) {

    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $scope = $rootScope.$new();
    $window = $injector.get('$window');
    Utilities = $injector.get('Utilities');

  /****************************************************
    Mocks up the chrome.storage.local setters 
    and getters.
  *****************************************************/

    $window.chrome = {
      storage: {
        local:{}
      }
    };

    $window.chrome.storage.local.set = function(obj , callback){
      tempStore = obj;
      callback();
    };

    $window.chrome.storage.local.get = function(propStrOrArray, callback){
      var result = {};                        
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
    };

  /*********************************************
    Mocks up state of chrome.storage.local
  **********************************************/

    tempStore = {
      "isMainNet":false,
      "mainNet":{
        "allAddressesAndKeys":[
          ["1GuxzXBZaFfjpGgGEFVt9NBGF9mParcPX2","KwHTcpKsBWSKbpd2JcaPN7yJLFUXXHoUudfrVXoc46QU4sQo87zU"],
          ["1138fgj4sa1kEMBGBiTBSsQWNnfHWB5aoe","L2Wc7UBsAdyKYFx2S6W29mW73Zn6FMD4JGQYFWrESoUhC1KXc2iC"],
          ["1bgGRDEyufhMBkVX1XA6rtC9cXAEBqbww","KzPpppRYpLfQAJQtb9tvmynpkfMSaDjXEyd5deNT6ALJ4D4j4Ksy"]],
        "currentAddress":"1GuxzXBZaFfjpGgGEFVt9NBGF9mParcPX2",
        "currentPrivateKey":"KwHTcpKsBWSKbpd2JcaPN7yJLFUXXHoUudfrVXoc46QU4sQo87zU"
      },
      "testNet":{
        "allAddressesAndKeys":[
          ["mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf","cRqGMD3MDfkEJit4HTtA3tUDcAtQkmogqrLAnuu4aBaefXCp1J79"],
          ["moJvQo6j1uDPXxntNpfFHXcAjwLvJ72sDV","cRnTroGPQrEDR8sjEiC5fDBwqyPL779R2uH3UpfHP5i7rHskXUJg"],
          ["mivutayae2naDT1NxjYN4LjEHXcUsCM6gr","cP2usaS1DnCR1nQboo7d1bMdJs4idzmPSWgvKKX7hPGPU9Yft1my"]],
        "currentAddress":"mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf",
        "currentPrivateKey":"cRqGMD3MDfkEJit4HTtA3tUDcAtQkmogqrLAnuu4aBaefXCp1J79"
      }
    };
  }));
  
  /*********************************************
                      Tests
  **********************************************/

  it('initialize should instantiate isMainNet, mainNet and testNet properties in chrome storage', function (done) {
    tempStore = {};
    var expectedResult = {
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

    Utilities.initialize()
    .then(function(message){
      expect(message).to.be("Initialization complete.");
      expect(JSON.stringify(tempStore)).to.equal(JSON.stringify(expectedResult));
      done();
    });
    $rootScope.$apply();
  });

  it('isMainNet is a function that returns isMainNet property in local storage', function (done) {
    tempStore.isMainNet = true;
    
    Utilities.isMainNet()
    .then(function(isMainNet){
      expect(isMainNet).to.equal(true);
      done();
    });
    $rootScope.$apply();
  })

  it('getCurrentAddress returns correct currentPrivateKey for testNet', function (done) {
    tempStore.isMainNet = false;

    Utilities.getCurrentAddress()
    .then(function(currentAddress){
      expect(currentAddress).to.equal("mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf");
      done();
    });
    $rootScope.$apply();
  });

  it('getCurrentPrivateKey returns correct currentPrivateKey for testNet', function (done) {
    tempStore.isMainNet = false;

    Utilities.getCurrentPrivateKey()
    .then(function(currentPrivateKey){
      expect(currentPrivateKey).to.equal("cRqGMD3MDfkEJit4HTtA3tUDcAtQkmogqrLAnuu4aBaefXCp1J79");
      done();
    });
    $rootScope.$apply();
  });

  it('getCurrentAddress returns correct currentPrivateKey for mainNet', function (done) {
    tempStore.isMainNet = true;

    Utilities.getCurrentAddress()
    .then(function(currentAddress){
      expect(currentAddress).to.equal("1GuxzXBZaFfjpGgGEFVt9NBGF9mParcPX2");
      done();
    });
    $rootScope.$apply();
  });

  it('getCurrentPrivateKey returns correct currentPrivateKey for mainNet', function (done) {
    tempStore.isMainNet = true;

    Utilities.getCurrentPrivateKey()
    .then(function(currentPrivateKey){
      expect(currentPrivateKey).to.equal("KwHTcpKsBWSKbpd2JcaPN7yJLFUXXHoUudfrVXoc46QU4sQo87zU");
      done();
    })
    $rootScope.$apply();
  });

  it('getAllAddresses returns correct addresses for testNet', function (done) {
    var expectedResult = [ 'mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf', "moJvQo6j1uDPXxntNpfFHXcAjwLvJ72sDV", "mivutayae2naDT1NxjYN4LjEHXcUsCM6gr"];
    
    Utilities.getAllAddresses()
    .then(function(allAddressesAndKeys){
      expect(JSON.stringify(allAddressesAndKeys)).to.equal(JSON.stringify(expectedResult));
      done();
    });
    $rootScope.$apply();
  });

  it('getAllAddresses returns correct addresses ainNet', function (done) {
    tempStore.isMainNet = true;
    var expectedResult = ["1GuxzXBZaFfjpGgGEFVt9NBGF9mParcPX2","1138fgj4sa1kEMBGBiTBSsQWNnfHWB5aoe","1bgGRDEyufhMBkVX1XA6rtC9cXAEBqbww"];

    Utilities.getAllAddresses()
    .then(function(allAddressesAndKeys){
      expect(JSON.stringify(allAddressesAndKeys)).to.equal(JSON.stringify(expectedResult));
      done();
    });
    $rootScope.$apply();
  });
});