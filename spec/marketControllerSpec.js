describe('Market Controller', function () {
  beforeEach(module('bitclip'));

  var $scope, $rootScope, $httpBackend, $location, $window, History, tempStore;

  beforeEach(inject(function($injector) {

    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $httpBackend = $injector.get('$httpBackend');
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    Market = $injector.get('Market');

  /******************************************************************
    Mocks up the chrome.storage.local setters 
    and getters.
  *******************************************************************/

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

  /****************************************************
    Mocks up state of chrome.storage.local
  *****************************************************/

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
      return $controller('marketController', {
        $rootScope: $rootScope,
        $scope: $scope,
        $window: $window,
        $location: $location,
        Market: Market,
        tempStore: tempStore
      });
    };
    createController(); 
  }));
  

/*********************************************
                      Tests
**********************************************/

  it('getGraphData should be a function', function () {
    expect($scope.getGraphData).to.be.a('function');
  });

  it('toolTipContentFunction should be a function', function () {
    expect($scope.toolTipContentFunction).to.be.a('function');
  });
  
  it('xAxisTickValuesFunction should be a function', function () {
    expect($scope.xAxisTickValuesFunction).to.be.a('function');
  });

  it('xAxisTickFormatFunction should be a function', function () {
    expect($scope.xAxisTickFormatFunction).to.be.a('function');
  });

  it('setActiveTab should be a function', function () {
    expect($scope.setActiveTab).to.be.a('function');
  });
});