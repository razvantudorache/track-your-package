'use strict';

(function () {
  angular.module('trackYourPackage')
    .component('agGrid', {
      templateUrl: 'scripts/common/components/agGrid/agGrid.template.html',
      controller: agGridController,
      bindings: {
        gridColumns: "<",
        gridProperties: "<"
      }
    });

  agGridController.$inject = ['$scope', '$http'];

  function agGridController($scope, $http) {
    var me = this;

    me.$onInit = function () {
      var defaultGridOptions = {
        columnDefs: me.gridColumns,
        onGridReady: onGridReadyHandler,
        onGridSizeChanged: onGridSizeChangedHandler,
        animateRows: true,
        rowSelection: 'single',
        suppressContextMenu: true,
        suppressMenuHide: true,
        suppressCellSelection: true,
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
     * Handler when grid resize
     */
    function onGridSizeChangedHandler() {
      $scope.gridOptions.api.sizeColumnsToFit();
    }

    /**
     * Get data from the server
     * @param params
     */
    function requestGridData(params) {
      $http.get(me.gridProperties.url, {
        params: {
          start: params.startRow,
          limit: $scope.gridOptions.paginationPageSize
        }
      }).then(function (response) {
        var results = response.data.docs;
        var total = response.data.total;

        params.successCallback(results, total);
      });
    }
  }
}());
