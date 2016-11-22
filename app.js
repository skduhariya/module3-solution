(function(){
  'use strict';

  angular.module('NarrowItDownApp',[])
  .controller('NarrowItDownController',NarrowItDownController)
  .service('MenuSearchService',MenuSearchService)
  .constant('ApiPath','https://davids-restaurant.herokuapp.com')
  .directive('foundItems',FoundItemsDirective);

  function FoundItemsDirective(){
    var ddo = {
      templateUrl:'findList.html',
      scope:{
        categories: '<',
        onRemove:'&'

      },
      controller:FoundItemsDirectiveCtrl,
      controllerAs:'menu',
      bindToController:true
    };
    return ddo;
  };

  function FoundItemsDirectiveCtrl(){
    var menu = this;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService){
    var menu = this;

    menu.itemName = "";
    menu.getResult = function(){

        var searchedData = MenuSearchService.getMatchedMenuItems(menu.itemName);
        searchedData.then(function(response){
          menu.categories = response;

        }).catch(function(error){
          alert("somthing went wrong!");

        });


    };

    menu.removeItem = function(itemIndex){
    //  menu.totalItem = MenuSearchService.menuLength;
      MenuSearchService.removeItem(itemIndex);
    };

  }

  MenuSearchService.$inject = ['$http','ApiPath'];
  function MenuSearchService($http,ApiPath){
    var service = this;
    var foundItems = [];

    service.getMatchedMenuItems = function(itemName){


      return $http({
        method:"GET",
        url:(ApiPath+"/menu_items.json")
      }).then(function(result){
        foundItems = [];
      //  console.log("foundItems:: length: ",result.data['menu_items'].length);
        var resultLength =  result.data['menu_items'].length;
          for(var i=0;i<resultLength;i++){
            var desc = result.data['menu_items'][i].description;
          //  console.log("description: ",desc);

          if(itemName.trim() !== ""){
            if(desc.toLowerCase().indexOf(itemName.toLowerCase()) !== -1){
            //  console.log("indside if ...");
              var itemList = {
                  short_name:result.data['menu_items'][i].short_name,
                  name:result.data['menu_items'][i].name,
                  description:result.data['menu_items'][i].description
              }
              foundItems.push(itemList);

            }
          }

          }
        //  console.log("foundItems: ",JSON.stringify(foundItems));
          return foundItems;
      });


    };

    service.removeItem = function(itemIndex){

      foundItems.splice(itemIndex,1);

    };

    // service.chekEmpty = function(){
    //   if(foundItems.length === 0){
    //     return true;
    //   }
    //   return false;
    // };
  }


})();
