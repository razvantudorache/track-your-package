'use strict';

(function () {
  angular.module('trackYourPackage')
    .controller('usersController', usersController);

  usersController.$inject = ['$scope', '$mdDialog', 'trackYourPackageService', '$http', 'notificationMessage', 'trackYourPackageConst'];

  function usersController($scope, $mdDialog, trackYourPackageService, $http, notificationMessage, trackYourPackageConst) {
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
        },
        {
          headerName: 'Last modification',
          field: 'lastModification',
          cellRenderer: lastModificationFormat,
          minWidth: 150
        }
      ];
      me.gridProperties = {
        url: '/userList'
      };

      me.grid = null;

      me.rowActions = {
        deleteRow: deleteRow,
        editRow: editRow
      }
    }

    function lastModificationFormat(params) {
      var template = '';

      if (params.data) {
        var formatData = moment(params.data.lastModification).format(trackYourPackageConst.DATE_FORMAT);
        template = '<span>' + formatData + '</span>';
      }

      return template;
    }

    function actionColumnRenderer(params) {
      var columnTemplate = '';

      if (params.data) {
        var deleteButton = '';
        var currentUser = trackYourPackageService.getUserDetails();

        //the current user should not be deleted from the user list
        if (params.data._id !== currentUser._id) {
          deleteButton = '<li class="action deleteRow" data-row-id="' + params.node.id + '"></li>';
        }

        columnTemplate = '<ul class="actionList">' +
          '                   <li class="action editRow" data-row-id="' + params.node.id + '"></li>' +
          deleteButton +
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
          grid: me.grid,
          editMode: false
        }
      });
    }

    function deleteRow() {
      var $button = $(this);

      var confirm = $mdDialog.confirm()
        .title('Would you like to delete the selected user?')
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(function () {
        var rowId = $button.data('rowId');

        var data = me.grid.api.getDisplayedRowAtIndex(rowId).data;

        $http.delete('/deleteUser/' + data._id).then(function (response) {

          notificationMessage.showNotificationMessage(response.data.message, response.data.messageType);

          if (response.data.success) {
            me.grid.api.purgeInfiniteCache();
          }
        });
      }, function () {
        $mdDialog.cancel();
      });
    }

    function editRow() {
      var $button = $(this);
      var rowId = $button.data('rowId');

      var data = me.grid.api.getDisplayedRowAtIndex(rowId).data;

      $mdDialog.show({
        controller: 'userDialogController',
        controllerAs: 'userDialog',
        templateUrl: 'scripts/users/userDialog.template.html',
        bindToController: true,
        locals: {
          title: 'Edit user',
          buttonLabel: 'Edit',
          grid: me.grid,
          user: data,
          editMode: true
        }
      });
    }
  }
})();
