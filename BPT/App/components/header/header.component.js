(function () {
    'use strict';
    var baseUrl = $("base").first().attr("href");

    function headerController(menuService,  authService, $scope, $rootScope, $window, revenueService) {
        var vm = this;

        function activate() { 
            $rootScope.$on('revenueChange', function (o, e) {
                if (e.selectedTimeLine && e.selectedYear && e.selectedFundCenter) {
                    revenueService.getHeaderInfo(e.selectedYear, e.selectedFundCenter, e.selectedTimeLine).then(function (respnse) {
                        vm.headerdata = {
                            headerRevenue: respnse.data.statistic.TotalCurrencyRevenue,
                            headerDE: respnse.data.statistic.PercentDE,
                            headerDB: respnse.data.statistic.TotalCurrencyRevenueDirectPercent
                        }
                    })
                } else {
                    vm.headerdata = null;
                }
            });
            //revenueService.getHeaderInfo(2018, 13, 1).then(function (respnse) {
            //    vm.headerdata = {
            //        headerRevenue: respnse.data.statistic.TotalCurrencyRevenue,
            //        headerDE: respnse.data.statistic.PercentDE,
            //        headerDB: respnse.data.statistic.TotalCurrencyRevenueDirectPercent
            //    }
            //})
            menuService.getMenus().then(function (data) {

                $.each(data.data, function (i, l1) {
                    var url1 = l1.URL !== null ? l1.URL.toLowerCase() : "";
                    var span = $("<span>").attr("class", "hidden-xs").html(l1.MenuName);
                    var a = $("<a>").attr({ "class": "dropdown notifications-menu", "href": baseUrl + url1 }).append(span);

                    var ulc = $("<ul>").attr("class", "dropdown-menu multi-level").attr("role", "menu")
                                .attr("aria-labelledby","dropdownMenu");
                    var li = $("<li>").attr("class", "dropdown notifications-menu").append(a).append(ulc);                    

                    $("ul#menuBPT").append(li);
                    
                    addChildMenuList(l1.ChildMenus, ulc);

                });

            });

            roleService.getRoles().then(function (response) {
                vm.roles = response.data;
            });
        }
        
        $scope.currentUser = $rootScope.currentUser;
        $rootScope.$on('authenticated', function () {
            $scope.currentUser = authService.currentUser;
        });

        authService.canSwitchRole().then(function (response) {
            vm.canSwitchRole = response.data;
        });

        vm.switchRole = function (roleId) {
            authService.switchRole(roleId).then(function () {                                
                $window.location.reload(true);
            });
        }

        vm.$onInit = activate;

        function addChildMenuList(childMenuList, ulc) {
            $.each(childMenuList, function (j, l2) {
                var url2 = l2.URL !== null ? l2.URL.toLowerCase() : l2.URL;
                var ac = $("<a>").attr("href", baseUrl + url2).html(l2.MenuName);

                var ulv = $("<ul>").attr("class", "dropdown-menu");
                var lic = $("<li>").append(ac).append(ulv);

                if (l2.ChildMenus !== null && l2.ChildMenus.length > 0) {
                    lic.attr("class", "dropdown-submenu");
                }

                $(ulc).append(lic);

                if (l2.ChildMenus !== null && l2.ChildMenus.length > 0) {
                    addChildMenuList(l2.ChildMenus, ulv);
                }                
            });
        }
        
    }

    angular
        .module('BPT.components')
        .component('headerComponent', {
            controller: headerController,
            controllerAs: 'vm',
            templateUrl: baseUrl + 'app/components/header/header.tpl.html'
        });

    headerController.$inject = ['menuService',  'authService', '$scope', '$rootScope', '$window','revenueService'];
})();