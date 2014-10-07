angular.module('bitclip.historyFactory', [])

.factory('History', ['$http', 'Utilities', '$q', function($http, Utilities, $q) {
  var getTransactionHist = function(currentAddress) {
    var deferred = $q.defer();
    Utilities.isMainNet().then(function(bool) {
      var baseUrl = 'http://' + (bool ? 'mainnet' : 'testnet') + '.helloblock.io/v1/addresses/';
      var requestString = currentAddress;
      baseUrl += requestString;
      baseUrl += '/transactions?limit=15';
      Utilities.httpGet(baseUrl, function(obj) {
        deferred.resolve(obj.data.transactions);
      });
    });
    return deferred.promise;
  };

  var isContainedInArrayMatrix = function(inputOrOutputMatrix, current) {
    for (var i = 0, l = inputOrOutputMatrix.length; i < l; i++) {
      var returnedAddress = inputOrOutputMatrix[i][0];
      var returnedValue = inputOrOutputMatrix[i][1];
      var txTime = inputOrOutputMatrix[i][2];
      if (current === returnedAddress) {
        return [returnedAddress, returnedValue, txTime];
      }
    }
    return false;
  };  

  var getUsableTransData = function(transObj, current) {
    var direction, amount, time, address;
    var addressObj = {
      inputs: [],
      outputs: []
    };

    transObj.inputs.forEach(function(tx) {
      addressObj.inputs.push([tx.address, tx.value, transObj.estimatedTxTime]);
    });

    transObj.outputs.forEach(function(tx) {
      addressObj.outputs.push([tx.address, tx.value, transObj.estimatedTxTime]);
    });
    
    if (isContainedInArrayMatrix(addressObj.inputs, current) && isContainedInArrayMatrix(addressObj.outputs, current)) {
      var matchedInputs = isContainedInArrayMatrix(addressObj.inputs, current);
      var matchedOutputs = isContainedInArrayMatrix(addressObj.outputs, current);
      var inputAmount = matchedInputs[1];
      var outputAmount = matchedOutputs[1];

      if (outputAmount < inputAmount) {
        if (addressObj.outputs[0][0] === current) {
          address = addressObj.outputs[1][0];
        } else {
          address = addressObj.outputs[0][0];
        }
        direction = 'outbound';
        amount = addressObj.outputs[0][1];
        time = matchedInputs[2];
      }
    } else if (isContainedInArrayMatrix(addressObj.inputs, current) && !isContainedInArrayMatrix(addressObj.outputs, current)) {
      var matchedInputs = isContainedInArrayMatrix(addressObj.inputs, current);
      if (addressObj.outputs[0][0] === current) {
        address = addressObj.outputs[1].address;
      } else {
        address = addressObj.outputs[0][0];
      }
      direction = 'outbound';
      amount = matchedInputs[1];
      time = matchedInputs[2];
    } else if (!isContainedInArrayMatrix(addressObj.inputs, current) && isContainedInArrayMatrix(addressObj.outputs, current)) {
      var matchedOutputs = isContainedInArrayMatrix(addressObj.outputs, current);
      address = addressObj.inputs[0][0];
      direction = 'inbound';
      amount = matchedOutputs[1];
      time = matchedOutputs[2];
    }
    return [direction, amount / 100000000, time * 1000, address];
  };

  return {
    getTransactionHist: getTransactionHist,
    getUsableTransData: getUsableTransData
  };
}]);
