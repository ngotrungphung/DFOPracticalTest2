(function () {
    'use strict';

    angular
        .module('BPT')
        .factory('commonService', commonService);

    commonService.$inject = ['httpService'];

    function commonService(httpService) {

        function getListYear() {
            return httpService.get('Common/GetListYear');
        }
        function getListPlanType() {
            return httpService.get('Common/GetListPlanType');
        }
        function getListCurrency() {
            return httpService.get('Common/GetListCurrency');
        }
        function getCurrentRoleName() {
            return httpService.get('Common/GetCurrentRoleName');
        }

        var service = {
            getListYear: getListYear,
            getListPlanType: getListPlanType,
            getListCurrency:getListCurrency,
            getCurrentRoleName: getCurrentRoleName
        };
        return service;
    }
})();