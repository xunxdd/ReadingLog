(function () {
    /*jshint validthis: true */
    'use strict';

    angular.module('app.stopWatch', [])
        .controller('appStopWatch', stopWatch);

    stopWatch.$inject = ['$scope'];

    function stopWatch($scope) {
        var vm = this;
        vm.startTimer = function () {
            if ($scope.timerPaused) {
                $scope.$broadcast('timer-resume');
            } else {
                $scope.$broadcast('timer-start');
            }
            $scope.timerRunning = true;
        };
        vm.stopTimer = function () {
            $scope.$broadcast('timer-stop');
            $scope.timerPaused = true;
            $scope.timerRunning = false;
        };

        vm.resetTimer = function () {
            $scope.$broadcast('timer-reset');
            $scope.timerRunning = false;
        };
        $scope.$on('timer-stopped', function (event, args) {
            vm.timeInfo = args;
        });
        vm.closeStopWatchModal = function () {
            vm.stopTimer();
            $scope.stopWatchModal.hide();
        };

        vm.setTimeInfo = function () {
            vm.stopTimer();
            var min = Math.ceil(vm.timeInfo.seconds / 60) + vm.timeInfo.minutes;
            $scope.setReadingTimeInfo(min, vm.timeInfo.hours);
            vm.closeStopWatchModal();
        };
    }
})();