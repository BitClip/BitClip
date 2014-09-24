angular.module('bitclip.historyFactory', [])

.factory('History', [ '$http', 'Utilities', '$q', function($http, Utilities, $q){
  var current;


  var getTransactionHist = function(currentAddress){
    var deferred = $q.defer();

    current = currentAddress; 
    
    Utilities.isMainNet().then(function(bool) {
        var baseUrl = 'http://' + (bool ? 'mainnet' : 'testnet') + '.helloblock.io/v1/addresses/';
        var requestString = currentAddress;
        baseUrl += requestString;
        baseUrl += '/transactions?limit=15';
        Utilities.httpGet(baseUrl, function(obj) {
          console.log(obj);
          deferred.resolve(obj.data.transactions);
        });
    });
    return deferred.promise;
  }

  var isContainedinArrayMatrix = function(inputOrOutputMatrix){
  for (var i = 0; i < inputOrOutputMatrix.length; i ++ ){
    var returnedAddress = inputOrOutputMatrix[i][0];
    var returnedValue = inputOrOutputMatrix[i][1];
    var txTime = inputOrOutputMatrix[i][2];
    if (current === returnedAddress) {
      //console.log("match is found: ", inputOrOutputMatrix[i]);
      return [returnedAddress, returnedValue, txTime];
    }
  }
  return false;
};
 
 
 
//transObj is each object in the transactions array returned by the
//helloBlock, e.g. helloBlockData.data.transactions, where helloBlockData is the 
//JSON object returned by helloblock
var getUsableTransData = function(transObj){
  var direction, amount, time, address;
 
  var addressObj = {
    inputs: [],
    outputs: []
  };
 
  //push address from inputs into addressObj;
  transObj.inputs.forEach(function(tx){
    addressObj.inputs.push([tx.address, tx.value, transObj.estimatedTxTime]);
  });
 
  //push address from outputs into addressObj;
  transObj.outputs.forEach(function(tx){
    addressObj.outputs.push([tx.address, tx.value, transObj.estimatedTxTime]);
  });
 
  //check if currentAddress appears in both outpus and inputs
  if (isContainedinArrayMatrix(addressObj.inputs) && isContainedinArrayMatrix(addressObj.outputs)){
    //console.log(1)
    var matchedInputs = isContainedinArrayMatrix(addressObj.inputs);
    var matchedOutputs = isContainedinArrayMatrix(addressObj.outputs);
    var inputAmount = matchedInputs[1];
    var outputAmount = matchedOutputs[1];
    if (outputAmount<inputAmount){
      if(addressObj.outputs[0][0] === current){
        address = addressObj.outputs[1].address;
      }
      else{
        address = addressObj.outputs[0][0];
      }
      direction = "outbound";
      amount = inputAmount;
      time = matchedInputs[2];
      //us
    }
  }
  // check if currentAddress only appears in inputs
  // means currentAddress is sending all its btc to another address
  //therefore we need outputs[i].address
  else if (isContainedinArrayMatrix(addressObj.inputs) && !isContainedinArrayMatrix(addressObj.outputs)){
    //console.log(2)
    var matchedInputs = isContainedinArrayMatrix(addressObj.inputs);
    if(addressObj.outputs[0][0] === current){
      address = addressObj.outputs[1].address;
    }
    else{
      address = addressObj.outputs[0][0];
    }
    direction = "outbound";
    amount = matchedInputs[1];
    time = matchedInputs[2];
    //us
  }
  //check if currentAddress only appears in outputs
  else if (!isContainedinArrayMatrix(addressObj.inputs) && isContainedinArrayMatrix(addressObj.outputs)){
    //console.log(3)
    var matchedOutputs = isContainedinArrayMatrix(addressObj.outputs);
    address = addressObj.inputs[0][0];
    console.log(addressObj.inputs[0][0])
    direction = "inbound";
    amount = matchedOutputs[1];
    time = matchedOutputs[2];
    //them
  }

  return [direction, amount/100000000, time*1000, address]
};

  return {
    getTransactionHist: getTransactionHist,
    getUsableTransData: getUsableTransData,
    current: current
  };
}])







 
 
// var testObj = {"txHash":"4db732a171f2eecef2caada7c18de6a21a0e16fd1b50877214010ab68b9123ce",
// "version":1,
// "locktime":0,
// "size":226,
// "blockHash":"0000000000000002a9220b28742b2b440a6a8a472638da4733fc0968537e8d60",
// "blockHeight":274443,
// "blockTime":1386826263,
// "estimatedTxTime":1386826262,
// "confirmations":47944,
// "inputsCount":1,
// "outputsCount":2,
// "inputs":
// [
// {"prevTxHash":"9045ccb8ff609f1d67d05b93c7d68dacf19ee94a9713c9d1a388ea4a90839183",
// "prevTxoutIndex":0,
// "prevTxoutType":"pubkeyhash",
// "value":4323103,
// "address":"1H5c667tFHPFNJUnjAACWKicGke6b21VTY",
// "hash160":"b060f7557f3bb63d8151775fa33a6941644f62ec",
// "scriptSig":"4830450220775205cf4c9fe21b89d8ac1f09525b925034fc54d1eb24a08e0a34c60fbfaccb022100dd9a9fb0e70eaf6bc7d02f7b469829f7be5ab010c96f8089dce597054b7b0a190121022c39a5836913aa654fcf8962c7a44df9d09d3f9da86ca2a6d6b21f11a5a21e5f",
// "sequence":4294967295}
// ],
// "outputs":[
// {"index":0,
// "value":144145,
// "scriptPubKey":"76a9143fe5f29a94136efccf81cb13f9dc29e9bde1e71e88ac",
// "scriptPubKeyASM":"OP_DUP OP_HASH160 3fe5f29a94136efccf81cb13f9dc29e9bde1e71e OP_EQUALVERIFY OP_CHECKSIG",
// "address":"16ps38WzmDhEWMPQecVndrWZADekC4FU42",
// "hash160":"3fe5f29a94136efccf81cb13f9dc29e9bde1e71e",
// "type":"pubkeyhash",
// "spent":false,"nextTxHash":null,
// "nextTxinIndex":null},
// {"index":1,"value":4166958,
// "scriptPubKey":"76a914b060f7557f3bb63d8151775fa33a6941644f62ec88ac",
// "scriptPubKeyASM":"OP_DUP OP_HASH160 b060f7557f3bb63d8151775fa33a6941644f62ec OP_EQUALVERIFY OP_CHECKSIG",
// "address":"1H5c667tFHPFNJUnjAACWKicGke6b21VTY",
// "hash160":"b060f7557f3bb63d8151775fa33a6941644f62ec",
// "type":"pubkeyhash",
// "spent":true,
// "nextTxHash":"ff025934a6d2703ab6edb722818e2f2139aa0f49eaaf120a2b2d6c94cd0211ad",
// "nextTxinIndex":0}],
// "totalInputsValue":4323103,
// "totalOutputsValue":4311103,
// "fees":12000,"estimatedTxDirection":"incoming","estimatedTxValue":144145}
 
// console.log(direction(testObj,"16ps38WzmDhEWMPQecVndrWZADekC4FU42"));