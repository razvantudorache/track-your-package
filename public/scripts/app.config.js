/**
 * Created by Razvan on 06.10.2016.
 */
'use strict';

(function () {
  angular.module('trackYourPackage')
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

