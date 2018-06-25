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