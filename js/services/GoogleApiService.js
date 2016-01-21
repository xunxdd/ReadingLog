(function () {
    /*jshint validthis: true */
    'use strict';
    var googleBooApiUrl = 'https://www.googleapis.com/books/v1/volumes';

    angular.module('app.GoogleApiService', [])
        .service('GoogleApiService', GoogleApiService);

    GoogleApiService.$inject = ['$http', '$q', 'appGlobalConfigService'];

    function GoogleApiService($http, $q, appGlobalConfigService) {
        var service = this;
        var GoogleApiSearchType = appGlobalConfigService.constants.GoogleApiSearchType;

        var getUrl = function (searchType, param) {
            var url = "";
            switch (searchType) {
                case GoogleApiSearchType.isbn:
                    url = googleBooApiUrl + '?q=isbn:' + param;
                    break;
                case GoogleApiSearchType.title:
                    url = googleBooApiUrl + '?q=' + param;
                    break;
            }

            return url;
        };

        var getPromise = function (url) {
            var response = $q.defer();
            $http.get(url).then(function (res) {
                response.resolve(res.data);
            });
            return response.promise;
        };
        service.searchTitleOnly = function (query) {
            var url = getUrl(GoogleApiSearchType.title, query);
            url += '&maxResults=10&fields=items(volumeInfo)&orderBy=relevance';
            return getPromise(url);
        };

        service.search = function (searchType, query) {
            var response = $q.defer(),
                url = getUrl(searchType, query);

            url += '&maxResults=1&fields=items%2FvolumeInfo&orderBy=relevance';

            $http.get(url).then(function (res) {
                response.resolve(res.data);

            });
            return response.promise;
        };

        service.getBookInfo = function (bookItem) {
            var info = bookItem.volumeInfo;
            var bookInfo = {
                title: info.title,
                link: info.infoLink,
                smThumbnail: info.imageLinks && info.imageLinks.smallThumbnail ? info.imageLinks.smallThumbnail : 'img/image-missing-md.png',
                description: info.description && info.description.length > 500?
                              info.description.substring(0,500) + '...' : info.description,
                previewLink: info.previewLink,
                authors: info.authors
            };
            return bookInfo;
        };
    }

})();
