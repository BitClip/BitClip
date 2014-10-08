angular.module('bitclip.validateAddressDirective', [])

.directive('validAddress', ['TxBuilder', function (TxBuilder) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, formElement, attr, ngModelCtrl) {
      ngModelCtrl.$parsers.unshift(function(destination) {
        var isValidAddress = TxBuilder.isValidAddress(destination);
        ngModelCtrl.$setValidity('validAddress', isValidAddress);
        return isValidAddress ? destination : undefined;
      });
      ngModelCtrl.$formatters.unshift(function(destination) {
        ngModelCtrl.$setValidity('validAddress', TxBuilder.isValidAddress(destination));
        return destination;
      });
    }
  };
}]);
