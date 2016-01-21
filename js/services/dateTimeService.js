(function () {
    /*jshint validthis: true */
    'use strict';

    angular.module('app.dateTimeService', [])
        .service('appDateTimeService', appDateTimeService);

    function appDateTimeService() {
        var service = this,
            maxWeeks = 12,
            maxMonths = 6;

        function formatMMDDYY(date) {
            return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString().substring(2, 4);
        }

        function getTimeUnitName(index, date, unitName) {
            switch (index) {
                case 0:
                    return 'This ' + unitName;
                case 1:
                    return 'Last ' + unitName;
                default:
                    return (unitName == 'week' ? 'Week' : 'Month') + ' Of ' + formatMMDDYY(date);
            }
        }

        function getLastWeekDates(earliestDate) {
            var today = new Date(),
               dayIndex = today.getDay();
            var weeks = getLastTwelveWeeks(earliestDate);
            if (weeks.length > 1) {
                return dayIndex === 0 ? weeks[0] : weeks[1]; // if today is sunday, return the latest week, otherwise last week
            }
            return null;
        }

      function getLastSevenDays() {
        var today = new Date();

        return {
            name: 'Past 7 Days',
            startDate: today.addDays(-6),
            endDate: today
        };
      }

      function getLastTwelveWeeks(earliestDate) {
            var today = new Date(),
                dayIndex = today.getDay(),
                thisSundayDate = new Date(new Date().setDate(today.getDate() - dayIndex)),
                i,
                weeks = [];

            for (i = 0; i < maxWeeks; i++) {
                var sundayTime = thisSundayDate.getTime();
                var startDate = new Date(new Date(sundayTime).setDate(thisSundayDate.getDate() - i * 7));
                var endDate= new Date( new Date(startDate.getTime()).setDate(startDate.getDate()+6));
                var didNotGetThisFar = startDate <= earliestDate;
                weeks.push({
                    name: getTimeUnitName(i, startDate, 'week'),
                    startDate: didNotGetThisFar ? earliestDate : startDate,
                    endDate: endDate > today ? today : endDate
                });
                if (didNotGetThisFar) {
                    break;
                }
            }
            return weeks;
        }

        function getLastSixMonths(earliestDate) {

            var today = new Date(),
                monthIndex = today.getMonth(),
                yearIndex = today.getFullYear(),
                i,
                months = [];
            for (i = 0; i < maxMonths; i++) {
                var thisFirstDate = new Date(yearIndex, monthIndex, 1, 0, 0, 0);
                var startDate = new Date(thisFirstDate.setMonth(monthIndex - i));
                var endDate=  new Date(new Date(startDate.getTime()).setMonth(startDate.getMonth()+1) - 1);
                var didNotGetThisFar = startDate <= earliestDate;
                months.push({
                    name: getTimeUnitName(i, startDate, 'month'),
                    startDate: didNotGetThisFar ? earliestDate : startDate,
                    endDate: endDate > today ? today : endDate
                });
                if (didNotGetThisFar) {
                    break;
                }
            }
            //console.log(months);
            return months;
        }

        service.getLastSixMonths = getLastSixMonths;
        service.getLastTwelveWeeks = getLastTwelveWeeks;
        service.getLastWeekDates = getLastWeekDates;
        service.getLastSevenDays = getLastSevenDays;

    }
})();
