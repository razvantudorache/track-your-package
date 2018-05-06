'use strict';

(function () {
  angular.module('trackYourPackage')
    .controller('logoutController', logoutController);

  logoutController.$inject = ['$http', '$state'];

  function logoutController($http, $state) {
    $http.get('/logout').then(function () {
      Chat.mainChatDisconnect();

      $state.go('login');
    });
  }
})();
