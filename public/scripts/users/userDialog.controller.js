'use strict';

(function () {
  angular.module('trackYourPackage')
    .controller('userDialogController', userDialogController);

  userDialogController.$inject = ['$scope', '$mdDialog', '$http', 'trackYourPackageService', 'notificationMessage'];

  function userDialogController($scope, $mdDialog, $http, trackYourPackageService, notificationMessage) {
    var me = this;

    $scope.buttonAddDisabled = false;
    $scope.user = me.editMode ? me.user : {};

    buildAvailableRoles();

    function buildAvailableRoles() {
      $scope.roles = ['courier'];
      $scope.currentUser = trackYourPackageService.getUserDetails();

      if ($scope.currentUser.role === 'superadmin') {
        $scope.roles.push('admin', 'superadmin');
      }
    }

    $scope.addOrEdit = function () {
      var url = me.editMode ? '/updateUserDetails' : '/insertUser';

      $scope.buttonDisabled = true;

      $http.post(url, {
        user: $scope.user
      }).then(function (response) {
        $scope.buttonDisabled = false;
        notificationMessage.showNotificationMessage(response.data.message, response.data.messageType);

        if (response.data.success) {
          $scope.user = {};

          me.grid.api.purgeInfiniteCache();

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
