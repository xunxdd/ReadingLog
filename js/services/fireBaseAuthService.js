(function () {
    /*jshint validthis: true */
    'use strict';
    var fireBaseUrl = 'https://fiery-torch-1756.firebaseio.com';

    angular.module('app.fireBaseAuthService', ['firebase'])
        .service('appFireBaseAuthService', appFireBaseAuthService);

    appFireBaseAuthService.$inject = ['$q', '$rootScope',  '$ionicHistory', '$timeout'];

    function appFireBaseAuthService($q, $rootScope, $ionicHistory, $timeout) {
        var service = this,
            rootRef = new Firebase(fireBaseUrl);

        // Handle third party login providers
        // returns a promise
        function thirdPartyLogin(provider) {
            var deferred = $q.defer();

            rootRef.authWithOAuthPopup(provider, function (err, user) {
                if (err) {
                    deferred.reject(err);
                }

                if (user) {
                    deferred.resolve(user);
                }
            });

            return deferred.promise;
        }

        // Handle Email/Password login
        // returns a promise
        function authWithPassword(userObj) {
            var deferred = $q.defer();
            rootRef.authWithPassword(userObj, function onAuth(err, user) {
                if (err) {
                    deferred.reject(err);
                }

                if (user) {
                    deferred.resolve(user);
                }

            });

            return deferred.promise;
        }

      function authAnonymously() {
        var deferred = $q.defer();
        rootRef.authAnonymously(function (err, authData) {

          if (authData) {
            deferred.resolve(authData);
          }

          if (err) {
            deferred.reject(err);
          }
        },{
            remember: "sessionOnly"
        });

        return deferred.promise;
      }

      // create a user but not login
        // returns a promsie
      function createUser(userObj) {
            var deferred = $q.defer();
            rootRef.createUser(userObj, function (err) {

                if (!err) {
                    deferred.resolve();
                } else {
                    deferred.reject(err);
                }

            });

            return deferred.promise;
        }

        // Create a user and then login in
        // returns a promise
        function createUserAndLogin(userObj) {
            return createUser(userObj)
                .then(function () {
                    return authWithPassword(userObj);
                });
        }

        function resetPassword(user) {
            var deferred = $q.defer();
            rootRef.resetPassword(user, function (error) {

                if (error === null) {
                    deferred.resolve("Password reset email sent successfully");
                } else {
                    deferred.reject(error);
                }
            });

            return deferred.promise;
        }

        service.logIn = function (user) {
            return authWithPassword(user);
        };

        service.signUpAndLogin = function (user) {
            return createUserAndLogin(user);
        };

        service.signOut = function () {
            rootRef.unauth();
            service.clearCache();
        };

        service.clearCache = function() {
          $timeout(function () {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
          }, 30);

        };

        service.resetPassword = function (user) {
            return resetPassword(user);
        };

        service.facebookLogin = function () {
            return thirdPartyLogin('facebook');
        };

        service.googleLogin = function () {
            return thirdPartyLogin('google');
        };

        service.authAnonymously = authAnonymously;

    }
})();
