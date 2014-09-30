angular.module('bitclip.sendButtonsDirective', [])

.directive('transactionButtons', function() {
  return {
    restrict: 'E',
    scopes: {
      ngModel: '='
    },
    templateUrl: 'send/send.buttonsDirective.tpl.html'
  };
});

