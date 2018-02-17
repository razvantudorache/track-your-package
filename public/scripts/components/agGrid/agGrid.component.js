'use strict';

(function () {
  angular.module('trackYourPackage')
    .component('agGrid', {
      templateUrl: 'scripts/components/agGrid/agGrid.template.html',
      controller: agGridController,
      bindings: {
        gridColumns: "<",
        gridProperties: "<"
      }
    });

  agGridController.$inject = ['$scope', '$http'];
  function agGridController ($scope, $http) {
    var me = this;

    me.$onInit = function () {
      var defaultGridOptions = {
        columnDefs: me.gridColumns,
        onGridReady: onGridReadyHandler,
        animateRows: true,
        rowSelection: 'single',
        suppressContextMenu: true,
        suppressMenuHide: true,
        enableSorting: true,
        enableServerSideSorting: true,
        enableFilter: true,
        enableServerSideFilter: true,
        floatingFilter: false,
        cacheOverflowSize: 2,
        rowModelType: 'infinite',
        paginationPageSize: 20,
        rowBuffer: 0,
        maxConcurrentDatasourceRequests: 2,
        infiniteInitialRowCount: 1,
        maxBlocksInCache: 2,
        cacheBlockSize: 20
      };

      // $scope.gridOptions = _.merge(defaultGridOptions, me.gridProperties.customGridOptions);
      $scope.gridOptions = defaultGridOptions;

    };

    /**
     * Handler when the grid is ready
     */
    function onGridReadyHandler() {
      var dataSource = {
        rowCount: null,
        getRows: requestGridData
      };

      $scope.gridOptions.api.setDatasource(dataSource);
      $scope.gridOptions.api.sizeColumnsToFit();
    }

    /**
     * Get data from the server
     */
    function requestGridData() {
      $http.get(me.gridProperties.url).then(function (result) {
      })
    }

  }
}());
