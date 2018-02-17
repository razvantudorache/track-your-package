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
        field: 'firstName',
        minWidth: 150
      },
      {
        headerName: 'Last name',
        field: 'lastName',
        minWidth: 150
      },
      {
        headerName: 'Username',
        field: 'username',
        minWidth: 150
      },
      {
        headerName: 'Role',
        field: 'role',
        minWidth: 150
      },
      {
        headerName: 'Email',
        field: 'email',
        minWidth: 150
      },
      {
        headerName: 'Phone',
        field: 'phone',
        minWidth: 150
      },
      {
        headerName: 'Company ID',
        field: 'companyID',
        minWidth: 150
      }
    ];


    me.gridProperties = {
      url: '/userList'
    }
  }
})();
