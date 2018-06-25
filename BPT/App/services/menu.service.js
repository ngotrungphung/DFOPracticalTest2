(function() {
    'use strict';

    angular
        .module('BPT')
        .factory('menuService', menuService);


    function menuService(httpService) {

        function getMenus() {
            return httpService.get('menu/GetAllMenusByCurrentRole');
        }

        function getAllMenu() {
            return httpService.get('menu/GetAll');
        }

        function createMenu(menu) {
            return httpService.post('menu/create', menu);
        }

        function updateMenu(menu) {
            return httpService.put('menu/update', menu);
        }

        function getMenu(id) {
            return httpService.get('menu/get/' + id);
        }

        function deleteMenu(id) {
            return httpService.remove('menu/delete/' + id);
        }

        var service = {
            getMenus: getMenus,
            getAllMenu: getAllMenu
        };

        return service;


    }

    menuService.$inject = ['httpService'];
})();