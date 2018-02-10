'use strict';

(function () {
  angular.module('trackYourPackage')
    .controller('changePasswordDialogController', changePasswordDialogController);

  changePasswordDialogController.$inject = ['$scope', '$mdDialog', '$http', 'notificationMessage'];

  function changePasswordDialogController($scope, $mdDialog, $http, notificationMessage) {
    $scope.changePassword = function () {
      $http.post('/updatePassword', {
        oldPassword: $scope.oldPassword,
        newPassword: $scope.newPassword
      }).then(
        function (response) {
          if (response.data.success) {
            notificationMessage.showNotificationMessage(response.data.message, 'success');
            $mdDialog.cancel();
          } else {
            notificationMessage.showNotificationMessage(response.data.message, 'warning');
          }
        });
    };

    $scope.closeDialog = function () {
      $mdDialog.cancel();
    };
  }
})();
