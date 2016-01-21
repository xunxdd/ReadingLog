(function () {
    /*jshint validthis: true */
    'use strict';

    angular.module('app.emailService', [])
        .service('appEmailService', appEmailService);

    appEmailService.$inject = ['$q', '$http'];

    function appEmailService($q, $http) {
        var emailUrl = 'http://rlmail.azurewebsites.net/api/email';

        function sendEmail(data) {
            var deferred = $q.defer(),
                dataRequest=transformRequest(data);
            $http({
                url: emailUrl,
                method: "POST",
                data: dataRequest,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (data) {
                   deferred.resolve(data);
               });
            return deferred.promise;
        }

        return {
            sendEmail: sendEmail
        };
 
    }

    function transformRequest(obj) {
        var str = [];
        for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    }
})();