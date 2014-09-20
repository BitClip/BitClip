angular.module('bitclip.utilServices', [])

.factory('NetworkSettings', ['$q',
	function($q) {

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
			getNetwork: getNetwork
		}
	}
])
