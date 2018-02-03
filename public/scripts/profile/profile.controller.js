'use strict';

(function () {
  angular.module('trackYourPackage')
    .controller('profileController', profileController);

  profileController.$inject = ['$scope', 'trackYourPackageService', '$state'];
  function profileController($scope, trackYourPackageService, $state) {

    $scope.userDetails = trackYourPackageService.getUserDetails();
  }
})();
