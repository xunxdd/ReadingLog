(function () {
    /*jshint validthis: true */
    'use strict';

    angular.module('app.bookscan', ['app.services'])
        .controller('appBookScan', BookScan);

    BookScan.$inject = [
      '$scope'
    ];

    function BookScan($scope, $ionicPlatform, appGlobalConfigService, GoogleApiService) {
        var vm = this;
        };

})();
