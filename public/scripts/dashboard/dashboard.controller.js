'use strict';

(function () {
  angular.module("trackYourPackage")
    .controller('dashboardController', dashboardController);

  dashboardController.$inject = ['trackYourPackageService', 'user', '$state', '$stateRegistry', '$transitions', '$scope'];
  function dashboardController(trackYourPackageService, user, $state, $stateRegistry, $transitions, $scope) {
    var me = this;

    me.$onInit = function () {
      trackYourPackageService.setMenu(user.menu);
      trackYourPackageService.setUserDetails(user.details);

      $scope.pageTitle = _.capitalize($state.current.name);

      addSpecialStates();

      $transitions.onSuccess({}, function(trans){
        var currentState = trans.router.stateService.current;

        $scope.pageTitle = _.capitalize(currentState.name);
      });
    };

    /**
     * Build the special routes based on the user role
     * @returns {void}
     */
    function addSpecialStates() {
      switch (user.role) {
        case 'admin':
          var statisticsState = {
            name: 'statistics',
            url: '/statistics',
            parent: 'dashboard',
            templateUrl: 'scripts/statistics/statistics.template.html',
            controller: 'statisticsController'
          };
          var usersState = {
            name: 'users',
            url: '/users',
            parent: 'dashboard',
            templateUrl: 'scripts/users/users.template.html',
            controller: 'usersController'
          };

          if (_.isEmpty($stateRegistry.get('statistics')) && _.isEmpty($stateRegistry.get('users'))) {
            $stateRegistry.register(statisticsState);
            $stateRegistry.register(usersState);
          }
          break;
        case 'courier':
          if (!_.isEmpty($stateRegistry.get('statistics')) && !_.isEmpty($stateRegistry.get('users'))) {
            $stateRegistry.deregister('statistics');
            $stateRegistry.deregister('users');
          }
          break;
        case 'superadmin':
          break;
      }
    }
  }
})();
