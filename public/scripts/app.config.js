/**
 * Created by Razvan on 06.10.2016.
 */
'use strict';

(function () {
  angular.module('TYP')
    .config(stateConfig)
    .config(httpConfig)
    .config(resourceConfig)
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
      .state('mainView', {
        url: '/mainView',
        templateUrl: 'scripts/mainView/mainView.template.html'
      })
      .state('generalInformation', {
        url: '/generalInformation',
        templateUrl: 'scripts/generalInformation/generalInformation.html',
        controller: 'generalInformationController',
        parent: 'mainView'
      })
      .state('myAccount', {
        url: '/userAccount',
        templateUrl: 'scripts/userAccount/userAccount.html',
        controller: 'userAccountController',
        parent: 'mainView'
      })
      .state('detailedInformation', {
        url: '/detailedInformation',
        templateUrl: 'scripts/detailedInformation/detailedInformation.html',
        controller: 'detailedInformationController',
        parent: 'mainView'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'scripts/login/login.template.html',
        controller: 'loginController'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'scripts/register/register.template.html',
        controller: 'registerController',
        controllerAs: 'registerCtrl'
      });
  }

  httpConfig.$inject = ['$httpProvider'];
  function httpConfig($httpProvider) {
    $httpProvider.defaults.headers.common = {
      'Content-Type': 'application/json; charset=utf-8',
      'Response-Type': 'json'
    };
  }

  resourceConfig.$inject = ['$resourceProvider'];
  function resourceConfig($resourceProvider) {

    $resourceProvider.defaults.actions.put = {
      method: 'PUT'
    };

    $resourceProvider.defaults.actions.post = {
      method: 'POST'
    };
  }

  progressbarConfig.$inject = ['cfpLoadingBarProvider'];
  function progressbarConfig(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '.topBarContainer';
    cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner"></span></div>';
  }
})();

