(function () {
    'use strict';

    angular
        .module('BPT')
        .directive('comment', ["$parse", "$q", 'commentService', 'authService', 'lodash', 'utilitiesService', '$compile', function ($parse, $q, commentService, authService, lodash, utilitiesService, $compile) {

            var contextMenus = [];
            var $currentContextMenu = null;
            var defaultItemText = "New Item";

            var removeContextMenus = function (level) {
                /// <summary>Remove context menu.</summary>
                while (contextMenus.length && (!level || contextMenus.length > level)) {
                    contextMenus.pop().remove();
                }
                if (contextMenus.length == 0 && $currentContextMenu) {
                    $currentContextMenu.remove();
                }
            };

            var processTextItem = function ($scope, item, text, event, model, $promises, nestedMenu, $) {
                "use strict";

                var $a = $('<a>');
                $a.css("padding-right", "8px");
                $a.css("color", "white");
                $a.attr({ tabindex: '-1', href: '#' });

                if (typeof item[0] === 'string') {
                    text = item[0];
                }
                else if (typeof item[0] === "function") {
                    text = item[0].call($scope, $scope, event, model);
                } else if (typeof item.text !== "undefined") {
                    text = item.text;
                }

                var $promise = $q.when(text);
                $promises.push($promise);
                $promise.then(function (text) {
                    if (nestedMenu) {
                        $a.css("cursor", "default");
                        $a.append($('<strong style="font-family:monospace;font-weight:bold;float:right;">&gt;</strong>'));
                    }
                    $a.append(text);
                });

                return $a;
            };

            var processItem = function ($scope, event, model, enabled, item, $ul, $li, $promises, $q, $, level) {
                /// <summary>Process individual item</summary>
                "use strict";
                // nestedMenu is either an Array or a Promise that will return that array.
                var nestedMenu = angular.isArray(item[1]) || (item[1] && angular.isFunction(item[1].then))
                  ? item[1] : angular.isArray(item[2]) || (item[2] && angular.isFunction(item[2].then))
                  ? item[2] : angular.isArray(item[3]) || (item[3] && angular.isFunction(item[3].then))
                  ? item[3] : null;

                // if html property is not defined, fallback to text, otherwise use default text
                // if first item in the item array is a function then invoke .call()
                // if first item is a string, then text should be the string.

                var text = defaultItemText;
                if (typeof item[0] === 'function' || typeof item[0] === 'string' || typeof item.text !== "undefined") {
                    text = processTextItem($scope, item, text, event, model, $promises, nestedMenu, $);
                }
                else if (typeof item.html === 'function') {
                    // leave styling open to dev
                    text = item.html($scope);
                }
                else if (typeof item.html !== "undefined") {
                    // leave styling open to dev
                    text = item.html;
                }

                $li.append(text);

                registerEnabledEvents($scope, enabled, item, $ul, $li, nestedMenu, model, text, event, $, level);
            };

            var handlePromises = function ($ul, level, event, $promises) {
                /// <summary>
                /// calculate if drop down menu would go out of screen at left or bottom
                /// calculation need to be done after element has been added (and all texts are set; thus thepromises)
                /// to the DOM the get the actual height
                /// </summary>
                "use strict";
                $q.all($promises).then(function () {
                    var topCoordinate = event.pageY;
                    var menuHeight = angular.element($ul[0]).prop('offsetHeight');
                    var winHeight = event.view.innerHeight;
                    if (topCoordinate > menuHeight && winHeight - topCoordinate < menuHeight) {
                        topCoordinate = event.pageY - menuHeight;
                    } else if (winHeight <= menuHeight) {
                        // If it really can't fit, reset the height of the menu to one that will fit
                        angular.element($ul[0]).css({ "height": winHeight - 5, "overflow-y": "scroll" });
                        // ...then set the topCoordinate height to 0 so the menu starts from the top
                        topCoordinate = 0;
                    } else if (winHeight - topCoordinate < menuHeight) {
                        var reduceThreshold = 5;
                        if (topCoordinate < reduceThreshold) {
                            reduceThreshold = topCoordinate;
                        }
                        topCoordinate = winHeight - menuHeight - reduceThreshold;
                    }

                    var leftCoordinate = event.pageX;
                    var menuWidth = angular.element($ul[0]).prop('offsetWidth');
                    var winWidth = event.view.innerWidth;
                    var rightPadding = 5;
                    if (leftCoordinate > menuWidth && winWidth - leftCoordinate - rightPadding < menuWidth) {
                        leftCoordinate = winWidth - menuWidth - rightPadding;
                    } else if (winWidth - leftCoordinate < menuWidth) {
                        var reduceThreshold = 5;
                        if (leftCoordinate < reduceThreshold + rightPadding) {
                            reduceThreshold = leftCoordinate + rightPadding;
                        }
                        leftCoordinate = winWidth - menuWidth - reduceThreshold - rightPadding;
                    }

                    $ul.css({
                        display: 'block',
                        position: 'absolute',
                        left: leftCoordinate + 'px',
                        top: topCoordinate + 'px'
                    });
                });
            };

            var registerEnabledEvents = function ($scope, enabled, item, $ul, $li, nestedMenu, model, text, event, $, level) {
                /// <summary>If item is enabled, register various mouse events.</summary>
                if (enabled) {
                    var openNestedMenu = function ($event) {
                        removeContextMenus(level + 1);
                        /*
                         * The object here needs to be constructed and filled with data
                         * on an "as needed" basis. Copying the data from event directly
                         * or cloning the event results in unpredictable behavior.
                         */
                        var ev = {
                            pageX: event.pageX + $ul[0].offsetWidth - 1,
                            pageY: $ul[0].offsetTop + $li[0].offsetTop - 3,
                            view: event.view || window
                        };

                        /*
                         * At this point, nestedMenu can only either be an Array or a promise.
                         * Regardless, passing them to when makes the implementation singular.
                         */
                        $q.when(nestedMenu).then(function (promisedNestedMenu) {
                            renderContextMenu($scope, ev, promisedNestedMenu, model, level + 1);
                        });
                    };

                    $li.on('click', function ($event) {
                        $event.preventDefault();
                        $scope.$apply(function () {
                            if (nestedMenu) {
                                openNestedMenu($event);
                            } else {
                                $(event.currentTarget).removeClass('context');
                                removeContextMenus();

                                if (angular.isFunction(item[1])) {
                                    item[1].call($scope, $scope, event, model, text)
                                } else {
                                    item.click.call($scope, $scope, event, model, text);
                                }
                            }
                        });
                    });

                    $li.on('mouseover', function ($event) {
                        $scope.$apply(function () {
                            if (nestedMenu) {
                                openNestedMenu($event);
                            }
                        });
                    });
                } else {
                    $li.on('click', function ($event) {
                        $event.preventDefault();
                    });
                    $li.addClass('disabled');
                }
            };

            var currentTarget;
            var renderContextMenu = function ($scope, event, options, model, level, customClass) {
                /// <summary>Render context menu recursively.</summary>                
                if (!level) { level = 0; }
                if (!$) { var $ = angular.element; }
                $(event.currentTarget).addClass('context');
                currentTarget = event.currentTarget;

                if (hasComment()) {
                    options[0][0] = 'Remove Comment';
                }

                if (hasPressSheet()) {
                    options[1][0] = 'Remove Spreadsheet';
                }

                var $contextMenu = $('<div>');
                if ($currentContextMenu) {
                    $contextMenu = $currentContextMenu;
                } else {
                    $currentContextMenu = $contextMenu;
                    $contextMenu.addClass('angular-bootstrap-contextmenu dropdown clearfix');
                }
                if (customClass) {
                    $contextMenu.addClass(customClass);
                }
                var $ul = $('<ul>');
                $ul.addClass('dropdown-menu');
                $ul.attr({ 'role': 'menu' });
                $ul.css({
                    display: 'block',
                    position: 'absolute',
                    left: event.pageX + 'px',
                    top: event.pageY + 'px',
                    "z-index": 10000,
                    'background-color': '#3C8DBC'
                });

                var $promises = [];

                angular.forEach(options, function (item) {

                    // if item is object, and has enabled prop invoke the prop
                    // els if fallback to item[2]
                    var isVisibled = function () {
                        if (typeof item.enabled !== "undefined") {
                            return item.enabled.call($scope, $scope, event, model);
                        } else if (typeof item[2] === "function") {
                            return item[2].call($scope, $scope, event, model);
                        } else {
                            return true;
                        }
                    };

                    if (isVisibled(item)) {
                        var $li = $('<li>');
                        if (item === null) {
                            $li.addClass('divider');
                        } else if (typeof item[0] === "object") {
                            //custom.initialize($li, item);
                        } else {
                            processItem($scope, event, model, true, item, $ul, $li, $promises, $q, $, level);
                        }
                        $ul.append($li);
                    }
                });
                $contextMenu.append($ul);
                var height = Math.max(
                    document.body.scrollHeight, document.documentElement.scrollHeight,
                    document.body.offsetHeight, document.documentElement.offsetHeight,
                    document.body.clientHeight, document.documentElement.clientHeight
                );
                $contextMenu.css({
                    width: '100%',
                    height: height + 'px',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 9999,
                    //"max-height": window.innerHeight - 3,
                });
                $(document).find('body').append($contextMenu);

                handlePromises($ul, level, event, $promises);

                $contextMenu.on("mousedown", function (e) {
                    if ($(e.target).hasClass('dropdown')) {
                        $(event.currentTarget).removeClass('context');
                        removeContextMenus();
                    }
                })
                .on('contextmenu', function (event) {                    
                    $(event.currentTarget).removeClass('context');
                    event.preventDefault();
                    removeContextMenus(level);
                });

                $scope.$on("$destroy", function () {
                    removeContextMenus();
                });

                contextMenus.push($ul);
            };

            function isTouchDevice() {
                return 'ontouchstart' in window        // works on most browsers
                    || navigator.maxTouchPoints;       // works on IE10/11 and Surface
            };

            function createCommentPopover($itemScope) {
                if ($(document).find('#popover-content-block').length == 0) {
                    var popoverDOM = '<div id="popover-content-block" class="hide">' +
                                        '<div class="comment-content small"></div>' +
                                        '<h6 class="small"><a href="javascript:void(0)" class="view-full-comment">View Full Comment</a></h6>' +
                                    '</div>';

                    $(document).find('body').append(popoverDOM);

                    if (hasPressSheet()) {
                        if ($(currentTarget).children('input').is(':visible')) {
                            $('#popover-content-block').append($('<h6 class="small"><a href="javascript:void(0)" class="edit-press-sheet">Edit Spreadsheet</a></h6>'));
                        } else {
                            $('#popover-content-block').append($('<h6 class="small"><a href="javascript:void(0)" class="view-press-sheet">View Spreadsheet</a></h6>'));
                        }
                    }
                }

                removeCurrentPopoverIfExist();

                var $a = $('<a>');
                $a.css('float', 'right');
                $a.attr('data-toggle', 'popover');
                $a.attr('data-trigger', 'manual');
                $a.attr('data-container', 'body');
                $a.attr('data-placement', 'right');
                $a.attr('data-html', 'true');
                $a.attr('title', '<h6 class="medium comment-meta"><a href="javascript:void(0)">' + $(currentTarget).attr('comment-user') + '</a> ' + $(currentTarget).attr('comment-time') + '</h6>');
                $(currentTarget).append($a);
                $('#popover-content-block').find('.comment-content').html($(currentTarget).attr('comment-content'));
                $a.popover({
                    html: true,
                    content: function () {
                        return $('#popover-content-block').html();
                    }
                });

                hideAllPopovers();
                $(currentTarget).find('a').popover('show');

                $('.popover-content').find('.view-full-comment').on('click', function () {
                    $(currentTarget).find('a').popover('hide');
                    showDialog();
                });

                $('.popover-content').find('.view-press-sheet').on('click', function () {
                    $(currentTarget).find('a').popover('hide');
                    showViewPressSheetDialog();
                });

                $('.popover-content').find('.edit-press-sheet').on('click', function () {
                    $(currentTarget).find('a').popover('hide');
                    var pressSheets = JSON.parse($(currentTarget).attr('press-sheet-content'));
                    showEditablePressSheetDialog($itemScope, pressSheets);
                });
            }

            function generatePressSheetDOM(pressSheets) {
                var $table = $('<table class="table table-striped table-hover table-bordered full-width-table table-press-sheet-hover">' +
                    '<thead>' +
                    '<tr>' +
                    '<th>Name</th>' +
                    '<th>Value</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                    '<tr class="summary">' +
                    '<td><strong><label>Summary</label></strong></td>' +
                    '<td colspan="2"><strong><span class="summary-value"></span></strong></td>' +
                    '</tr>' +
                    '</tbody>' +
                    '</table>');

                for (var key in pressSheets) {
                    if (key != 'Summary') {
                        var $tr = $('<tr>');

                        var $tdName = $('<td>');
                        $tdName.html(key);
                        $tr.append($tdName);

                        var $tdValue = $('<td>');
                        $tdValue.html(utilitiesService.defaultFormatNumber(pressSheets[key]));
                        $tr.append($tdValue);

                        $tr.insertBefore($table.find('.summary'));
                    } else {
                        $($table.find('.summary-value')).html(utilitiesService.defaultFormatNumber(pressSheets[key]));
                    }
                }

                return $table;
            }
            function createPressSheetPopover($scope) {
                if ($(document).find('#popover-press-sheet-block').length == 0) {
                    var popoverDOM = '<div id="popover-press-sheet-block" class="hide">' +
                        '<div class="press-sheet-content small">Table</div>' +
                        '<h6 class="small"><a href="javascript:void(0)" class="edit-press-sheet">Edit Spreadsheet</a></h6>' +
                        '</div>';

                    $(document).find('body').append(popoverDOM);
                }
                
                if ($(currentTarget).children('input').is(':visible') == false) {
                    $('.edit-press-sheet').hide();
                } else {
                    $('.edit-press-sheet').show();
                }

                removeCurrentPopoverIfExist();

                var $a = $('<a>');
                $a.css('float', 'right');
                $a.attr('data-toggle', 'popover');
                $a.attr('data-trigger', 'manual');
                $a.attr('data-container', 'body');
                $a.attr('data-placement', 'right');
                $a.attr('data-html', 'true');
                $a.attr('title', '<h6 class="medium comment-meta"><a href="javascript:void(0)">' + $(currentTarget).attr('press-sheet-user') + '</a> ' + $(currentTarget).attr('press-sheet-time') + '</h6>');
                $(currentTarget).append($a);

                var pressSheets = JSON.parse($(currentTarget).attr('press-sheet-content'));
                var table = generatePressSheetDOM(pressSheets);
                $('.press-sheet-content').html(table);

                $a.popover({
                    html: true,
                    content: function () {
                        return $('#popover-press-sheet-block').html();
                    }
                });

                hideAllPopovers();
                $(currentTarget).find('a').popover('show');

                $('.popover-content').find('.edit-press-sheet').on('click', function () {
                    $(currentTarget).find('a').popover('hide');
                    showEditablePressSheetDialog($scope, pressSheets);
                });
            }

            function markAsNote(element, comment) {
                var content = comment.Content.length > 100 ? comment.Content.substring(0, 100) + '...' : comment.Content;
                $(element).attr('comment-user', comment.User.EmpName);
                $(element).attr('comment-time', comment.ShortAddedDateString);
                $(element).attr('comment-content', content);
                $(element).addClass('note');
            }

            function markAsPressSheet(element, $itemScope, pressSheet, summaryValue) {
                $(element).addClass('press-sheet');
                $(element).attr('press-sheet-id', pressSheet.Id);
                $(element).attr('press-sheet-user', pressSheet.User.EmpName);
                $(element).attr('press-sheet-time', pressSheet.ShortAddedDateString);
                $(element).attr('press-sheet-content', pressSheet.Content);

                if ($itemScope != null) {
                    var $input = $(currentTarget).children('input:last');
                    if ($input.length > 0) {
                        var model = $input.attr('ng-model');
                        if (model != null) {
                            $input.val(summaryValue);
                            $itemScope.$eval(model + '=' + summaryValue)
                        }
                    }
                }
            }

            function hideAllPopovers() {
                $("[data-toggle=popover]").popover('hide');
            }

            function showDialog() {
                var modalDialogDOM = '<div class="modal fade comment-modal" id="commentModal" role="dialog">' +
                                    '<div class="modal-dialog">' +
                                      '<div class="modal-content">' +
                                        '<div class="modal-header">' +
                                          '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                                          '<h4 class="modal-title">Your Comment</h4>' +
                                        '</div>' +
                                        '<div class="modal-body">' +
                                            '<script>' +
                                                'var CKEDITOR_BASEPATH = "/Scripts/ckeditor/";' +
			                                    'CKEDITOR.replace("commentText");' +
                                            '</script>' +
                                          '<form novalidate>' +
                                            '<div class="form-group">' +
                                                '<textarea rows="5" name="commentText" id="commentText" class="editable-input form-control input-sm" required style="width:570px;"/>' +
                                            '</div>' +
                                            '<div class="form-group">' +
                                                 '<div class="modal-footer">' +
                                                    '<button type="button" class="btn btn-default" data-dismiss="modal" id="btn-close">Close</button>' +
                                                    '<button type="button" class="btn btn-primary" data-dismiss="modal" id="btn-add">Add</button>' +
                                                    '<button type="button" class="btn btn-primary" data-dismiss="modal" id="btn-update">Update</button>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div class="form-group comment-block">' +
                                            '</div>' +
                                          '</form>' +

                                        '</div>' +
                                      '</div>' +
                                    '</div>' +
                                  '</div>' +
                                '</div>';

                $(document).find('body').append(modalDialogDOM);

                $('.comment-modal').on('hidden.bs.modal', function () {
                    $(document).find('#commentModal').remove();
                })

                $('#btn-add').on('click', function () {
                    processPostComment();
                });

                $('#btn-update').on('click', function () {
                    var commentId = parseInt($('#commentText').attr('comment-id'));
                    processPutComment(commentId);
                });

                populateCommentDOM();

                $('#btn-update').hide();
                $('#commentText').val('');
                $("#commentModal").modal();
            }

            function showViewPressSheetDialog() {
                var pressSheets = JSON.parse($(currentTarget).attr('press-sheet-content'));
                var table = generatePressSheetDOM(pressSheets);
                var modalDialogDOM = '<div class="modal fade comment-modal" id="pressSheetModal" role="dialog">' +
                    '<div class="modal-dialog">' +
                        '<div class="modal-content">' +
                            '<div class="modal-header">' +
                                '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                                '<h4 class="modal-title">Your Spreadsheet</h4>' +
                            '</div>' +
                            '<div class="modal-body">' +
                                table[0].outerHTML +
                                '<div class="form-group">' +
                                    '<div class="modal-footer">' +
                                        '<button type="button" class="btn btn-default" data-dismiss="modal" id="btn-close">Close</button>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '</div>';

                $('#pressSheetModal').remove();
                $(document).find('body').append(modalDialogDOM);
                $("#pressSheetModal").modal();
            }

            function showEditablePressSheetDialog($itemScope, pressSheets) {
                var modalDialogDOM = '<div class="modal fade comment-modal" id="pressSheetModal" role="dialog">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                    '<h4 class="modal-title">Your Spreadsheet</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<form novalidate>' +
                    '<div class="form-group">' +
                    '<table class="table table-striped table-hover table-bordered full-width-table table-press-sheet">' +
                        '<thead>' +
                            '<tr>' +
                                '<th>Name</th>' +
                                '<th>Value</th>' +
                                '<th>Action</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                            '<tr>' +
                                '<td><input class="form-control" type="text" /></td>' +
                                '<td><input class="form-control col-value" type="number" /></td>' +
                                '<td><button type="button" title="Remove row" disabled class="btn btn-primary btn-remove"><span class="glyphicon glyphicon-minus"></span></button></td>' +
                            '</tr>' +
                            '<tr class="summary">' +
                                '<td><strong><label>Summary</label></strong></td>' +
                                '<td colspan="2"><strong><span class="summary-value"></span></strong></td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>' +

                    '<div class="form-group">' +
                    '<button type= "button" title="Add row" class="btn btn-warning" id="btn-add-row"><span class="glyphicon glyphicon-plus"></span></button>' +
                    '</div>' +

                    '</div>' +
                    '<div class="form-group">' +
                    '<div class="modal-footer">' +
                    '<button type="button" class="btn btn-default" data-dismiss="modal" id="btn-close">Close</button>' +
                    '<button type="button" class="btn btn-primary" data-dismiss="modal" id="btn-add-press-sheet">Add</button>' +
                    '<button type="button" class="btn btn-primary" data-dismiss="modal" id="btn-update-press-sheet">Update</button>' +
                    '</div>' +
                    '</div>' +
                    '</form>' +

                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                $('#pressSheetModal').remove();
                $(document).find('body').append(modalDialogDOM);

                if (pressSheets != null) {
                    for (var key in pressSheets) {
                        if (key != 'Summary') {
                            var row = $('.table-press-sheet').find('tbody').children('tr').not('.summary').last()[0];
                            var newRow = $(row).clone().insertAfter(row);
                            newRow.find('input:first').val(key);
                            newRow.find('input:last').val(pressSheets[key]);
                            newRow.find('button').removeAttr('disabled');
                        } else {
                            $('.summary-value').html(utilitiesService.defaultFormatNumber(pressSheets[key]));
                        }
                    }

                    $('.table-press-sheet').find('tbody').children('tr').first().remove();
                    if ($('.table-press-sheet').find('tbody').children('tr').not('.summary').length == 1) {
                        $('.table-press-sheet').find('button').attr('disabled', true);
                    }

                    $('#btn-add-press-sheet').hide();
                    $('#btn-update-press-sheet').show();
                } else {
                    $('#btn-update-press-sheet').hide();
                    $('#btn-add-press-sheet').show
                }

                $('#pressSheetModal').on('hidden.bs.modal', function () {
                    $(this).remove();
                })

                $('#btn-add-row').on('click', function () {
                    var newRow = $('.table-press-sheet').find('tbody').children('tr').not('.summary').last()[0];
                    $(newRow).clone().insertAfter(newRow).find('input').val('');
                    $('.table-press-sheet').find('button').removeAttr('disabled');
                });

                $('.table-press-sheet').delegate('.btn-remove', 'click', function () {
                    $(this).parents('tr').remove();
                    calcSummary();
                    if ($('.table-press-sheet').find('tbody').children('tr').not('.summary').length == 1) {
                        $('.table-press-sheet').find('button').attr('disabled', true);
                    }
                });

                function calcSummary() {
                    $('.summary-value').text(utilitiesService.defaultFormatNumber(getSummaryValue()));
                }

                function getJSONString() {
                    var jsonModel = {};
                    var elements = $('.table-press-sheet').find('tbody').children('tr').not('.summary');
                    for (var i = 0; i < elements.length; i++) {
                        var tr = elements[i];
                        var name = $(tr).find('input:first').val();
                        var value = $(tr).find('input:last').val();
                        if (name != '' && value != '') {
                            jsonModel[name] = parseFloat(value);
                        }
                    }

                    jsonModel['Summary'] = getSummaryValue();

                    return JSON.stringify(jsonModel);
                }

                $('.table-press-sheet').delegate('.col-value', 'keyup click', function () {
                    calcSummary();
                });

                $('#btn-add-press-sheet').on('click', function () {
                    processPostPressSheet($itemScope, getJSONString());
                });

                $('#btn-update-press-sheet').on('click', function () {
                    var pressSheetId = parseInt($(currentTarget).attr('press-sheet-id'));
                    processPutPressSheet($itemScope, pressSheetId, getJSONString());
                });

                $("#pressSheetModal").modal();
            }

            function getSummaryValue(jsonString) {
                if (jsonString == null) {
                    var value = 0;
                    $('.table-press-sheet').find('.col-value').each(function () {
                        var colValue = parseFloat($(this).val());
                        if (!isNaN(colValue)) {
                            value += colValue;
                        }
                    });

                    return value;
                } else {
                    var pressSheet = JSON.parse(jsonString);
                    return pressSheet['Summary'];
                }
            }

            function populateCommentDOM() {
                $('.comment-block').empty();
                var commentThread = getCurrentCommentThread();
                if (commentThread) {
                    var comments = lodash.filter(commentThread.Comments, { IsPressSheet: false, IsActive: true });
                    lodash.forEach(comments, function (comment) {
                        $('.comment-block').append('<div class="comment mb-2 row" comment-user-id="' + comment.User.Id + '" comment-id="' + comment.Id + '">' +
                         '	<div class="comment-avatar col-md-2 col-sm-2 text-center pr-1">' +
                         '		<img class="mx-auto rounded-circle img-fluid" src="https://rb-owa.apac.bosch.com/ews/exchange.asmx/s/GetUserPhoto?email=' + comment.User.Email + '&amp;size=HR120x120"' + 'alt="">' +
                         '	</div>' +
                         '	<div class="comment-content col-md-9 col-sm-10">' +
                         '		<h6 class="small comment-meta"><a href="javascript:void(0)">' + comment.User.EmpName + '</a> ' + comment.ShortAddedDateString + '</h6>' +
                         '		<div class="comment-body">' +
                         '			<p>' + comment.Content + '</p>' +
                         '		</div>' +
                         '	</div>' +
                         '</div>'
                        );
                    });

                    $('.comment').hover(processEventMouseOverComment, processEventMouseLeaveComment);
                }
                $('.comment-block').scrollTop(5000);
            }

            function processEventMouseOverComment(event) {
                var commentThread = getCurrentCommentThread();
                if (commentThread == null) { return; }

                var comments = commentThread.Comments;

                var element = event.currentTarget;
                $(element).css({
                    'background-color': '#ECF0F5'
                });

                if ($(element).attr('comment-user-id') == authService.currentUser.UserId.toString()) {
                    $(element).append('<div class="comment-bar">' +
                        '<i class="glyphicon glyphicon-pencil pointer edit-comment" aria-hidden="true"></i>' +
                        '&nbsp;' +
                        '<i class="glyphicon glyphicon-trash pointer remove-comment" aria-hidden="true"></i>' +
                     '</div>');

                    $('.edit-comment').on('click', function (event) {
                        var comment = lodash.find(comments, {
                            Id: parseInt($(event.currentTarget).closest('.comment').attr('comment-id'))
                        });
                        CKEDITOR.instances.commentText.setData(comment.Content);
                        $('#commentText').attr('comment-id', comment.Id);
                        $('#btn-add').hide();
                        $('#btn-update').show();
                    });

                    $('.remove-comment').on('click', function (event) {
                        var commentId = parseInt($(event.currentTarget).closest('.comment').attr('comment-id'));
                        var dialogBoxDOM = '<div class="modal fade" id="deleteComment" role="dialog" aria-labelledby="myModalLabel" comment-id="' + commentId + '" aria-hidden="true">' +
                                        '<div class="modal-dialog">' +
                                            '<div class="modal-content">' +
                                                '<div class="modal-header">Confirm delete comment</div>' +
                                                '<div class="modal-body"><p>Are you sure you want to delete this comment?</p></div>' +
                                                '<div class="modal-footer">' +
                                                    '<a id="bt-modal-cancel" href="#" class="btn btn-default" data-dismiss="modal">Cancel</a>' +
                                                    '<a id="bt-modal-confirm" class="btn btn-danger btn-ok btn-delete-comment" data-dismiss="modal">Delete</a>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>';

                        $(document).find('body').append(dialogBoxDOM);

                        $('#deleteComment').on('hidden.bs.modal', function () {
                            $(document).find('#deleteComment').remove();
                        });

                        $('.btn-delete-comment').on('click', function () {
                            var commentId = parseInt($('#deleteComment').attr('comment-id'));
                            commentService.removeComment(commentId).then(function (response) {
                                if (response) {
                                    var commentThread = getCurrentCommentThread();
                                    var comment = lodash.find(commentThread.Comments, { Id: commentId });
                                    var index = commentThread.Comments.indexOf(comment);
                                    commentThread.Comments.splice(index, 1);
                                    populateCommentDOM();
                                    updateNote(commentThread.PartitionKey, commentThread.UniqueKey);
                                }
                            });
                        });

                        $("#deleteComment").modal();
                    });
                }
            }

            function processEventMouseLeaveComment(event) {
                var element = event.currentTarget;
                $(element).css({
                    'background-color': 'white'
                });
                $(element).find('.comment-bar').remove();
            }

            function getPartitionKey() {
                return $(currentTarget).closest('table').attr('binding-partition-key');
            }

            function getUniqueKey() {
                return $(currentTarget).attr('binding-unique-key');
            }

            function getCurrentCommentThread() {
                var partitionKey = getPartitionKey();
                var uniqueKey = getUniqueKey();
                var commentThread = lodash.find(commentService.commentThreads[partitionKey], { UniqueKey: uniqueKey });
                return commentThread;
            }

            function processPostComment() {
                var partitionKey = getPartitionKey();
                var comment = {
                    UserId: authService.currentUser.UserId,
                    UniqueKey: getUniqueKey(),
                    Content: CKEDITOR.instances.commentText.getData(),
                    AddedDate: new Date(),
                    AddedByUserId: authService.currentUser.UserId,
                    UpdatedDate: new Date(),
                    UpdatedUserId: authService.currentUser.UserId,
                    IsActive: true,
                    IsPressSheet: false
                };

                commentService.addOrUpdateComment(partitionKey, comment).then(function () {
                    updateNote(partitionKey, comment.UniqueKey);
                });
            }

            function processPutComment(commentId) {
                var partitionKey = getPartitionKey();
                var comment = {
                    Id: commentId,
                    UserId: authService.currentUser.UserId,
                    UniqueKey: getUniqueKey(),
                    Content: CKEDITOR.instances.commentText.getData(),
                    UpdatedDate: new Date(),
                    UpdatedUserId: authService.currentUser.UserId
                };

                commentService.addOrUpdateComment(partitionKey, comment).then(function () {
                    updateNote(partitionKey, comment.UniqueKey);
                });
            }

            function processPostPressSheet($itemScope, jsonString) {
                var partitionKey = getPartitionKey();
                var pressSheet = {
                    UserId: authService.currentUser.UserId,
                    UniqueKey: getUniqueKey(),
                    Content: jsonString,
                    AddedDate: new Date(),
                    AddedByUserId: authService.currentUser.UserId,
                    UpdatedDate: new Date(),
                    UpdatedUserId: authService.currentUser.UserId,
                    IsActive: true,
                    IsPressSheet: true
                };

                commentService.addOrUpdateComment(partitionKey, pressSheet).then(function () {
                    updatePressSheet($itemScope, partitionKey, pressSheet.UniqueKey);
                });
            }

            function processPutPressSheet($itemScope, pressSheetId, jsonString) {
                var partitionKey = getPartitionKey();
                var pressSheet = {
                    Id: pressSheetId,
                    UserId: authService.currentUser.UserId,
                    UniqueKey: getUniqueKey(),
                    Content: jsonString,                                        
                    UpdatedDate: new Date(),
                    UpdatedUserId: authService.currentUser.UserId,                                        
                };
                commentService.addOrUpdateComment(partitionKey, pressSheet).then(function () {
                    updatePressSheet($itemScope, partitionKey, pressSheet.UniqueKey);
                });
            }

            function updateNote(partitionKey, uniqueKey) {
                commentService.getCommentThreads(partitionKey).then(function () {
                    var latestComment = findLatestComment(partitionKey, uniqueKey);
                    if (latestComment != null) {
                        markAsNote(currentTarget, latestComment);
                    }
                });
            }

            function updatePressSheet($itemScope, partitionKey, uniqueKey) {
                commentService.getCommentThreads(partitionKey).then(function () {
                    var pressSheet = findPressSheet(partitionKey, uniqueKey);
                    if (pressSheet != null) {
                        var summaryValue = getSummaryValue(pressSheet.Content);
                        markAsPressSheet(currentTarget, $itemScope, pressSheet, summaryValue);
                    }
                });
            }

            function processRemoveCommentThread(event) {
                var partitionKey = getPartitionKey();
                var uniqueKey = getUniqueKey();

                commentService.removeCommentThread(partitionKey, uniqueKey).then(function (response) {
                    if (response) {                        
                        commentService.getCommentThreads(partitionKey).then(function () {
                            $(event.currentTarget).removeClass('note');
                            $(event.currentTarget).removeAttr('comment-text');

                            var $a = $(event.currentTarget).find('a');
                            $a.popover("destroy");
                            $a.remove();
                        });                        
                    }
                })
            }

            function processRemovePressSheet(event) {               
                var pressSheetId = parseInt($(currentTarget).attr('press-sheet-id'));
                commentService.removeComment(pressSheetId).then(function (response) {
                    if (response) {
                        var commentThread = getCurrentCommentThread();
                        var comment = lodash.find(commentThread.Comments, { Id: pressSheetId });
                        var index = commentThread.Comments.indexOf(comment);
                        commentThread.Comments.splice(index, 1);
                        
                        $(event.currentTarget).removeClass('press-sheet');
                        updatePressSheet(null, commentThread.PartitionKey, commentThread.UniqueKey);
                    }
                });
            }

            function findLatestComment(partitionKey, uniqueKey) {
                var commentThread = lodash.find(commentService.commentThreads[partitionKey], { UniqueKey: uniqueKey });
                if (commentThread != null) {
                    if (commentThread.Comments != null && commentThread.Comments.length > 0) {
                        var comments = lodash.filter(commentThread.Comments, { IsPressSheet: false, IsActive: true });
                        if (comments != null && comments.length > 0) {
                            var latestComment = comments[comments.length - 1];
                            return latestComment;
                        }
                    }
                }

                return null;
            }

            function registerComment(element, partitionKey, uniqueKey) {
                if (commentService.commentThreads[partitionKey] == null) { return; }

                var latestComment = findLatestComment(partitionKey, uniqueKey);
                if (latestComment != null) {
                    markAsNote(element, latestComment);
                }
            }

            function findPressSheet(partitionKey, uniqueKey) {
                var commentThread = lodash.find(commentService.commentThreads[partitionKey], { UniqueKey: uniqueKey });
                if (commentThread != null) {
                    if (commentThread.Comments != null && commentThread.Comments.length > 0) {
                        var comments = lodash.filter(commentThread.Comments, { IsPressSheet: true, IsActive: true });
                        if (comments != null && comments.length > 0) {
                            var latestPressSheet = comments[comments.length - 1];
                            return latestPressSheet;
                        }
                    }
                }

                return null;
            }

            function registerPressSheet(element, partitionKey, uniqueKey) {
                if (commentService.commentThreads[partitionKey] == null) { return; }

                var pressSheet = findPressSheet(partitionKey, uniqueKey);
                if (pressSheet != null) {
                    markAsPressSheet(element, null, pressSheet);
                }
            }

            function registerComments() {
                var items = $('table').find('td[comment]');
                angular.forEach(items, function (item) {
                    var partitionKey = $(item).closest('table').attr('binding-partition-key');
                    var uniqueKey = $(item).attr('binding-unique-key');
                    registerComment(item, partitionKey, uniqueKey);
                    registerPressSheet(item, partitionKey, uniqueKey);
                });
            }

            function processAddCommentThread(event) {
                if (hasComment()) {
                    processRemoveCommentThread(event);
                } else {
                    showDialog();
                }
            }

            function processAddPressSheet($itemScope, $event) {
                if (hasPressSheet()) {
                    processRemovePressSheet($event);
                } else {
                    showEditablePressSheetDialog($itemScope, null);
                }
            }

            function hasComment() {
                return $(currentTarget).hasClass('note');
            }

            function hasPressSheet() {
                return $(currentTarget).hasClass('press-sheet');
            }

            function removeCurrentPopoverIfExist() {
                $(currentTarget).find('a[data-toggle="popover"]').remove();
            }

            function processEventMouseOverCell(event, $scope) {
                if (!$) { var $ = angular.element; }

                hideAllPopovers();

                currentTarget = event.currentTarget;

                $(currentTarget).attr('original-color', $(currentTarget).css("border-color"));
                $(currentTarget).attr('original-width', $(currentTarget).css("border-width"));
                $(currentTarget).css({
                    "border-color": "#FF0000",
                    "border-width": "2px"
                });

                if (hasComment()) {
                    createCommentPopover($scope);                    
                } else if (hasPressSheet()) {
                    createPressSheetPopover($scope);
                }
            }

            function removeCommentPopover() {
                $('#popover-content-block').remove();
            }

            function removePressSheetPopover() {
                $('#popover-press-sheet-block').remove();
            }

            function processEventMouseLeaveCell(event) {
                if (!$) { var $ = angular.element; }

                var originalColor = $(currentTarget).attr('original-color');
                var orginalWidth = $(currentTarget).attr('original-width');

                $(currentTarget).css({
                    "border-color": originalColor,
                    "border-width": orginalWidth
                });

                $(currentTarget).removeAttr('original-color');
                $(currentTarget).removeAttr('original-width');

                if (hasComment()) {
                    removeCommentPopover();
                }

                if (hasPressSheet()) {
                    removePressSheetPopover();
                }

                //removeCurrentPopoverIfExist()
            }

            function processEventMouseDblClick(event) {
                hideAllPopovers();
                showDialog();
            }

            return function ($scope, element, attrs) {
                var table = $(element).closest('table');
                var partitionKeyAttr = table.attr('partition-key');
                var partitionKey = null;

                try {
                    if (partitionKeyAttr === undefined) {
                        throw 'Missing partition key on table';
                    }

                    partitionKey = $scope.$eval(partitionKeyAttr);

                } catch (err) {
                    partitionKey = partitionKeyAttr;
                } finally {
                    table.attr('binding-partition-key', partitionKey || 0);
                }

                var uniqueKey = null;
                try {
                    uniqueKey = $scope.$eval(attrs.uniqueKey);

                } catch (err) {
                    uniqueKey = attrs.uniqueKey;
                } finally {
                    $(element).attr('binding-unique-key', uniqueKey || 0);
                }

                //check $scope.comments contain comment partition key if not exist that mean new partition key of new table so call to server else ignore
                //use partition key to improve performance, avoid calling to server multiple times

                if (commentService.commentThreads[partitionKey] === undefined) {
                    commentService.commentThreads[partitionKey] = []
                    commentService.getCommentThreads(partitionKey).then(function (response) {
                        registerComments();
                    });
                } else {
                    registerComment(element, partitionKey, uniqueKey);
                    registerPressSheet(element, partitionKey, uniqueKey);
                }

                $("body").off("click").on("click", function () {
                    hideAllPopovers();
                });

                if (partitionKey.search('budget').length > 0) {
                    element.hover(function (event) {
                        processEventMouseOverCellBudget(event, $scope);
                    }, processEventMouseLeaveCellBudget);
                } else {                    
                    element.hover(function (event) {
                        processEventMouseOverCell(event, $scope);
                    }, processEventMouseLeaveCell);
                }

                element.on('dblclick', processEventMouseDblClick);

                var openMenuEvent = "contextmenu";
                if (attrs.contextMenuOn && typeof (attrs.contextMenuOn) === "string") {
                    openMenuEvent = attrs.contextMenuOn;
                }

                element.on(openMenuEvent, function (event) {
                    hideAllPopovers();
                    event.stopPropagation();
                    event.preventDefault();

                    // Don't show context menu if on touch device and element is draggable
                    if (isTouchDevice() && element.attr('draggable') === 'true') {
                        return false;
                    }

                    $scope.$apply(function () {
                        var options = [
                            ['Add Comment', function ($itemScope, $event, color) {
                                processAddCommentThread($event);
                            }],
                            ['Add Spreadsheet', function ($itemScope, $event, color) {
                                processAddPressSheet($itemScope, $event);
                            }, function () {
                                return $(currentTarget).children('input').is(':visible');                                
                            }]
                        ];

                        var customClass = attrs.contextMenuClass;
                        var model = null;
                        try {
                            model = $scope.$eval(attrs.uniqueKey);
                        } catch (err) {
                            model = attrs.uniqueKey;
                        }
                        if (options instanceof Array) {
                            if (options.length === 0) {
                                return;
                            }
                            renderContextMenu($scope, event, options, model, undefined, customClass);
                        } else {
                            throw '"' + attrs.uniqueKey + '" not an array';
                        }
                    });
                });
            };

            function processEventMouseOverCellBudget(event, $scope) {
                if (!$) { var $ = angular.element; }

                hideAllPopovers();

                currentTarget = event.currentTarget;

                $(currentTarget).attr('original-color', $(currentTarget).css("border-right-color"));
                $(currentTarget).attr('original-width', $(currentTarget).css("border-right-width"));

                $(currentTarget).css({
                    "border-top-color": "#FF0000",
                    "border-right-color": "#FF0000",
                    "border-bottom-color": "#FF0000",
                    "border-left-color": "#FF0000",
                    "border-top-width": "2px",
                    "border-right-width": "2px",
                    "border-bottom-width": "2px",
                    "border-left-width": "2px"
                });

                if (hasComment()) {
                    createCommentPopover($scope);
                } else if (hasPressSheet()) {
                    createPressSheetPopover($scope);
                }
            }

            function processEventMouseLeaveCellBudget(event) {
                if (!$) { var $ = angular.element; }

                var originalColor = $(currentTarget).attr('original-color');
                var orginalWidth = $(currentTarget).attr('original-width');

                $(currentTarget).css({
                    "border-top-color": 'transparent',
                    "border-right-color": originalColor,
                    "border-bottom-color": 'transparent',
                    "border-left-color": originalColor,
                    "border-top-width": orginalWidth,
                    "border-right-width": orginalWidth,
                    "border-bottom-width": orginalWidth,
                    "border-left-width": orginalWidth
                });

                $(currentTarget).removeAttr('original-color');
                $(currentTarget).removeAttr('original-width');
            }
        }]);
})();
