(function () {
    'use strict';

    angular.module('BPT.components', ['ui.bootstrap']);
    //angular.module('app').run(function ($rootScope, ngProgress) {
    //    $rootScope.$on('$routeChangeStart', function (ev, data) {
    //        ngProgress.start();
    //    });
    //    $rootScope.$on('$routeChangeSuccess', function (ev, data) {
    //        ngProgress.complete();
    //    });
    //});

    
    //var app = angular.module('progressApp', ['ngProgress']);


    //angular.module('directive.loading', [])
    //.directive('loading', ['$http', function ($http) {
    //    return {
    //        restrict: 'A',
    //        link: function (scope, elm, attrs) {
    //            scope.isLoading = function () {
    //                return $http.pendingRequests.length > 0;
    //            };

    //            scope.$watch(scope.isLoading, function (v) {
    //                if (v) {
    //                    elm.show();
    //                    console.log('show');
    //                } else {
    //                    elm.hide();
    //                    console.log('hide');
    //                }
    //            });
    //        }
    //    };

    //}]);


})();
(function () {
    'use strict';

    var env = {};    
    if (window) {
        if (typeof Object.assign != 'function') {
            Object.assign = function (target) {
                'use strict';
                if (target == null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                target = Object(target);
                for (var index = 1; index < arguments.length; index++) {
                    var source = arguments[index];
                    if (source != null) {
                        for (var key in source) {
                            if (Object.prototype.hasOwnProperty.call(source, key)) {
                                target[key] = source[key];
                            }
                        }
                    }
                }
                return target;
            };
        } 
        Object.assign(env, window.__env);
    }

    angular
        .module('BPT')
        .constant('env', env);
})();
(function () {
    'use strict';

    angular.module('BPT',
            [
                'BPT.routes',
                'BPT.components',
                'ngTable',
                'ngLodash',
                'ngCookies',
                'ui.utils.masks'
            ])
        .config(configs)
        .run(runs);

    configs.$inject = ['$httpProvider', '$locationProvider'];
    function configs($httpProvider, $locationProvider) {
        var interceptor = function ($location, $log, $q) {
            function error(response) {
                if (response.status === 401) {
                    $log.error('You are unauthorised to access the requested resource (401)');
                } else if (response.status === 404) {
                    $log.error('The requested resource could not be found (404)');
                } else if (response.status === 500) {
                    $log.error('Internal server error (500)');
                }
                return $q.reject(response);
            }
            function success(response) {
                //Request completed successfully
                return response;
            }
            return function (promise) {
                return promise.then(success, error);
            }
        };
        $httpProvider.interceptors.push(['$location', '$log', '$q', interceptor]);
        $locationProvider.hashPrefix("");

        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // Answer edited to include suggestions from comments
        // because previous version of code introduced browser-related errors

        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }

    runs.$inject = ['$rootScope', '$location', 'authService'];
    function runs($rootScope, $location, authService) {
    
        $rootScope.page = {
            setTitle: function (title) {
                this.title = title;
            },
            setDescription: function (description) {
                this.description = description;
            }
        };

        //get authenticate user information
        //authService.authenticate().then(function () {
        //    $rootScope.currentUser = authService.currentUser;
        //    $rootScope.$broadcast('authenticated');
        //});        
        
        $rootScope.$on('$routeChangeStart', function (event, next) {                                    
            if (!next.$$route) return;

            var currentPage = next.$$route.originalPath;
            authService.canAccessPage(currentPage).then(function (matched) {
                if (!matched) {
                    $location.path('home'); //redirect to home when user with role cannot access page
                }
            })
        });

        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $rootScope.page.setTitle(current.$$route.title || 'Home');
            $rootScope.page.setDescription(current.$$route.description || '');
        });
    }
})();
(function() {
    'use strict';
    //var baseUrl = $("base").first().attr("href");
    angular
        .module('BPT.routes', ['ngRoute'])
        .config(config);

    config.$inject = ['$routeProvider', '$locationProvider'];

    function config($routeProvider, $locationProvider) {
        var baseUrl = $("base").first().attr("href");

        //console.log("base url for relative links = " + baseUrl);

        $routeProvider
            .when('/home', {
                title: 'Home',
                description: 'Description',
                templateUrl: baseUrl + 'app/pages/home/index.html',
                controller: 'HomeController',
                controllerAs: 'vm'
            })

            //Fund Center
            .when('/ctg/fundcenter', {
                title: 'Fund Center',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/fundcenter/index.html',
                controller: 'FundCenterController',
                controllerAs: 'vm'
            })

            //IFRS Category
            .when('/ctg/ifrscategory', {
                title: 'IRFS Category',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/IFRScategory/index.html',
                controller: 'IFRSCategoryController',
                controllerAs: 'vm'
            })

            //Attrition Rate
            .when('/ctg/attritionrate', {
                title: 'Rate',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/attritionrate/index.html',
                controller: 'AttritionRateController',
                controllerAs: 'vm'
            })

            //Budget Category
            .when('/ctg/budgetcodecategory', {
                title: 'Budget Category',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/budgetcodecategory/index.html',
                controller: 'BudgetCodeCategoryController',
                controllerAs: 'vm'
            })
            .when('/ctg/masterheadcountrelatedbenefit', {
                title: 'Master Headcount Related Benefit',
                description: 'Master Headcount Related Benefit',
                templateUrl: baseUrl + 'app/pages/ctg/masterheadcountrelatedbenefit/index.html',
                controller: 'MasterHeadcountRelatedBenefitController',
                controllerAs: 'vm'
            })

            //Budget Code Configuration
            .when('/ctg/budgetcode', {
                title: 'Budget Code',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/budgetcode/index.html',
                controller: 'BudgetCodeController',
                controllerAs: 'vm'
            })

            //Service Line
            .when('/ctg/serviceline', {
                title: 'Service line',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/serviceline/index.html',
                controller: 'ServiceLineController',
                controllerAs: 'vm'
            })

            //Target DE
            .when('/ctg/targetde', {
                title: 'Target DE',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/targetde/index.html',
                controller: 'TargetDEController',
                controllerAs: 'vm'
            })
            
            //RBEI Department
            .when('/ctg/rbeidepartment', {
                title: 'RBEI Department',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/rbeidepartment/index.html',
                controller: 'RBEIDepartmentController',
                controllerAs: 'vm'
            })

            //Allocation Key
            .when('/ctg/allocationkey', {
                title: 'Allocation Key',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/allocationkey/index.html',
                controller: 'AllocationKeyController',
                controllerAs: 'vm'
            })
            
            .when('/dh/capacitynrecruitment', {
                title: 'Capacity & Recruitment',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/index.html',
                controller: 'CapacityNRecruitmentController',
                controllerAs: 'vm'
            })
            .when('/dh/capacitynrecruitment/create', {
                title: 'Capacity & Recruitment',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/create.html',
                controller: 'CapacityNRecruitmentController',
                controllerAs: 'vm'
            })
            .when('/dh/capacitynrecruitment/edit/:id', {
                title: 'Capacity & Recruitment',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/edit.html',
                controller: 'CapacityNRecruitmentController',
                controllerAs: 'vm'
            })
            .when('/dh/capacitynrecruitment/delete/:id', {
                title: 'Capacity & Recruitment',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/delete.html',
                controller: 'CapacityNRecruitmentController',
                controllerAs: 'vm'
            })
            .when('/dh/departmenthead', {
                title: 'DepartmentHead',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/index.html',
                controller: 'DepartmentHeadController',
                controllerAs: 'vm'
            })
            .when('/dh/departmenthead/create', {
                title: 'DepartmentHead',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/create.html',
                controller: 'DepartmentHeadController',
                controllerAs: 'vm'
            })
            .when('/dh/departmenthead/edit/:id', {
                title: 'DepartmentHead',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/edit.html',
                controller: 'DepartmentHeadController',
                controllerAs: 'vm'
            })
            .when('/dh/departmenthead/delete/:id', {
                title: 'DepartmentHead',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/delete.html',
                controller: 'DepartmentHeadController',
                controllerAs: 'vm'
            })
            .when('/dh/travel', {
                title: 'Travel',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/index.html',
                controller: 'TravelController',
                controllerAs: 'vm'
            })
            .when('/dh/revenue', {
                title: 'Revenue',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/index.html',
                controller: 'RevenueController',
                controllerAs: 'vm'
            })            
            .when('/dh/vkmsheet', {
                title: 'VKM Sheet',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/index.html',
                controller: 'VKMSheetController',
                controllerAs: 'vm'
            })
            //VKM Budget
            .when('/dh/vkmbudget', {
                title: 'VKM Budget',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/vkmbudget/index.html',
                controller: 'VKMBudgetController',
                controllerAs: 'vm'
            })

            //ITFM Cost
            .when('/dh/itfmcost', {
                title: 'ITFM',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/index.html',
                controller: 'ITFMCostController',
                controllerAs: 'vm'
            })
            .when('/dh/outsourcing', {
                title: 'Outsourcing',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/index.html',
                controller: 'OutsourcingController',
                controllerAs: 'vm'
            })
            .when('/dh/training', {
                title: 'Training',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/index.html',
                controller: 'TrainingController',
                controllerAs: 'vm'
            })
            .when('/dh/salarybudget', {
                    title: 'Salary Budget',
                    description: '',
                    templateUrl: baseUrl + 'app/pages/dh/departmenthead/index.html',
                    controller: 'SalaryBudgetController',
                    controllerAs: 'vm'
                })
            .when('/dh/budgetbooking', {
                title: 'Budgeting',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/index.html',
                controller: 'BudgetBookingController',
                controllerAs: 'vm'
            })
            .when('/dh/budgetbooking/create', {
                title: 'Budgeting',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/create.html',
                controller: 'BudgetBookingController',
                controllerAs: 'vm'
            })
            .when('/dh/budgetbooking/edit/:id', {
                title: 'Budgeting',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/edit.html',
                controller: 'BudgetBookingController',
                controllerAs: 'vm'
            })
            .when('/dh/budgetbooking/delete/:id', {
                title: 'Budgeting',
                description: '',
                templateUrl: baseUrl + 'app/pages/dh/departmenthead/delete.html',
                controller: 'BudgetBookingController',
                controllerAs: 'vm'
            })

            //department ctg consolidate
                 .when('/ctg/ifrsreport', {
                     title: 'Ifrs report',
                     description: '',
                     templateUrl: baseUrl + 'app/pages/ctg/ifrsreport/index.html',
                     controller: 'IfrsReportController',
                     controllerAs: 'vm'
                 })
               .when('/ctg/fundultilization', {
                   title: 'Fund Utilization',
                   description: '',
                   templateUrl: baseUrl + 'app/pages/ctg/fundultilization/index.html',
                   controller: 'BudgetUtilizationController',
                   controllerAs: 'vm'
               })
                 .when('/ctg/personnelcostnvasalary', {
                     title: 'Personnel cost & VA salary',
                     description: '',
                     templateUrl: baseUrl + 'app/pages/ctg/departmenthead/index.html',
                     controller: 'PersonnelcostnVAsalaryController',
                     controllerAs: 'vm'
                 })
            .when('/ctg/capacitynrecruitment', {
                title: 'Capacity & Recruitment',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/departmenthead/index.html',
                controller: 'CapacityCTGRecruitmentController',
                controllerAs: 'vm'
            })
            .when('/ctg/departmenthead', {
                title: 'DepartmentHead',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/departmenthead/index.html',
                controller: 'DepartmentHeadController',
                controllerAs: 'vm'
            })
            .when('/ctg/travel', {
                title: 'Travel',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/departmenthead/index.html',
                controller: 'TravelController',
                controllerAs: 'vm'
            })
            .when('/ctg/revenue', {
                title: 'Revenue',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/departmenthead/index.html',
                controller: 'RevenueController',
                controllerAs: 'vm'
            })
             .when('/ctg/vkmsheet', {
                 title: 'VKM Sheet',
                 description: '',
                 templateUrl: baseUrl + 'app/pages/ctg/departmenthead/index.html',
                 controller: 'VKMSheetController',
                 controllerAs: 'vm'
             })            
            .when('/ctg/vkmbudget', {
                title: 'VKM Budget',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/departmenthead/index.html',
                controller: 'VKMBudgetController',
                controllerAs: 'vm'
            })
            .when('/ctg/itfmcost', {
                title: 'ITFM',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/departmenthead/index.html',
                controller: 'ITFMCostController',
                controllerAs: 'vm'
            })
            .when('/ctg/outsourcing', {
                title: 'Outsourcing',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/departmenthead/index.html',
                controller: 'OutsourcingController',
                controllerAs: 'vm'
            })
            .when('/ctg/training', {
                title: 'Training',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/departmenthead/index.html',
                controller: 'TrainingController',
                controllerAs: 'vm'
            })
            .when('/ctg/salarybudget', {
                title: 'Salary Budget',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/departmenthead/index.html',
                controller: 'SalaryBudgetController',
                controllerAs: 'vm'
            })
            .when('/ctg/budgetbooking', {
                title: 'Budgeting',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/departmenthead/index.html',
                controller: 'BudgetBookingCTGController',
                controllerAs: 'vm'
            })
            .when('/ctg/budgetcycle', {
                title: 'Cost Allocation',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/departmenthead/index.html',
                controller: 'BudgetCycleController',
                controllerAs: 'vm'
            })
            .when('/ctg/masterheadcountrelatedbenefit', {
                title: 'Headcount Related Benefit',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/MasterHeadcountRelatedBenefit/index.html',               
                controller: 'MasterHeadcountRelatedBenefitController',
                controllerAs: 'vm'
                
            })

            //department gm approve
            .when('/gm/capacitynrecruitment', {
                title: 'Capacity & Recruitment',
                description: '',
                templateUrl: baseUrl + 'app/pages/gm/departmenthead/index.html',
                controller: 'CapacityGMRecruitmentController',
                controllerAs: 'vm'
            })
     
            .when('/gm/travel', {
                title: 'Travel',
                description: '',
                templateUrl: baseUrl + 'app/pages/gm/departmenthead/index.html',
                controller: 'TravelController',
                controllerAs: 'vm'
            })
            .when('/gm/revenue', {
                title: 'Revenue',
                description: '',
                templateUrl: baseUrl + 'app/pages/gm/departmenthead/index.html',
                controller: 'RevenueController',
                controllerAs: 'vm'
            })
            .when('/gm/vkmsheet', {
                title: 'VKM Sheet',
                description: '',
                templateUrl: baseUrl + 'app/pages/gm/departmenthead/index.html',
                controller: 'VKMSheetController',
                controllerAs: 'vm'
            })
            .when('/gm/vkmbudget', {
                title: 'VKM Budget',
                description: '',
                templateUrl: baseUrl + 'app/pages/gm/departmenthead/index.html',
                controller: 'VKMBudgetController',
                controllerAs: 'vm'
            })
            .when('/gm/itfmcost', {
                title: 'ITFM',
                description: '',
                templateUrl: baseUrl + 'app/pages/gm/departmenthead/index.html',
                controller: 'ITFMCostController',
                controllerAs: 'vm'
            })
            .when('/gm/budgetbooking', {
                title: 'Budget confirm',
                description: '',
                templateUrl: baseUrl + 'app/pages/gm/departmenthead/index.html',
                controller: 'BudgetBookingGMController',
                controllerAs: 'vm'
            })
            .when('/gm/budgetcycle', {
                title: 'Cost Allocation',
                description: '',
                templateUrl: baseUrl + 'app/pages/gm/departmenthead/index.html',
                controller: 'BudgetCycleGMController',
                controllerAs: 'vm'
            })
                  .when('/dh/dashboard', {
                      title: 'Dashboard',
                      description: '',
                      templateUrl: baseUrl + 'app/pages/ctg/dashboard/index.html',
                      controller: 'DashboardController',
                      controllerAs: 'vm'
                  })
                 .when('/ctg/dashboard', {
                     title: 'Dashboard',
                     description: '',
                     templateUrl: baseUrl + 'app/pages/ctg/dashboard/index.html',
                     controller: 'DashboardController',
                     controllerAs: 'vm'
                 })

            //Country
            .when('/hr/travel/country', {
                title: 'List of Countries',
                description: '',
                templateUrl: baseUrl + 'app/pages/hr/travel/country/index.html',
                controller: 'CountryController',
                controllerAs: 'vm'
            })

                 .when('/hr/jmpheadcount', {
                     title: 'JMP Head Count',
                     description: '',
                     templateUrl: baseUrl + 'app/pages/hr/jmpheadcount/index.html',
                     controller: 'JMPHeadcountController',
                     controllerAs: 'vm'
                 })
               .when('/hr/personnelcapacity', {
                   title: 'Personnel Capacity',
                   description: '',
                   templateUrl: baseUrl + 'app/pages/hr/personnelcapacity/index.html',
                   controller: 'PersonnelCapacityController',
                   controllerAs: 'vm'
               })
             .when('/hr/departmentheadcount', {
                 title: 'Department Head Count',
                 description: '',
                 templateUrl: baseUrl + 'app/pages/hr/departmentheadcount/index.html',
                 controller: 'DepartmentHeadcountController',
                 controllerAs: 'vm'
             })
            .when('/hr/headcount', {
                title: 'Level-wise Head Count',
                description: '',
                templateUrl: baseUrl + 'app/pages/hr/headcount/index.html',
                controller: 'HeadcountController',
                controllerAs: 'vm'
            })
            .when('/hr/headcount/create', {
                title: 'Headcount',
                description: '',
                templateUrl: baseUrl + 'app/pages/hr/headcount/create.html',
                controller: 'HeadcountController',
                controllerAs: 'vm'
            })
            .when('/hr/headcount/edit/:id', {
                title: 'Headcount',
                description: '',
                templateUrl: baseUrl + 'app/pages/hr/headcount/edit.html',
                controller: 'HeadcountController',
                controllerAs: 'vm'
            })
            .when('/hr/headcount/delete/:id', {
                title: 'Headcount',
                description: '',
                templateUrl: baseUrl + 'app/pages/hr/headcount/delete.html',
                controller: 'HeadcountController',
                controllerAs: 'vm'
            })
            .when('/hr/personnelcostnonva', {
                title: 'Personnel cost',
                description: '',
                templateUrl: baseUrl + 'app/pages/hr/personnelcost/index.html',
                controller: 'PersonnelCostController',
                controllerAs: 'vm'
            })
            .when('/hr/personnelcostva', {
                title: 'Personnel cost',
                description: '',
                templateUrl: baseUrl + 'app/pages/hr/personnelcost/index.html',
                controller: 'PersonnelCostController',
                controllerAs: 'vm'
            })

            //Visa Type
            .when('/hr/travel/visatype', {
                title: 'Master Visa Type',
                description: '',
                templateUrl: baseUrl + 'app/pages/hr/travel/visaType/index.html',
                controller: 'visaTypeController',
                controllerAs: 'vm'
            })

            //Visa
            .when('/hr/travel/visa', {
                title: 'Master Visa',
                description: '',
                templateUrl: baseUrl + 'app/pages/hr/travel/visa/index.html',
                controller: 'visaController',
                controllerAs: 'vm'
            })

            //Ticket Type
            .when('/hr/travel/tickettype', {
                title: 'Master Ticket Type',
                description: '',
                templateUrl: baseUrl + 'app/pages/hr/travel/ticketType/index.html',
                controller: 'ticketTypeController',
                controllerAs: 'vm'
            })

            //Ticket
            .when('/hr/travel/ticket', {
                title: 'Master Ticket',
                description: '',
                templateUrl: baseUrl + 'app/pages/hr/travel/ticket/index.html',
                controller: 'ticketController',
                controllerAs: 'vm'
            })

            //Allowance Type
            .when('/hr/travel/allowancetype', {
                title: 'Master Allowance Type',
                description: '',
                templateUrl: baseUrl + 'app/pages/hr/travel/allowanceType/index.html',
                controller: 'allowanceTypeController',
                controllerAs: 'vm'
            })

            //Allowance
            .when('/hr/travel/allowance', {
                title: 'Master Allowance',
                description: '',
                templateUrl: baseUrl + 'app/pages/hr/travel/allowance/index.html',
                controller: 'AllowanceController',
                controllerAs: 'vm'
            })

            //Outsource Role
            .when('/hr/outsourcerole', {
                title: 'Outsource Role',
                description: '',
                templateUrl: baseUrl + 'app/pages/hr/outsourceRole/index.html',
                controller: 'OutsourceRoleController',
                controllerAs: 'vm'
            })

            //Associate Level
            .when('/hr/associatelevel', {
                title: 'Master Associate Level',
                description: '',
                templateUrl: baseUrl + 'app/pages/hr/associateLevel/index.html',
                controller: 'AssociateLevelController',
                controllerAs: 'vm'
            })

            //VA Family
            .when('/ctg/vafamily', {
                title: 'VA Family Status',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/vafamily/index.html',
                controller: 'VAFamilyController',
                controllerAs: 'vm'
            })

            //Fund Code
            .when('/ctg/fund', {
                title: 'Fund Code',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/fundcode/index.html',
                controller: 'FundCodeController',
                controllerAs: 'vm'
            })

            //Budget Owner Assignment
            .when('/ctg/budgetowner', {
                title: 'Budget Owner Assignment',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/budgetowner/index.html',
                controller: 'BudgetOwnerController',
                controllerAs: 'vm'
            })

            //Department
            .when('/ctg/department', {
                title: 'Master Department',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/department/index.html',
                controller: 'DepartmentController',
                controllerAs: 'vm'
            })

            //ITFM Pricing
            .when('/ctg/itfmpricing', {
                title: 'ITFM Pricing List',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/itfmpricing/index.html',
                controller: 'ItfmPricingController',
                controllerAs: 'vm'
            })
            
            //ITFM Existing List
            .when('/ctg/itfmexistinglist', {
                title: 'ITFM Existing List',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/itfmexistinglist/index.html',
                controller: 'ITFMExistingListController',
                controllerAs: 'vm'
            })

            //User
            .when('/admin/user', {
                title: 'Users Management',
                description: '',
                templateUrl: baseUrl + 'app/pages/admin/user/index.html',
                controller: 'UserController',
                controllerAs: 'vm'
            })

            //IT Hardware
            .when('/ctg/ithardware', {
                title: 'IT Hardware',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/ithardware/index.html',
                controller: 'ITHardwareController',
                controllerAs: 'vm'
            })

            //start exchangerate
            .when('/ctg/exchangerates', {
                title: 'Master Exchange Rate',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/exchangerates/index.html',
                controller: 'ExchangeRateController',
                controllerAs: 'vm'
            })
            .when('/ctg/exchangerates/create', {
                title: 'Master Exchange Rate',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/exchangerates/create.html',
                controller: 'ExchangeRateController',
                controllerAs: 'vm'
            })
            .when('/ctg/exchangerates/create', {
                title: 'Master Exchange Rate',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/exchangerates/createGroups.html',
                controller: 'ExchangeRateController',
                controllerAs: 'vm'
            })
            .when('/ctg/exchangerates/edit/:id', {
                title: 'Master Exchange Rate',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/exchangerates/edit.html',
                controller: 'ExchangeRateController',
                controllerAs: 'vm'
            })
            .when('/ctg/exchangerates/edit/:id', {
                title: 'Master Exchange Rate',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/exchangerates/editGroups.html',
                controller: 'ExchangeRateController',
                controllerAs: 'vm'
            })
            //end exchangerate

            //ITFM Replacement
            .when('/ctg/planitfmreplacement', {
                title: 'ITFM Replacement',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/planitfmreplacement/index.html',
                controller: 'PlanITFMReplacementController',
                controllerAs: 'vm'
            })

            //Asset Class
            .when('/ctg/assetclass', {
                title: 'Asset Class',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/assetclass/index.html',
                controller: 'AssetClassController',
                controllerAs: 'vm'
            })

            //Asset
            .when('/ctg/asset', {
                title: 'Asset Mangement',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/asset/index.html',
                controller: 'AssetController',
                controllerAs: 'vm'
            })

            //Cost Center
            .when('/ctg/costcenter', {
                title: 'Cost Center',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/costcenter/index.html',
                controller: 'CostCenterController',
                controllerAs: 'vm'
            })

            //Time Line
            .when('/admin/timeline', {
                title: 'Timeline',
                description: '',
                templateUrl: baseUrl + 'app/pages/admin/timeline/index.html',
                controller: 'TimelineController',
                controllerAs: 'vm'
            })

            //Menu Management
            .when('/home/menu', {
                title: 'Menu management',
                description: '',
                templateUrl: baseUrl + 'app/pages/home/menu/index.html',
                controller: 'MenuController',
                controllerAs: 'vm'
            })

            //Asset Depreciation
            .when('/ctg/assetdepreciation', {
                title: 'Asset Depreciation',
                description: '',
                templateUrl: baseUrl + 'app/pages/ctg/departmenthead/index.html',
                controller: 'AssetDepreciationController',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/home'
            });

        // use the HTML5 History API
        //$locationProvider.html5Mode(true).hashPrefix('!');

    }

})();
(function (window) {
    'use strict';
    var baseUrl = $("base").first().attr("href");

    window.__env = window.__env || {};

    // API url
    window.__env.apiUrl = 'http://localhost:23557/';

    // Base url
    window.__env.baseUrl = baseUrl;//'/';

    // Enable debug
    window.__env.debug = true;
}(this));
(function (window) {
    'use strict';

    window.__env = window.__env || {};

    // API url
    window.__env.apiUrl = 'http://production:9138/api/';

    // Base url
    window.__env.baseUrl = '/';

    // Enable debug
    window.__env.debug = false;
}(this));
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
(function () {
    'use strict';

    angular
        .module('BPT')
        .factory('httpService', httpService);

    httpService.$inject = ['$http', '$q', 'env', 'utilitiesService'];

    function httpService($http, $q, env, utilitiesService) {
        var service = {
            get: get,
            post: post,
            put: put,
            remove: remove,
            getNonLoading:getNonLoading
        };

        var verbAction = {
            get: "get",
            post: "post",
            put: "put",
            delete: "delete"
        };

        var httpCodes = {
            success: 200,
            badRequest: 400,
            unProcessable: 422,
            unauthorized: 401,
            forbidden: 403,
            notFound: 404,
            notAcceptable: 406,
            serverError: 500,
            serviceUnavailable: 503,
            conflict: 409,
            notModified: 304
        };

        var message = {
            success: "Successfully!",
            error: "Error !!",
            unKnown: "UnKnown Error !!",
            unchange: "- Nothing change",
            unauthorized: "- Unauthorized access page !!!"
        };

        var action = {
            "addnew": "Add Information",
            "update": "Update Information",
            "delete": "Delete Action"
        };

        return service;

        function get(uri) {
            return makeRequest('get', uri);
        }
        function getNonLoading(uri){
            return makeRequestNonLoading('get',uri);
        }
        function post(uri, data, option) {
            return makeRequest('post', uri, data, option);
        }
        function put(uri, data, option) {
            return makeRequest('put', uri, data, option);
        }

        function remove(uri, option) {
            return makeRequest('delete', uri, option);
        }

        function makeRequest(verb, uri, data, option) {
            var defer = $q.defer();
            verb = verb.toLowerCase();
            $('.loader').show();
            var httpArgs = [env.baseUrl + uri];
            if (verb.match(/post|put/)) {
                httpArgs.push(data);
            }
   
            $http[verb].apply(null, httpArgs)
                .then(function (data, status) {                    
                    showMessageAction(verb, data.status, option);
                    defer.resolve(data);
                    $('.loader').fadeOut(1);
                }, function (response, status) {                    
                    if (response.data && response.data.ErrorMessage) {
                        option = {
                            message: {}
                        };
                        option.message.error = response.data.ErrorMessage;
                    }
                    $('.loader').fadeOut(1);
                    showMessageAction(verb, response.status, option);
                    defer.reject('HTTP Error: ' + status);
                    
                });

            return defer.promise;
        }
        function makeRequestNonLoading(verb, uri, data, option) {
            var defer = $q.defer();
            verb = verb.toLowerCase();
            var httpArgs = [env.baseUrl + uri];
            if (verb.match(/post|put/)) {
                httpArgs.push(data);
            }
   
            $http[verb].apply(null, httpArgs)
                .then(function (data, status) {                    
                    showMessageAction(verb, data.status, option);
                    defer.resolve(data);
                }, function (response, status) {                    
                    if (response.data && response.data.ErrorMessage) {
                        option = {
                            message: {}
                        };
                        option.message.error = response.data.ErrorMessage;
                    }
                    showMessageAction(verb, response.status, option);
                    defer.reject('HTTP Error: ' + status);
                });

            return defer.promise;
        }

        function showMessageAction(verb, status, option) {
            var messageTemplate = "{0} {1}";
            var displayMessage = getMessage(status, option);
            switch (verb) {
                case verbAction.post:
                    displayMessage = option && option.message ? displayMessage : utilitiesService.formatStringWithParams(messageTemplate, action.addnew, displayMessage);
                    showToastr(status, displayMessage);
                    break;
                case verbAction.put:
                    displayMessage = option && option.message ? displayMessage : utilitiesService.formatStringWithParams(messageTemplate, action.update, displayMessage);
                    showToastr(status, displayMessage);
                    break;
                case verbAction.delete:
                    displayMessage = option && option.message ? displayMessage : utilitiesService.formatStringWithParams(messageTemplate, action.delete, displayMessage);;
                    showToastr(status, displayMessage);
                    break;
                default: break;    
            }
        }

        function showToastr(status, messages) {
            switch (status) {
                case httpCodes.success:
                    toastr.success(messages, "Success");
                    break;
                case httpCodes.badRequest:
                case httpCodes.unProcessable:
                case httpCodes.notFound:
                case httpCodes.serverError:
                case httpCodes.serviceUnavailable:
                case httpCodes.unauthorized:
                    toastr.warning(messages, "Warning");
                    break;
                default: break;
            }
        }

        function getMessage(status, option) {
            switch (status) {
                case httpCodes.success:
                    return option && option.message && option.message.success? option.message.success : message.success;
                case httpCodes.badRequest:
                case httpCodes.unProcessable:
                case httpCodes.notFound:
                case httpCodes.serverError:
                case httpCodes.serviceUnavailable:
                    return option && option.message && option.message.error ? option.message.error : message.error;
                case httpCodes.unauthorized:
                    return option && option.message && option.message.unauthorized ? option.message.unauthorized : message.unauthorized;
                default: return "";
            }
        }

    }
})();


