(function () {
    /*jshint validthis: true */
    'use strict';

    angular.module('app.bookSearch', ['app.services'])
        .controller('appBookSearch', BookSearch);

    BookSearch.$inject = ['$scope', 'appGlobalConfigService', 'GoogleApiService', 'appFireBaseBookService'];

    function BookSearch($scope, appGlobalConfigService, GoogleApiService, appFireBaseBookService) {
        var vm = this,
            GoogleApiSearchType = appGlobalConfigService.constants.GoogleApiSearchType;

        vm.query = '';

        vm.closebookSearchModal = function() {
            clearSearch();
            vm.bookInfo = null;
            $scope.bookSearchModal.hide();
        };

        vm.clearSearch = function() {
            clearSearch();
        };

        var doSearchTitleOnly = ionic.debounce(function (query) {
            GoogleApiService.searchTitleOnly(query)
              .then(function (result) {
                  var items = result.items;
                  vm.searchResultTitles = items.map(function (itm) {
                      return {
                          thumbnail: itm.volumeInfo.imageLinks && itm.volumeInfo.imageLinks.smallThumbnail ?
                              itm.volumeInfo.imageLinks.smallThumbnail : 'img/missing.png',
                          title: itm.volumeInfo.title,
                          authors: appFireBaseBookService.getBookAuthors(itm.volumeInfo.authors),
                          volumeInfo: itm.volumeInfo
                      };
                  });
              });
        }, 500);

        vm.getBookTitles = function () {
            doSearchTitleOnly(vm.query);
        };

        vm.setBookTitleAndSearch = function (book) {
            vm.searchResultTitles = [];
            vm.bookInfo = GoogleApiService.getBookInfo(book);
        };

        function clearSearch() {
          vm.query ='';
          vm.searchResultTitles = [];
        }
    }

})();
