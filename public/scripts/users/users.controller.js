'use strict';

(function () {
  angular.module('trackYourPackage')
    .controller('usersController', usersController);

  usersController.$inject = ['$scope', '$mdDialog'];

  function usersController($scope, $mdDialog) {
    var me = this;

    me.$onInit = function () {
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
          headerName: 'Company address',
          field: 'address',
          minWidth: 190
        },
        {
          headerName: 'Company ID',
          field: 'companyID',
          minWidth: 150
        }
      ];
      me.gridProperties = {
        url: '/userList'
      };

      $scope.addUser = addUser;
    };

    function addUser() {
      $mdDialog.show({
        controller: 'userDialogController',
        controllerAs: 'userDialog',
        templateUrl: 'scripts/users/userDialog.template.html',
        bindToController: true,
        locals: {
          title: 'Add new user',
          buttonLabel: 'Add'
        }
      });
    }
  }
})();
