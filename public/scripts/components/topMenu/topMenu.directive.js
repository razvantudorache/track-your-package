'use strict';

(function () {
  angular.module('trackYourPackage')
    .directive('topMenu', topMenuDirective);

  topMenuDirective.$inject = ['trackYourPackageService'];

  function topMenuDirective(trackYourPackageService) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        var userDetails = trackYourPackageService.getUserDetails();
        var menuEntries = userDetails.menuEntries;
        buildMenuMarkup(menuEntries);
        configureMenu();

        /**
         * Build the HTML markup for the mmenu plugin
         */
        function buildMenuMarkup(menuEntries) {
          var $topMenuContainer = $('.topMenuContainer');
          var menuMarkup = "";

          for (var i = 0; i < menuEntries.length; i++) {
            menuMarkup += "<li><a class='menuItem " + menuEntries[i].cls + "'>" + menuEntries[i].name + "</a></li>";
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
