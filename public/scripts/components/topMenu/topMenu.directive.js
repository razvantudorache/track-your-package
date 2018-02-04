'use strict';

(function () {
  angular.module('trackYourPackage')
    .directive('topMenu', topMenuDirective);

  topMenuDirective.$inject = ['trackYourPackageService'];

  function topMenuDirective(trackYourPackageService) {
    return {
      restrict: 'A',
      template: '<ul class="topMenuContainer"></ul>',
      link: function (scope, element) {
        buildMenuMarkup(trackYourPackageService.getMenu());
        configureMenu();

        /**
         * Build the HTML markup for the mmenu plugin
         * @param {Array} menu - list with entries
         * @returns {void}
         */
        function buildMenuMarkup(menu) {
          var $topMenuContainer = $('.topMenuContainer');
          var menuMarkup = "";

          for (var i = 0; i < menu.length; i++) {
            var href = '';
            switch (menu[i].route) {
              case 'dashboard':
              case 'logout':
                href = menu[i].route;
                break;
              default:
                href = 'dashboard/' + menu[i].route;
            }

            menuMarkup += '<li><a href="#/'+ href +'" class="menuItem ' + menu[i].cls + '">' + menu[i].name + '</a></li>';
          }

          $topMenuContainer.append(menuMarkup);
        }

        /**
         * Add configuration for the mmenu plugin
         * @returns {void}
         */
        function configureMenu() {
          var $topMenu = $(element);
          $topMenu.mmenu({
              "wrappers": ["angular"],
              "extensions": [
                "pagedim-black",
                "position-front",
                "position-top"
              ]
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
