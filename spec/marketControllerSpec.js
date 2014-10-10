describe('Market Factory', function () {
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

  it.only('getGraphData should set a market scope values', function(done){
    var result = {"timePeriod":86400000,"time":1412901968055,"transactions":[{"key":"bitstamp","values":[[1412816359007,354.84979334118697]]}],"stdDeviation":9.601723573401443,"vwap":367.1599991515436,"max":395.25,"min":343,"volume":114680.90688799924};
    $httpBackend.when('GET', "http://bitscrape.azurewebsites.net/api/marketdata?time=" + new Date().getTime() + "&timePeriod=86400000")
    // in order to fix this query string so that it always works
    // you need to add code to produce a time variable IN the query
    .respond(result);

    $scope.getGraphData(24);
    console.log($scope.setYAxis);
    setTimeout(function(){
      console.log($scope.volume);
      done();
    },1000)

    $httpBackend.flush();
    $rootScope.$apply();
    // expect($scope.setYAxis).to.be.a(Number);
    // expect($scope.transactions) = Market.parseTxIntoTwoDecimals(data.transactions);
    // $scope.updateTime = data.time;
    // $scope.vwap = +(data.vwap).toFixed(2);
    // $scope.stdDeviation = +data.stdDeviation.toFixed(2);
    // $scope.max = +data.max.toFixed(2);
    // $scope.min = +data.min.toFixed(2);
    // $scope.volume = +data.volume.toFixed(2);
    // $scope.lastTrade = Market.getLastTrade(data.transactions);
    // $scope.loading = false;
  });

});