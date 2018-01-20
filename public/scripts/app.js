(function () {
  'use strict';
  angular
    .module('TYP', [
      'ngAnimate',
      'ngCookies',
      'ngMessages',
      'ngResource',
      'ngSanitize',
      'ui.router',
      'ngMaterial',
      'angular-loading-bar'
    ])

    .run(['$rootScope', '$state', function ($rootScope, $state) {
    }]);
})();
