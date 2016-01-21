(function () {
    /*jshint validthis: true */
    'use strict';

    angular.module('app.signup', [])
        .controller('appSignup', Signup);

    Signup.$inject = ['$scope', '$state', 'appFireBaseAuthService', 'appUserService'];

    function Signup($scope, $state, appFireBaseAuthService, appUserService) {
        var vm = this;

        function success(authdata) {
            appUserService.saveCustomUserDataAndSetUser(vm.user.email);
            $state.go('app.booklogform');
        }

        function failure(err) {
            vm.error = err.toString();
        }

        vm.doSignUp = function () {
            var loginPromise = appFireBaseAuthService.signUpAndLogin(vm.user);
            loginPromise.then(success, failure);
        };
    }

})();