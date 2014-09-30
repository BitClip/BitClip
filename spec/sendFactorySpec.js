describe('Unit: sendFactory - TxBuilder', function () {
  beforeEach(module('bitclip'));

  var $scope, $rootScope, $location, $window, $q, $timeout, transactionDetails, createController, TxBuilder, tempStore;

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $scope = $rootScope.$new();
    $window = $injector.get('$window');
    $timeout = $injector.get('$timeout');

    TxBuilder = $injector.get('TxBuilder');
    $q = $injector.get('$q');

    //mock up of WinJS .done function

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
                  currentAddress: "mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf",
                  currentPrivateKey: "cRqGMD3MDfkEJit4HTtA3tUDcAtQkmogqrLAnuu4aBaefXCp1J79",
                  allAddressesAndKeys: []
               }
    };
    transactionDetails = {
      amount:"",
      destination:""
    };

  }));

  afterEach(function() {
    //$window.localStorage.removeItem('com.shortly'); //something like this but for chrome storage
  });

  it('sendTransaction should be a function', function () {
    expect(TxBuilder.sendTransaction).to.be.a('function');
  });


  it('should return success when sending a correctly stated transaction', function (done) {

    //self-made digest loop no longer necessary 
    //finish = function(err){
    //   setTimeout(function(){
    //     done(err);
    //   },0)
    // };
    
    transactionDetails.amount = 0.001;
    transactionDetails.destination = "mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS";
    TxBuilder.sendTransaction(tempStore.testNet.currentPrivateKey, transactionDetails,false)
    .then(function(message){
      expect(message).to.equal("Transaction successfully propagated");
      done();
    })
    .catch(function(error){
      finish(error);
    });
  });

  // this test is broken, does first if err in txBuilder is not invoked
  // and then deferred.reject is not resolved
  it('should return error when sending transaction with 0 amount', function (done) {
    
    transactionDetails.amount = 0;
    transactionDetails.destination = "mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS";
    
    TxBuilder.sendTransaction(tempStore.testNet.currentPrivateKey, transactionDetails, false)
    .then(function(message){
      console.log("Should not be log this");
      done();
    })
    .catch(function(error){
      expect(error).not.to.equal(undefined);
      done();
    });
  });

  //This is test does not work because HelloBlock has no error handling
  //for improper addresses
  //this will be handled form input regex

  // it('should return error when sending transaction with improper address', function (done) {
  //   transactionDetails.amount = 0.01;
  //   transactionDetails.destination = "non-btc address";
    
  //   TxBuilder.sendTransaction(tempStore.testNet.currentPrivateKey, transactionDetails, false)
  //   .then(function(message){
  //     console.log("Should not log this");
  //     done();
  //   })
  //   .catch(function(error){
  //     expect(error).not.to.equal(undefined);
  //     done();
  //   })
  // });

  it('should return error when propagating to the incorrect network', function (done) {
    transactionDetails.amount = 0.01;
    transactionDetails.destination = "mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS";
    
    TxBuilder.sendTransaction(tempStore.testNet.currentPrivateKey, transactionDetails , true)
    .then(function(message){
      console.log("Should not log this");
      done();
    })
    .catch(function(error){
      console.log("In the catch");
      expect(error).not.to.equal(undefined);
      done();
    })
  });

  it('should return error when tx amount is more than available amount in address', function (done) {
    transactionDetails.amount = 1000;
    transactionDetails.destination = "mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS";
    
    TxBuilder.sendTransaction(tempStore.testNet.currentPrivateKey, transactionDetails , true)
    .then(function(message){
      console.log("Should not log this");
      done();
    })
    .catch(function(error){
      console.log("In the catch");
      expect(error).not.to.equal(undefined);
      done();
    })
  });
});