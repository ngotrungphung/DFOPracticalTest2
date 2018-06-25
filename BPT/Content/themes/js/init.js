$(function () {
    $("select").select2();

    $(".datepicker").datepicker({
        autoclose: true
    });

    $('input[type="checkbox"], input[type="radio"]').iCheck({
        checkboxClass: "icheckbox_minimal-blue",
        radioClass: "iradio_minimal-blue"
    });

    $("#datemask").inputmask("dd/mm/yyyy", { "placeholder": "dd/mm/yyyy" });
    $("#datemask2").inputmask("mm/dd/yyyy", { "placeholder": "mm/dd/yyyy" });
    $("[data-mask]").inputmask();
});

var formatDateUI = {
    momentJS: "DD-MM-YYYY",
    datepicker: "dd-mm-yyyy",
    dateFilter: "dd-MM-yyyy"
}

function datePickerConfig(){
    return {
        format: formatDateUI.datepicker,
        todayHighlight: true,
        autoclose: true        
    }
}


function datePickerYearOnlyConfig() {
    return {
        autoclose: true,
        format: " yyyy",
        viewMode: "years",
        minViewMode: "years",
        startView: 'decade',
        minView: 'decade',
        viewSelect: 'decade',
    }
}

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}