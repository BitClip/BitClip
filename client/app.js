angular.module('bitclip', [
  'ui.router',
  'bitclip.receiveFactory',
  'bitclip.receiveController',
  'bitclip.send'
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
        controller: 'receiveController'
      });
  }
])
