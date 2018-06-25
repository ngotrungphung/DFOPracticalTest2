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