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

  topBarController.$inject = ['trackYourPackageService'];
  function topBarController(trackYourPackageService) {
    var me = this;

    var userDetails = trackYourPackageService.getUserDetails();
    me.user = userDetails.firstName + ' ' + userDetails.lastName;
  }
})();
