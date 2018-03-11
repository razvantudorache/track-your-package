'use strict';

(function () {
  angular.module('trackYourPackage')
    .controller('usersController', usersController);

  usersController.$inject = ['$scope', '$mdDialog', 'trackYourPackageService'];

  function usersController($scope, $mdDialog, trackYourPackageService) {
    var me = this;

    me.$onInit = function () {
      defineGridColumnsAndProperties();

      $scope.addUser = addUser;
    };

    function defineGridColumnsAndProperties() {
      me.gridColumns = [
        {
          headerName: 'Actions',
          minWidth: 150,
          cellClass: 'actionColumn',
          cellRenderer: actionColumnRenderer
        },
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

      me.grid = {};
    }

    function actionColumnRenderer(params) {
      var columnTemplate = '';

      if (params.data) {
        var deleteButton = '';
        var currentUser = trackYourPackageService.getUserDetails();

        //the current user should not be deleted from the user list
        if (params.data._id !== currentUser._id) {
          deleteButton = '<li class="action deleteRow"></li>'
        }

        columnTemplate = '<ul class="actionList">' +
                              deleteButton +
          '                   <li class="action editRow"></li>' +
          '               </ul>';
      }

      return columnTemplate;
    }

    function addUser() {
      $mdDialog.show({
        controller: 'userDialogController',
        controllerAs: 'userDialog',
        templateUrl: 'scripts/users/userDialog.template.html',
        bindToController: true,
        locals: {
          title: 'Add new user',
          buttonLabel: 'Add',
          grid: me.grid
        }
      });
    }
  }
})();
