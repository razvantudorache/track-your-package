'use strict';

(function () {
  angular.module("trackYourPackage")
    .controller('loginController', loginController);

  loginController.$inject = ['$scope', '$http', '$state', 'notificationMessage'];

  function loginController($scope, $http, $state, notificationMessage) {
    var me = this;

    me.$onInit = function () {
      $scope.disableLoginButton = false;
      $scope.submitLogin = submitLogin;
    };

    /**
     * Action from the login button
     * @return {void}
     */
    function submitLogin() {
      if ($scope.loginForm.$valid) {
        $scope.disableLoginButton = true;

        var userLogin = {
          username: $scope.login.username,
          password: $scope.login.password
        };

        $http.post('/login', userLogin).then(function (response) {
          $scope.disableLoginButton = false;

          if (response.data.success) {
            $state.go('dashboard');
          } else {
            notificationMessage.showNotificationMessage(response.data.message, 'warning');
          }
        });
      }
    }
  }
})();
