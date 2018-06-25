(function () {
	'use strict';

	angular
		.module('BPT')
		.controller('MenuController', MenuController);

	MenuController.$inject = ['menuService', '$window', 'env'];

	function MenuController(menuService, $window, env) {
		var vm = this;

		vm.getAllMenu = getAllMenu;

		vm.goToIndex = goToIndex;
		//vm.goToCreate = goToCreate;
		//vm.goToEdit = goToEdit;
		//vm.goToDelete = goToDelete;
		vm.create = create;
		vm.update = update;
		vm.getMenu = getMenu;

		vm.initUpdateMenu = initUpdateMenu;
		vm.initDeleteMenu = initDeleteMenu;

		vm.menu = {};
		vm.rollBackEditMenu = {};

		activate();
		var baseUrl = env.baseUrl;

		function activate() {
		    getAllMenu();
		    var params = window.location.href.split('/');
		    //getMenu(params[params.length - 1]);
		}
		function getAllMenu() {
		    menuService.getAllMenu().then(function (response) {
		        vm.allMenu = response.data;
		    });
		}
		function getMenu(id) {
		    menuService.getMenu(id).then(function (response) {
		        vm.Menu = response.data;
		    });
		}
		function create(Menu) {
		    menuService.createMenu(Menu).then(function (response) {
		        if (response.data) {
		            goToIndex();
		            getAllMenu();
		        }
		    });
		}
		function update(Menu) {
		    menuService.updateMenu(Menu).then(function (response) {
		        if (response.data) {
		            goToIndex();
		            getAllMenu();
		        }
		    });
		}
		function goToDelete(id) {
		    if (confirm("Are you sure to delete?")) {
		        menuService.deleteMenu(id).then(function (response) {
		            if (response.data) {
		                goToIndex();
		                getAllMenu();
		            }
		        });
		    }
		}

		function initUpdateMenu(menu) {		    
		    angular.copy(menu, vm.rollBackEditMenu);
		    vm.editMenu = menu;
		}

		function initDeleteMenu(menu) {
		    vm.deleteMenu = menu;
		}

		function cancelEdit(user) {
		    angular.copy(vm.rollBackEditUser, user);
		}


		function goToIndex() {
		    $window.location.href = baseUrl + '#/home/menu';
		}
		function goToCreate() {
		    $window.location.href = baseUrl + '#/home/menu/create';
		}
		function goToEdit(id) {
		    $window.location.href = baseUrl + '#/home/menu/edit/' + id;
		}
	}
})();