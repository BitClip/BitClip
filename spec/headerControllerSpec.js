describe('Unit: headerController', function () {
  beforeEach(module('bitclip'));

  var $scope, $rootScope, $location, $window, $controller, createController, Header, Utilities, tempStore, $http;

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $httpBackend = $injector.get('$httpBackend');
    $scope = $rootScope.$new();
    $window = $injector.get('$window');
    Header = $injector.get('Header');
    Utilities = $injector.get('Utilities');

  /***********************************************************
    Mocks up HelloBlock server when a GET request is made to 
    query balance of testNet currentAddress.
    Endpoint: https://helloblock.io/docs/ref#addresses-batch
  ***********************************************************/

    $httpBackend.when('GET','http://testnet.helloblock.io/v1/addresses?addresses=mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf')
    .respond({
      "status":"success",
      "data":{
        "addresses":[
          { "balance":224880000,
            "confirmedBalance":224880000 
          }
        ]
      }
    });

    $httpBackend.when('GET','http://mainnet.helloblock.io/v1/addresses?addresses=1GuxzXBZaFfjpGgGEFVt9NBGF9mParcPX2')
    .respond({
      "status":"success",
      "data":{
        "addresses":[
          { "balance":0,
            "confirmedBalance":0 
          }
        ]
      }
    });

    $httpBackend.when('GET','send/send.tpl.html')
    .respond({
      "status":"success"
    });

  /***********************************************************
  The next section mocks up the chrome.storage.local
  setters and getters.
  ***********************************************************/

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
    Mocked up state of chrome.storage.local
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

    $controller = $injector.get('$controller');
    createController = function () {
      return $controller('headerController', {
        $rootScope: $rootScope,
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

  /*********************************************
                      Tests
  **********************************************/
  
  it('setBalance should exist on the scope', function ( done ) {
    Utilities.initialize().then(function(){
      expect($scope.setBalance).to.be.a('function');
      done();
    })
    $rootScope.$apply();
  });

  it('setBalance should set the correct balanceMessage variable on the $scope for testNet', function ( done ) {
    Utilities.initialize().then(function(){
      $scope.setBalance().then(function(){
        expect($scope.balanceMessage).to.equal("Bal: 2.2488 BTC");
        done();
      });
    });
    $httpBackend.flush();
  });

  it('setBalance should set the correct balanceMessage variable on the $scope for mainNet', function ( done ) {
    Utilities.initialize().then(function(){
      tempStore.isMainNet = true;
      $scope.setBalance().then(function(){
        expect($scope.balanceMessage).to.equal("Bal: 0 BTC");
        done();
      });
    });
    $httpBackend.flush();
  });

  it('getNetworkStatus should set the $rootScope.isMainNet property as same as chrome.storage.local', function ( done ) {
    Utilities.initialize().then(function(){
      $scope.getNetworkStatus().then(function(){
        expect($rootScope.isMainNet).to.equal(tempStore.isMainNet);
        done();
      });
    });
    $rootScope.$apply();
  });

  it('getNetworkStatus should set the $rootScope.isMainNet when isMainNet property changes', function ( done ) {
    Utilities.initialize().then(function(){
      tempStore.isMainNet = true;
      $scope.getNetworkStatus().then(function(){
        expect($rootScope.isMainNet).to.equal(tempStore.isMainNet);
        done();
      });
    });
    $rootScope.$apply();
  });

  it('menu should be a function that toggles $scope.isCollapsed', function ( done ) {
    Utilities.initialize().then(function(){
      $scope.isCollapsed = true;
      $scope.menu();
      expect($scope.isCollapsed).to.be(false);
      done();
    });
    $rootScope.$apply();
  });
});
