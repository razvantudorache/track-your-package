'use strict';

(function () {
  angular.module('trackYourPackage')
    .controller('changePasswordDialogController', changePasswordDialogController);

  changePasswordDialogController.$inject = ['$scope', '$mdDialog', '$http', 'notificationMessage'];

  function changePasswordDialogController($scope, $mdDialog, $http, notificationMessage) {
    $scope.buttonChangeDisabled = false;

    /**
     * Save new password
     * @return {void}
     */
    $scope.changePassword = function () {
      $scope.buttonChangeDisabled = true;

      $http.post('/updatePassword', {
        oldPassword: $scope.oldPassword,
        newPassword: $scope.newPassword
      }).then(
        function (response) {
          $scope.buttonChangeDisabled = false;

          if (response.data.success) {
            notificationMessage.showNotificationMessage(response.data.message, response.data.messageType);
            $mdDialog.cancel();
          } else {
            notificationMessage.showNotificationMessage(response.data.message, response.data.messageType);
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
