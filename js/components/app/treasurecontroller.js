(function () {
  /*jshint validthis: true */
  'use strict';

  angular.module('app.treasure',[])
    .controller('appTreasure', treasure);

  treasure.$inject = ['$scope', 'appFireBaseBookService','appUserService'];

  function treasure($scope, appFireBaseBookService, appUserService) {

    var vm = this;

    appUserService.getUserInfo().then(function (user) {
        if(user !== null) {
          appFireBaseBookService.getBookLogsByUser().$loaded()
            .then(onGetBooks,onError);
        }
    });

    function onGetBooks(items) {
      var books = items,
          l = books.length,
          i,
          numberTicket= 1,
          numberStickers,
          numberStars,
          totalMinutes= 0,
          numberCoins,
          genre=[],
          awards = {
            // logs logged
            tickets : {
              available: 6,
              max: 20,
              base : 5,
              img: 'ticket'
            },
            // minutes read
            stickers :{
              available: 4,
              max: 10,
              base: 60,
              img: 'goodjob'
            },
            //genre
            stars: {
              available:4,
              img: 'genre'
            },
            coins: {
              available:1,
              img:'coin',
              base: 100
            }
          };

      for (i = 0; i < l; i++) {
        totalMinutes += books[i].timeRead;
        if (genre.indexOf(books[i].genre)<0) {
          genre.push(books[i].genre);
        }
      }

      numberTicket +=  Math.floor(l / awards.tickets.base);
      numberTicket = Math.min(awards.tickets.max, numberTicket);
      numberStickers = 1 + Math.floor(totalMinutes/awards.stickers.base);
      numberStars = genre.length;

      if (l > awards.coins.base) {
          numberCoins = Math.ceil(l / awards.coin.base);
      }
      vm.totalLogs = l;
      vm.toalMinutes = totalMinutes;
      vm.totalGenres = numberStars;

      vm.stars = getAwards(numberStars, awards.stars);
      vm.stickers = getAwards(numberStickers, awards.stickers);
      vm.tickets = getAwards(numberTicket, awards.tickets);
      vm.coins = getAwards(numberCoins, awards.coins);
    }

    function getAwards(total, award) {
      var i,
          stickers = [];
      for(i = 0; i< total; i++){
        stickers.push({
          img: getTicketNumber(i, award.available, award.img),
          index: i
        });
      }
      return stickers;
    }

    function getTicketNumber(i, available, imgName) {

        var ind = i % available + 1 ;

        return imgName + ind + '.png';
    }

    function onError(error) {
      throw error.message;
    }

  }

})();
