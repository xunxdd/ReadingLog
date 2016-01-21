(function () {
    /*jshint validthis: true */
    'use strict';

    angular.module('app.feedbackService', ['firebase'])
        .service('appFeedbackService', appFeedbackService);

    appFeedbackService.$inject = ['$q'];

    function appFeedbackService($q) {
        var service = this,
            date = new Date(),
            timeStramp = date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear(),
            fireBaseUrl = 'https://fiery-torch-1756.firebaseio.com/feedbacks' + timeStramp,
            rootRef = new Firebase(fireBaseUrl);
        
        service.addFeedback = function (feedback) {
            var deferred = $q.defer();
            feedback.platform = log_currentPlatform;
            feedback.platformVersion = log_currentPlatformVersion;
            rootRef.push(feedback, function () {
                deferred.resolve();
            });

            return deferred.promise;
        };
  
    }
})();