(function () {
    'use strict';

    function rateData() {
        return {
            Categories: [
                { value: "Personnel cost Growth rate", id: 3 },
                { value: "VA salary growth rate", id: 2 },
                { value: "Attrition rate", id: 1 }
            ]
        };
    }

    angular
        .module('BPT')
        .constant('rateData', rateData());
})();





(function () {
    'use strict';

    angular
        .module('BPT')
        .constant('RevenueData', RevenueData());

    function RevenueData() {
        return {
            ServiceLines: [
                 { value: "Application embedded software", text: "Application embedded software" },
                 { value: "Application non-embedded software", text: "Application non-embedded software" },
                 { value: "Application software development", text: "Application software development" },
                 { value: "Application software domain dependent", text: "Application software domain dependent" },
                 { value: "Business Services Processes", text: "Business Services Processes" },
                 { value: "Design Services", text: "Design Services" },
                 { value: "ERP Services", text: "ERP Services" },
                 { value: "Non ERP", text: "Non ERP" },
                 { value: "Testing & Validation", text: "Testing & Validatione" },
            ],
            RBEIBusinessUnits: [
                { value: "BE1", text: "BE1" },
                { value: "BE2", text: "BE2" },
                { value: "BE3", text: "BE3" },
                { value: "BS", text: "BS" }
            ],
            YesNoOption: [
                 { value: true, text: "Yes" },
                 { value: false, text: "No" }
            ],
            WorkingSites: [
                { value: true, text: "Onsite" },
                { value: false, text: "Offshore" },
            ],
            DirectTypes: [
                { value: "Direct", text: "Direct" },
                { value: "Direct-PE", text: "Direct-PE" },
                { value: "Indirect", text: "Indirect" }
            ],
            Currencies: [
                { value: "USD", text: "USD" },
                { value: "EUR", text: "EUR" },
                { value: "JPY", text: "JPY" }
            ],
            KeyRevenues: [
                { value: "Onsite", text: "Onsite" },
                { value: "Direct billing", text: "Direct billing" },
                { value: "Japan revenue", text: "Japan revenue" },
                { value: "Global customer", text: "Global customer" }
            ]

        }
    }

})();
(function () {
    'use strict';

    angular
        .module('BPT')
        .constant('TravelData', TravelData());

    function TravelData() {
        return {
            Purposes: [
                { value: "Business Project", text: "Business/Project" },
                { value: "Training", text: "Training" },
                { value: "Secondary Travel", text: "Secondary travel" },
                { value: "3rd Party Travel", text: "3rd party travel" },
                { value: "Recruitment", text: "Recruitment" }
            ],
            VisaTypes:{
                WorkPermit: "Work Permit",
                BusinessVisa: "Business Visa",
                InlandTravel: "Inland travel"
            },
            AllowanceSubType: {
                Living: "Living",
                Lodging: "Lodging"
            },
            LevelRanges: {
                LowAssociateLevel: 54,
                HightAssociateLevel: 55
            }
        };
    }

})();





