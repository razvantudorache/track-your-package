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

      $transitions.onSuccess({}, function(trans){
        var currentState = trans.router.stateService.current;

        Noty.closeAll();

        $scope.pageTitle = _.capitalize(currentState.name);
      });
    };
  }
})();
