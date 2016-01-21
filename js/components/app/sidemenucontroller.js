(function () {
    /*jshint validthis: true */
    'use strict';

    angular
        .module('app.sidemenu', [])
        .controller('appSideMenu', AppSideMenu);


    AppSideMenu.$inject = ['$scope', 'appUserService'];

    function AppSideMenu($scope, appUserService) {
        var vm = this;

        appUserService.getUserInfo().then(function (user) {
          appUserService.setDefaultAvartar(user);
          vm.user = user;
        }, function () {
            vm.user = null;
        });

        $scope.$on('user-changed', function (event, user) {
            appUserService.setDefaultAvartar(user);
            vm.user = user;
        });



    }

})();
