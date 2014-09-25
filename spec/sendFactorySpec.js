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
                  currentAddress: "morpWFtSj2LBMUxLfxHJ7U4s5dnqn2QBa6",
                  currentPrivateKey: "cVJUMhpZopo9myE2KGtzAXeFoDdhqdMvt4Pm62BGtL2Zahh4qeAv",
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


  //this async test is not working properly
  //we need chai-as-promised to test promise resolution
  it('should return success when sending a correctly stated transaction', function (done) {
    transactionDetails.amount = 0.01;
    transactionDetails.destination = "mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS";

    TxBuilder.sendTransaction(tempStore.testNet.currentPrivateKey, transactionDetails,false)
    .then(function(message){
      expect(message).to.equal("Transaction successfully propagated");
      done();
    })
    .catch(function(error){
      done(error);
    });
  });

  it('should return error when sending transaction with 0 amount', function () {
    transactionDetails.amount = 0;
    transactionDetails.destination = "mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS";
    
    TxBuilder.sendTransaction(tempStore.testNet.currentPrivateKey, transactionDetails,false)
    .then(function(message, error){
      expect(error).not.to.equal(undefined);
    });
  });

  it('should return error when sending transaction with improper address', function () {
    transactionDetails.amount = 0;
    transactionDetails.destination = "non-btc address";
    
    TxBuilder.sendTransaction(tempStore.testNet.currentPrivateKey, transactionDetails,false)
    .then(function(message, error){
      expect(error).not.to.equal(undefined);
    });
  });

  it('should return error when propagating to the incorrect network', function () {
    transactionDetails.amount = 0;
    transactionDetails.destination = "mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS";
    
    TxBuilder.sendTransaction(tempStore.testNet.currentPrivateKey, transactionDetails,true)
    .then(function(message, error){
      expect(error).not.to.equal(undefined);
    });
  });
});