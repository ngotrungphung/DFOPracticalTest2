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




