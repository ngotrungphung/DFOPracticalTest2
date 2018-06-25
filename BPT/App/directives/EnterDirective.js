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
