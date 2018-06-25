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