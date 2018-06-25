(function () {
    'use strict';

    angular
        .module('BPT')
        .constant('TravelData', TravelData());

    function TravelData() {
        return {
            Purposes: [
                { value: "Business Project", text: "Business/Project" },
                { value: "Training", text: "Training" },
                { value: "Secondary Travel", text: "Secondary travel" },
                { value: "3rd Party Travel", text: "3rd party travel" },
                { value: "Recruitment", text: "Recruitment" }
            ],
            VisaTypes:{
                WorkPermit: "Work Permit",
                BusinessVisa: "Business Visa",
                InlandTravel: "Inland travel"
            },
            AllowanceSubType: {
                Living: "Living",
                Lodging: "Lodging"
            },
            LevelRanges: {
                LowAssociateLevel: 54,
                HightAssociateLevel: 55
            }
        };
    }

})();




