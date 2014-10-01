angular.module('bitclip', [
  'ui.router',
  'ngFx',
  'bitclip.headerController',
  'bitclip.headerDirective',
  'bitclip.headerFactory',
  'bitclip.viewTabsController',
  'bitclip.viewTabsDirective',
  'bitclip.receiveController',
  'bitclip.receiveFactory',
  'bitclip.sendController',
  'bitclip.sendFactory',
  // 'bitclip.inputDirective',
  // 'bitclip.sendButtonsDirective',
  'bitclip.historyController',
  'bitclip.historyFactory',
  'bitclip.marketController',
  'bitclip.marketFactory',
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
    })
    .state('history', {
      url: '/history',
      templateUrl: 'history/history.tpl.html',
      controller: 'historyController'
    })
    .state('market', {
      url: '/market',
      templateUrl: 'market/market.tpl.html',
      controller: 'marketController'
    });
}])


