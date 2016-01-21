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

      .state('app', {
          url: "/app",
          abstract: true,
          templateUrl: "views/app/side-menu.html",
          controller: 'appSideMenu as sidemenu'
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
    .state('app.accounts', {
      url: "/accounts",
      views: {
        'menuContent': {
          templateUrl: "views/app/account.html",
          controller: 'appAccount as account'
        }
      }
    })
    .state('app.treasure', {
      url: "/treasures",
      views: {
        'menuContent': {
          templateUrl: "views/app/treasurebox.html",
          controller: 'appTreasure as treasure'
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
    });

      $urlRouterProvider.otherwise('app/booklogform/');
    });
})();
