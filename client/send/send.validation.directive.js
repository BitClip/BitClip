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
            var transactionDetails = TxBuilder.getTransactionDetails();
            console.log("i am transactionDetails: ", transactionDetails);
            var isValidAddress = TxBuilder.isValidAddress(transactionDetails.destination);
            ngModelCtrl.$setValidity('validAddress', isValidAddress);
        }
    };
}])