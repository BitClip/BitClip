angular.module('bitclip.inputDirective', [])

.directive('transactionInput', function() {
  return {
    restrict: 'E',
    scopes: {
      ngModel: '='
    },
    templateUrl: 'send/send.inputDirective.tpl.html'
  };
});

