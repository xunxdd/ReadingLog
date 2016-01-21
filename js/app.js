var debug = false;
var log_currentPlatform;
var log_currentPlatformVersion;
var isApp;
function track(event, data) {
    var date= new Date(),
        timeStramp = date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear(),
        fireBaseUrl = 'https://fiery-torch-1756.firebaseio.com/errorlogs/' +timeStramp,
        rootRef = new Firebase(fireBaseUrl);
        data.platform = log_currentPlatform;
        data.platformVersion = log_currentPlatformVersion;
        rootRef.push(data);
}

angular.module('app', [
    'ionic',
    'ionic.utils',
    'chart.js',
    'dbaq.ionTimer',
    'ionic-datepicker',
    'ionic-ratings',
    'readinglog.views',
    'app.config',
    'app.GlobalConfig',
    'app.services',
    'app.auth',
    'app.modules'
])

.config(function($provide) {
    $provide.decorator('$exceptionHandler', ['$delegate', function ($delegate) {
        return function (exception, cause) {
            $delegate(exception, cause);

            var data = {
                url: window.location.hash
            };
            if (cause) { data.cause = cause; }
            if (exception) {
                if (exception.message) { data.message = exception.message; }
                if (exception.name) { data.name = exception.name; }
                if (exception.stack) { data.stack = exception.stack; }
            }

            if (debug) {
                console.log('exception', data);
            } else {
                track('exception', data);

            }
        };
    }]);
})

.run(function ($state,$ionicPlatform,  appUserService, appFireBaseAuthService) {

    window.isMobileApp = !(window.location.origin.indexOf('http') >= 0 || window.location.origin.indexOf('https') >= 0);

    handleUserAccount();

    $ionicPlatform.ready(function () {

      $ionicPlatform.on("resume", function(event) {
        handleUserAccount();
      });

      log_currentPlatform = ionic.Platform.platform();
      log_currentPlatformVersion = ionic.Platform.version();


      if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
         StatusBar.overlaysWebView(false);
         ionic.Platform.fullScreen();
      }
      ionic.Platform.isFullScreen = true;
    });

    // Disable BACK button on home
    $ionicPlatform.registerBackButtonAction(function (event) {
        navigator.app.backHistory();
    }, 100);

    function handleUserAccount(){
      appUserService.getUserInfo().then(function (user) {
        if( user === null){
          appFireBaseAuthService.authAnonymously();
        }
      }, function () {
        appFireBaseAuthService.authAnonymously();
      });
    }
});

// catch exceptions out of angular
window.onerror = function (message, url, line, col, error) {
    var stopPropagation = debug ? false : true;
    var data = {
        url: window.location.hash
    };
    if (message) { data.message = message; }
    if (url) { data.fileName = url; }
    if (line) { data.lineNumber = line; }
    if (col) { data.columnNumber = col; }
    if (error) {
        if (error.name) { data.name = error.name; }
        if (error.stack) { data.stack = error.stack; }
    }

    if (debug) {
        console.log('exception', data);
    } else {
        track('exception', data);
    }
    return stopPropagation;
};
