(function () {
    'use strict';
    var baseUrl = $("base").first().attr("href");

    function timelineSelectionController(timelineService, utilitiesService, commonService, homeService, $location, $q, $cookies) {
        var vm = this;
        vm.timeline = {};
        var pageUrl = $location.path();
        var processDetail = {};

        function getListYear() {
            var deferred = $q.defer();
            commonService.getListYear().then(function (response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }
        function getListTimeline(year) {
            var deferred = $q.defer();
            timelineService.getTimelines(year).then(function (response) {
                deferred.resolve(response.data);
            });
            
            return deferred.promise;
        }
        function getRoleName() {
            var deferred = $q.defer();
            commonService.getCurrentRoleName().then(function (response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }

        function activate() {
            vm.selectedYear = new Date().getFullYear() + 1;
            //console.log($cookies.get("vm.selectedYear"));

            if ($cookies.get("vm.selectedYear") !== null) {
                vm.selectedYear = $cookies.get("vm.selectedYear");
            }

            if ($cookies.get("vm.timeline") !== undefined && $cookies.get("vm.timeline") !== "") {
                vm.timeline = JSON.parse($cookies.get("vm.timeline"));
                console.log("vm.timeline.Id: " + vm.timeline.Id);
            }

            $q.all([getListYear(), getRoleName(), getListTimeline(vm.selectedYear)]).then(function(dataArray) {
                vm.listYear = dataArray[0];
                vm.roleName = dataArray[1];
                vm.listTimeline = dataArray[2];
                var time = vm.listTimeline.find(function(timeline) { return timeline.Id === vm.timeline.Id; });
                if (time != undefined) {
                    vm.timeline.Status = time.Status;
                }
                //Just CTG has permssion to reject the submitted data
                vm.canReject = vm.roleName === "CTG";

                vm.ctrlActivate();
                selectTimeline();
            });

        }

        function checkIsMyTask(pageUrl, roleName) {
            var deferred = $q.defer();
            homeService.checkIsMyTask(pageUrl, roleName).then(function (response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }
        function getProcessDetail(pageUrl, timelineId) {
            var deferred = $q.defer();
            homeService.getProcessDetail(pageUrl, timelineId).then(function (response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }
        function selectTimeline() {

            if (vm.timeline === null || vm.timeline === "") {
                vm.timeline = {};
                vm.timeline.Id = -1;
            }

            console.log("vm.timeline.Id: " + vm.timeline.Id);
            $cookies.put("vm.timeline", JSON.stringify(vm.timeline));

            $q.all([getProcessDetail(pageUrl, vm.timeline.Id), checkIsMyTask(pageUrl, vm.roleName), getListTimeline(vm.selectedYear)]).then(function (dataArray) {
                processDetail = dataArray[0];
                vm.isMyTask = dataArray[1];
                vm.listTimeline = dataArray[2];
                vm.timeline.Status = vm.listTimeline.find(function(timeline) { return timeline.Id === vm.timeline.Id; }).Status;
                if (vm.isMyTask) {
                    if (processDetail !== null && processDetail !== "") {
                        vm.status = processDetail.Status;
                    } else {
                        vm.status = "Pending";
                    }
                } else {
                    if (processDetail !== null && processDetail !== "") {
                        vm.status = processDetail.Status;
                    } else {
                        vm.status = "Pending";
                    }
                }

                vm.isEditable = (vm.timeline.Status === "Open" && vm.isMyTask && (vm.status === "Pending" || vm.status === "Rejected")) || vm.roleName === "CTG";

                vm.onTimelineChange({ timeline: vm.timeline, isEditable: vm.isEditable, dataStatus: vm.status });

                vm.isActivePage = true;
            });
        }
        function loadTimeline() {
            $cookies.put("vm.selectedYear", vm.selectedYear);
            timelineService.getTimelines(vm.selectedYear).then(function (response) {
                vm.listTimeline = response.data;

                //Just get the BP data if is year data
                if (response.data.length > 0) {
                    if (vm.isYearData) {
                        var bpTimeline = response.data.find(function(tl) {
                            return tl.Planning.indexOf("BP") >= 0;
                        });
                        vm.listTimeline = [];
                        vm.listTimeline.push(bpTimeline);
                        vm.timeline = "";
                    }
                } else {
                    vm.timeline = {};
                    vm.timeline.Id = -1;
                }

                selectTimeline();
            });
        }
        function submitData() {
            homeService.submitData(pageUrl, vm.timeline.Id,null).then(function (response) {
                var result = response.data;
                selectTimeline();
            });
        }
        function rejectData() {
            homeService.rejectData(pageUrl, vm.timeline.Id, null).then(function (response) {
                var result = response.data;
                selectTimeline();
            });
        }

        vm.selectTimeline = selectTimeline;
        vm.loadTimeline = loadTimeline;
        vm.submitData = submitData;
        vm.rejectData = rejectData;
        vm.getListTimeline = getListTimeline;
        vm.$onInit = activate;
    }

    angular
        .module('BPT.components')
        .component('timelineSelectionComponent', {
            bindings: {
                onTimelineChange: '&',
                ctrlActivate: '&',
                isYearData: '<'
            },
            controller: timelineSelectionController,
            controllerAs: 'vm',
            templateUrl: baseUrl + 'app/components/timelineSelection/timelineSelection.tpl.html'
        });

    timelineSelectionController.$inject = ['timelineService', 'utilitiesService', 'commonService', 'homeService', '$location', '$q', '$cookies'];
})();