(function () {
  'use strict';
  angular
    .module('trackYourPackage', [
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
