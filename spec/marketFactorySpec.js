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
    var expectedResult = {"status":"success","data":{"transactions":[{"txHash":"907d4d9950386222c8e38f9c8d8b7cf988ea1f45437ce6f7babf2ed009008b49","version":1,"locktime":0,"size":226,"blockHash":"00000000000461ab5585074ea9cac4aeac7f457c87dde6e85bff4f2391cb53ad","blockHeight":295595,"blockTime":1412389677,"estimatedTxTime":1412389653,"confirmations":3646,"inputsCount":1,"outputsCount":2,"inputs":[{"prevTxHash":"b8696c055ae1eb5488d4ee6747a1360c95dba67ae7b737481e3511700cfe0583","prevTxoutIndex":1,"prevTxoutType":"pubkeyhash","value":8500000,"address":"mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf","hash160":"226cb2bf4f5db4651892ecb562fdedeb608713bf","scriptSig":"483045022100a3a1c8ec4228e057a2ad7417c0a8a9a90f612dc1bef0d57d0c88b9cf9a323ada02204590f318ce31f88143ab194b413631f5ccc19416e606891609507ee3a5f8a12e0121038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79","sequence":4294967295}],"outputs":[{"index":0,"value":100000,"scriptPubKey":"76a9146409ece4bd0cf22a5e2a780db8ad5625097a91e788ac","scriptPubKeyASM":"OP_DUP OP_HASH160 6409ece4bd0cf22a5e2a780db8ad5625097a91e7 OP_EQUALVERIFY OP_CHECKSIG","address":"mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS","hash160":"6409ece4bd0cf22a5e2a780db8ad5625097a91e7","type":"pubkeyhash","spent":false,"nextTxHash":null,"nextTxinIndex":null},{"index":1,"value":8400000,"scriptPubKey":"76a914226cb2bf4f5db4651892ecb562fdedeb608713bf88ac","scriptPubKeyASM":"OP_DUP OP_HASH160 226cb2bf4f5db4651892ecb562fdedeb608713bf OP_EQUALVERIFY OP_CHECKSIG","address":"mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf","hash160":"226cb2bf4f5db4651892ecb562fdedeb608713bf","type":"pubkeyhash","spent":false,"nextTxHash":null,"nextTxinIndex":null}],"totalInputsValue":8500000,"totalOutputsValue":8500000,"fees":0,"estimatedTxDirection":"outgoing","estimatedTxValue":-100000}]}};

    var result = {"status":"success","data":{"transactions":[{"txHash":"907d4d9950386222c8e38f9c8d8b7cf988ea1f45437ce6f7babf2ed009008b49","version":1,"locktime":0,"size":226,"blockHash":"00000000000461ab5585074ea9cac4aeac7f457c87dde6e85bff4f2391cb53ad","blockHeight":295595,"blockTime":1412389677,"estimatedTxTime":1412389653,"confirmations":3646,"inputsCount":1,"outputsCount":2,"inputs":[{"prevTxHash":"b8696c055ae1eb5488d4ee6747a1360c95dba67ae7b737481e3511700cfe0583","prevTxoutIndex":1,"prevTxoutType":"pubkeyhash","value":8500000,"address":"mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf","hash160":"226cb2bf4f5db4651892ecb562fdedeb608713bf","scriptSig":"483045022100a3a1c8ec4228e057a2ad7417c0a8a9a90f612dc1bef0d57d0c88b9cf9a323ada02204590f318ce31f88143ab194b413631f5ccc19416e606891609507ee3a5f8a12e0121038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79","sequence":4294967295}],"outputs":[{"index":0,"value":100000,"scriptPubKey":"76a9146409ece4bd0cf22a5e2a780db8ad5625097a91e788ac","scriptPubKeyASM":"OP_DUP OP_HASH160 6409ece4bd0cf22a5e2a780db8ad5625097a91e7 OP_EQUALVERIFY OP_CHECKSIG","address":"mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS","hash160":"6409ece4bd0cf22a5e2a780db8ad5625097a91e7","type":"pubkeyhash","spent":false,"nextTxHash":null,"nextTxinIndex":null},{"index":1,"value":8400000,"scriptPubKey":"76a914226cb2bf4f5db4651892ecb562fdedeb608713bf88ac","scriptPubKeyASM":"OP_DUP OP_HASH160 226cb2bf4f5db4651892ecb562fdedeb608713bf OP_EQUALVERIFY OP_CHECKSIG","address":"mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf","hash160":"226cb2bf4f5db4651892ecb562fdedeb608713bf","type":"pubkeyhash","spent":false,"nextTxHash":null,"nextTxinIndex":null}],"totalInputsValue":8500000,"totalOutputsValue":8500000,"fees":0,"estimatedTxDirection":"outgoing","estimatedTxValue":-100000}]}};
    $httpBackend.when('GET', "http://bitscrape.azurewebsites.net/api/marketdata?time=" + new Date().getTime() + "&timePeriod=86400000")
    // in order to fix this query string so that it always works
    // you need to add code to produce a time variable IN the query
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
      var obj = {bitstamp: {values: [[999, 351.21]]}};
      expect(Market.getLastTrade(obj)).to.equal(351.21);
  });

  it('getLastTrade should be a function', function () {
    expect(Market.parseTxIntoTwoDecimals).to.be.a('function');
  });

  it('getLastTrade should return the last trade of graph data', function () {
      var obj = {bitstamp: {values: [[999, 351.21]]}};
      expect(JSON.stringify(Market.parseTxIntoTwoDecimals(obj))).to.equal(JSON.stringify({bitstamp: {values: [["1970-01-01T00:00:00.999Z", 351.21]]}}));
  });

  it('returnNext2Hour should be a function', function () {
    expect(Market.returnNext2Hour).to.be.a('function');
  });
  
  it('returnLast2Hour should be a function', function () {
      expect(Market.returnLast2Hour).to.be.a('function');
  });

});