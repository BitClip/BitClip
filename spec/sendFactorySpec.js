describe('Unit: sendFactory - TxBuilder', function () {
  beforeEach(module('bitclip'));

  var $scope, $rootScope, $location, $window, transactionDetails, createController, TxBuilder, tempStore;

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $scope = $rootScope.$new();
    $window = $injector.get('$window');
    TxBuilder = $injector.get('TxBuilder');
    transactionDetails = {};

  /****************************************************
    The next section mocks up the chrome.storage.local
    setters and getters.
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
  }));
  
  /*********************************************
                      Tests
  **********************************************/

  it('sendTransaction should exist', function () {
    expect(TxBuilder.sendTransaction).to.be.a('function');
  });

  it('should return success when sending a correctly stated transaction', function (done) {
    this.timeout(5000);
    transactionDetails.amount = 0.001;
    transactionDetails.destination = "mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS";
    
    tempStore.testNet.currentAddress = "moJvQo6j1uDPXxntNpfFHXcAjwLvJ72sDV";
    tempStore.testNet.currentPrivateKey = "cRnTroGPQrEDR8sjEiC5fDBwqyPL779R2uH3UpfHP5i7rHskXUJg";
    
    TxBuilder.sendTransaction(tempStore.testNet.currentPrivateKey, transactionDetails, false)
    .then(function(message){
      expect(message).to.equal("Transaction successfully propagated.");
      done();
    })
    .catch(function(error){
      expect(error).to.be(undefined);
      done();
    });
  });


  it('should return error when sending transaction with 0 amount', function (done) {
    this.timeout(5000);
    transactionDetails.amount = 0;
    transactionDetails.destination = "mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS";
    
    tempStore.testNet.currentAddress = "moJvQo6j1uDPXxntNpfFHXcAjwLvJ72sDV";
    tempStore.testNet.currentPrivateKey = "cRnTroGPQrEDR8sjEiC5fDBwqyPL779R2uH3UpfHP5i7rHskXUJg";

    TxBuilder.sendTransaction(tempStore.testNet.currentPrivateKey, transactionDetails, false)
    .then(function(message){
      expect(message).to.be(undefined);
      done();
    })
    .catch(function(error){
      expect(error).not.to.equal(undefined);
      done();
    });
  });


  it('should return error when propagating to the incorrect network', function (done) {
    this.timeout(5000);
    transactionDetails.amount = 0.01;
    transactionDetails.destination = "mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS";

    tempStore.testNet.currentAddress = "moJvQo6j1uDPXxntNpfFHXcAjwLvJ72sDV";
    tempStore.testNet.currentPrivateKey = "cRnTroGPQrEDR8sjEiC5fDBwqyPL779R2uH3UpfHP5i7rHskXUJg";
    
    TxBuilder.sendTransaction(tempStore.testNet.currentPrivateKey, transactionDetails , true)
    .then(function(message){
      expect(message).to.be(undefined);
      done();
    })
    .catch(function(error){
      expect(error).not.to.equal(undefined);
      done();
    })
  });

  it('should return error when tx amount is more than available amount in address', function (done) {
    this.timeout(5000);
    transactionDetails.amount = 1000;
    transactionDetails.destination = "mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS";

    tempStore.testNet.currentAddress = "moJvQo6j1uDPXxntNpfFHXcAjwLvJ72sDV";
    tempStore.testNet.currentPrivateKey = "cRnTroGPQrEDR8sjEiC5fDBwqyPL779R2uH3UpfHP5i7rHskXUJg";
    
    TxBuilder.sendTransaction(tempStore.testNet.currentPrivateKey, transactionDetails , true)
    .then(function(message){
      expect(message).to.be(undefined);
      done();
    })
    .catch(function(error){
      expect(error).not.to.equal(undefined);
      done();
    })
  });


  it('isValidAddress should return true for valid testNet address', function(){
    expect(TxBuilder.isValidAddress('mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf')).to.equal(true);
    expect(TxBuilder.isValidAddress('misSCxTCxnxdfYSD5qdsMyd72zDrYpZcoV')).to.equal(true);
    expect(TxBuilder.isValidAddress('muaDVYfm1S711Aaj7MjZNv1XyhEXovMtK1')).to.equal(true);
  });

  it('isValidAddress should return true for valid mainNet address', function(){
    expect(TxBuilder.isValidAddress('1111111111111111111114oLvT2')).to.equal(true);
    expect(TxBuilder.isValidAddress('1L7krXWHm2ax124oj8y8ZFGuYNEib5YDWy')).to.equal(true);
    expect(TxBuilder.isValidAddress('1CfKjwNZMgT8UeoUd9CdXbEGUNwWsVQG4Y')).to.equal(true);
  });

  it('isValidAddress should return false for invalid address composed of alphanumeric characters', function(){
    expect(TxBuilder.isValidAddress('11111111111111114oLvT2')).to.equal(false);
    expect(TxBuilder.isValidAddress('muaDVYfm1S711Aaj7K1')).to.equal(false);
  });

  it('isValidAddress should return false for invalid address that includes non-alphanumeric characters', function(){
    expect(TxBuilder.isValidAddress('!mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf')).to.equal(false);
    expect(TxBuilder.isValidAddress('?mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf')).to.equal(false);
    expect(TxBuilder.isValidAddress('hello world')).to.equal(false);
    expect(TxBuilder.isValidAddress(' !1L7krXWHm2ax124oZFGuYNEib5YDWy')).to.equal(false);
    expect(TxBuilder.isValidAddress('1L7krXWHm2ax12 4oj8y8ZFGuYNEib5YDWy')).to.equal(false);
    expect(TxBuilder.isValidAddress('?mieyV4Y8ba87pZ-YJKsJRz8qcZP4b2HvWLf')).to.equal(false);
    expect(TxBuilder.isValidAddress('?mieyV4Y8ba87pZ++YJKsJRz8qcZP4b2HvWLf')).to.equal(false);
  });
});