(function () {
    'use strict';

    angular
        .module('BPT')
        .factory('utilitiesService', utilitiesService);

    utilitiesService.$inject = [];

    function utilitiesService() {
        var verbAction = {
            get: "get",
            post: "post",
            put: "put",
            delete: "delete"
        };

        var httpCodes = {
            success: 200,
            badRequest: 400,
            unProcessable: 422,
            unauthorized: 401,
            forbidden: 403,
            notFound: 404,
            notAcceptable: 406,
            serverError: 500,
            serviceUnavailable: 503,
            conflict: 409,
            notModified: 304
        };

        var message = {
            success: "Successfully!",
            error: "Error !!",
            unKnown: "UnKnown Error !!",
            unchange: "- Nothing change",
            unauthorized: "- Unauthorized access page !!!"
        };

        var action = {
            "addnew": "Add Information",
            "update": "Update Information",
            "delete": "Delete Action"
        };
        var service = {
   
            formatStringWithParams: formatStringWithParams,
            generateYears: generateYears,
            importExcel: importExcel,
            compareString: compareString,
            defaultFormatNumber: defaultFormatNumber,
            getNumberFromString: getNumberFromString,
            importExcelAsync:importExcelAsync
        };
        return service;


        function formatStringWithParams() {
            var result = arguments[0];
            for (var index = 0; index < arguments.length - 1; index++) {
                var reg = new RegExp('\\{' + index + '\\}', 'gm');
                result = result.replace(reg, arguments[index + 1]);
            }
            return result;
        }

        function generateYears() {
            var result = [];
            var currentYear = new Date().getFullYear() + 2;
            var bias = 5;
            var minYear = currentYear - bias;
            var maxYear = currentYear;
            for (var index = minYear; index <= maxYear; index++) {
                result.push({
                    value: index,
                    text: index
                });
            }
            return result;
        }

        function getNumberFromString(input) {
            var numberString = input.match(/[0-9]+/g);
            if (numberString != null)
                return parseInt(numberString);
            return 0;
        }

        function importExcel(params) {
            debugger;
            var fileName = params.inputFile.split('\\').pop();
                params.scope.vm.importFileName = fileName;
                params.scope.vm.isUpdating = true;
                var file = $('#ImportFile').prop("files")[0];
                var formData = new FormData();
                formData.append("FileUpload", file);
                params.scope.$apply();
                $('.loader').show();
            $.ajax({
                type: "POST",
                url: params.url,
                data: formData,
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function(response) {
                    toastr.info(response, "Info");
                    showMessageAction('post', response.status, null);
                    $('.loader').fadeOut(1);
                    console.log(response);
                    params.callback();

                },
                error: function(error) {
                    toastr.info(error.message, "Info");
                    console.log(error);
                    showMessageAction('post', error.status, null);
                    $('.loader').fadeOut(1);
                    return error;
                }
            });

        }
        function importExcelAsync(params) {
            var fileName = params.inputFile.split('\\').pop();
                params.scope.vm.importFileName = fileName;
                params.scope.vm.isUpdating = true;
                var file = $('#'+params.id).prop("files")[0];
                var formData = new FormData();
                formData.append("FileUpload", file);
                params.scope.$apply();
            return $.ajax({
                type: "POST",
                url: params.url,
                data: formData,
                dataType: 'json',
                contentType: false,
                processData: false
            });

        }
        function compareString(first, second) {
            if (!first || !second) {
                return false;
            } else {
                return first.toUpperCase() === second.toUpperCase();
            }
        }

        function defaultFormatNumber(number) {
            if (number == null || number == 0) return '';
            if (number < 0) return '(' + (number * -1).toLocaleString('en-US') + ')';
            return number.toLocaleString('en-US');
        }

        function showMessageAction(verb, status, option) {
            var messageTemplate = "{0} {1}";
            var displayMessage = getMessage(status, option);
            switch (verb) {
                case verbAction.post:
                    displayMessage = option && option.message ? displayMessage : formatStringWithParams(messageTemplate, action.addnew, displayMessage);
                    showToastr(status, displayMessage);
                    break;
                case verbAction.put:
                    displayMessage = option && option.message ? displayMessage : formatStringWithParams(messageTemplate, action.update, displayMessage);
                    showToastr(status, displayMessage);
                    break;
                case verbAction.delete:
                    displayMessage = option && option.message ? displayMessage : formatStringWithParams(messageTemplate, action.delete, displayMessage);;
                    showToastr(status, displayMessage);
                    break;
                default: break;
            }
        }
        function showToastr(status, messages) {
            switch (status) {
                case httpCodes.success:
                    toastr.success(messages, "Success");
                    break;
                case httpCodes.badRequest:
                case httpCodes.unProcessable:
                case httpCodes.notFound:
                case httpCodes.serverError:
                case httpCodes.serviceUnavailable:
                case httpCodes.unauthorized:
                    toastr.warning(messages, "Warning");
                    break;
                default: break;
            }
        }

        function getMessage(status, option) {
            switch (status) {
                case httpCodes.success:
                    return option && option.message && option.message.success ? option.message.success : message.success;
                case httpCodes.badRequest:
                case httpCodes.unProcessable:
                case httpCodes.notFound:
                case httpCodes.serverError:
                case httpCodes.serviceUnavailable:
                    return option && option.message && option.message.error ? option.message.error : message.error;
                case httpCodes.unauthorized:
                    return option && option.message && option.message.unauthorized ? option.message.unauthorized : message.unauthorized;
                default: return "";
            }
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('BPT')
        .directive('comment', ["$parse", "$q", 'commentService', 'authService', 'lodash', 'utilitiesService', '$compile', function ($parse, $q, commentService, authService, lodash, utilitiesService, $compile) {

            var contextMenus = [];
            var $currentContextMenu = null;
            var defaultItemText = "New Item";

            var removeContextMenus = function (level) {
                /// <summary>Remove context menu.</summary>
                while (contextMenus.length && (!level || contextMenus.length > level)) {
                    contextMenus.pop().remove();
                }
                if (contextMenus.length == 0 && $currentContextMenu) {
                    $currentContextMenu.remove();
                }
            };

            var processTextItem = function ($scope, item, text, event, model, $promises, nestedMenu, $) {
                "use strict";

                var $a = $('<a>');
                $a.css("padding-right", "8px");
                $a.css("color", "white");
                $a.attr({ tabindex: '-1', href: '#' });

                if (typeof item[0] === 'string') {
                    text = item[0];
                }
                else if (typeof item[0] === "function") {
                    text = item[0].call($scope, $scope, event, model);
                } else if (typeof item.text !== "undefined") {
                    text = item.text;
                }

                var $promise = $q.when(text);
                $promises.push($promise);
                $promise.then(function (text) {
                    if (nestedMenu) {
                        $a.css("cursor", "default");
                        $a.append($('<strong style="font-family:monospace;font-weight:bold;float:right;">&gt;</strong>'));
                    }
                    $a.append(text);
                });

                return $a;
            };

            var processItem = function ($scope, event, model, enabled, item, $ul, $li, $promises, $q, $, level) {
                /// <summary>Process individual item</summary>
                "use strict";
                // nestedMenu is either an Array or a Promise that will return that array.
                var nestedMenu = angular.isArray(item[1]) || (item[1] && angular.isFunction(item[1].then))
                  ? item[1] : angular.isArray(item[2]) || (item[2] && angular.isFunction(item[2].then))
                  ? item[2] : angular.isArray(item[3]) || (item[3] && angular.isFunction(item[3].then))
                  ? item[3] : null;

                // if html property is not defined, fallback to text, otherwise use default text
                // if first item in the item array is a function then invoke .call()
                // if first item is a string, then text should be the string.

                var text = defaultItemText;
                if (typeof item[0] === 'function' || typeof item[0] === 'string' || typeof item.text !== "undefined") {
                    text = processTextItem($scope, item, text, event, model, $promises, nestedMenu, $);
                }
                else if (typeof item.html === 'function') {
                    // leave styling open to dev
                    text = item.html($scope);
                }
                else if (typeof item.html !== "undefined") {
                    // leave styling open to dev
                    text = item.html;
                }

                $li.append(text);

                registerEnabledEvents($scope, enabled, item, $ul, $li, nestedMenu, model, text, event, $, level);
            };

            var handlePromises = function ($ul, level, event, $promises) {
                /// <summary>
                /// calculate if drop down menu would go out of screen at left or bottom
                /// calculation need to be done after element has been added (and all texts are set; thus thepromises)
                /// to the DOM the get the actual height
                /// </summary>
                "use strict";
                $q.all($promises).then(function () {
                    var topCoordinate = event.pageY;
                    var menuHeight = angular.element($ul[0]).prop('offsetHeight');
                    var winHeight = event.view.innerHeight;
                    if (topCoordinate > menuHeight && winHeight - topCoordinate < menuHeight) {
                        topCoordinate = event.pageY - menuHeight;
                    } else if (winHeight <= menuHeight) {
                        // If it really can't fit, reset the height of the menu to one that will fit
                        angular.element($ul[0]).css({ "height": winHeight - 5, "overflow-y": "scroll" });
                        // ...then set the topCoordinate height to 0 so the menu starts from the top
                        topCoordinate = 0;
                    } else if (winHeight - topCoordinate < menuHeight) {
                        var reduceThreshold = 5;
                        if (topCoordinate < reduceThreshold) {
                            reduceThreshold = topCoordinate;
                        }
                        topCoordinate = winHeight - menuHeight - reduceThreshold;
                    }

                    var leftCoordinate = event.pageX;
                    var menuWidth = angular.element($ul[0]).prop('offsetWidth');
                    var winWidth = event.view.innerWidth;
                    var rightPadding = 5;
                    if (leftCoordinate > menuWidth && winWidth - leftCoordinate - rightPadding < menuWidth) {
                        leftCoordinate = winWidth - menuWidth - rightPadding;
                    } else if (winWidth - leftCoordinate < menuWidth) {
                        var reduceThreshold = 5;
                        if (leftCoordinate < reduceThreshold + rightPadding) {
                            reduceThreshold = leftCoordinate + rightPadding;
                        }
                        leftCoordinate = winWidth - menuWidth - reduceThreshold - rightPadding;
                    }

                    $ul.css({
                        display: 'block',
                        position: 'absolute',
                        left: leftCoordinate + 'px',
                        top: topCoordinate + 'px'
                    });
                });
            };

            var registerEnabledEvents = function ($scope, enabled, item, $ul, $li, nestedMenu, model, text, event, $, level) {
                /// <summary>If item is enabled, register various mouse events.</summary>
                if (enabled) {
                    var openNestedMenu = function ($event) {
                        removeContextMenus(level + 1);
                        /*
                         * The object here needs to be constructed and filled with data
                         * on an "as needed" basis. Copying the data from event directly
                         * or cloning the event results in unpredictable behavior.
                         */
                        var ev = {
                            pageX: event.pageX + $ul[0].offsetWidth - 1,
                            pageY: $ul[0].offsetTop + $li[0].offsetTop - 3,
                            view: event.view || window
                        };

                        /*
                         * At this point, nestedMenu can only either be an Array or a promise.
                         * Regardless, passing them to when makes the implementation singular.
                         */
                        $q.when(nestedMenu).then(function (promisedNestedMenu) {
                            renderContextMenu($scope, ev, promisedNestedMenu, model, level + 1);
                        });
                    };

                    $li.on('click', function ($event) {
                        $event.preventDefault();
                        $scope.$apply(function () {
                            if (nestedMenu) {
                                openNestedMenu($event);
                            } else {
                                $(event.currentTarget).removeClass('context');
                                removeContextMenus();

                                if (angular.isFunction(item[1])) {
                                    item[1].call($scope, $scope, event, model, text)
                                } else {
                                    item.click.call($scope, $scope, event, model, text);
                                }
                            }
                        });
                    });

                    $li.on('mouseover', function ($event) {
                        $scope.$apply(function () {
                            if (nestedMenu) {
                                openNestedMenu($event);
                            }
                        });
                    });
                } else {
                    $li.on('click', function ($event) {
                        $event.preventDefault();
                    });
                    $li.addClass('disabled');
                }
            };

            var currentTarget;
            var renderContextMenu = function ($scope, event, options, model, level, customClass) {
                /// <summary>Render context menu recursively.</summary>                
                if (!level) { level = 0; }
                if (!$) { var $ = angular.element; }
                $(event.currentTarget).addClass('context');
                currentTarget = event.currentTarget;

                if (hasComment()) {
                    options[0][0] = 'Remove Comment';
                }

                if (hasPressSheet()) {
                    options[1][0] = 'Remove Spreadsheet';
                }

                var $contextMenu = $('<div>');
                if ($currentContextMenu) {
                    $contextMenu = $currentContextMenu;
                } else {
                    $currentContextMenu = $contextMenu;
                    $contextMenu.addClass('angular-bootstrap-contextmenu dropdown clearfix');
                }
                if (customClass) {
                    $contextMenu.addClass(customClass);
                }
                var $ul = $('<ul>');
                $ul.addClass('dropdown-menu');
                $ul.attr({ 'role': 'menu' });
                $ul.css({
                    display: 'block',
                    position: 'absolute',
                    left: event.pageX + 'px',
                    top: event.pageY + 'px',
                    "z-index": 10000,
                    'background-color': '#3C8DBC'
                });

                var $promises = [];

                angular.forEach(options, function (item) {

                    // if item is object, and has enabled prop invoke the prop
                    // els if fallback to item[2]
                    var isVisibled = function () {
                        if (typeof item.enabled !== "undefined") {
                            return item.enabled.call($scope, $scope, event, model);
                        } else if (typeof item[2] === "function") {
                            return item[2].call($scope, $scope, event, model);
                        } else {
                            return true;
                        }
                    };

                    if (isVisibled(item)) {
                        var $li = $('<li>');
                        if (item === null) {
                            $li.addClass('divider');
                        } else if (typeof item[0] === "object") {
                            //custom.initialize($li, item);
                        } else {
                            processItem($scope, event, model, true, item, $ul, $li, $promises, $q, $, level);
                        }
                        $ul.append($li);
                    }
                });
                $contextMenu.append($ul);
                var height = Math.max(
                    document.body.scrollHeight, document.documentElement.scrollHeight,
                    document.body.offsetHeight, document.documentElement.offsetHeight,
                    document.body.clientHeight, document.documentElement.clientHeight
                );
                $contextMenu.css({
                    width: '100%',
                    height: height + 'px',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 9999,
                    //"max-height": window.innerHeight - 3,
                });
                $(document).find('body').append($contextMenu);

                handlePromises($ul, level, event, $promises);

                $contextMenu.on("mousedown", function (e) {
                    if ($(e.target).hasClass('dropdown')) {
                        $(event.currentTarget).removeClass('context');
                        removeContextMenus();
                    }
                })
                .on('contextmenu', function (event) {                    
                    $(event.currentTarget).removeClass('context');
                    event.preventDefault();
                    removeContextMenus(level);
                });

                $scope.$on("$destroy", function () {
                    removeContextMenus();
                });

                contextMenus.push($ul);
            };

            function isTouchDevice() {
                return 'ontouchstart' in window        // works on most browsers
                    || navigator.maxTouchPoints;       // works on IE10/11 and Surface
            };

            function createCommentPopover($itemScope) {
                if ($(document).find('#popover-content-block').length == 0) {
                    var popoverDOM = '<div id="popover-content-block" class="hide">' +
                                        '<div class="comment-content small"></div>' +
                                        '<h6 class="small"><a href="javascript:void(0)" class="view-full-comment">View Full Comment</a></h6>' +
                                    '</div>';

                    $(document).find('body').append(popoverDOM);

                    if (hasPressSheet()) {
                        if ($(currentTarget).children('input').is(':visible')) {
                            $('#popover-content-block').append($('<h6 class="small"><a href="javascript:void(0)" class="edit-press-sheet">Edit Spreadsheet</a></h6>'));
                        } else {
                            $('#popover-content-block').append($('<h6 class="small"><a href="javascript:void(0)" class="view-press-sheet">View Spreadsheet</a></h6>'));
                        }
                    }
                }

                removeCurrentPopoverIfExist();

                var $a = $('<a>');
                $a.css('float', 'right');
                $a.attr('data-toggle', 'popover');
                $a.attr('data-trigger', 'manual');
                $a.attr('data-container', 'body');
                $a.attr('data-placement', 'right');
                $a.attr('data-html', 'true');
                $a.attr('title', '<h6 class="medium comment-meta"><a href="javascript:void(0)">' + $(currentTarget).attr('comment-user') + '</a> ' + $(currentTarget).attr('comment-time') + '</h6>');
                $(currentTarget).append($a);
                $('#popover-content-block').find('.comment-content').html($(currentTarget).attr('comment-content'));
                $a.popover({
                    html: true,
                    content: function () {
                        return $('#popover-content-block').html();
                    }
                });

                hideAllPopovers();
                $(currentTarget).find('a').popover('show');

                $('.popover-content').find('.view-full-comment').on('click', function () {
                    $(currentTarget).find('a').popover('hide');
                    showDialog();
                });

                $('.popover-content').find('.view-press-sheet').on('click', function () {
                    $(currentTarget).find('a').popover('hide');
                    showViewPressSheetDialog();
                });

                $('.popover-content').find('.edit-press-sheet').on('click', function () {
                    $(currentTarget).find('a').popover('hide');
                    var pressSheets = JSON.parse($(currentTarget).attr('press-sheet-content'));
                    showEditablePressSheetDialog($itemScope, pressSheets);
                });
            }

            function generatePressSheetDOM(pressSheets) {
                var $table = $('<table class="table table-striped table-hover table-bordered full-width-table table-press-sheet-hover">' +
                    '<thead>' +
                    '<tr>' +
                    '<th>Name</th>' +
                    '<th>Value</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                    '<tr class="summary">' +
                    '<td><strong><label>Summary</label></strong></td>' +
                    '<td colspan="2"><strong><span class="summary-value"></span></strong></td>' +
                    '</tr>' +
                    '</tbody>' +
                    '</table>');

                for (var key in pressSheets) {
                    if (key != 'Summary') {
                        var $tr = $('<tr>');

                        var $tdName = $('<td>');
                        $tdName.html(key);
                        $tr.append($tdName);

                        var $tdValue = $('<td>');
                        $tdValue.html(utilitiesService.defaultFormatNumber(pressSheets[key]));
                        $tr.append($tdValue);

                        $tr.insertBefore($table.find('.summary'));
                    } else {
                        $($table.find('.summary-value')).html(utilitiesService.defaultFormatNumber(pressSheets[key]));
                    }
                }

                return $table;
            }
            function createPressSheetPopover($scope) {
                if ($(document).find('#popover-press-sheet-block').length == 0) {
                    var popoverDOM = '<div id="popover-press-sheet-block" class="hide">' +
                        '<div class="press-sheet-content small">Table</div>' +
                        '<h6 class="small"><a href="javascript:void(0)" class="edit-press-sheet">Edit Spreadsheet</a></h6>' +
                        '</div>';

                    $(document).find('body').append(popoverDOM);
                }
                
                if ($(currentTarget).children('input').is(':visible') == false) {
                    $('.edit-press-sheet').hide();
                } else {
                    $('.edit-press-sheet').show();
                }

                removeCurrentPopoverIfExist();

                var $a = $('<a>');
                $a.css('float', 'right');
                $a.attr('data-toggle', 'popover');
                $a.attr('data-trigger', 'manual');
                $a.attr('data-container', 'body');
                $a.attr('data-placement', 'right');
                $a.attr('data-html', 'true');
                $a.attr('title', '<h6 class="medium comment-meta"><a href="javascript:void(0)">' + $(currentTarget).attr('press-sheet-user') + '</a> ' + $(currentTarget).attr('press-sheet-time') + '</h6>');
                $(currentTarget).append($a);

                var pressSheets = JSON.parse($(currentTarget).attr('press-sheet-content'));
                var table = generatePressSheetDOM(pressSheets);
                $('.press-sheet-content').html(table);

                $a.popover({
                    html: true,
                    content: function () {
                        return $('#popover-press-sheet-block').html();
                    }
                });

                hideAllPopovers();
                $(currentTarget).find('a').popover('show');

                $('.popover-content').find('.edit-press-sheet').on('click', function () {
                    $(currentTarget).find('a').popover('hide');
                    showEditablePressSheetDialog($scope, pressSheets);
                });
            }

            function markAsNote(element, comment) {
                var content = comment.Content.length > 100 ? comment.Content.substring(0, 100) + '...' : comment.Content;
                $(element).attr('comment-user', comment.User.EmpName);
                $(element).attr('comment-time', comment.ShortAddedDateString);
                $(element).attr('comment-content', content);
                $(element).addClass('note');
            }

            function markAsPressSheet(element, $itemScope, pressSheet, summaryValue) {
                $(element).addClass('press-sheet');
                $(element).attr('press-sheet-id', pressSheet.Id);
                $(element).attr('press-sheet-user', pressSheet.User.EmpName);
                $(element).attr('press-sheet-time', pressSheet.ShortAddedDateString);
                $(element).attr('press-sheet-content', pressSheet.Content);

                if ($itemScope != null) {
                    var $input = $(currentTarget).children('input:last');
                    if ($input.length > 0) {
                        var model = $input.attr('ng-model');
                        if (model != null) {
                            $input.val(summaryValue);
                            $itemScope.$eval(model + '=' + summaryValue)
                        }
                    }
                }
            }

            function hideAllPopovers() {
                $("[data-toggle=popover]").popover('hide');
            }

            function showDialog() {
                var modalDialogDOM = '<div class="modal fade comment-modal" id="commentModal" role="dialog">' +
                                    '<div class="modal-dialog">' +
                                      '<div class="modal-content">' +
                                        '<div class="modal-header">' +
                                          '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                                          '<h4 class="modal-title">Your Comment</h4>' +
                                        '</div>' +
                                        '<div class="modal-body">' +
                                            '<script>' +
                                                'var CKEDITOR_BASEPATH = "/Scripts/ckeditor/";' +
			                                    'CKEDITOR.replace("commentText");' +
                                            '</script>' +
                                          '<form novalidate>' +
                                            '<div class="form-group">' +
                                                '<textarea rows="5" name="commentText" id="commentText" class="editable-input form-control input-sm" required style="width:570px;"/>' +
                                            '</div>' +
                                            '<div class="form-group">' +
                                                 '<div class="modal-footer">' +
                                                    '<button type="button" class="btn btn-default" data-dismiss="modal" id="btn-close">Close</button>' +
                                                    '<button type="button" class="btn btn-primary" data-dismiss="modal" id="btn-add">Add</button>' +
                                                    '<button type="button" class="btn btn-primary" data-dismiss="modal" id="btn-update">Update</button>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div class="form-group comment-block">' +
                                            '</div>' +
                                          '</form>' +

                                        '</div>' +
                                      '</div>' +
                                    '</div>' +
                                  '</div>' +
                                '</div>';

                $(document).find('body').append(modalDialogDOM);

                $('.comment-modal').on('hidden.bs.modal', function () {
                    $(document).find('#commentModal').remove();
                })

                $('#btn-add').on('click', function () {
                    processPostComment();
                });

                $('#btn-update').on('click', function () {
                    var commentId = parseInt($('#commentText').attr('comment-id'));
                    processPutComment(commentId);
                });

                populateCommentDOM();

                $('#btn-update').hide();
                $('#commentText').val('');
                $("#commentModal").modal();
            }

            function showViewPressSheetDialog() {
                var pressSheets = JSON.parse($(currentTarget).attr('press-sheet-content'));
                var table = generatePressSheetDOM(pressSheets);
                var modalDialogDOM = '<div class="modal fade comment-modal" id="pressSheetModal" role="dialog">' +
                    '<div class="modal-dialog">' +
                        '<div class="modal-content">' +
                            '<div class="modal-header">' +
                                '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                                '<h4 class="modal-title">Your Spreadsheet</h4>' +
                            '</div>' +
                            '<div class="modal-body">' +
                                table[0].outerHTML +
                                '<div class="form-group">' +
                                    '<div class="modal-footer">' +
                                        '<button type="button" class="btn btn-default" data-dismiss="modal" id="btn-close">Close</button>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '</div>';

                $('#pressSheetModal').remove();
                $(document).find('body').append(modalDialogDOM);
                $("#pressSheetModal").modal();
            }

            function showEditablePressSheetDialog($itemScope, pressSheets) {
                var modalDialogDOM = '<div class="modal fade comment-modal" id="pressSheetModal" role="dialog">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                    '<h4 class="modal-title">Your Spreadsheet</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<form novalidate>' +
                    '<div class="form-group">' +
                    '<table class="table table-striped table-hover table-bordered full-width-table table-press-sheet">' +
                        '<thead>' +
                            '<tr>' +
                                '<th>Name</th>' +
                                '<th>Value</th>' +
                                '<th>Action</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                            '<tr>' +
                                '<td><input class="form-control" type="text" /></td>' +
                                '<td><input class="form-control col-value" type="number" /></td>' +
                                '<td><button type="button" title="Remove row" disabled class="btn btn-primary btn-remove"><span class="glyphicon glyphicon-minus"></span></button></td>' +
                            '</tr>' +
                            '<tr class="summary">' +
                                '<td><strong><label>Summary</label></strong></td>' +
                                '<td colspan="2"><strong><span class="summary-value"></span></strong></td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>' +

                    '<div class="form-group">' +
                    '<button type= "button" title="Add row" class="btn btn-warning" id="btn-add-row"><span class="glyphicon glyphicon-plus"></span></button>' +
                    '</div>' +

                    '</div>' +
                    '<div class="form-group">' +
                    '<div class="modal-footer">' +
                    '<button type="button" class="btn btn-default" data-dismiss="modal" id="btn-close">Close</button>' +
                    '<button type="button" class="btn btn-primary" data-dismiss="modal" id="btn-add-press-sheet">Add</button>' +
                    '<button type="button" class="btn btn-primary" data-dismiss="modal" id="btn-update-press-sheet">Update</button>' +
                    '</div>' +
                    '</div>' +
                    '</form>' +

                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                $('#pressSheetModal').remove();
                $(document).find('body').append(modalDialogDOM);

                if (pressSheets != null) {
                    for (var key in pressSheets) {
                        if (key != 'Summary') {
                            var row = $('.table-press-sheet').find('tbody').children('tr').not('.summary').last()[0];
                            var newRow = $(row).clone().insertAfter(row);
                            newRow.find('input:first').val(key);
                            newRow.find('input:last').val(pressSheets[key]);
                            newRow.find('button').removeAttr('disabled');
                        } else {
                            $('.summary-value').html(utilitiesService.defaultFormatNumber(pressSheets[key]));
                        }
                    }

                    $('.table-press-sheet').find('tbody').children('tr').first().remove();
                    if ($('.table-press-sheet').find('tbody').children('tr').not('.summary').length == 1) {
                        $('.table-press-sheet').find('button').attr('disabled', true);
                    }

                    $('#btn-add-press-sheet').hide();
                    $('#btn-update-press-sheet').show();
                } else {
                    $('#btn-update-press-sheet').hide();
                    $('#btn-add-press-sheet').show
                }

                $('#pressSheetModal').on('hidden.bs.modal', function () {
                    $(this).remove();
                })

                $('#btn-add-row').on('click', function () {
                    var newRow = $('.table-press-sheet').find('tbody').children('tr').not('.summary').last()[0];
                    $(newRow).clone().insertAfter(newRow).find('input').val('');
                    $('.table-press-sheet').find('button').removeAttr('disabled');
                });

                $('.table-press-sheet').delegate('.btn-remove', 'click', function () {
                    $(this).parents('tr').remove();
                    calcSummary();
                    if ($('.table-press-sheet').find('tbody').children('tr').not('.summary').length == 1) {
                        $('.table-press-sheet').find('button').attr('disabled', true);
                    }
                });

                function calcSummary() {
                    $('.summary-value').text(utilitiesService.defaultFormatNumber(getSummaryValue()));
                }

                function getJSONString() {
                    var jsonModel = {};
                    var elements = $('.table-press-sheet').find('tbody').children('tr').not('.summary');
                    for (var i = 0; i < elements.length; i++) {
                        var tr = elements[i];
                        var name = $(tr).find('input:first').val();
                        var value = $(tr).find('input:last').val();
                        if (name != '' && value != '') {
                            jsonModel[name] = parseFloat(value);
                        }
                    }

                    jsonModel['Summary'] = getSummaryValue();

                    return JSON.stringify(jsonModel);
                }

                $('.table-press-sheet').delegate('.col-value', 'keyup click', function () {
                    calcSummary();
                });

                $('#btn-add-press-sheet').on('click', function () {
                    processPostPressSheet($itemScope, getJSONString());
                });

                $('#btn-update-press-sheet').on('click', function () {
                    var pressSheetId = parseInt($(currentTarget).attr('press-sheet-id'));
                    processPutPressSheet($itemScope, pressSheetId, getJSONString());
                });

                $("#pressSheetModal").modal();
            }

            function getSummaryValue(jsonString) {
                if (jsonString == null) {
                    var value = 0;
                    $('.table-press-sheet').find('.col-value').each(function () {
                        var colValue = parseFloat($(this).val());
                        if (!isNaN(colValue)) {
                            value += colValue;
                        }
                    });

                    return value;
                } else {
                    var pressSheet = JSON.parse(jsonString);
                    return pressSheet['Summary'];
                }
            }

            function populateCommentDOM() {
                $('.comment-block').empty();
                var commentThread = getCurrentCommentThread();
                if (commentThread) {
                    var comments = lodash.filter(commentThread.Comments, { IsPressSheet: false, IsActive: true });
                    lodash.forEach(comments, function (comment) {
                        $('.comment-block').append('<div class="comment mb-2 row" comment-user-id="' + comment.User.Id + '" comment-id="' + comment.Id + '">' +
                         '	<div class="comment-avatar col-md-2 col-sm-2 text-center pr-1">' +
                         '		<img class="mx-auto rounded-circle img-fluid" src="https://rb-owa.apac.bosch.com/ews/exchange.asmx/s/GetUserPhoto?email=' + comment.User.Email + '&amp;size=HR120x120"' + 'alt="">' +
                         '	</div>' +
                         '	<div class="comment-content col-md-9 col-sm-10">' +
                         '		<h6 class="small comment-meta"><a href="javascript:void(0)">' + comment.User.EmpName + '</a> ' + comment.ShortAddedDateString + '</h6>' +
                         '		<div class="comment-body">' +
                         '			<p>' + comment.Content + '</p>' +
                         '		</div>' +
                         '	</div>' +
                         '</div>'
                        );
                    });

                    $('.comment').hover(processEventMouseOverComment, processEventMouseLeaveComment);
                }
                $('.comment-block').scrollTop(5000);
            }

            function processEventMouseOverComment(event) {
                var commentThread = getCurrentCommentThread();
                if (commentThread == null) { return; }

                var comments = commentThread.Comments;

                var element = event.currentTarget;
                $(element).css({
                    'background-color': '#ECF0F5'
                });

                if ($(element).attr('comment-user-id') == authService.currentUser.UserId.toString()) {
                    $(element).append('<div class="comment-bar">' +
                        '<i class="glyphicon glyphicon-pencil pointer edit-comment" aria-hidden="true"></i>' +
                        '&nbsp;' +
                        '<i class="glyphicon glyphicon-trash pointer remove-comment" aria-hidden="true"></i>' +
                     '</div>');

                    $('.edit-comment').on('click', function (event) {
                        var comment = lodash.find(comments, {
                            Id: parseInt($(event.currentTarget).closest('.comment').attr('comment-id'))
                        });
                        CKEDITOR.instances.commentText.setData(comment.Content);
                        $('#commentText').attr('comment-id', comment.Id);
                        $('#btn-add').hide();
                        $('#btn-update').show();
                    });

                    $('.remove-comment').on('click', function (event) {
                        var commentId = parseInt($(event.currentTarget).closest('.comment').attr('comment-id'));
                        var dialogBoxDOM = '<div class="modal fade" id="deleteComment" role="dialog" aria-labelledby="myModalLabel" comment-id="' + commentId + '" aria-hidden="true">' +
                                        '<div class="modal-dialog">' +
                                            '<div class="modal-content">' +
                                                '<div class="modal-header">Confirm delete comment</div>' +
                                                '<div class="modal-body"><p>Are you sure you want to delete this comment?</p></div>' +
                                                '<div class="modal-footer">' +
                                                    '<a id="bt-modal-cancel" href="#" class="btn btn-default" data-dismiss="modal">Cancel</a>' +
                                                    '<a id="bt-modal-confirm" class="btn btn-danger btn-ok btn-delete-comment" data-dismiss="modal">Delete</a>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>';

                        $(document).find('body').append(dialogBoxDOM);

                        $('#deleteComment').on('hidden.bs.modal', function () {
                            $(document).find('#deleteComment').remove();
                        });

                        $('.btn-delete-comment').on('click', function () {
                            var commentId = parseInt($('#deleteComment').attr('comment-id'));
                            commentService.removeComment(commentId).then(function (response) {
                                if (response) {
                                    var commentThread = getCurrentCommentThread();
                                    var comment = lodash.find(commentThread.Comments, { Id: commentId });
                                    var index = commentThread.Comments.indexOf(comment);
                                    commentThread.Comments.splice(index, 1);
                                    populateCommentDOM();
                                    updateNote(commentThread.PartitionKey, commentThread.UniqueKey);
                                }
                            });
                        });

                        $("#deleteComment").modal();
                    });
                }
            }

            function processEventMouseLeaveComment(event) {
                var element = event.currentTarget;
                $(element).css({
                    'background-color': 'white'
                });
                $(element).find('.comment-bar').remove();
            }

            function getPartitionKey() {
                return $(currentTarget).closest('table').attr('binding-partition-key');
            }

            function getUniqueKey() {
                return $(currentTarget).attr('binding-unique-key');
            }

            function getCurrentCommentThread() {
                var partitionKey = getPartitionKey();
                var uniqueKey = getUniqueKey();
                var commentThread = lodash.find(commentService.commentThreads[partitionKey], { UniqueKey: uniqueKey });
                return commentThread;
            }

            function processPostComment() {
                var partitionKey = getPartitionKey();
                var comment = {
                    UserId: authService.currentUser.UserId,
                    UniqueKey: getUniqueKey(),
                    Content: CKEDITOR.instances.commentText.getData(),
                    AddedDate: new Date(),
                    AddedByUserId: authService.currentUser.UserId,
                    UpdatedDate: new Date(),
                    UpdatedUserId: authService.currentUser.UserId,
                    IsActive: true,
                    IsPressSheet: false
                };

                commentService.addOrUpdateComment(partitionKey, comment).then(function () {
                    updateNote(partitionKey, comment.UniqueKey);
                });
            }

            function processPutComment(commentId) {
                var partitionKey = getPartitionKey();
                var comment = {
                    Id: commentId,
                    UserId: authService.currentUser.UserId,
                    UniqueKey: getUniqueKey(),
                    Content: CKEDITOR.instances.commentText.getData(),
                    UpdatedDate: new Date(),
                    UpdatedUserId: authService.currentUser.UserId
                };

                commentService.addOrUpdateComment(partitionKey, comment).then(function () {
                    updateNote(partitionKey, comment.UniqueKey);
                });
            }

            function processPostPressSheet($itemScope, jsonString) {
                var partitionKey = getPartitionKey();
                var pressSheet = {
                    UserId: authService.currentUser.UserId,
                    UniqueKey: getUniqueKey(),
                    Content: jsonString,
                    AddedDate: new Date(),
                    AddedByUserId: authService.currentUser.UserId,
                    UpdatedDate: new Date(),
                    UpdatedUserId: authService.currentUser.UserId,
                    IsActive: true,
                    IsPressSheet: true
                };

                commentService.addOrUpdateComment(partitionKey, pressSheet).then(function () {
                    updatePressSheet($itemScope, partitionKey, pressSheet.UniqueKey);
                });
            }

            function processPutPressSheet($itemScope, pressSheetId, jsonString) {
                var partitionKey = getPartitionKey();
                var pressSheet = {
                    Id: pressSheetId,
                    UserId: authService.currentUser.UserId,
                    UniqueKey: getUniqueKey(),
                    Content: jsonString,                                        
                    UpdatedDate: new Date(),
                    UpdatedUserId: authService.currentUser.UserId,                                        
                };
                commentService.addOrUpdateComment(partitionKey, pressSheet).then(function () {
                    updatePressSheet($itemScope, partitionKey, pressSheet.UniqueKey);
                });
            }

            function updateNote(partitionKey, uniqueKey) {
                commentService.getCommentThreads(partitionKey).then(function () {
                    var latestComment = findLatestComment(partitionKey, uniqueKey);
                    if (latestComment != null) {
                        markAsNote(currentTarget, latestComment);
                    }
                });
            }

            function updatePressSheet($itemScope, partitionKey, uniqueKey) {
                commentService.getCommentThreads(partitionKey).then(function () {
                    var pressSheet = findPressSheet(partitionKey, uniqueKey);
                    if (pressSheet != null) {
                        var summaryValue = getSummaryValue(pressSheet.Content);
                        markAsPressSheet(currentTarget, $itemScope, pressSheet, summaryValue);
                    }
                });
            }

            function processRemoveCommentThread(event) {
                var partitionKey = getPartitionKey();
                var uniqueKey = getUniqueKey();

                commentService.removeCommentThread(partitionKey, uniqueKey).then(function (response) {
                    if (response) {                        
                        commentService.getCommentThreads(partitionKey).then(function () {
                            $(event.currentTarget).removeClass('note');
                            $(event.currentTarget).removeAttr('comment-text');

                            var $a = $(event.currentTarget).find('a');
                            $a.popover("destroy");
                            $a.remove();
                        });                        
                    }
                })
            }

            function processRemovePressSheet(event) {               
                var pressSheetId = parseInt($(currentTarget).attr('press-sheet-id'));
                commentService.removeComment(pressSheetId).then(function (response) {
                    if (response) {
                        var commentThread = getCurrentCommentThread();
                        var comment = lodash.find(commentThread.Comments, { Id: pressSheetId });
                        var index = commentThread.Comments.indexOf(comment);
                        commentThread.Comments.splice(index, 1);
                        
                        $(event.currentTarget).removeClass('press-sheet');
                        updatePressSheet(null, commentThread.PartitionKey, commentThread.UniqueKey);
                    }
                });
            }

            function findLatestComment(partitionKey, uniqueKey) {
                var commentThread = lodash.find(commentService.commentThreads[partitionKey], { UniqueKey: uniqueKey });
                if (commentThread != null) {
                    if (commentThread.Comments != null && commentThread.Comments.length > 0) {
                        var comments = lodash.filter(commentThread.Comments, { IsPressSheet: false, IsActive: true });
                        if (comments != null && comments.length > 0) {
                            var latestComment = comments[comments.length - 1];
                            return latestComment;
                        }
                    }
                }

                return null;
            }

            function registerComment(element, partitionKey, uniqueKey) {
                if (commentService.commentThreads[partitionKey] == null) { return; }

                var latestComment = findLatestComment(partitionKey, uniqueKey);
                if (latestComment != null) {
                    markAsNote(element, latestComment);
                }
            }

            function findPressSheet(partitionKey, uniqueKey) {
                var commentThread = lodash.find(commentService.commentThreads[partitionKey], { UniqueKey: uniqueKey });
                if (commentThread != null) {
                    if (commentThread.Comments != null && commentThread.Comments.length > 0) {
                        var comments = lodash.filter(commentThread.Comments, { IsPressSheet: true, IsActive: true });
                        if (comments != null && comments.length > 0) {
                            var latestPressSheet = comments[comments.length - 1];
                            return latestPressSheet;
                        }
                    }
                }

                return null;
            }

            function registerPressSheet(element, partitionKey, uniqueKey) {
                if (commentService.commentThreads[partitionKey] == null) { return; }

                var pressSheet = findPressSheet(partitionKey, uniqueKey);
                if (pressSheet != null) {
                    markAsPressSheet(element, null, pressSheet);
                }
            }

            function registerComments() {
                var items = $('table').find('td[comment]');
                angular.forEach(items, function (item) {
                    var partitionKey = $(item).closest('table').attr('binding-partition-key');
                    var uniqueKey = $(item).attr('binding-unique-key');
                    registerComment(item, partitionKey, uniqueKey);
                    registerPressSheet(item, partitionKey, uniqueKey);
                });
            }

            function processAddCommentThread(event) {
                if (hasComment()) {
                    processRemoveCommentThread(event);
                } else {
                    showDialog();
                }
            }

            function processAddPressSheet($itemScope, $event) {
                if (hasPressSheet()) {
                    processRemovePressSheet($event);
                } else {
                    showEditablePressSheetDialog($itemScope, null);
                }
            }

            function hasComment() {
                return $(currentTarget).hasClass('note');
            }

            function hasPressSheet() {
                return $(currentTarget).hasClass('press-sheet');
            }

            function removeCurrentPopoverIfExist() {
                $(currentTarget).find('a[data-toggle="popover"]').remove();
            }

            function processEventMouseOverCell(event, $scope) {
                if (!$) { var $ = angular.element; }

                hideAllPopovers();

                currentTarget = event.currentTarget;

                $(currentTarget).attr('original-color', $(currentTarget).css("border-color"));
                $(currentTarget).attr('original-width', $(currentTarget).css("border-width"));
                $(currentTarget).css({
                    "border-color": "#FF0000",
                    "border-width": "2px"
                });

                if (hasComment()) {
                    createCommentPopover($scope);                    
                } else if (hasPressSheet()) {
                    createPressSheetPopover($scope);
                }
            }

            function removeCommentPopover() {
                $('#popover-content-block').remove();
            }

            function removePressSheetPopover() {
                $('#popover-press-sheet-block').remove();
            }

            function processEventMouseLeaveCell(event) {
                if (!$) { var $ = angular.element; }

                var originalColor = $(currentTarget).attr('original-color');
                var orginalWidth = $(currentTarget).attr('original-width');

                $(currentTarget).css({
                    "border-color": originalColor,
                    "border-width": orginalWidth
                });

                $(currentTarget).removeAttr('original-color');
                $(currentTarget).removeAttr('original-width');

                if (hasComment()) {
                    removeCommentPopover();
                }

                if (hasPressSheet()) {
                    removePressSheetPopover();
                }

                //removeCurrentPopoverIfExist()
            }

            function processEventMouseDblClick(event) {
                hideAllPopovers();
                showDialog();
            }

            return function ($scope, element, attrs) {
                var table = $(element).closest('table');
                var partitionKeyAttr = table.attr('partition-key');
                var partitionKey = null;

                try {
                    if (partitionKeyAttr === undefined) {
                        throw 'Missing partition key on table';
                    }

                    partitionKey = $scope.$eval(partitionKeyAttr);

                } catch (err) {
                    partitionKey = partitionKeyAttr;
                } finally {
                    table.attr('binding-partition-key', partitionKey || 0);
                }

                var uniqueKey = null;
                try {
                    uniqueKey = $scope.$eval(attrs.uniqueKey);

                } catch (err) {
                    uniqueKey = attrs.uniqueKey;
                } finally {
                    $(element).attr('binding-unique-key', uniqueKey || 0);
                }

                //check $scope.comments contain comment partition key if not exist that mean new partition key of new table so call to server else ignore
                //use partition key to improve performance, avoid calling to server multiple times

                if (commentService.commentThreads[partitionKey] === undefined) {
                    commentService.commentThreads[partitionKey] = []
                    commentService.getCommentThreads(partitionKey).then(function (response) {
                        registerComments();
                    });
                } else {
                    registerComment(element, partitionKey, uniqueKey);
                    registerPressSheet(element, partitionKey, uniqueKey);
                }

                $("body").off("click").on("click", function () {
                    hideAllPopovers();
                });

                if (partitionKey.search('budget').length > 0) {
                    element.hover(function (event) {
                        processEventMouseOverCellBudget(event, $scope);
                    }, processEventMouseLeaveCellBudget);
                } else {                    
                    element.hover(function (event) {
                        processEventMouseOverCell(event, $scope);
                    }, processEventMouseLeaveCell);
                }

                element.on('dblclick', processEventMouseDblClick);

                var openMenuEvent = "contextmenu";
                if (attrs.contextMenuOn && typeof (attrs.contextMenuOn) === "string") {
                    openMenuEvent = attrs.contextMenuOn;
                }

                element.on(openMenuEvent, function (event) {
                    hideAllPopovers();
                    event.stopPropagation();
                    event.preventDefault();

                    // Don't show context menu if on touch device and element is draggable
                    if (isTouchDevice() && element.attr('draggable') === 'true') {
                        return false;
                    }

                    $scope.$apply(function () {
                        var options = [
                            ['Add Comment', function ($itemScope, $event, color) {
                                processAddCommentThread($event);
                            }],
                            ['Add Spreadsheet', function ($itemScope, $event, color) {
                                processAddPressSheet($itemScope, $event);
                            }, function () {
                                return $(currentTarget).children('input').is(':visible');                                
                            }]
                        ];

                        var customClass = attrs.contextMenuClass;
                        var model = null;
                        try {
                            model = $scope.$eval(attrs.uniqueKey);
                        } catch (err) {
                            model = attrs.uniqueKey;
                        }
                        if (options instanceof Array) {
                            if (options.length === 0) {
                                return;
                            }
                            renderContextMenu($scope, event, options, model, undefined, customClass);
                        } else {
                            throw '"' + attrs.uniqueKey + '" not an array';
                        }
                    });
                });
            };

            function processEventMouseOverCellBudget(event, $scope) {
                if (!$) { var $ = angular.element; }

                hideAllPopovers();

                currentTarget = event.currentTarget;

                $(currentTarget).attr('original-color', $(currentTarget).css("border-right-color"));
                $(currentTarget).attr('original-width', $(currentTarget).css("border-right-width"));

                $(currentTarget).css({
                    "border-top-color": "#FF0000",
                    "border-right-color": "#FF0000",
                    "border-bottom-color": "#FF0000",
                    "border-left-color": "#FF0000",
                    "border-top-width": "2px",
                    "border-right-width": "2px",
                    "border-bottom-width": "2px",
                    "border-left-width": "2px"
                });

                if (hasComment()) {
                    createCommentPopover($scope);
                } else if (hasPressSheet()) {
                    createPressSheetPopover($scope);
                }
            }

            function processEventMouseLeaveCellBudget(event) {
                if (!$) { var $ = angular.element; }

                var originalColor = $(currentTarget).attr('original-color');
                var orginalWidth = $(currentTarget).attr('original-width');

                $(currentTarget).css({
                    "border-top-color": 'transparent',
                    "border-right-color": originalColor,
                    "border-bottom-color": 'transparent',
                    "border-left-color": originalColor,
                    "border-top-width": orginalWidth,
                    "border-right-width": orginalWidth,
                    "border-bottom-width": orginalWidth,
                    "border-left-width": orginalWidth
                });

                $(currentTarget).removeAttr('original-color');
                $(currentTarget).removeAttr('original-width');
            }
        }]);
})();

(function() {
    'use strict';

    angular
        .module('BPT')
        .directive('enterAction', EnterDirective);

    function EnterDirective() {
        return function (scope, element, attrs) {
            element.bind('keydown keypress', function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.enterAction);
                    });

                    event.preventDefault();
                }
            });
        };
    }
})();

