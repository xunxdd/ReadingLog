(function () {
    /*jshint validthis: true */
    'use strict';

    angular.module('app.timer', [])
        .controller('appTimer', Timer);

    Timer.$inject = ['$scope'];

    function Timer($scope) {
        var vm = this,
            defaultMinutes = 20;

        vm.closeTimerModal = function () {
            $scope.timerModal.hide();
        };

        // the timer duration in SECONDS 
        vm.minutes = 20;
        vm.duration =(vm.minutes|| defaultMinutes) *60;
        vm.setDuration = function () {
            vm.duration = (vm.minutes || defaultMinutes) * 60;
        };
        var onComplete = function () {
            // update the color to a nice green
            vm.ionTimerOpts.progressCircle.strokeColor = '#3BCC3B';
            vm.ionTimerOpts.text = {
                color: '#3BCC3B'
            };
        };

        vm.ionTimerOpts = {
            autoStart:false,
            text: {
                color: '#45ccce',
                size: '20px'
            },
            progressCircle: {
                backgroundColor: '#eaeaea', //the background color of the progress circle
                rounded: true, // true to use `round` for the stroke-line-cap properties, false to use `butt`
                clockwise: false // direction
            },
            events: {
                onComplete: onComplete,
                onStart: function () {
                },
                onPause: function (remainingSeconds) {
                    vm.timeRead = Math.ceil((remainingSeconds) / 60);
                },
                onStop: function (remainingSeconds) {
                }
            }
        };

        vm.toggleTimer = function () {
            var status = vm.ionTimerOpts.controls.status();
            if (status === 'STARTED') {
                vm.ionTimerOpts.controls.pause();
            }
            else {
                vm.ionTimerOpts.controls.start();
            }
        };

        vm.stopTimer = function () {
            vm.duration = (vm.minutes || defaultMinutes) * 60;
            vm.ionTimerOpts.controls.stop();

            // we reinit the default color
            vm.ionTimerOpts.progressCircle.strokeColor = '#45ccce';
            vm.ionTimerOpts.text = {
                color: '#45ccce'
            };
        };

        vm.setTimerInfo = function () {
            vm.ionTimerOpts.controls.pause();
            $scope.setReadingTimeInfo(vm.timeRead);
            vm.closeTimerModal();
        };

    }
})();