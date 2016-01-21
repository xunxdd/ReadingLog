(function() {
    /*jshint validthis: true */
    'use strict';
    var fireBaseUrl = 'https://fiery-torch-1756.firebaseio.com/';

    angular.module('app.fireBaseBookService', ['firebase'])
        .service('appFireBaseBookService', appFireBaseBookService);

    appFireBaseBookService.$inject = ['$q', '$firebaseArray'];

    function appFireBaseBookService($q, $firebaseArray) {
        var service = this,
            rootRef = new Firebase(fireBaseUrl),
            currentLogItemToEdit = {};

        service.getBookLogsByUser = function () {
            var user = rootRef.getAuth();
            if (!user) {
              return null;
            }
            var itemsRef = new Firebase(fireBaseUrl + "booklogs");
            var userItemsRef = itemsRef.child(user.uid);
            return $firebaseArray(userItemsRef);
        };

        service.addBookLog = function (logItem) {
            var deferred = $q.defer();
            var logs = service.getBookLogsByUser();
            logs.$add(logItem).then(function(firebaseRef) {
                deferred.resolve(logs);
            });
            return deferred.promise;
        };

        service.editBookLog = function (logItem) {
            var deferred = $q.defer();
            service.getBookLogsByUser().$loaded()
                .then(function (logs) {
                    var itm = logs.$getRecord(logItem.$id);

                    if (itm) {
                        logs.$save(angular.extend(itm,logItem)).then(function (ref) {
                            deferred.resolve(logs);
                        }, onError);
                    }
                 },
                onError);
            return deferred.promise;
        };

        service.removeBookLog = function (logItem) {
            var deferred = $q.defer();
            service.getBookLogsByUser().$loaded()
                .then(function (logs) {
                    var itm = logs.$getRecord(logItem.$id);
                    logs.$remove(itm).then(function (ref) {
                        deferred.resolve(ref);
                    });
                },
                onError);
            return deferred.promise;
        };

        service.setCurrentBookEdit = function (logItem) {
            currentLogItemToEdit = logItem;
        };

        service.getCurrentBookEdit = function () {
            return currentLogItemToEdit;
        };
        service.getBookDescription = function (description) {
          return description && description.length > 500?
                 description.substring(0,500) + '...' : description;
        };
        service.getBookAuthors = function (authors) {
            return authors && Array.isArray(authors)? authors.join(',') : authors;
        };

        function onError(error) {
            var deferred = $q.defer();
            deferred.reject(error);
            return deferred.promise;
        }

        function onRemoveBook(logs, logItem) {
            var deferred = $q.defer();
            var itm = logs.$getRecord(logItem.$id);
            if (itm) {
                logs.$remove(itm).then(function (ref) {
                    deferred.resolve(ref);
                }, onError);
                return deferred.promise;
            }
            deferred.reject({ message: 'item not found' });

            return deferred.promise;
        }



    }
})();
