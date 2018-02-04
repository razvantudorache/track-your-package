'use strict';

(function () {
  angular.module("trackYourPackage")
    .controller('loginController', loginController);

  loginController.$inject = ['$scope', '$http', '$state', 'notificationMessage'];
  function loginController($scope, $http, $state, notificationMessage) {

    // action from the login button
    $scope.submitLogin = function () {
      if ($scope.loginForm.$valid) {
        var userLogin = {
          username: $scope.login.username,
          password: $scope.login.password
        };

        $http.post('/login', userLogin).then(function (response) {
          if (response.data.success) {
            $state.go('dashboard');
          } else {
            notificationMessage.showNotificationMessage(response.data.message, 'warning');
          }
        });
      }
    };
  }
})();
