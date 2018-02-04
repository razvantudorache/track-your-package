'use strict';

(function () {
  angular.module('trackYourPackage')
    .controller('profileController', profileController);

  profileController.$inject = ['$scope', 'trackYourPackageService'];
  function profileController($scope, trackYourPackageService) {

    $scope.userDetails = trackYourPackageService.getUserDetails();
  }
})();
