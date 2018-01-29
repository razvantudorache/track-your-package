'use strict';

(function () {
  angular.module('trackYourPackage')
    .directive('topMenu', topMenuDirective);

  topMenuDirective.$inject = ['trackYourPackageService'];
  function topMenuDirective(trackYourPackageService) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        buildMenuMarkup(trackYourPackageService.getMenu());
        configureMenu();

        /**
         * Build the HTML markup for the mmenu plugin
         */
        function buildMenuMarkup(menu) {
          var $topMenuContainer = $('.topMenuContainer');
          var menuMarkup = "";

          for (var i = 0; i < menu.length; i++) {
            menuMarkup += "<li><a class='menuItem " + menu[i].cls + "'>" + menu[i].name + "</a></li>";
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
