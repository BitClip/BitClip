angular.module('bitclip.validateAddressDirective', [])

.directive('validAddress', ['TxBuilder', function (TxBuilder) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ngModelCtrl) {
            //destination is the modelValue
            console.log("scope: ", scope);
            console.log("elm: ", elm);
            console.log("atr: ", attr);
            console.log("controller: ", ngModelCtrl);
            var isValidAddress = TxBuilder.isValidAddress(scope.transactionDetails.destination);
            ngModelCtrl.$setValidity('validAddress', isValidAddress);
        }
    };
}])