'use strict';
(function () {
  angular.module('trackYourPackage')
    .service('trackYourPackageService', trackYourPackageService);

  function trackYourPackageService() {
    var me = this;
    var menu = [];
    var details = {};

    me.setMenu = function (value) {
      menu = value;
    };

    me.getMenu = function () {
      return menu;
    };

    me.setUserDetails = function (value) {
      details = value;
    };

    me.getUserDetails = function () {
      return details;
    }
  }
})();