(function () {
    angular.module("BPT").directive("trackedTable", trackedTable);

    trackedTable.$inject = [];

    function trackedTable() {
        return {
            restrict: "A",
            priority: -1,
            require: "ngForm",
            controller: trackedTableController
        };
    }

    trackedTableController.$inject = ["$scope", "$parse", "$attrs", "$element"];

    function trackedTableController($scope, $parse, $attrs, $element) {
        var self = this;
        var tableForm = $element.controller("form");
        var dirtyCellsByRow = [];
        var invalidCellsByRow = [];

        init();

        ////////

        function init() {
            var setter = $parse($attrs.trackedTable).assign;
            setter($scope, self);
            $scope.$on("$destroy", function () {
                setter(null);
            });

            self.reset = reset;
            self.isCellDirty = isCellDirty;
            self.setCellDirty = setCellDirty;
            self.setCellInvalid = setCellInvalid;
            self.untrack = untrack;
        }

        function getCellsForRow(row, cellsByRow) {
            return _.find(cellsByRow, function (entry) {
                return entry.row === row;
            })
        }

        function isCellDirty(row, cell) {
            var rowCells = getCellsForRow(row, dirtyCellsByRow);
            return rowCells && rowCells.cells.indexOf(cell) !== -1;
        }

        function reset() {
            dirtyCellsByRow = [];
            invalidCellsByRow = [];
            setInvalid(false);
        }

        function setCellDirty(row, cell, isDirty) {
            setCellStatus(row, cell, isDirty, dirtyCellsByRow);
        }

        function setCellInvalid(row, cell, isInvalid) {
            setCellStatus(row, cell, isInvalid, invalidCellsByRow);
            setInvalid(invalidCellsByRow.length > 0);
        }

        function setCellStatus(row, cell, value, cellsByRow) {
            var rowCells = getCellsForRow(row, cellsByRow);
            if (!rowCells && !value) {
                return;
            }

            if (value) {
                if (!rowCells) {
                    rowCells = {
                        row: row,
                        cells: []
                    };
                    cellsByRow.push(rowCells);
                }
                if (rowCells.cells.indexOf(cell) === -1) {
                    rowCells.cells.push(cell);
                }
            } else {
                _.remove(rowCells.cells, function (item) {
                    return cell === item;
                });
                if (rowCells.cells.length === 0) {
                    _.remove(cellsByRow, function (item) {
                        return rowCells === item;
                    });
                }
            }
        }

        function setInvalid(isInvalid) {
            self.$invalid = isInvalid;
            self.$valid = !isInvalid;
        }

        function untrack(row) {
            _.remove(invalidCellsByRow, function (item) {
                return item.row === row;
            });
            _.remove(dirtyCellsByRow, function (item) {
                return item.row === row;
            });
            setInvalid(invalidCellsByRow.length > 0);
        }
    }
})();

