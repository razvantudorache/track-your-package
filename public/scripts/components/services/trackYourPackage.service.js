'use strict';
(function () {
  angular.module('trackYourPackage')
    .service('trackYourPackageService', trackYourPackageService);

  function trackYourPackageService() {
    var me = this;
    var userDetails = null;

    me.setUserDetails = function (value) {
      userDetails = value;
    };

    me.getUserDetails = function () {
      return userDetails;
    }
  }
})();
