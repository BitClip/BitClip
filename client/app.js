angular.module('bitclip', [
  'ui.router',
  'bitclip.headerController',
  'bitclip.headerDirective',
  'bitclip.headerFactory',
  'bitclip.receiveController',
  'bitclip.receiveFactory',
  'bitclip.sendController',
  'bitclip.sendFactory',
  'bitclip.utilitiesFactory'
])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
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
}]);
