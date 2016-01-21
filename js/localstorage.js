angular.module('ionic.utils', [])

.factory('$localstorage', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
          var obj = null;
          if($window.localStorage[key]) {
              try {
                obj = JSON.parse($window.localStorage[key]);
              } catch (e){
                obj = null;
                }
          }
          return obj;
        }
    };
}]);
