(function() {
    'use strict';

    angular
        .module('BPT')
        .factory('homeService', homeService);


    function homeService(httpService) {

        function gethomepage() {
            return httpService.get('home/GetHomepageView');
        }
        function getProcessDetail(pageUrl, timelineId, fundCenterId) {
            return httpService.get('Home/GetProcessDetail/?pageUrl=' + pageUrl + '&timelineId=' + timelineId + '&fundCenterId=' + fundCenterId);
        }
        function checkIsMyTask(pageUrl, roleName) {
            return httpService.get('Home/CheckIsMyTask/?pageUrl=' + pageUrl + '&roleName=' + roleName);
        }
        function submitData(pageUrl, timelineId, fundCenterId) {
            return httpService.post('Home/SubmitData/?pageUrl=' + pageUrl + '&timelineId=' + timelineId + '&fundCenterId=' + fundCenterId);
        }
        function rejectData(pageUrl, timelineId, fundCenterId) {
            return httpService.post('Home/RejectData/?pageUrl=' + pageUrl + '&timelineId=' + timelineId + '&fundCenterId=' + fundCenterId);
        }
        function confirmData(pageUrl, timelineId, fundCenterIds) {
            return httpService.post('Home/confirmData/?pageUrl=' + pageUrl + '&timelineId=' + timelineId + '&fundCenterIds=' + fundCenterIds);
        }
        function approveData(pageUrls, timelineId, fundCenterIds) {
            return httpService.post('Home/approveData/?pageUrls=' + pageUrls + '&timelineId=' + timelineId + '&fundCenterIds=' + fundCenterIds);
        }
        function submitListPendingTask(timelineId) {
            return httpService.post('Home/SubmitListPendingTask/?timelineId=' + timelineId);
        }
        
        var service = {
            gethomepage: gethomepage,
            getProcessDetail: getProcessDetail,
            checkIsMyTask: checkIsMyTask,
            submitData: submitData,
            rejectData: rejectData,
            confirmData: confirmData,
            approveData: approveData,
            submitListPendingTask: submitListPendingTask
        };

        return service;


    }

    homeService.$inject = ['httpService'];
})();