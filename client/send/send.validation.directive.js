angular.module('bitclip.validateAddressDirective', [])

.directive('validAddress', ['TxBuilder', function (TxBuilder) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, formElement, attr, ngModelCtrl) {
      formElement.bind('click', function(event) {
        var isValidAddress = TxBuilder.isValidAddress(scope.transactionDetails.destination);
        scope.sendForm.destination.$invalid = !isValidAddress;
        scope.sendForm.destination.$valid = isValidAddress;
      });
    }
  };
}]);
