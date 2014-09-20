angular.module('bitclip.utilServices', [])

.factory('LocalStorage', ['$q',
	function($q) {

		var setLocalStorage = function(saveObj, callback) {
			chrome.storage.local.set(saveObj, callback);
		};

		var getLocalStorage = function(propertyName, callback) {
			chrome.storage.local.get(propertyName, function(data) {
				callback(data);
			});
		};

		var getSpecificNetworkObj = function(isMainNet) {
			var network = (isMainNet) ? 'MainNet' : 'TestNet';
			var deferred = $q.defer();
			getLocalStorage(network, function(data) {
				deferred.resolve(data);
			});
			return deferred.promise;
		};

		var updateSpecificNetworkObj = function(isMainNet, saveObj, callback) {
			getSpecificNetworkObj(isMainNet).then(function(data) {
				var network = Object.keys(data)[0];
				var storedData = data.network;
				var saveObjKeys = Object.keys(saveObj);
				var objToBeSaved = {};
				saveObjKeys.forEach(function(key) {
					storedData[key] = saveObjKeys[key];
				});
				objToBeSaved[network] = storedData;
				setLocalStorage(objToBeSaved, callback);
			});
		};

		//isMainNet is a boolean;
		//if true, all key and address generation and transaction
		//building will use MainNet protocol
		//if false, will use TestNet protocol
		var setNetwork = function(isMainNet, callback) {
			var deferred = $q.defer();
			chrome.storage.local.set({
				isMainNet: isMainNet
			}, function() {
				deferred.resolve();
			});
			return deferred.promise;
		};

		var getNetwork = function() {
			var deferred = $q.defer();
			chrome.storage.local.get('isMainNet', function(data) {
				var isMainNet = data.isMainNet;
				deferred.resolve(isMainNet);
			});
			return deferred.promise;
		};

		return {
			setNetwork: setNetwork,
			getNetwork: getNetwork,
			getLocalStorage: getLocalStorage,
			setLocalStorage: setLocalStorage,
			getSpecificNetworkObj: getSpecificNetworkObj
		}
	}
])
