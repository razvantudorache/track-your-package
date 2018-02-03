'use strict';

(function () {
  angular.module("trackYourPackage")
    .controller('dashboardController', dashboardController);

  dashboardController.$inject = ['trackYourPackageService', 'user'];
  function dashboardController(trackYourPackageService, user) {
    trackYourPackageService.setMenu(user.menu);
    trackYourPackageService.setUserDetails(user.details);
  }
})();
