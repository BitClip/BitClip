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
  }));
  

/*********************************************
                      Tests
**********************************************/

  it('getGraphData should be a function', function () {
    expect(Market.getGraphData).to.be.a('function');
  });

  it('getGraphData should query the database server and return all relative data.', function (done) {
    var expectedResult = {"timePeriod":86400000,"time":1412901968055,"transactions":[{"key":"bitstamp","values":[[1412816359007,354.84979334118697]]}],"stdDeviation":9.601723573401443,"vwap":367.1599991515436,"max":395.25,"min":343,"volume":114680.90688799924};

    var result = {"timePeriod":86400000,"time":1412901968055,"transactions":[{"key":"bitstamp","values":[[1412816359007,354.84979334118697]]}],"stdDeviation":9.601723573401443,"vwap":367.1599991515436,"max":395.25,"min":343,"volume":114680.90688799924};
    $httpBackend.when('GET', "http://bitscrape.azurewebsites.net/api/marketdata?time=" + new Date().getTime() + "&timePeriod=86400000")
    .respond(JSON.stringify(result));

    Market.getGraphData(24, function(data){
      expect(JSON.stringify(data)).to.equal(JSON.stringify(expectedResult));
      done();
    }); 

    $httpBackend.flush();
    $rootScope.$apply();
  })

  it('getLastTrade should be a function', function () {
    expect(Market.getLastTrade).to.be.a('function');
  });

  it('getLastTrade should return the last trade of graph data', function () {
      var obj = {bitstamp: {values: [[999, 351.21]]}, bitfinex: {values: [[1000, 400.21]]}};
      expect(Market.getLastTrade(obj)).to.equal(400.21);
  });

  it('parseTxIntoTwoDecimals should be a function', function () {
    expect(Market.parseTxIntoTwoDecimals).to.be.a('function');
  });

  it('parseTxIntoTwoDecimals should return values rounded to two decimal places', function () {
      var obj = {bitstamp: {values: [[999, 351.218760860876]]}};
      expect(JSON.stringify(Market.parseTxIntoTwoDecimals(obj))).to.equal(JSON.stringify({bitstamp: {values: [["1970-01-01T00:00:00.999Z", 351.22]]}}));
  });

  it('returnNext2Hour should be a function', function () {
    expect(Market.returnNext2Hour).to.be.a('function');
  });
  
  it('returnLast2Hour should be a function', function () {
      expect(Market.returnLast2Hour).to.be.a('function');
  });

});