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
      // if login wasn't applied redirect to login
      return 'login';
    });

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'scripts/login/login.template.html',
        controller: 'loginController',
        controllerAs: 'login'
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'scripts/dashboard/dashboard.template.html',
        controller: 'dashboardController',
        controllerAs: 'dashboard',
        resolve:{
          menu: function ($http, $state) {
            return $http.get('/dashboard').then(
              function successCallback(response) {
                return response.data.menuEntries;
              },
              function errorCallback() {
                $state.go('login');
              }
            );
          }
        }
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
  }
})();

