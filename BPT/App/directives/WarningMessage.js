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