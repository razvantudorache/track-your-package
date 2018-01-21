'use strict';

(function () {
  angular.module('trackYourPackage')
    .config(stateConfig)
    .config(httpConfig)
    .config(progressbarConfig);

  /**
   * State config injection + method
   * @type {string[]}
   */
  stateConfig.$inject = ['$urlRouterProvider', '$stateProvider'];
  function stateConfig($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise(function () {
      return 'login';
    });

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'scripts/login/login.template.html',
        controller: 'loginController',
        controllerAs: 'login'
      })
      .state('main', {
        url: '/main',
        templateUrl: 'scripts/main/main.template.html',
        controller: 'mainController',
        controllerAs: 'main'
      });


  }

  httpConfig.$inject = ['$httpProvider'];
  function httpConfig($httpProvider) {
    $httpProvider.defaults.headers.common = {
      'Content-Type': 'application/json; charset=utf-8',
      'Response-Type': 'json'
    };
  }

  progressbarConfig.$inject = ['cfpLoadingBarProvider'];
  function progressbarConfig(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '.topBarContainer';
    cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner"></span></div>';
  }
})();

