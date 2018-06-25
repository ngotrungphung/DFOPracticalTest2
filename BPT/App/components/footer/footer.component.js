(function () {
    'use strict';
    var baseUrl = $("base").first().attr("href");

    angular
        .module('BPT.components')
        .component('footerComponent', {
            controller: footerController,
            controllerAs: 'vm',
            templateUrl: baseUrl + 'app/components/footer/footer.tpl.html'
        });

    footerController.$inject = [];

    function footerController() {
        var vm = this;

        vm.$onInit = activate;

        function activate() {
        }
    }
})();