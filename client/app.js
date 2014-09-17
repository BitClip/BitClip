angular.module('bitclip', [
  'ui.router',
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
    //write for /receive and market
  }
])
