angular.module('bitclip.headerDirective', [])

.directive('headerBar', function() {
  return {
    restrict: 'E',
    scopes: {
      ngModel: '='
    },
    templateUrl: 'header/header.tpl.html'
  };
});
