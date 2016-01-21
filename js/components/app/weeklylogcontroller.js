(function () {
    /*jshint validthis: true */
    'use strict';

    angular
        .module('app.weeklylog', [])
        .controller('appWeeklyLog', weeklyLog);

    weeklyLog.$inject = [
        '$scope',
        '$filter',
        '$ionicPopup',
        'appFireBaseBookService',
        'appGlobalConfigService',
        'appUserService',
        'appDateTimeService',
        'appEmailService'
    ];

    /* @ngInject */
    function weeklyLog($scope, $filter, $ionicPopup, appFireBaseBookService, appGlobalConfigService, appUserService, appDateTimeService, appEmailService) {
        var vm = this,
            timeMode = {
              lastSevenDays : 'last7days',
              lastWeek : 'lastWeek'
            },
            dateFormat = 'MM/dd/yy';

        vm.isMobileApp = !(window.location.origin.indexOf('http') >= 0 || window.location.origin.indexOf('https') >= 0);
        vm.genres = appGlobalConfigService.genres;
        vm.readWays = appGlobalConfigService.readWays;
        vm.timeFrame =timeMode.lastSevenDays;

        appUserService.getUserInfo().then(function (data) {
           if (data){
              vm.username = data.username;
              vm.parentEmail = data.parentemail;
             appFireBaseBookService.getBookLogsByUser().$loaded()
               .then(onGetBooks, onError);
           }
        });

        function reSetLogs(mode) {
          if (mode === vm.timeFrame){
            return;
          }
          setLogs(mode);
        }

        function setLogs(mode) {
          var lastWeek,
              startDate,
              today = new Date(),
              dayIndex = today.getDay(),
              lastSevenDays;

          vm.timeFrame = mode;
          if (mode === timeMode.lastWeek && vm.earliestDate) {
            lastWeek = appDateTimeService.getLastWeekDates(vm.earliestDate);

            if (lastWeek){
              startDate = dayIndex===0 ? lastWeek.startDate.addDays(-6) :  lastWeek.startDate.addDays(1);
              vm.timeDescription = 'Week Of ' + $filter('date')(startDate, dateFormat);
            }
          } else {
              lastSevenDays = appDateTimeService.getLastSevenDays();
              startDate = lastSevenDays.startDate;
              vm.timeDescription =$filter('date')(startDate, dateFormat)  + ' to ' +
                                  $filter('date')(lastSevenDays.endDate, dateFormat);
          }

          setSevenDaysBookLogs(startDate, vm.books || []);
        }

        function setSevenDaysBookLogs(startDate, books) {
            var i, d,
                booksReadByDay=[],
                booksReadWeekly =[],
                daysOfWeek =['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
                totalMinutes= 0,
                dayIndex;

            vm.booklogs = books;

            for (i = 0; i < 7 ; i++) {
              d = startDate.addDays(i);
              if (d >= new Date()) {
                break;
              }
              dayIndex = d.getDay();
              booksReadByDay =getBooksOfTheDay(books,d);
              if (booksReadByDay.length){
                totalMinutes += getTotalMinutes(booksReadByDay);
              }
              booksReadByDay = booksReadByDay.map(bookMap);
              if (booksReadByDay.length === 0) {
                booksReadByDay.push({ title: '', nonStarsArr: 5, starsArr:0 });
              }
              booksReadWeekly.push({
                name: daysOfWeek[dayIndex],
                date: $filter('date')(d, dateFormat),
                books: booksReadByDay });
            }
            vm.booksReadWeekly = booksReadWeekly;
            vm.totalminutes = totalMinutes;
          }

        function onGetBooks(items) {
            var books = items;
            if (books && books.length){
                var earliestDate = new Date(items[0].dateRead);
                vm.earliestDate = earliestDate;
                vm.books = items;
                setLogs(vm.timeFrame);
            }
        }

        function getBooksOfTheDay(books, d) {
            return books.filter(function (book) {
                return new Date(book.dateRead).setHours(0, 0, 0, 0) === d.setHours(0, 0, 0, 0);
            });
        }

        function getTotalMinutes(books) {
            var timeRead = 0,
                l = books? books.length : 0,
                i;

            for(i = 0; i<l; i++){
              timeRead += books[i].timeRead;
            }
            return timeRead;
        }

        function bookMap(itm){

            var readWay=itm.readingSel? findItem(vm.readWays,itm.readingSel) : vm.readWays;
            itm.howIRead =readWay? readWay.name : vm.readWays[0].name;
            itm.starsArr = new Array(itm.rating);
            itm.nonStarsArr = new Array(5 - itm.rating);
            itm.authors = appFireBaseBookService.getBookAuthors(itm.authors);
            return itm;
        }

        function findItem(arry, val){
            var founds= arry.filter(function (arritm) {
                return findObject(arritm, val);
            });
            return founds.length>0?founds[0]:arry[0];
       }

       function findObject(itm, val) {
            return itm.value === val;
       }
        function onError(error) {
            throw error.message;
        }

        vm.sendEmail = function () {
            if (vm.parentEmail && vm.parentEmail.length) {
                var body = document.getElementById('print-log').innerHTML;
                body = body.replace(/img/g, 'http://readinglogapp.net/img');
                appEmailService.sendEmail({
                    MailTo: vm.parentEmail,
                    Subject: "Weekly Reading Report for " + vm.username,
                    Body: body
                }).then(function () {
                    sendingEmailComplete($ionicPopup);
                });
            }
        };

        function sendingEmailComplete($ionicPopup) {
             $ionicPopup.alert({
                    title: 'Email sent',
                    template: 'It may take a minute or 2 reaching your inbox. Try not to let it run into your spam box :)'
            });
        }

      vm.getLogFor7Days = function() {
          reSetLogs(timeMode.lastSevenDays);
      };

      vm.getLogForLastWeek = function() {
        reSetLogs(timeMode.lastWeek);
      };

    }

})();
