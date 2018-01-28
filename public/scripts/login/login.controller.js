'use strict';

(function () {
  angular.module("trackYourPackage")
    .controller('loginController', loginController);

  loginController.$inject = ['$scope', '$http', '$state', 'notificationMessage', 'trackYourPackageService'];
  function loginController($scope, $http, $state, notificationMessage, trackYourPackageService) {

    // action from the login button
    $scope.submitLogin = function () {
      if ($scope.loginForm.$valid) {
        var userLogin = {
          username: $scope.login.username,
          password: $scope.login.password
        };

        $http.get('/api/user', {
          params: userLogin
        }).then(function (response) {
          if (response.data.success) {
            // $state.go('main', {
            //   userDetails: response.data.userDetails
            // });
            trackYourPackageService.setUserDetails(response.data.userDetails);
            $state.go('main');
          } else {
            notificationMessage.showNotificationMessage(response.data.message, 'warning');
          }
        });
      }
    }
  }
})();
