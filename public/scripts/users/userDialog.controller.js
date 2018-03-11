'use strict';

(function () {
  angular.module('trackYourPackage')
    .controller('userDialogController', userDialogController);

  userDialogController.$inject = ['$scope', '$mdDialog', '$http', 'trackYourPackageService', 'notificationMessage'];

  function userDialogController($scope, $mdDialog, $http, trackYourPackageService, notificationMessage) {

    $scope.buttonAddDisabled = false;
    $scope.user = {};

    buildAvailableRoles();

    function buildAvailableRoles() {
      $scope.roles = ['courier'];
      $scope.currentUser = trackYourPackageService.getUserDetails();

      if ($scope.currentUser.role === 'superadmin') {
        $scope.roles.push('admin', 'superadmin');
      }
    }

    /**
     * Save new password
     * @return {void}
     */
    $scope.add = function () {
      $scope.buttonAddDisabled = true;

      $http.post('/insertUser', {
        user: $scope.user
      }).then(
        function (response) {
          $scope.buttonAddDisabled = false;
          notificationMessage.showNotificationMessage(response.data.message, response.data.messageType);

          if (response.data.success) {
            $scope.user = {};
            //refresh the grid
            $mdDialog.cancel();
          }
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
