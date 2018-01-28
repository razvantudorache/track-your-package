'use strict';

(function () {
  angular.module("trackYourPackage")
    .controller('mainController', mainController);

  mainController.$inject = ['$scope', '$stateParams'];
  function mainController($scope, $stateParams) {
    // get data from the input
  }
})();
