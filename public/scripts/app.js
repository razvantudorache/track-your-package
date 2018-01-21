'use strict';
(function () {
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


    .run(trackYourPackageRun);

  trackYourPackageRun.$inject = ['$rootScope', '$state', '$http'];
  function trackYourPackageRun($rootScope, $state) {
  }

})();