(function () {
    angular.module("BPT").directive("trackedTableRow", trackedTableRow);

    trackedTableRow.$inject = [];

    function trackedTableRow() {
        return {
            restrict: "A",
            priority: -1,
            require: ["^trackedTable", "ngForm"],
            controller: trackedTableRowController
        };
    }

    trackedTableRowController.$inject = ["$attrs", "$element", "$parse", "$scope"];

    function trackedTableRowController($attrs, $element, $parse, $scope) {
        var self = this;
        var row = $parse($attrs.trackedTableRow)($scope);
        var rowFormCtrl = $element.controller("form");
        var trackedTableCtrl = $element.controller("trackedTable");

        self.isCellDirty = isCellDirty;
        self.setCellDirty = setCellDirty;
        self.setCellInvalid = setCellInvalid;

        function isCellDirty(cell) {
            return trackedTableCtrl.isCellDirty(row, cell);
        }

        function setCellDirty(cell, isDirty) {
            trackedTableCtrl.setCellDirty(row, cell, isDirty)
        }

        function setCellInvalid(cell, isInvalid) {
            trackedTableCtrl.setCellInvalid(row, cell, isInvalid)
        }
    }
})();

(function () {
    angular.module("BPT").directive("trackedTableCell", trackedTableCell);

    trackedTableCell.$inject = [];

    function trackedTableCell() {
        return {
            restrict: "A",
            priority: -1,
            scope: true,
            require: ["^trackedTableRow", "ngForm"],
            controller: trackedTableCellController
        };
    }

    trackedTableCellController.$inject = ["$attrs", "$element", "$scope"];

    function trackedTableCellController($attrs, $element, $scope) {
        var self = this;
        var cellFormCtrl = $element.controller("form");
        var cellName = cellFormCtrl.$name;
        var trackedTableRowCtrl = $element.controller("trackedTableRow");

        if (trackedTableRowCtrl.isCellDirty(cellName)) {
            cellFormCtrl.$setDirty();
        } else {
            cellFormCtrl.$setPristine();
        }
        // note: we don't have to force setting validaty as angular will run validations
        // when we page back to a row that contains invalid data

        $scope.$watch(function () {
            return cellFormCtrl.$dirty;
        }, function (newValue, oldValue) {
            if (newValue === oldValue) return;

            trackedTableRowCtrl.setCellDirty(cellName, newValue);
        });

        $scope.$watch(function () {
            return cellFormCtrl.$invalid;
        }, function (newValue, oldValue) {
            if (newValue === oldValue) return;

            trackedTableRowCtrl.setCellInvalid(cellName, newValue);
        });
    }
})();
(function() {
    'use strict';

    angular
        .module('BPT')
        .directive('warningMessage', WarningMessageDirective);

    WarningMessageDirective.$inject = [
        '$timeout'
    ];
    
    function WarningMessageDirective($timeout) {
        return {
            restrict: 'E',
            transclude:true,
            scope: {
                show: '=',
                timeout: '@'
            },
            link: link,
            templateUrl: '/shared/directives/warning-message/partials/message.html'
        };

        function link($scope, element) {
            element.hide();
            $scope.$watch('show', onShow);
             
            function onShow(newValue, oldValue){
                if (oldValue !== newValue){
                    if (newValue === true){
                        element.show();
                        $timeout(function(){
                            element.hide();
                            $scope.show = false;
                        }, $scope.timeout);
                    }
                }
            }
        }
    }

})();
(function () {
    'use strict';

    angular
        .module('BPT')
        .factory('authService', authService);

    authService.$inject = ['httpService', 'lodash', '$rootScope', '$q'];
    function authService(httpService, lodash, $rootScope, $q) {
        var currentUser = {
            NTID: null,
            UserId: null,
            UserName: null,
            Email: null,
            RoleId: null,
            RoleName: null,
            AddedDateFormated: null,
            DepartmentId: null,
            Accessables: null
        };
        function authenticate() {
            var defered = $q.defer();
            getUser().then(function (response) {
                setUser(response.data);                
                defered.resolve();
            });

            return defered.promise;
        }
        function getUser() {
            return httpService.get('Common/GetCurrentUser');
        }
        function setUser(user) {
            Object.assign(currentUser, user);            
        }        
        function canAccessPage(currentPage) {
            var defered = $q.defer();
            if (currentUser.NTID == null) {
                authenticate().then(function () {
                    var result = isMatch(currentPage);
                    defered.resolve(result);
                });
            } else {
                var result = isMatch(currentPage);
                defered.resolve(result);
            }
            return defered.promise;
        }
        function isMatch(currentPage) {
            if (!currentUser.Accessables) return false;
            var index = lodash.findIndex(currentUser.Accessables, function (page) {
                return page.toLowerCase() == '#' + currentPage.toLowerCase();
            });
            return index > -1;
        }
        function isInRoles(roles) {
            var defered = $q.defer();
            if (currentUser.NTID == null) {
                authenticate().then(function () {
                    if (!roles) {
                        defered.resolve(false);
                    } else {                        
                        var result = isPermit(roles);
                        defered.resolve(result);
                    }                    
                });
            } else {
                var result = isPermit(roles);
                defered.resolve(result);
            }
            return defered.promise;
                        
        }
        function isPermit(roles) {
            var index = lodash.findIndex(roles, function (role) {
                return role.toUpperCase() == currentUser.RoleName.toUpperCase();
            });
            return index > -1;
        }
        function switchRole(roleId) {
            return httpService.put('Common/SwitchRole', { role: roleId });
        }
        function canSwitchRole() {
            return httpService.get('Common/CanSwitchRole');
        }
        var service = {
            authenticate: authenticate,
            currentUser: currentUser,
            canAccessPage: canAccessPage,
            isInRoles: isInRoles,
            switchRole: switchRole,
            canSwitchRole: canSwitchRole
        };

        return service;
    }    
})();
(function () {
    'use strict';

    angular
        .module('BPT')
        .factory('commentService', commentService);

    commentService.$inject = ['httpService', 'lodash', '$rootScope', '$q'];
    function commentService(httpService, lodash, $rootScope, $q) {

        var commentThreads = {};

        function authenticate() {
            var defered = $q.defer();
            getUser().then(function (response) {
                setUser(response.data);
                defered.resolve();
            });

            return defered.promise;
        }

        function getCommentThreads(partitionKey) {
            var defered = $q.defer();
            httpService.get('Common/GetComments/?partitionKey=' + partitionKey).then(function (response) {
                commentThreads[partitionKey] = response.data;
                defered.resolve(response.data);
            });
            return defered.promise;
        }

        function addOrUpdateComment(partitionKey, comment) {
            var defered = $q.defer();
            httpService.post('Common/AddOrUpdateComment/?partitionKey=' + partitionKey, comment).then(function (response) {
                defered.resolve(response.data);
            });
            return defered.promise;
        }

        function removeCommentThread(partitionKey, uniqueKey) {
            var defered = $q.defer();
            var newUniqueKey = uniqueKey.replace(/&/g, "[and]");
            httpService.remove('Common/RemoveCommentThread/?partitionKey=' + partitionKey + '&uniqueKey=' + newUniqueKey).then(function (response) {
                defered.resolve(response.data);
            });
            return defered.promise;
        }

        function removeComment(commentId) {
            var defered = $q.defer();
            httpService.remove('Common/RemoveComment/?commentId=' + commentId).then(function (response) {
                defered.resolve(response.data);                
            });            
            return defered.promise;
        }        

        var service = {
            getCommentThreads: getCommentThreads,
            commentThreads: commentThreads,
            addOrUpdateComment: addOrUpdateComment,
            removeCommentThread: removeCommentThread,
            removeComment: removeComment
        };

        return service;
    }
})();
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
(function () {
    'use strict';

    angular
		.module('BPT')
		.controller('UserController', UserController);

    UserController.$inject = ['userService',  'utilitiesService', '$window', 'env', '$timeout', '$filter'];
    function UserController(userService,  utilitiesService, $window, env, $timeout, $filter) {
        var vm = this;

        vm.getUsers = getUsers;

        vm.deleteUser = deleteUser;
        vm.create = create;
        vm.update = update;
        vm.initUpdateUser = initUpdateUser;
        vm.initDeleteUser = initDeleteUser;

        vm.cancelEdit = cancelEdit;

        activate();
        var baseUrl = env.baseUrl;
        function activate() {
    
            getUsers();
            vm.user = {};
            vm.rollBackEditUser = {};
            vm.deleteuser = {};
            vm.departments = [];
            vm.roles = [];
            //getDeparments();
          
        }


        //function getDeparments() {
        //    departmentService.getAllDepartments().then(function (response) {
        //        vm.departments = response.data;
        //    });
        //}
        
        function getUsers() {
            userService.getUsers().then(function (response) {
                vm.users = response.data;
            });
        }

        function create(user) {    
            user.ID = 0;
            userService.createUser(user).then(function (response) {
                if (response.data) {
                    getUsers();
                    vm.user = {};
                }
            });
        }

        function update(user) {
            userService.updateUser(user).then(function (response) {
                getUsers();
            }, function (error) {
                angular.copy(vm.rollBackEditUser, user);
            });
        }

        function deleteUser(id) {
            userService.deleteUser(id).then(function (response) {
                getUsers();
            }, function (error) {
                //do nothing
            });
        }

        function initUpdateUser(user) {
            vm.selectedDepartment = null;
            angular.copy(user, vm.rollBackEditUser);
            vm.edituser = user;
            vm.edituser.Name = user.Name;
        }

        function initDeleteUser(user) {
            vm.deleteuser = user;
        }

        function cancelEdit(user) {
            angular.copy(vm.rollBackEditUser, user);
        }

        $timeout(function () {
            $(function () {
                //$("#EmpName").autocomplete({
                //    source: function (request, response) {
                //       return getDataFilterEmployee(request, response);
                //    },
                //    minLength: 3,
                //    select: function (event, data) {                     
                //        vm.user.EmpName = data.item.value;
                //        vm.user.NTID = data.item.option.domainId;
                //        vm.user.EmpNo = data.item.option.employeeNo;
                //        vm.user.Email = data.item.option.email;
                //        vm.user.DepartmentName = data.item.option.departmentName;
                //    },
                //    open: function () {
                //        $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                //    },
                //    close: function () {
                //        $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                //    },
                //    appendTo: "#addNewUser"
                //});

                //$("#EditEmpName").autocomplete({
                //    source: function (request, response) {
                //        return getDataFilterEmployee(request, response);
                //    },
                //    minLength: 3,
                //    select: function (event, data) {                       
                //        vm.edituser.EmpName = data.item.value;
                //        vm.edituser.NTID = data.item.option.domainId;
                //        vm.edituser.EmpNo = data.item.option.employeeNo;
                //        vm.edituser.Email = data.item.option.email;
                //        vm.edituser.DepartmentName = data.item.option.departmentName;

                //        console.log(data.item.option.DepartmentName);
                //        console.log(vm.edituser.DepartmentName);
                //    },
                //    open: function () {
                //        $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                //    },
                //    close: function () {
                //        $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                //    },
                //    appendTo: "#editUser"
                //});
              
                function getDataFilterEmployee(request, response) {
                    var param = {
                        filter: request.term,
                        departmentId: 1,
                        departmentName: vm.selectedDepartment || ''
                    }
                    userService.searchEmployees(param).then(
                        function (result) {
                            var templateOwner = "{0} ({1})";
                            response($.map(result.data, function (item) {
                                return {
                                    label: utilitiesService.formatStringWithParams(templateOwner, item.FullName, item.DepartmentName),
                                    value: utilitiesService.formatStringWithParams(templateOwner, item.FullName, item.DepartmentName),
                                    option: {
                                        domainId: item.DomainId,
                                        departmentName: item.DepartmentName,
                                        employeeNo: item.EmployeeNo,
                                        email: item.Email
                                    }
                                };
                            }));
                        }, function (xhr) {
                            console.log(xhr);
                        });
                }
            });
            

            $("#addNewUser").on('shown.bs.modal', function () {
                $(this).find('#role').focus();
            });
            $("#editUser").on('shown.bs.modal', function () {
                $(this).find('#editrole').focus();
            });
        }, 1000);

    }
})();


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
(function () {
    'use strict';

    angular
        .module('BPT')
        .factory('userService', userService);

    userService.$inject = ['httpService', 'utilitiesService'];

    function userService(httpService, utilitiesService) {
        var service = {
            getUsers: getUsers,
            createUser: createUser,
            updateUser: updateUser,
            deleteUser: deleteUser,
            searchEmployees: searchEmployees
        };

        return service;

        function getUsers() {
            return httpService.get('Users');
        }

        function createUser(user) {
            return httpService.post('Users/Create', user);
        }

        function updateUser(user) {
            return httpService.post('Users/Update', user);
        }

        function deleteUser(id) {
            return httpService.get('Users/Delete/' + id);
        }

        function searchEmployees(param) {
            var url = 'Users/searchEmployees?filter={0}&departmentId={1}&departmentName={2}';
            url = utilitiesService.formatStringWithParams(url, param.filter, param.departmentId, param.departmentName);
            return httpService.get(url, param);
        }

    }
})();