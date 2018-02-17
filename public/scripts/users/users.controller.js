'use strict';

//TODO block the access of this route
(function () {
  angular.module('trackYourPackage')
    .controller('usersController', usersController);

  usersController.$inject = ['$scope'];

  function usersController($scope) {
    var me = this;

    me.gridColumns = [
      {
        headerName: 'First name',
        field: 'firstName'
      },
      {
        headerName: 'Last name',
        field: 'lastName'
      },
      {
        headerName: 'Username',
        field: 'username'
      }
    ];


    me.gridProperties = {
      url: '/userList'
    }
  }
})();
