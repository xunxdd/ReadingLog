(function () {
    /*jshint validthis: true */
    'use strict';
    angular.module('app.bookEntry', [])
        .controller('appBookEntry', BookEntry);

    BookEntry.$inject = ['$scope'];

    function BookEntry($scope) {
        var vm = this;

        vm.closeBookEntryModal = function () {
          vm.title= '';
          vm.authorname = '';
          $scope.bookEntryModal.hide();
        };
    }

})();
