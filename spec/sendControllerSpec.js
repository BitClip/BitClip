describe('sendController', function () {
  // Load the module with MainController
  beforeEach(module('bitclip'));
  var tempStore;
  var $scope, $rootScope, $location, $window, createController, persistentTransaction, TxBuilder, Utilities;

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $scope = $rootScope.$new();
    $window = $injector.get('$window');

    persistentTransaction = $injector.get('persistentTransaction');
    TxBuilder = $injector.get('TxBuilder');
    Utilities = $injector.get('Utilities');
    console.log("persistenttx", persistentTransaction.transactionDetails);
    tempStore = {
                  isMainNet: true,
                  mainNet: {
                              currentAddress: "",
                              currentPrivateKey: "",
                              allAddressesAndKeys: []
                           },
                  testNet: {
                              currentAddress: "",
                              currentPrivateKey: "",
                              allAddressesAndKeys: []
                           }
                };

    $window.chrome = {
                      storage:{
                        local: sinon.stub({
                            set: function(){ },
                            get: function(){ },
                            remove: function(){ },
                            clear: function(){ }
                        })
                      }
                    };

    var $controller = $injector.get('$controller');

    //used to create our AuthController for testing
    createController = function () {
      return $controller('sendController', {
        $scope: $scope,
       // $window: $window, ////////////////////might have to be chrome storage
        $location: $location,
        persistentTransaction: persistentTransaction,
        TxBuilder: TxBuilder,
        Utilities: Utilities
      });
    };

    createController();
  }));

  afterEach(function() {
    //$window.localStorage.removeItem('com.shortly'); //something like this but for chrome storage
  });

  it('tacos', function () {
    expect(true).to.equal(true);
  });

  it('updateTransaction and sendTransaction should exists', function () {
    expect(persistentTransaction.updateTransaction).to.be.a('function');
    expect(TxBuilder.sendTransaction).to.be.a('function');
  });

  xit('updateTransaction should update transactionDetails', function () {
    var thing = {
      amount: 'thingOne',
      destination: 'thingTwo'
    };
    console.log(thing);
    persistentTransaction.updateTransaction(thing);
    console.log(persistentTransaction.transactionDetails);
    expect(persistentTransaction.transactionDetails).to.equal("");
  });

  // it('does something else', function () {
  //   expect(true).to.equal(false);
  // });
})