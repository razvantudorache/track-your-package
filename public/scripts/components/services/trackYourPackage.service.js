'use strict';
(function () {
  angular.module('trackYourPackage')
    .service('trackYourPackageService', trackYourPackageService);

  function trackYourPackageService() {
    var me = this;
    var menu = [];

    me.setMenu = function (value) {
      menu = value;
    };

    me.getMenu = function () {
      return menu;
    }
  }
})();
