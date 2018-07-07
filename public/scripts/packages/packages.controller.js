'use strict';

(function () {
  angular.module('trackYourPackage')
    .controller('packagesController', packagesController);

  packagesController.$inject = ['$scope', '$mdDialog', 'trackYourPackageService', '$http', 'notificationMessage'];

  function packagesController($scope, $mdDialog, trackYourPackageService, $http, notificationMessage) {
    var me = this;

    me.$onInit = function () {
      defineGridColumnsAndProperties();

      // $scope.addUser = addUser;
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
          headerName: 'ID',
          field: 'packageID',
          minWidth: 150
        },
        {
          headerName: 'Status',
          field: 'status',
          minWidth: 150
        },
        {
          headerName: 'Receiver address',
          field: 'receiverAddress',
          minWidth: 150
        },
        {
          headerName: 'Receiver',
          field: 'receiver',
          minWidth: 150
        },
        {
          headerName: 'Sender address',
          field: 'senderAddress',
          minWidth: 150
        }
      ];
      me.gridProperties = {
        url: '/userList'
      };

      me.grid = null;

      // me.rowActions = {
      //   deleteRow: deleteRow,
      //   editRow: editRow
      // }
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
  }
})();
