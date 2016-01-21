(function () {
  /*jshint validthis: true */
  'use strict';

  angular.module('app.accounts',[])
    .controller('appAccount', accounts);

  accounts.$inject = ['$scope', '$rootScope', '$ionicPopup', '$state', 'appFireBaseAuthService','appUserService','$localstorage'];

  function accounts($scope, $rootScope, $ionicPopup, $state, appFireBaseAuthService, appUserService,$localstorage) {

    var vm = this,
        key = 'readingLogUserList',
        currentUser = 'currentUser',
        list = $localstorage.getObject(key);

    if(!list || Object.getOwnPropertyNames(list).length === 0) {
        list =[];
        $localstorage.setObject(key, list);
    }

    vm.userList = list;
    vm.showAdd=false;

    appUserService.getUserInfo().then(function (user) {
      $localstorage.setObject(currentUser, user);
      vm.currentUserName = user? user.username : '';
      if (user === null){
        vm.useranonymous = true;
      } else {
          vm.useranonymous = appUserService.isInAnonymousMode(user);
      }
    }, function(err){
        vm.useranonymous = true;
    });

    vm.showAddAccount = function() {
      vm.showAdd = !vm.showAdd;
    };

    vm.removeAccount = function(user) {
        var i,
            index,
            userList = vm.userList,
            l = vm.userList.length;
        for (i = 0; i <l ; i++) {
            if (userList[i].username === user.username) {
              index = i;
              break;
            }
        }

        userList.splice(index, 1);
        vm.userList = userList;
        $localstorage.set(key, userList);
    };

    vm.goAnonymous = function() {
      appFireBaseAuthService.signOut();
      var promise = appFireBaseAuthService.authAnonymously();
      promise.then(function() {
        $rootScope.$broadcast('user-changed', null);
        $state.go('app.booklogform');

      }, failure);
    };

    vm.doLogin = function() {
      vm.addExistingUser = true;
      var email = vm.username.indexOf('@')>=0? vm.username : vm.username.toLowerCase() + '@readinglog.com';
      vm.email = email;
      var promise = appFireBaseAuthService.logIn({email: email, password: vm.password});
      promise.then(success, failure);
    };

    vm.switchAccount = function(user){

      if (user.username === vm.currentUserName){
        return;
      }
      vm.addExistingUser = false;
      var promise = appFireBaseAuthService.logIn({email: user.email, password: user.password});
      promise.then(success, failure);
    };

    function success(authdata) {
      appFireBaseAuthService.clearCache();
      appUserService.getUserInfo().then(function (user) {
        if (user) {
          $localstorage.setObject(currentUser, user);
          vm.currentUserName = user.username;
          if (vm.addExistingUser){
            handleAddUser(user);
          }
          $rootScope.$broadcast('user-changed', user);
          $state.go('app.booklogform');
        } else {
          failure('something went wrong');
        }
      });
    }

    function handleAddUser(user) {
      user.email = vm.email;
      user.password = vm.password;
      addToList(user, vm.userList);
      $localstorage.setObject(key, vm.userList);
      vm.username = '';
      vm.password ='';
      vm.showAdd = false;
    }

    function addToList(user, userList) {
      var userNames = [],
        i, l = vm.userList.length;

      for(i = 0; i< l; i++){
        userNames.push(userList[i].username.toLowerCase());
      }

      if (userNames.indexOf(user.username.toLocaleLowerCase())<0){
        userList.push(user);
      }
    }

    function failure(err) {
        $ionicPopup.alert({
          title: 'Sorry',
          template: 'The account information provided is not valid'
        });
    }
  }

})();
