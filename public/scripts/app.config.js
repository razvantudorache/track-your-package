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
      return 'dashboard';
    });

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'scripts/login/login.template.html',
        controller: 'loginController'
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'scripts/dashboard/dashboard.template.html',
        controller: 'dashboardController',
        resolve:{
          user: function ($http, $state) {
            return $http.get('/dashboard').then(
              function successCallback(response) {
                return {
                  menu: response.data.menuEntries,
                  details: response.data.userDetails
                }
              },
              function errorCallback() {
                $state.go('login');
              }
            );
          }
        }
      })
      .state('profile', {
        url: '/profile',
        parent: 'dashboard',
        templateUrl: 'scripts/profile/profile.template.html',
        controller: 'profileController'
      })
      .state('users', {
        url: '/users',
        parent: 'dashboard',
        templateUrl: 'scripts/users/users.template.html',
        controller: 'usersController'
      })
      .state('packages', {
        url: '/packages',
        parent: 'dashboard',
        templateUrl: 'scripts/packages/packages.template.html',
        controller: 'packagesController'
      })
      .state('statistics', {
        url: '/statistics',
        parent: 'dashboard',
        templateUrl: 'scripts/statistics/statistics.template.html',
        controller: 'statisticsController'
      })
      .state('logout', {
        url: '/logout',
        controller: 'logoutController'
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

