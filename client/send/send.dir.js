angular.module('bitclip.send', [
  'ui.router'
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
