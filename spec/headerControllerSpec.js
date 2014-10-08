describe('Unit: headerController', function () {
  beforeEach(module('bitclip'));

  var $scope, $rootScope, $location, $window, $controller, createController, Header, Utilities, tempStore, $http;

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $scope = $rootScope.$new();
    $window = $injector.get('$window');
    Header = $injector.get('Header');
    Utilities = $injector.get('Utilities');
    

    /*********************************************
    The next section mocks up the chrome.storage.local
    setters and getters.
    **********************************************/
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

  it('setNetwork should be a function', function () {
    expect(Header.setNetwork).to.be.a('function');
  });

  it('setNetwork change isMainNet in chrome.storage.local', function () {
    Header.setNetwork(true, function(){
      console.log("tempStore", tempStore);
      expect(tempStore.isMainNet).to.equal(true);
    });
  });

  it('getBalanceForCurrentAddress should return the correct balance for the currentAddress', function () {
    Header.getBalanceForCurrentAddress().then(function(currentBalance){
      var currentBalance1 = currentBalance;
      Utilities.httpGet('http://testnet.helloblock.io/v1/addresses/mjjeyn6Vs4TAtMFKJEwpMPJsAVysxL4nYG', function(data){
        console.log("xxxxxxxx $scope xxxxxxxx", $scope.activeTab);
        var currentBalance2 = data.data.address.balance;
        expect(currentBalance1).to.equal(currentBalance2);
      });
    });
  });

})
