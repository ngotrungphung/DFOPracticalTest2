(function () {
    'use strict';

    angular
        .module('BPT')
        .factory('httpService', httpService);

    httpService.$inject = ['$http', '$q', 'env', 'utilitiesService'];

    function httpService($http, $q, env, utilitiesService) {
        var service = {
            get: get,
            post: post,
            put: put,
            remove: remove,
            getNonLoading:getNonLoading
        };

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

        return service;

        function get(uri) {
            return makeRequest('get', uri);
        }
        function getNonLoading(uri){
            return makeRequestNonLoading('get',uri);
        }
        function post(uri, data, option) {
            return makeRequest('post', uri, data, option);
        }
        function put(uri, data, option) {
            return makeRequest('put', uri, data, option);
        }

        function remove(uri, option) {
            return makeRequest('delete', uri, option);
        }

        function makeRequest(verb, uri, data, option) {
            var defer = $q.defer();
            verb = verb.toLowerCase();
            $('.loader').show();
            var httpArgs = [env.baseUrl + uri];
            if (verb.match(/post|put/)) {
                httpArgs.push(data);
            }
   
            $http[verb].apply(null, httpArgs)
                .then(function (data, status) {                    
                    showMessageAction(verb, data.status, option);
                    defer.resolve(data);
                    $('.loader').fadeOut(1);
                }, function (response, status) {                    
                    if (response.data && response.data.ErrorMessage) {
                        option = {
                            message: {}
                        };
                        option.message.error = response.data.ErrorMessage;
                    }
                    $('.loader').fadeOut(1);
                    showMessageAction(verb, response.status, option);
                    defer.reject('HTTP Error: ' + status);
                    
                });

            return defer.promise;
        }
        function makeRequestNonLoading(verb, uri, data, option) {
            var defer = $q.defer();
            verb = verb.toLowerCase();
            var httpArgs = [env.baseUrl + uri];
            if (verb.match(/post|put/)) {
                httpArgs.push(data);
            }
   
            $http[verb].apply(null, httpArgs)
                .then(function (data, status) {                    
                    showMessageAction(verb, data.status, option);
                    defer.resolve(data);
                }, function (response, status) {                    
                    if (response.data && response.data.ErrorMessage) {
                        option = {
                            message: {}
                        };
                        option.message.error = response.data.ErrorMessage;
                    }
                    showMessageAction(verb, response.status, option);
                    defer.reject('HTTP Error: ' + status);
                });

            return defer.promise;
        }

        function showMessageAction(verb, status, option) {
            var messageTemplate = "{0} {1}";
            var displayMessage = getMessage(status, option);
            switch (verb) {
                case verbAction.post:
                    displayMessage = option && option.message ? displayMessage : utilitiesService.formatStringWithParams(messageTemplate, action.addnew, displayMessage);
                    showToastr(status, displayMessage);
                    break;
                case verbAction.put:
                    displayMessage = option && option.message ? displayMessage : utilitiesService.formatStringWithParams(messageTemplate, action.update, displayMessage);
                    showToastr(status, displayMessage);
                    break;
                case verbAction.delete:
                    displayMessage = option && option.message ? displayMessage : utilitiesService.formatStringWithParams(messageTemplate, action.delete, displayMessage);;
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
                    return option && option.message && option.message.success? option.message.success : message.success;
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

