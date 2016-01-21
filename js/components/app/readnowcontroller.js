(function () {
    /*jshint validthis: true */
    'use strict';

    angular
        .module('app.readnow', [])
        .controller('appReadNow', ReadNow);

    ReadNow.$inject = [
        '$scope',
        '$ionicModal',
        '$ionicPopup',
        'appFireBaseBookService',
        'appGlobalConfigService',
        '$state',
        '$stateParams',
        '$ionicHistory',
        'appUserService'
    ];

    /* @ngInject */
    function ReadNow($scope, $ionicModal, $ionicPopup, appFireBaseBookService,
        appGlobalConfigService, $state, $stateParams, $ionicHistory , appUserService) {
        var vm = this,
            modalTypes = appGlobalConfigService.constants.ModalTypes;
        vm.isMobileApp = window.isMobileApp;
        vm.isEditing = $stateParams.edit;
        vm.readingHow = 1;
        vm.genre= 'NF';
        vm.notes = '';

      setUpModals($scope, $ionicModal,appGlobalConfigService);

        appUserService.getUserInfo().then(function (user) {
          if (user === null){
            vm.useranonymous = true;
          } else {
            vm.useranonymous = appUserService.isInAnonymousMode(user);
          }
        }, function(err){
           vm.useranonymous = true;
        });

        vm.showModal = function (modalType) {
            showModalByType($scope, modalType, modalTypes);
        };

        vm.bookCategories = appGlobalConfigService.genres;
        vm.readWays = appGlobalConfigService.readWays;
        vm.modalTypes = modalTypes;

        vm.ratingsObject = {
            iconOn: 'ion-ios-star',
            iconOff: 'ion-ios-star-outline',
            iconOnColor: 'rgb(200, 200, 100)',
            iconOffColor: 'rgb(200, 100, 100)',
            rating: 0,
            minRating: 1,
            callback: function (rating) {
                vm.rating = rating;
            }
        };

        if (vm.isEditing === 'true') {
            var currentLogItemToEdit = appFireBaseBookService.getCurrentBookEdit();
            vm.readingTimeStats={
                timeRead: currentLogItemToEdit.timeRead,
                date: currentLogItemToEdit.dateRead
            };
            vm.book = {
                title: currentLogItemToEdit.title,
                authors: currentLogItemToEdit.authors,
                smThumbnail: currentLogItemToEdit.smThumbnail,
                description: currentLogItemToEdit.description
            };
            vm.authorStr =appFireBaseBookService.getBookAuthors(currentLogItemToEdit.authors);
            vm.genre= currentLogItemToEdit.genre || 'NF';
            vm.rating= currentLogItemToEdit.rating || 1;
            vm.readingHow = currentLogItemToEdit.readingSel || 1;
            vm.ratingsObject.rating = vm.rating;
            vm.notes = currentLogItemToEdit.notes || '';
        } else {
            vm.readingTimeStats = {
                timeRead: 0,
                date: new Date().toDateString()
            };
        }

        $scope.setBookInfo = function (bookInfo, title, authorName) {

          bookInfo = bookInfo || {
                title: title,
                authors: authorName
            };
            vm.book = bookInfo;
            vm.authorStr = appFireBaseBookService.getBookAuthors(bookInfo.authors);
        };

        $scope.setReadingTimeInfo = function (minute, hour, date) {
            var h = hour || 0;
            vm.readingTimeStats = {
                timeRead: (h * 60 + minute),
                date: date ? date.toDateString() : new Date().toDateString()
            };
        };

        vm.onSubmit = function () {
          var logItem;

          if (vm.book !== null && vm.book && vm.book.title && vm.book.title.length > 0 && vm.readingTimeStats !== null && vm.readingTimeStats.timeRead > 0) {
                logItem = {
                    title:  vm.book.title,
                    authors: vm.book.authors || '',
                    smThumbnail: vm.book.smThumbnail || 'img/image-missing-md.png',
                    description: appFireBaseBookService.getBookDescription(vm.book.description)  || '',
                    dateRead: vm.readingTimeStats.date || new Date(),
                    timeRead: vm.readingTimeStats.timeRead || 0,
                    genre: vm.genre || 'NF',
                    rating: vm.rating || 1,
                    readingSel: vm.readingHow || 1,
                    notes: vm.notes
                };
            }

            if (!logItem) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Please set the book title and minutes you have read',
                    template: 'You probably forgot?'
                });
                alertPopup.then(function (res) {
                });
                return false;
            }

            var promise;
            if (vm.isEditing) {
                var editItem = angular.extend(currentLogItemToEdit, logItem);
                if(typeof(editItem.authorStr) === 'undefined') {
                    editItem.authorStr ='';
                }
                promise = appFireBaseBookService.editBookLog(editItem);
            } else {
                promise = appFireBaseBookService.addBookLog(logItem);
            }

            promise.then(function (logs) {
                $ionicHistory.clearCache();
                return successAndredirectToViewAll($ionicPopup, $state);
            });

        };
    }

    function successAndredirectToViewAll($ionicPopup, $state) {
        var alertPopup = $ionicPopup.alert({
            title: 'Woo-hoo',
            template: 'Thanks! We have logged your book'
        });
        alertPopup.then(function (res) {
            $state.go('app.viewall');
        });
    }

    function getModalOptions($scope, id) {
        return {
            scope: $scope,
            backdropClickToClose: true,
            animation: 'slide-in-up',
            id:id
        };
    }

    function setUpModals($scope, $ionicModal, appGlobalConfigService) {
        var modalTypes = appGlobalConfigService.constants.ModalTypes;

        $ionicModal.fromTemplateUrl('views/modal/stopwatch.html', getModalOptions($scope, modalTypes.stopwatch)).then(function (modal) {
            $scope.stopWatchModal = modal;
        });

        $ionicModal.fromTemplateUrl('views/modal/timer.html', getModalOptions($scope, modalTypes.timer)).then(function (modal) {
            $scope.timerModal = modal;
        });

        $ionicModal.fromTemplateUrl('views/modal/timeform.html', getModalOptions($scope, modalTypes.timeform)).then(function (modal) {
            $scope.timeFormModal = modal;
        });

        $ionicModal.fromTemplateUrl('views/modal/bookscan.html', getModalOptions($scope, modalTypes.scan)).then(function (modal) {
            $scope.bookScanModal = modal;
        });

        $ionicModal.fromTemplateUrl('views/modal/booksearch.html', getModalOptions($scope, modalTypes.search)).then(function (modal) {
            $scope.bookSearchModal = modal;
        });

        $ionicModal.fromTemplateUrl('views/modal/bookentry.html', getModalOptions($scope, modalTypes.bookform)).then(function (modal) {
            $scope.bookEntryModal = modal;
        });

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.stopWatchModal.remove();
            $scope.timerModal.remove();
            $scope.timeFormModal.remove();
            $scope.bookScanModal.remove();
            $scope.bookSearchModal.remove();
            $scope.bookEntryModal.remove();
        });

        $scope.$on('modal.shown', function (event, modal) {
            switch (modal.id) {
                case modalTypes.stopwatch:
                    $scope.$broadcast('stopwatch-shown');
                    break;
                case modalTypes.timer:
                    $scope.$broadcast('timer-shown');
                    break;
            }
        });
    }

    function showModalByType($scope, modalType, modalTypes) {
        switch (modalType) {
            case modalTypes.timer:
                $scope.timerModal.show();
                break;
            case modalTypes.stopwatch:
                $scope.stopWatchModal.show();
                break;
            case modalTypes.timeform:
                $scope.timeFormModal.show();
                break;
            case modalTypes.scan:
                $scope.bookScanModal.show();
                break;
            case modalTypes.search:
                $scope.bookSearchModal.show();
                break;
            case modalTypes.bookform:
                $scope.bookEntryModal.show();
                break;
        }
    }
})();
