angular.module('bitclip.viewTabsDirective', [])

.directive('viewTabs', function() {
  return {
    restrict: 'E',
    scopes: {
      ngModel: '='
    },
    templateUrl: 'viewTabs/viewTabs.tpl.html'
  };
});
