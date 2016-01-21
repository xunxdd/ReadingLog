(function () {
    /*jshint validthis: true */
    'use strict';

    angular.module('app.settings', [])
        .controller('appSettings', Settings);

    Settings.$inject = ['$rootScope', 'appUserService', '$state'];

    function Settings($rootScope,  appUserService, $state) {
        var vm = this;
        vm.showPicker = false;
        vm.avartars=[
          'animal-icon-cow.png',
          'animal-icon-crab.png',
          'animal-icon-dog.png',
          'animal-icon-donkey.png',
          'animal-icon-frog.png',
          'animal-icon-gold-fish.png',
          'animal-icon-horse.png',
          'animal-icon-jellyfish.png',
          'animal-icon-kitten-cat.png',
          'animal-icon-mouse.png',
          'animal-icon-octopus.png',
          'animal-icon-puppy-dog.png',
          'animal-icon-shark.png',
          'animal-icon-squirrel.png',
          'animal-icon-tuna-blue-fish.png'
        ];

      vm.setCurrentUserInfo = function (user) {
          vm.user = user;
      };

       appUserService.getUserInfo().then(function (user) {

         if (user === null){
           vm.useranonymous = true;
         } else {
           vm.useranonymous = appUserService.isInAnonymousMode(user);
           appUserService.setDefaultAvartar(user);
         }

         vm.setCurrentUserInfo(user);
       }, function(err) {
           vm.useranonymous = true;
       });

       vm.saveUserInfo = function () {
            var userInfo = {
                username: vm.user.username,
                avartar: vm.user.avartar || 'icon.png'
            };
            appUserService.saveUserInfo(userInfo).then(function () {
                $rootScope.$broadcast('user-changed', vm.user);
                $state.go('app.booklogform');
            });
        };

        vm.toggleImagePicker = function () {
            vm.showPicker = !vm.showPicker;
        };

        vm.setAvartar = function(avartar){
            vm.user.avartar = avartar;
            vm.showPicker = false;
        };
    }

    function findItemByValue(arr, val) {
        var obj = arr.filter(function (itm) {
            return itm.value === val;
        });

        return obj && obj.length? obj[0]: null;
    }

})();
