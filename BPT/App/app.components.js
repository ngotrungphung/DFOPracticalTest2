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