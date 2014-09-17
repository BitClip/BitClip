angular.module('bitclip.send', [
  'ngMorph'
])

.controller('sendController', function($scope) {
  $scope.send = {
    closeEl: '.close',
    modal: {
      templateUrl: 'send.btn.html',
      position: {
        top: '25%',
        left: '25%'
      },
      fade: false
    }
  };
});
