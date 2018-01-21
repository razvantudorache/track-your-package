'use strict';

(function () {
  angular.module('trackYourPackage')
    .directive('topMenu', topMenuDirective);

  function topMenuDirective() {
    return {
      restrict: 'A',
      link: function (scope, element) {

        buildMenuMarkup();
        configureMenu();

        /**
         * Build the HTML markup for the mmenu plugin
         */
        function buildMenuMarkup() {
          var $topMenuContainer = $('.topMenuContainer');
          var menuEntries = ["Profile", "Users", "Packages", "Statistics", "Logout"];
          var menuMarkup = "";

          for (var i = 0; i < menuEntries.length; i++) {
            menuMarkup += "<li><a>" + menuEntries[i] + "</a></li>"
          }

          $topMenuContainer.append(menuMarkup);
        }

        /**
         * Add configuration for the mmenu plugin
         */
        function configureMenu() {
          var $topMenu = $(element);
          $topMenu.mmenu({
              "extensions": [
                "pagedim-black",
                "position-front",
                "position-top"
              ],
              "iconPanels": true
            }
          );

          var menuApi = $topMenu.data("mmenu");
          var $icon = $(".topMenuIcon");

          $icon.on("click", function () {
            menuApi.open();
          });
        }
      }
    };
  }
})();
