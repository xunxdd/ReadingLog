(function () {
    /*jshint validthis: true */
    'use strict';
    var fireBaseUrl = 'https://fiery-torch-1756.firebaseio.com';

    angular.module('app.userService', ['firebase'])
        .service('appUserService', appUserService);

    appUserService.$inject = ['$q', '$localstorage','$ionicPopup'];

    function appUserService($q, $localstorage,$ionicPopup) {
        var service = this;
        var rootRef = new Firebase(fireBaseUrl);

        function saveUserInfo(userInfo) {
            var deferred = $q.defer();
            var user = rootRef.getAuth();
            if (user) {
                var userRef = rootRef.child("users").child(user.uid);
                userRef.update(userInfo, function onComplete() {
                   $ionicPopup.alert({
                        title: 'Great',
                        template: 'Thanks! You are fantastic'
                    });
                    deferred.resolve();
                });
            } else {
                deferred.reject('woo. user does not exist');
            }

            return deferred.promise;
        }

        function saveUserProfile(userObj) {
            var deferred = $q.defer();
            // Check the current user
            var user = rootRef.getAuth();
            var userRef;

            // If no current user send to register page
            if (!user) {
                deferred.reject({ error: 'user not registered' });
            }

            // Load user info
            userRef = rootRef.child('users').child(user.uid);
            userRef.once('value', function(snap) {
                var user = snap.val();
                if (!user) {

                    userRef.set(userObj, function onComplete() {
                        deferred.resolve(userObj);
                    });
                } else {
                    deferred.resolve(user);
                }
            });

            return deferred.promise;
        }

        function isInAnonymousMode(user) {
          return user.auth && user.auth.provider && user.auth.provider === 'anonymous';
        }

        function getUserInfo() {
            // Check the current user
            var deferred = $q.defer();
            var user = rootRef.getAuth();
            var userRef;
            if (!user) {
                deferred.reject('user not authenticated');
                return deferred.promise;
            }

            if(user.auth && user.auth.provider && user.auth.provider === 'anonymous'){
                deferred.resolve(user);
            } else {
              // Load user info
              userRef = rootRef.child('users').child(user.uid);
              userRef.once('value', function (snap) {
                  var user = snap.val();
                  if (!user) {
                      deferred.resolve(null);
                  }

                  deferred.resolve(user||null);

              });
            }

            return deferred.promise;
        }

        function saveUserDataOnLogin(data) {
            var deferred = $q.defer();
            var userInfoPromise = getUserInfo();
            userInfoPromise.then(function (d) {
                if (d !== null) {
                    deferred.resolve(d);
                    return deferred;
                } else {
                    return saveUserProfile(data);
                }
            });

            return deferred.promise;
        }

        service.setDefaultAvartar = function (user) {
          if (user && user.avartar && user.avartar.indexOf('data') >= 0){
            user.avartar ='icon.png';
          }
        };
        service.saveCustomUserDataAndSetUser = function (user) {
            return saveUserDataOnLogin(user);
        };

        service.getUserInfo = getUserInfo;

        service.saveUserInfo = function (userInfo) {
            return saveUserInfo(userInfo);
        };

        service.storeUserInfoToLocal = function (userObj) {
            $localstorage.setObject('currentuser', userObj);
        };

        service.isUserAuthenticated = function () {
            var user = rootRef.getAuth();
            return user !== null;
        };

        service.isInAnonymousMode = isInAnonymousMode;

    }
})();
