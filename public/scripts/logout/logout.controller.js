'use strict';

(function () {
  angular.module('trackYourPackage')
    .controller('logoutController', logoutController);

  logoutController.$inject = ['$http', '$state', 'chatService'];

  function logoutController($http, $state, chatService) {
    $http.get('/logout').then(function () {
      chatService.disconnect();

      $state.go('login');
    });
  }
})();
