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

