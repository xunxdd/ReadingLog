(function () {
    /*jshint validthis: true */
    'use strict';

    angular.module('app.stats', [])
        .controller('appStats', Stats);

    Stats.$inject = ['$scope', 'appFireBaseBookService', 'appGlobalConfigService', 'appDateTimeService', '$filter','appUserService'];

    /* @ngInject */
    function Stats($scope, appFireBaseBookService, appGlobalConfigService, appDateTimeService, $filter, appUserService) {

        var vm = this,
            genres = appGlobalConfigService.genres;

        vm.mode = 'weekly';


        $scope.$on('newbooklogged', function (event, books) {
            vm.allBooksRead = books;
            setChartData(books);
        });

       var logs= appFireBaseBookService.getBookLogsByUser();

       appUserService.getUserInfo().then(function (user) {
          if(user !== null) {
            appFireBaseBookService.getBookLogsByUser().$loaded()
              .then(onGetBookLogsFromFb,onError);
          }
        });

        vm.setTimeMode = function (mode) {
            vm.mode = mode;
            vm.rechart();
        };

        vm.rechart = function () {
            var timeFrame, startDate, endDate,
                allBooks = angular.copy(vm.allBooksRead),
                books, dateRead;

            if (vm.mode == 'weekly') {
                timeFrame = vm.weekselected;
            } else {
                timeFrame = vm.monthselected;
            }
            if (timeFrame) {
                startDate = timeFrame.startDate;
                endDate = timeFrame.endDate;
                books = allBooks.filter(function (itm) {
                    dateRead = new Date(itm.dateRead).setHours(0, 0, 0, 0);
                    return (dateRead >= startDate.setHours(0, 0, 0, 0) && dateRead <= endDate.setHours(0, 0, 0, 0));
                });
                setChartData(books);
            }
        };

        var arrayUnique = function (a) {
            return a.reduce(function (p, c) {
                if (p.indexOf(c) < 0) p.push(c);
                return p;
            }, []);
        };

        function getTimeReadByGenres(books) {
            var i, l = genres.length,
                genreReadingData = [];
            for (i = 0; i < l; i++) {
                var logs = getLogsInGenre(genres[i], books);
                if (logs !== null) {
                    genreReadingData.push(logs);
                }
            }

            return genreReadingData;
        }

        function getLogsInGenre(genre, books) {
            var booksInGenre = books.filter(function (itm) {
                return itm.genre == genre.value;
            });
            if (booksInGenre.length > 0) {
                var timeRead = booksInGenre.map(function (x) { return x.timeRead; });
                var totalMinutes = timeRead.reduce(function (prev, current) { return prev + current; });
                return { name: genre.value, minutes: totalMinutes };
            }

            return null;
        }

        function getTimeReadSeries(books) {
            var i, l = books.length,
               readingDates = books.map(function (x) { return new Date(x.dateRead); }),
               readingTime = [],
               beginningDate, endDate,
               timeFrame;

            readingDates = arrayUnique(readingDates);
            if (vm.mode == 'weekly') {
                timeFrame = vm.weekselected;
            } else if (vm.mode == 'monthly') {
                timeFrame = vm.monthselected;
            }
            if (timeFrame){
                beginningDate = timeFrame.startDate;
                endDate = timeFrame.endDate;
                readingDates = [beginningDate];
                var d = new Date(beginningDate.getTime());
                while (d < endDate) {
                    readingDates.push(new Date(d.setDate(d.getDate() + 1)));
                }
            }

            //console.log(readingDates);
            l = readingDates.length;
            for (i = 0; i < l; i++) {
                var dateRead = readingDates[i];

                var totalMinutes = getTotalMinutesForDate(dateRead, books);
                readingTime.push(totalMinutes);
            }

            return { dates: readingDates, time: readingTime };
        }

        function getTotalMinutesForDate(dateRead, books) {
            var totalMinutes = 0;

            var timeReads = books.filter(function (itm) {
                return new Date(itm.dateRead).setHours(0, 0, 0, 0) == dateRead.setHours(0, 0, 0, 0);
            });

            if (timeReads && timeReads.length > 0) {
                var timeRead = timeReads.map(function (x) { return x.timeRead; });
                totalMinutes = timeRead.reduce(function (prev, current) { return prev + current; });
            }
            return totalMinutes;
        }

        function onGetBookLogsFromFb(items) {
            vm.allBooksRead = items;
            var earliestDate = new Date(items[0].dateRead);
            getTimeFrames(earliestDate);
            setChartData(items);
        }

        function getTimeFrames(earliestDate) {

            vm.weeks = appDateTimeService.getLastTwelveWeeks(earliestDate);
            vm.months = appDateTimeService.getLastSixMonths(earliestDate);

            if (vm.weeks.length > 0) {
                vm.weekselected = vm.weeks[0];
            }

            if (vm.months.length>0){
                vm.monthselected = vm.months[0];
            }
        }

        function setChartData(items) {
            if (items.length === 0) {
                console.log('no books found. cannot chart');
            }

            var books = items;
            vm.books = books;
            var genreReadingData = getTimeReadByGenres(books);
            var genres = genreReadingData.map(function (x) { return x.name; });
            var values = genreReadingData.map(function (x) { return x.minutes; });
            vm.chartGenreData = { labels: genres, data:[values]};
            var timeReadSeries = getTimeReadSeries(books);
            var dates = timeReadSeries.dates.map(function (t) {
                return $filter('date')(t, 'MM/dd');
            });
            var step = Math.floor(dates.length/10);
            var datesLabels=[];
            if (step>=1){
                for (var i = 0; i< dates.length; i++){
                    if (i % step ===0){
                        datesLabels.push(dates[i]);
                    }
                }
            } else {
                datesLabels=dates;
            }
            vm.chartReadingData = { labels: datesLabels, data: [timeReadSeries.time] };
        }
        function onError(error) {
            console.log(error);
        }
    }


})();
