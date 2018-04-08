'use strict';

(function () {
  angular.module('trackYourPackage')
    .controller('profileController', profileController);

  profileController.$inject = ['$scope', 'trackYourPackageService', '$http', '$state', '$mdDialog', 'notificationMessage'];

  function profileController($scope, trackYourPackageService, $http, $state, $mdDialog, notificationMessage) {
    var me = this;

    me.$onInit = function () {
      $scope.userDetails = trackYourPackageService.getUserDetails();
      $scope.buttonSaveDisabled = false;
      $scope.save = save;
      $scope.openChangePasswordDialog = openChangePasswordDialog;
    };

    /**
     * Update user details
     * @return {void}
     */
    function save() {
      $scope.buttonSaveDisabled = true;

      $http.post('/updateUserDetails', $scope.userDetails).then(function (response) {
        $scope.buttonSaveDisabled = false;
        notificationMessage.showNotificationMessage(response.data.message, response.data.messageType);

        if (response.data.success) {
          trackYourPackageService.setUserDetails(response.data.user);
        }
        $state.reload();
      });
    }

    /**
     * Change password of user
     * @return {void}
     */
    function openChangePasswordDialog() {
      $mdDialog.show({
        controller: 'changePasswordDialogController',
        templateUrl: 'scripts/profile/changePasswordDialog.template.html'
      });
    }
  }
})();
