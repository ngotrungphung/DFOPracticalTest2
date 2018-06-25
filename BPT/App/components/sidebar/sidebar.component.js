(function () {
    'use strict';
    var baseUrl = $("base").first().attr("href");
    angular
        .module('BPT.components')
        .component('sidebarComponent', {
            controller: sidebarController,
            controllerAs: 'vm',
            templateUrl: baseUrl + 'app/components/sidebar/sidebar.tpl.html'
        });

    sidebarController.$inject = [];

    function sidebarController() {
        var vm = this;

        vm.$onInit = activate;

        function activate() {
        }
    }
})();