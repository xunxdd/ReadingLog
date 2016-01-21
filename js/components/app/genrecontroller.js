(function () {
    /*jshint validthis: true */
    'use strict';

    angular.module('app.viewGenres',[])
        .controller('appViewGenres', viewGenres);

    viewGenres.$inject = ['$scope', 'appGlobalConfigService'];

    function viewGenres($scope, appGlobalConfigService) {

        var vm = this,
            genres = appGlobalConfigService.genres;
        
        vm.genres = genres;
    }

})();