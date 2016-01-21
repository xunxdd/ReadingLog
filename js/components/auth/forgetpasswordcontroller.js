(function () {
    /*jshint validthis: true */
    'use strict';

    angular.module('app.forgetpassword', [])
        .controller('appForgetPassword', ForgetPassword);

    ForgetPassword.$inject = ['$scope', '$state', 'appFireBaseAuthService'];

    function ForgetPassword($scope, $state, appFireBaseAuthService) {
        var vm = this;

        function success(msg) {
            vm.msg = msg;
        }

        function failure(err) {
            vm.msg = err.toString();
        }

        vm.requestNewPassword = function () {
            var promise = appFireBaseAuthService.resetPassword(vm.user);
            promise.then(success, failure);
        };
    }

})();