(function () {
    'use strict';

    angular.module('app.config', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

      .state('auth', {
          url: "/auth",
          templateUrl: "views/auth/auth.html",
          abstract: true
      })

      .state('auth.welcome', {
          url: '/welcome',
          templateUrl: "views/auth/welcome.html",
          controller: 'appWelcome as welcome'
      })

      .state('auth.login', {
          url: '/login',
          templateUrl: "views/auth/login.html",
          controller: 'appLogin as login'
      })

      .state('auth.signup', {
          url: '/signup',
          templateUrl: "views/auth/signup.html",
          controller: 'appSignup as signup'
      })

      .state('auth.forgot-password', {
          url: '/forgot-password',
          templateUrl: "views/auth/forgot-password.html",
          controller: 'appForgetPassword as forgetPassword'
      })
      .state('auth.logout', {
          url: '/logout',
          controller: 'appLogout as logout',
          templateUrl: "views/auth/logout.html"
      })

      .state('app', {
          url: "/app",
          abstract: true,
          templateUrl: "views/app/side-menu.html",
          controller: 'appSideMenu as sidemenu',
          authRequired: true,
          resolve: {
              user: function (appUserService) {
                  return appUserService.getUserInfo();
              }
          }
      })

     .state('app.booklogform', {
         url: "/booklogform/:edit",
         views: {
             'menuContent': {
                 templateUrl: "views/app/readnow.html",
                 controller: 'appReadNow as readNow'
             }
         },
         authRequired: true
     })
      .state('app.stats', {
          url: "/stats",
          views: {
              'menuContent': {
                  templateUrl: "views/app/stats.html",
                  controller: 'appStats as stats'
              }
          }
      })
     .state('app.viewall', {
         url: "/viewall/all",
         views: {
             'menuContent': {
                 templateUrl: "views/app/viewall.html",
                 controller: 'appViewAll as viewall'
             }
         }
     })
     .state('app.viewgenres', {
         url: "/viewgenres",
         views: {
             'menuContent': {
                 templateUrl: "views/app/genre.html",
                 controller: 'appViewGenres as viewgenres'
             }
         }
     })
    .state('app.booksbygenre', {
        url: "/viewall/:genreId",
        views: {
            'menuContent': {
                templateUrl: "views/app/viewall.html",
                controller: 'appViewAll as viewall'
            }
        }
    })
    .state('app.weeklylog', {
        url: "/weeklylog",
        views: {
            'menuContent': {
                templateUrl: "views/app/weeklylog.html",
                controller: 'appWeeklyLog as weeklylog'
            }
        }
    })

    .state('app.settings', {
        url: "/settings",
        views: {
            'menuContent': {
                templateUrl: "views/app/settings.html",
                controller: 'appSettings as settings'
            }
        }
    })

    .state('app.feedback', {
        url: "/feedback",
        views: {
            'menuContent': {
                templateUrl: "views/app/feedback.html",
                controller: 'appFeedback as feedback'
            }
        }
    });

        $urlRouterProvider.otherwise('/auth/welcome');
    });
})();