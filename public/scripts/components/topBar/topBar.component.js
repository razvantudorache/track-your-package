'use strict';
(function () {
  angular.module('trackYourPackage')
    .component('topBar', {
      templateUrl: 'scripts/components/topBar/topBar.template.html',
      controller: topBarController,
      controllerAs: 'topBarCtrl',
      bindings: {
        pageTitle: '<'
      }
    });

  function topBarController() {
    var me = this;
  }
})();
