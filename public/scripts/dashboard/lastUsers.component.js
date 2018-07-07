'use strict';

(function () {
  angular.module("trackYourPackage")
    .component('lastUsersCard',  {
      template: lastUsersCardTemplate,
      controller: lastUsersCardController
    });

  function lastUsersCardTemplate() {
    var template = "<md-card>" +
      "               <md-card-title>" +
      "                 <md-card-title-text>" +
      "                   <span class=\"md-headline\">Card with image</span>" +
      "                   <span class=\"md-subhead\">Medium</span>" +
      "                 </md-card-title-text>" +
      "               </md-card-title>" +
      "               <md-card-content>" +
      "                 <ul>" +
      "                   <li ng-repeat='item in contentList'>{{item}}</li>" +
      "                 </ul>" +
      "               </md-card-content>" +
      "               <md-card-actions layout=\"row\" layout-align=\"end center\">" +
      "                 <md-button>Action 1</md-button>" +
      "                 <md-button>Action 2</md-button>" +
      "               </md-card-actions>" +
      "           </md-card>";

    return template;
  }

  lastUsersCardController.$inject = ['$scope'];
  function lastUsersCardController ($scope) {
    $scope.contentList = [1,2,3];

  }
})();
