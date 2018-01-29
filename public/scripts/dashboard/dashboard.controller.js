'use strict';

(function () {
  angular.module("trackYourPackage")
    .controller('dashboardController', dashboardController);

  dashboardController.$inject = ['trackYourPackageService', 'menu'];
  function dashboardController(trackYourPackageService, menu) {
    trackYourPackageService.setMenu(menu);
  }
})();
