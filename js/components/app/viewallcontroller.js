(function () {
    /*jshint validthis: true */
    'use strict';

    angular.module('app.viewall', ['jett.ionic.filter.bar'])
        .controller('appViewAll', viewAll);

    viewAll.$inject = ['$scope', '$state', '$stateParams', 'appFireBaseBookService', 'appGlobalConfigService', '$ionicFilterBar', '$timeout', '$ionicHistory'];

    function viewAll($scope, $state, $stateParams, appFireBaseBookService, appGlobalConfigService, $ionicFilterBar, $timeout, $ionicHistory) {

        var vm = this,
            genres = appGlobalConfigService.genres,
            readWays = appGlobalConfigService.readWays,
            genreId = $stateParams.genreId;

        $scope.$on('newbooklogged', function (event, books) {
            vm.allBooksRead = books;
            try{
                onGetBooks(books);
            } catch (err) {
                vm.error = err.message;
            }
        });

       function onGetBooks(items) {
            var books = items;

            if (genreId && genreId.length) {
                vm.genreId = genreId;
                var grs = genres.filter(function (arritm) {
                    return findObject(arritm, vm.genreId);
                });
                vm.genreName = grs && grs.length ? grs[0].name : '';

                books = items.filter(function (itm) {
                    return itm.genre === genreId;
                });
            }
            angular.forEach(books, function (itm) {
                setItemGenreAndReadManner(itm);
            });

            vm.booklogs = books;
        }

        function onError(error) {
            throw error.message;
        }

        function setItemGenreAndReadManner(itm) {
            var ways = readWays.filter(function (arritm) {
                return findObject(arritm, itm.readingSel);
            });
            var grs = genres.filter(function (arritm) {
                return findObject(arritm, itm.genre);
            });
            itm.authorStr = appFireBaseBookService.getBookAuthors(itm.authors);
            itm.timestamp = new Date(itm.dateRead);
            itm.readMannerName = ways && ways.length ? ways[0].name : 'Read By Myself';
            itm.genreName = grs && grs.length ? grs[0].name : 'Non Fiction';
        }

        function findObject(itm, val) {
            return itm.value === val;
        }

        appFireBaseBookService.getBookLogsByUser().$loaded()
                .then(onGetBooks,onError);

        vm.showFilterBar = function () {
            vm.filterBarInstance = $ionicFilterBar.show({
                items: vm.booklogs,
                update: function (filteredItems, filterText) {
                    vm.booklogs = filteredItems;
               }
            });
        };
        vm.editLog = function (itm) {
            $ionicHistory.clearCache();
            appFireBaseBookService.setCurrentBookEdit(itm);
            $state.go('app.booklogform', { edit: true }, { reload: true });
        };
        vm.removeLog = function (itm) {
            appFireBaseBookService.removeBookLog(itm).then(function (itm) {
            }, onError);
        };
    }

})();
