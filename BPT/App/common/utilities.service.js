(function () {
    'use strict';

    angular
        .module('BPT')
        .factory('utilitiesService', utilitiesService);

    utilitiesService.$inject = [];

    function utilitiesService() {
        var verbAction = {
            get: "get",
            post: "post",
            put: "put",
            delete: "delete"
        };

        var httpCodes = {
            success: 200,
            badRequest: 400,
            unProcessable: 422,
            unauthorized: 401,
            forbidden: 403,
            notFound: 404,
            notAcceptable: 406,
            serverError: 500,
            serviceUnavailable: 503,
            conflict: 409,
            notModified: 304
        };

        var message = {
            success: "Successfully!",
            error: "Error !!",
            unKnown: "UnKnown Error !!",
            unchange: "- Nothing change",
            unauthorized: "- Unauthorized access page !!!"
        };

        var action = {
            "addnew": "Add Information",
            "update": "Update Information",
            "delete": "Delete Action"
        };
        var service = {
   
            formatStringWithParams: formatStringWithParams,
            generateYears: generateYears,
            importExcel: importExcel,
            compareString: compareString,
            defaultFormatNumber: defaultFormatNumber,
            getNumberFromString: getNumberFromString,
            importExcelAsync:importExcelAsync
        };
        return service;


        function formatStringWithParams() {
            var result = arguments[0];
            for (var index = 0; index < arguments.length - 1; index++) {
                var reg = new RegExp('\\{' + index + '\\}', 'gm');
                result = result.replace(reg, arguments[index + 1]);
            }
            return result;
        }

        function generateYears() {
            var result = [];
            var currentYear = new Date().getFullYear() + 2;
            var bias = 5;
            var minYear = currentYear - bias;
            var maxYear = currentYear;
            for (var index = minYear; index <= maxYear; index++) {
                result.push({
                    value: index,
                    text: index
                });
            }
            return result;
        }

        function getNumberFromString(input) {
            var numberString = input.match(/[0-9]+/g);
            if (numberString != null)
                return parseInt(numberString);
            return 0;
        }

        function importExcel(params) {
            debugger;
            var fileName = params.inputFile.split('\\').pop();
                params.scope.vm.importFileName = fileName;
                params.scope.vm.isUpdating = true;
                var file = $('#ImportFile').prop("files")[0];
                var formData = new FormData();
                formData.append("FileUpload", file);
                params.scope.$apply();
                $('.loader').show();
            $.ajax({
                type: "POST",
                url: params.url,
                data: formData,
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function(response) {
                    toastr.info(response, "Info");
                    showMessageAction('post', response.status, null);
                    $('.loader').fadeOut(1);
                    console.log(response);
                    params.callback();

                },
                error: function(error) {
                    toastr.info(error.message, "Info");
                    console.log(error);
                    showMessageAction('post', error.status, null);
                    $('.loader').fadeOut(1);
                    return error;
                }
            });

        }
        function importExcelAsync(params) {
            var fileName = params.inputFile.split('\\').pop();
                params.scope.vm.importFileName = fileName;
                params.scope.vm.isUpdating = true;
                var file = $('#'+params.id).prop("files")[0];
                var formData = new FormData();
                formData.append("FileUpload", file);
                params.scope.$apply();
            return $.ajax({
                type: "POST",
                url: params.url,
                data: formData,
                dataType: 'json',
                contentType: false,
                processData: false
            });

        }
        function compareString(first, second) {
            if (!first || !second) {
                return false;
            } else {
                return first.toUpperCase() === second.toUpperCase();
            }
        }

        function defaultFormatNumber(number) {
            if (number == null || number == 0) return '';
            if (number < 0) return '(' + (number * -1).toLocaleString('en-US') + ')';
            return number.toLocaleString('en-US');
        }

        function showMessageAction(verb, status, option) {
            var messageTemplate = "{0} {1}";
            var displayMessage = getMessage(status, option);
            switch (verb) {
                case verbAction.post:
                    displayMessage = option && option.message ? displayMessage : formatStringWithParams(messageTemplate, action.addnew, displayMessage);
                    showToastr(status, displayMessage);
                    break;
                case verbAction.put:
                    displayMessage = option && option.message ? displayMessage : formatStringWithParams(messageTemplate, action.update, displayMessage);
                    showToastr(status, displayMessage);
                    break;
                case verbAction.delete:
                    displayMessage = option && option.message ? displayMessage : formatStringWithParams(messageTemplate, action.delete, displayMessage);;
                    showToastr(status, displayMessage);
                    break;
                default: break;
            }
        }
        function showToastr(status, messages) {
            switch (status) {
                case httpCodes.success:
                    toastr.success(messages, "Success");
                    break;
                case httpCodes.badRequest:
                case httpCodes.unProcessable:
                case httpCodes.notFound:
                case httpCodes.serverError:
                case httpCodes.serviceUnavailable:
                case httpCodes.unauthorized:
                    toastr.warning(messages, "Warning");
                    break;
                default: break;
            }
        }

        function getMessage(status, option) {
            switch (status) {
                case httpCodes.success:
                    return option && option.message && option.message.success ? option.message.success : message.success;
                case httpCodes.badRequest:
                case httpCodes.unProcessable:
                case httpCodes.notFound:
                case httpCodes.serverError:
                case httpCodes.serviceUnavailable:
                    return option && option.message && option.message.error ? option.message.error : message.error;
                case httpCodes.unauthorized:
                    return option && option.message && option.message.unauthorized ? option.message.unauthorized : message.unauthorized;
                default: return "";
            }
        }
    }
})();