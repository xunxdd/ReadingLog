(function () {
    'use strict';

    angular.module('app.services', [
        'app.fireBaseBookService',
        'app.GoogleApiService',
        'app.fireBaseAuthService',
        'app.userService',
        'app.dateTimeService',
        'app.emailService',
        'app.feedbackService'
    ]);
})();