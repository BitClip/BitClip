angular.module('bitclip')
	.directive('headerBar', function() {
		return {
			restrict: 'E',
			scopes: {
				ngModel: '='
			},
			templateUrl: 'header/header.html'
		}
	});
