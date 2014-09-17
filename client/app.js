angular.module('bitclip', [
  'ui.router'
  // 'bitclip.send'
])

.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // $urlRouterProvider.otherwise('/send');

    $stateProvider
      .state('send', {
        url: '/send',
        templateUrl: 'send/test.html'
        // controller: 'sendController'
      });
  }
])

.run(['$state',
  function($state) {
    $state.transitionTo('send');
  }
])
