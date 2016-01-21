(function () {
    'use strict';

    angular.module('app.bookitem', [])
        .directive('bookitem', bookItem);


    function bookItem() {
        
        return {
            restrict: 'E',
            replace: true,
            scope: {
                bookInfo:'='
            },
            templateUrl: 'views/directives/bookitem.html'
        };

    }
})();