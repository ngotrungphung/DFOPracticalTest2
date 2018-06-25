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