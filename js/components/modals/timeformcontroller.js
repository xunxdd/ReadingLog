(function() {
    /*jshint validthis: true */
    'use strict';
    angular.module('app.timeForm', [])
        .controller('appTimeForm', timeForm);

    timeForm.$inject = ['$scope'];

    function timeForm($scope) {
        var vm = this;

        vm.closeTimeFormModal = function() {
            $scope.timeFormModal.hide();
        };

        vm.datePickerCallback = function (val) {
            vm.dateSelected = val;
          //  console.log(val);
        };

        vm.setTimeInfo = function () {
            var d = vm.dateSelected ? new Date(vm.dateSelected) : new Date();
            $scope.setReadingTimeInfo(vm.minutes, 0, d);
            vm.closeTimeFormModal();
        };
    }
})();