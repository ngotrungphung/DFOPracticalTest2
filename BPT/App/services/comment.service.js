(function () {
    'use strict';

    angular
        .module('BPT')
        .factory('commentService', commentService);

    commentService.$inject = ['httpService', 'lodash', '$rootScope', '$q'];
    function commentService(httpService, lodash, $rootScope, $q) {

        var commentThreads = {};

        function authenticate() {
            var defered = $q.defer();
            getUser().then(function (response) {
                setUser(response.data);
                defered.resolve();
            });

            return defered.promise;
        }

        function getCommentThreads(partitionKey) {
            var defered = $q.defer();
            httpService.get('Common/GetComments/?partitionKey=' + partitionKey).then(function (response) {
                commentThreads[partitionKey] = response.data;
                defered.resolve(response.data);
            });
            return defered.promise;
        }

        function addOrUpdateComment(partitionKey, comment) {
            var defered = $q.defer();
            httpService.post('Common/AddOrUpdateComment/?partitionKey=' + partitionKey, comment).then(function (response) {
                defered.resolve(response.data);
            });
            return defered.promise;
        }

        function removeCommentThread(partitionKey, uniqueKey) {
            var defered = $q.defer();
            var newUniqueKey = uniqueKey.replace(/&/g, "[and]");
            httpService.remove('Common/RemoveCommentThread/?partitionKey=' + partitionKey + '&uniqueKey=' + newUniqueKey).then(function (response) {
                defered.resolve(response.data);
            });
            return defered.promise;
        }

        function removeComment(commentId) {
            var defered = $q.defer();
            httpService.remove('Common/RemoveComment/?commentId=' + commentId).then(function (response) {
                defered.resolve(response.data);                
            });            
            return defered.promise;
        }        

        var service = {
            getCommentThreads: getCommentThreads,
            commentThreads: commentThreads,
            addOrUpdateComment: addOrUpdateComment,
            removeCommentThread: removeCommentThread,
            removeComment: removeComment
        };

        return service;
    }
})();