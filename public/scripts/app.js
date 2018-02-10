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

    .run(applicationRun);

  applicationRun.$inject = ['$transitions', '$state'];

  function applicationRun($transitions, $state) {
    // redirect the user to the login page if is not authenticated to have access to the dashboard route
    $transitions.onFinish({
      to: 'dashboard'
    }, function (trans) {
      var currentState = trans.router.stateService.current;

      if (currentState.isAuthenticatied) {
        return true;
      } else {
        return $state.target('login');
      }
    });
  }

})();
