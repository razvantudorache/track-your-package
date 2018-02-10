'use strict';

(function () {
  angular.module('trackYourPackage')
    .controller('profileController', profileController);

  profileController.$inject = ['$scope', 'trackYourPackageService', '$http', '$state'];

  function profileController($scope, trackYourPackageService, $http, $state) {
    var me = this;

    me.$onInit = function () {
      $scope.userDetails = trackYourPackageService.getUserDetails();
      $scope.buttonSaveDisabled = false;

      /**
       * Update user details
       * @return {void}
       */
      $scope.save = function () {
        $scope.buttonSaveDisabled = true;

        $http.post('/updateUserDetails', $scope.userDetails).then(function (response) {
          $scope.buttonSaveDisabled = false;
          trackYourPackageService.setUserDetails(response.data);
          $state.reload();
        });
      };

      /**
       * Change password of user
       * @return {void}
       */
      $scope.changePassword = function () {
        //
      };
    };
  }
})();
