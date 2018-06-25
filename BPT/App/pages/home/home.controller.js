(function() {
    'use strict';

    angular
        .module('BPT')
        .controller('HomeController', HomeController);

    //HomeController.$inject = ['userService'];
    HomeController.$inject = ['homeService', 'commonService', 'budgetOwnerService', '$q'];

    function HomeController(homeService, commonService, budgetOwnerService, $q) {
        var vm = this;
        vm.timelineList = [];
        vm.myProcessStatusList = [];
        vm.myPendingProcessStatusList = [];
        vm.mySubmittedProcessStatusList = [];
        vm.myCompletedProcessStatusList = [];
        vm.adminProcessMgm = {};
        vm.year;
        vm.submitPendingTasks = submitPendingTasks;
        activate();

        function activate() {
            //userService.getUsers();
            vm.year = (new Date()).getFullYear();
            vm.currentUser = currenrUser;
            gethomepage();
        }

        function submitPendingTasks() {
            vm.openedTimeline = vm.timelineList.find(function(tl) {
                var result = tl.Status === "Open";
                return result;
            });
            homeService.submitListPendingTask(vm.openedTimeline.Id).then(function (response) {
                activate();
            });
        }

        function gethomepage() {
            vm.roleName = vm.currentUser.Role.RoleName;

            homeService.gethomepage().then(function (response) {
                vm.timelineList = response.data.TimelineList;
                vm.myProcessStatusList = response.data.MyProcessStatusList;
                vm.adminProcessMgm = response.data.AdminProcessMgm;
                var openTimeline = vm.timelineList.filter(function (timeline) { return timeline.Status === 'Open'; });
                if (openTimeline.length > 0) {
                    budgetOwnerService.getBudgetOwnersByNTID(vm.currentUser.NTID, openTimeline[0].Id).then(function (response) {
                        vm.departments = response.data;
                        vm.isHavingPendingTasks = false;
                        if (vm.myProcessStatusList !== null && vm.myProcessStatusList !== undefined) {

                            vm.myPendingProcessStatusList = vm.myProcessStatusList.filter(function(task) {
                                var result;
                                switch (vm.roleName) {
                                case "DH":
                                    result = task.IsActive && (task.Status === "Pending" || task.Status === "Rejected") && task.RoleName.startsWith(vm.roleName) && vm.departments.filter(function (fundcenter) { return fundcenter.FundName === task.FundCenterName; }).length > 0;
                                    break;
                                case "HRL":
                                    result = task.IsActive && (task.Status === "Pending" || task.Status === "Rejected") && task.RoleName.startsWith(vm.roleName) && vm.departments.filter(function (fundcenter) { return fundcenter.FundName === task.FundCenterName; }).length > 0;
                                    break;
                                default:
                                    result = task.IsActive && (task.Status === "Pending" || task.Status === "Rejected") && task.RoleName.startsWith(vm.roleName);
                                    break;
                                }
                                return result;
                            });
                            vm.isHavingPendingTasks = vm.myPendingProcessStatusList.length > 0 && (vm.roleName === "CTG" || vm.roleName.startsWith("HR") || vm.roleName.startsWith("DH"));

                            vm.mySubmittedProcessStatusList = vm.myProcessStatusList.filter(function(task) {
                                return task.IsActive && (task.Status === "Submitted" && task.GroupMenu === "DEPARTMENT") && task.RoleName.startsWith(vm.roleName);
                            });

                            vm.myCompletedProcessStatusList = vm.myProcessStatusList.filter(function(task) {
                                return task.IsActive && ((task.Status === "Approved" && task.GroupMenu === "DEPARTMENT")
                                    || (task.Status === "Submitted" && task.GroupMenu !== "DEPARTMENT")) && task.RoleName.startsWith(vm.roleName);
                            });
                        }
                    });
                }
            });
        }
    }
})();