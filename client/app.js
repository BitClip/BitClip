angular.module('bitclip', [
  'ui.router',
  'bitclip.header',
  'bitclip.headerDirective',
  'bitclip.headerServices',
  'bitclip.receiveFactory',
  'bitclip.receiveController',
  'bitclip.send',
  'bitclip.sendService'
])

.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/send');

    $stateProvider
      .state('send', {
        url: '/send',
        templateUrl: 'send/send.tpl.html',
        controller: 'sendController'
      })
      .state('receive', {
        url: '/receive',
        templateUrl: 'receive/receive.tpl.html',
        controller: 'receiveController',
        resolve: {
          currentAddress: function(Address) {
            return Address.findAddress().then(function(currentAddress) {
              return currentAddress;
            });
          }
        }
      });
  }
]);
