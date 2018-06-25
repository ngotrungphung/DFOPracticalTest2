(function () {
    'use strict';
    var baseUrl = $("base").first().attr("href");

    function planbarController($window,
        $scope,
        revenueService,
        capacitynrecruitmentService,
        fundCenterService,
        budgetOwnerService,
        timelineService,
        commonService,
        homeService,
        utilitiesService,
        $location,
        $q,
        $cookies,
        lodash, $rootScope) {
        var vm = this;
        var pageUrl = $location.path();
        var lstpages = [
            "/gm/capacitynrecruitment",
            "/gm/itfmcost",
            "/gm/travel",
            "/gm/revenue",
            "/gm/vkmsheet",
            "/gm/vkmbudget",
            "/gm/budgetbooking"
        ];
        var processDetail = {};

        function getListYear() {
            var deferred = $q.defer();
            commonService.getListYear().then(function (response) {
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

        function checkIsMyTask(pageUrl, roleName) {

            homeService.checkIsMyTask(pageUrl, roleName).then(function (response) {
                vm.isMyTask = response.data;
                if (processDetail !== null && processDetail !== "") {
                    vm.status = processDetail.Status;
                } else {
                    vm.status = "Pending";
                }

                vm.isEditable =
                    (vm.timeline.Status === "Open" &&
                        vm.isMyTask &&
                        (vm.status === "Pending" || vm.status === "Rejected")) ||
                    vm.roleName === "CTG";


                vm.isActivePage = true;

                $scope.$emit('dataChange',
                {
                    selectedYear: vm.selectedYear,
                    selectedTimeLine: vm.timeline.Id,
                    selectedFundCenter: vm.seletedDepartment.FundId,
                    selectedFundCenterName: vm.seletedDepartment.FundCode,
                    isEditable: vm.isEditable,
                    listTimeline: vm.listTimeline,
                    fundcenters: vm.lstfundCenters,
                    functions: vm.departments,
                    actualMonth: vm.actualMonth
                });
                $rootScope.$emit('revenueChange',
                    {
                        selectedYear: vm.selectedYear,
                        selectedTimeLine: vm.timeline.Id,
                        selectedFundCenter: vm.seletedDepartment.FundId,
                        selectedFundCenterName: vm.seletedDepartment.FundCode,
                        isEditable: vm.isEditable,
                        listTimeline: vm.listTimeline,
                        fundcenters: vm.lstfundCenters
                    });
                if (vm.selectedYear) {
                    $scope.$emit('changeFilter', { selectedYear: vm.selectedYear });
                }
                //vm.onTimelineChange({ timeline: vm.timeline, isEditable: vm.isEditable });
            });

        }
        function getProcessDetail(pageUrl, timelineId, fundCenterId) {
            homeService.getProcessDetail(pageUrl, timelineId, fundCenterId).then(function (response) {
                processDetail = response.data;
                checkIsMyTask(pageUrl, vm.roleName);
            });
        }

        function changeFilter() {
            if ($("#planbarSection").val() !== undefined && vm.seletedDepartment && vm.seletedDepartment.FundId !== undefined &&
                vm.seletedDepartment.FundId !== null) {
                capacitynrecruitmentService.getHeadCountCapacity(vm.seletedDepartment.FundId, vm.timeline.Id).then(
                    function (response) {
                        $("#headerHC").text('Headcount: ' + response.data.headCount).show();
                    });

            } else {
                $("#headerHC").hide();
            }


            if (vm.timeline === null || vm.timeline === "" || vm.timeline === undefined) {
                vm.timeline = {};
                vm.timeline.Id = -1;
            }

            $cookies.put("vm.timeline", JSON.stringify(vm.timeline));
            //$cookies.put('vm.seletedDepartment', vm.seletedDepartment);

            if (vm.timeline !== null && vm.timeline !== "" && vm.timeline !== undefined &&
                vm.seletedDepartment !== null && vm.seletedDepartment !== "" && vm.seletedDepartment !== undefined) {
                $('.loader').fadeIn(1);
                vm.showStatus = true;
                $cookies.put('vm.seletedDepartment', JSON.stringify(vm.seletedDepartment));
                getProcessDetail(pageUrl, vm.timeline.Id, vm.seletedDepartment.FundId);
            }
        }

        function checkFundCenter() {
            if ($cookies.get('vm.seletedDepartment') !== undefined) {
                var cookieDepartment = JSON.parse($cookies.get('vm.seletedDepartment'));
                $(vm.departments).each(function () {
                    if (this.FundId === cookieDepartment.FundId) {
                        vm.seletedDepartment = cookieDepartment;
                    }
                });
            }
            changeFilter();
        }

        function getDepartments(fundCenterParentId) {
            vm.seletedDepartment = undefined;
            if ($window.location.href.indexOf('dh') >= 0) {
                budgetOwnerService.getBudgetOwnersByNTID(vm.currentUser.NTID, vm.timeline.Id).then(function (response) {
                    vm.departments = response.data;

                    vm.departments.push({ FundId: -1, FundCode: "-----", ParentID: -1 });

                    vm.departments = vm.departments.filter(function (functionItem) {
                        return functionItem.ParentID === fundCenterParentId;
                    });
                    
                    checkFundCenter();
                });
            } else {
                fundCenterService.getAllFundCenters(vm.timeline.Id).then(function (response) {
                    vm.departments = [];
                    vm.lstfundCenters = [];
                    var fundCenters = lodash.orderBy(response.data, ['FundCenterCode'], ['asc']);

                    if ($window.location.href.indexOf('gm') >= 0 || $window.location.href.indexOf('ctg') >= 0) {
                        vm.departments.push({ FundId: -1, FundCode: "-----", ParentID: -1 });
                    }
                    $(fundCenters).each(function () {
                        vm.departments.push({ FundId: this.FundCenterID, FundCode: this.FundCenterCode, ParentID: this.ParentID });
                        vm.lstfundCenters.push({ FundId: this.FundCenterID, FundCode: this.FundCenterCode, ParentID: this.ParentID });
                    });
                    vm.departments = vm.departments.filter(function (functionItem) {
                        return functionItem.ParentID === fundCenterParentId;
                    });
                    
                    checkFundCenter();
                });
            }

        }

        function getListTimeline(year) {
            var deferred = $q.defer();
            timelineService.getTimelines(year).then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function loadtime(year) {
            $cookies.put('vm.selectedYear', year);
            $scope.$emit('changeFilter', {
                selectedYear: vm.selectedYear,
            });
            return $q.all([getListTimeline(year)]).then(function (dataArray) {
                vm.listTimeline = dataArray[0];
                bindFundCenterParentsAndDepartments(-1);
                changeFilter();
            });
        }

        function submitData() {
            homeService.submitData(pageUrl, vm.timeline.Id, vm.seletedDepartment.FundId).then(function (response) {
                var result = response.data;
                changeFilter();
            });
        }
        function rejectData() {
            homeService.rejectData(pageUrl, vm.timeline.Id, vm.seletedDepartment.FundId).then(function (response) {
                var result = response.data;
                changeFilter();
            });
        }

        function confirmData() {

            homeService.confirmData(pageUrl, vm.timeline.Id, [vm.seletedDepartment.FundId]).then(function (response) {
                var result = response;
                if (result) {
                    changeFilter();
                }
            });
        }

        function confirmAllData() {
            var depts = [];
            $(vm.departments).each(function () {
                var dep = this;
                if (dep.FundId > 0) {
                    depts.push(dep.FundId);

                }
            });

            homeService.confirmData(pageUrl, vm.timeline.Id, depts).then(function (response) {
                var result = response;
                if (result) {
                    changeFilter();
                }
            });
        }

        function approveData() {
            if (lstpages.indexOf(pageUrl) >= 0) {
                homeService.approveData(lstpages, vm.timeline.Id, [vm.seletedDepartment.FundId]).then(function (response) {
                    var result = response;
                    if (result) {
                        changeFilter();
                    }
                });
            }
        }

        function approveAllData() {
            var depts = [];
            $(vm.departments).each(function () {
                var dep = this;
                if (dep.FundId > 0) {
                    depts.push(dep.FundId);

                }
            });

            if (lstpages.indexOf(pageUrl) >= 0) {
                homeService.approveData(lstpages, vm.timeline.Id, depts).then(function (response) {
                    var result = response;
                    if (result) {
                        changeFilter();
                    }
                });
            }

        }

        function activate() {
            console.log(pageUrl);
            if (pageUrl.indexOf("dashboard") > 0) {
                vm.isDashboard = true;
            }
            setTimeout(function() {
                if (vm.isDashboard) {
                    $('#actualTerm').datepicker({
                        format: "mm/yyyy",
                        startView: "year",
                        minViewMode: "months"
                    });
                    $('#actualTerm').datepicker('setDate', 'now');
                }
            }, 1000);

            vm.currentUser = currenrUser;
            vm.departments = [];
            vm.selectedYear = new Date().getFullYear();
            vm.lstfundCenters = [];
            if ($cookies.get('vm.selectedYear') !== undefined) {
                vm.selectedYear = $cookies.get('vm.selectedYear');
                $scope.$emit('changeFilter', {
                    selectedYear: vm.selectedYear,
                });
            }

            $q.all([getListYear(), getListTimeline(vm.selectedYear), getRoleName()]).then(function (dataArray) {
                vm.listYear = dataArray[0];
                //vm.roleName = dataArray[1];
                vm.listTimeline = dataArray[1];

                vm.roleName = dataArray[2];
                vm.canReject = vm.roleName === "CTG" || vm.roleName === "GM";

                if ($cookies.get('vm.timeline') !== undefined) {
                    vm.timeline = JSON.parse($cookies.get('vm.timeline'));

                    bindFundCenterParentsAndDepartments(vm.timeline.Id);
                }
            });

            vm.isOnlyShowFilter = vm.onlyShowFilter === 'true'; //default is show all filter and status


        }

        function bindFundCenterParentsAndDepartments(timelineId) {
            vm.fundCenterParents = [];
            vm.departments = [];

            fundCenterService.getAllFundCenterParents(timelineId).then(function (response) {
                vm.fundCenterParents = response.data;
                $(vm.fundCenterParents).each(function () {
                    this.FundId = this.FundCenterID;
                    this.FundCode = this.FundCenterCode;
                });

                if (vm.roleName === "HRL") {
                    vm.fundCenterParents = vm.fundCenterParents.filter(function (fundCenterParent) { return fundCenterParent.FundCenterCode === "HRL"; });
                }

                switch (vm.roleName) {
                    case "HRL":
                        vm.fundCenterParents = vm.fundCenterParents.filter(function (fundCenterParent) { return fundCenterParent.FundCenterCode === "HRL"; });
                        break;
                    case "CTG":
                        vm.fundCenterParents.push({ FundId: -1, FundCode: "Total RBVH", ParentID: 0 });
                        break;
                }
                getCachedSeletedFundCenterParent();
                if (vm.seletedFundCenterParent != undefined) {
                    getDepartments(vm.seletedFundCenterParent.FundId);
                } else {
                    getDepartments(-1);
                }
            });
        }

        function getFundCenterParents(timelineId) {
            if (timelineId != undefined) {
                vm.fundCenterParents = [];
                fundCenterService.getAllFundCenterParents(timelineId).then(function (response) {
                    vm.fundCenterParents = response.data;
                    $(vm.fundCenterParents).each(function () {
                        this.FundId = this.FundCenterID;
                        this.FundCode = this.FundCenterCode;
                    });

                    switch (vm.roleName) {
                        case "HRL":
                            vm.fundCenterParents = vm.fundCenterParents.filter(function (fundCenterParent) { return fundCenterParent.FundCenterCode === "HRL"; });
                            break;
                        case "CTG":
                            vm.fundCenterParents.push({ FundId: -1, FundCode: "Total RBVH", ParentID: 0 });
                            break;
                    }
                });
            }
        }

        function getCachedSeletedFundCenterParent() {
            if ($cookies.get('vm.seletedFundCenterParent') !== undefined) {
                var cookieFundCenterParent = JSON.parse($cookies.get('vm.seletedFundCenterParent'));
                $(vm.fundCenterParents).each(function () {
                    if (this.FundId === cookieFundCenterParent.FundId) {
                        vm.seletedFundCenterParent = cookieFundCenterParent;
                    }
                });
            }
        }

        function setCookieSelectedTimeline() {
            $cookies.put('vm.timeline', JSON.stringify(vm.timeline));
        }

        function setCookieSeletedFundCenterParent() {
            $cookies.put('vm.seletedFundCenterParent', JSON.stringify(vm.seletedFundCenterParent));
        }

        function setCookieSeletedFunction() {
            $cookies.put('vm.seletedDepartment', JSON.stringify(vm.seletedDepartment));
        }

        vm.isDashboard = false;
        vm.loadtime = loadtime;
        vm.changeFilter = changeFilter;
        vm.$onInit = activate;
        vm.submitData = submitData;
        vm.rejectData = rejectData;
        vm.confirmData = confirmData;
        vm.confirmAllData = confirmAllData;
        vm.approveData = approveData;
        vm.approveAllData = approveAllData;
        vm.getDepartments = getDepartments;
        vm.getFundCenterParents = getFundCenterParents;
        vm.setCookieSelectedTimeline = setCookieSelectedTimeline;
        vm.setCookieSeletedFundCenterParent = setCookieSeletedFundCenterParent;
        vm.setCookieSeletedFunction = setCookieSeletedFunction;
    }

    angular
        .module('BPT.components')
        .component('planbarComponent', {
            controller: planbarController,
            controllerAs: 'vm',
            templateUrl: baseUrl + 'app/components/planbar/planbar.tpl.html',
            bindings: {
                onlyShowFilter: '@'
            }
        });

    planbarController.$inject = ['$window', '$scope', 'revenueService', 'capacitynrecruitmentService', 'fundCenterService', 'budgetOwnerService', 'timelineService', 'commonService', 'homeService', 'utilitiesService', '$location', '$q', '$cookies', 'lodash','$rootScope'];
})();