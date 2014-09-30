describe('sendController', function () {
  beforeEach(module('bitclip'));
  var $scope, $rootScope, $location, $window, createController, Header, TxBuilder, Receive, Utilities, tempStore, $http, $timeout;

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $scope = $rootScope.$new();
    $window = $injector.get('$window');
    $timeout = $injector.get('$timeout');

    Header = $injector.get('Header');
    Utilities = $injector.get('Utilities');
    Receive = $injector.get('Receive');
    TxBuilder = $injector.get('TxBuilder');

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

    var $controller = $injector.get('$controller');

    //used to create our AuthController for testing
    createController = function () {
      return $controller('sendController', {
        $scope: $scope,
        $window: $window, 
        $location: $location,
        TxBuilder: TxBuilder,
        Utilities: Utilities
      });
    };

    createController();
  }));

  afterEach(function() {
  });

  it('$scope.transactionDetails should exist as object', function () {
    expect($scope.transactionDetails).to.be.an('object');
  });

  it('$scope.morph should toggle as $scope.confirm', function () {
    $scope.morph();
    expect($scope.confirmed).to.equal(true);
  });

  // not working, need to test all of the Utilities factory functions first
  // ensure digest loop is being notified of their async nature
  
  // it('$scope.sendPayment should trigger Tx.Builder sendPayment', function ( done ){
  //   $scope.transactionDetails = {
  //     amount: 0.01,
  //     destination: "mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS"
  //   };
  //   $scope.sendPayment();
  //   $rootScope.$apply();
  //   expect($scope.txSuccessMessage).to.equal("Transaction successfully propagated");
  //   done();
  // });
  
  

});