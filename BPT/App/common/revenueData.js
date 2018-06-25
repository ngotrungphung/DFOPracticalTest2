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