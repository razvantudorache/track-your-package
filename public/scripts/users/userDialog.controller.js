'use strict';

(function () {
  angular.module('trackYourPackage')
    .controller('userDialogController', userDialogController);

  userDialogController.$inject = ['$scope', '$mdDialog', '$http', 'trackYourPackageService'];

  function userDialogController($scope, $mdDialog, $http, trackYourPackageService) {
    $scope.buttonAddDisabled = false;
    $scope.user = {};

    buildAvailableRoles();

    function buildAvailableRoles () {
      $scope.roles = ['courier'];
      var user = trackYourPackageService.getUserDetails();

      if (user.role === 'superadmin') {
        $scope.roles.push('admin', 'superadmin');
      }
    }
    /**
     * Save new password
     * @return {void}
     */
    $scope.add = function () {
      $scope.buttonAddDisabled = true;

      $http.post('/updatePassword', {
        oldPassword: $scope.oldPassword,
        newPassword: $scope.newPassword
      }).then(
        function (response) {
          $scope.buttonAddDisabled = false;
        });
    };

    /**
     * Close dialog
     * @return {void}
     */
    $scope.closeDialog = function () {
      $mdDialog.cancel();
    };
  }
})();
