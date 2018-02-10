'use strict';

(function () {
  angular.module('trackYourPackage')
    .controller('profileController', profileController);

  profileController.$inject = ['$scope', 'trackYourPackageService', '$http', '$state'];

  function profileController($scope, trackYourPackageService, $http, $state) {
    var me = this;

    me.$onInit = function () {
      $scope.userDetails = trackYourPackageService.getUserDetails();
      $scope.buttonDisabled = false;

      $scope.save = function () {
        $scope.buttonDisabled = true;

        $http.post('/updateUserDetails', $scope.userDetails).then(function (response) {
          $scope.buttonDisabled = false;
          trackYourPackageService.setUserDetails(response.data);
          $state.reload();
        });
      }
    };
  }
})();
