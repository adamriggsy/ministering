import {commentsHelper} from './_comments.js';

window.approvalHelper = function () {
    'use strict';

    var data = {
        'currentAssignmentId': null
    };

    var css = {
        'mainContainer': '#assignmentContainer',
        'viewTypes': {
            'grid': 'ajr-grid',
            'list': 'ajr-list'
        },
        'modals': {
            'comment': '#commentModal'
        },
        'comments': {
            'form': '#newComment',
            'formError': '#commentError'
        },
        'household': {
            'container': '.household',
            'comments': '.allComments',
            'status': '.status',
            'error': '.statusError'
        }
    };

    const commentTemplate = function commentTemplate(id, body, author ) {
        return `
            <div class='ministeringComment' data-commentid="${id}">
                <author>${author}</author>
                <p class="commentBody">${body}</p>
            </div>
        `;
    };

    var functions = {
    	'init' : function(households) {
    		$.ajaxSetup({
			    headers: {
			        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			    }
			});

            $('.household').each(function() {
                functions.handleBtnGroup($(this));
            });

            commentsHelper.functions.init();
            commentsHelper.functions.setDataAttr('commentTemplate', commentTemplate);
    	},
    	'setDataAttr' : function(attr, val) {
    		data[attr] = val;
    	},
    	'getDataAttr' : function(attr) {
    		return data[attr];
    	},
    	'getAllData' : function() {
    		return data;
    	},
        'getActiveContainerById' : function(assignmentId) {
            return $('[data-assignmentid="' + assignmentId + '"] ' + css.household.comments);
        },
    	'createComment' : function() {
    		const form = $(css.comments.form);
            const assignmentId = form.find('#assignmentId').val();
            functions.setDataAttr('currentAssignmentId', assignmentId);

            let params = {
                'url' : '/api/assignment/' + assignmentId + '/comments/create',
                'data' : {
                    form: JSON.stringify(form.serializeArray().reduce(function(m,o){  m[o.name] = o.value; return m;}, {}))
                },
                'successCallback' : functions.commentCreateSuccess
            };

            commentsHelper.functions.createComment(params);
    	},
        'commentCreateSuccess' : function(response) {
            if(response.saved) {
                commentsHelper.functions.resetCommentForm(
                    $(css.comments.form)[0]
                );
                commentsHelper.functions.buildComments(
                    commentsHelper.functions.getDataAttr('commentTemplate'),
                    functions.getActiveContainerById(functions.getDataAttr('currentAssignmentId')),
                    response.comments,
                    'No feedback provided.'
                );
                $(css.modals.comment).modal('hide');
            } else {
                commentsHelper.functions.setCommentError(
                    $(css.comments.formError),
                    'Could not save your comment. Refresh the page and try again.'
                );
            }
        },
    	'updateStatus' : function(btn, status) {
            let container = btn.closest(css.household.container);
            let assignmentId = container.data('assignmentid');
            // let householdId = container.data('householdid');

            $.ajax({
                url: '/api/assignment/' + assignmentId + '/' + status,
                type: 'post',
                data: {},
                success: function(response) {
                    if(response.saved) {
                        $(css.household.status, container).html(response.status);
                        $(container).removeClass().addClass('household ' + response.status);
                        functions.handleBtnGroup(container);
                    } else {
                        functions.setStatusError('Could not update the status. Refresh the page and try again.');
                    }
                }
            });
        },
        'setStatusError' : function(error) {
            $(css.household.error).html(error);
        },
        'handleBtnGroup' : function(container) {
            $('.btn-group', container)
                .find('button')
                .removeClass('fake-last')
                .removeClass('fake-first');

            $('.btn-group', container)
                .find('button')
                .not(':hidden')
                .last()
                .addClass('fake-last');

            $('.btn-group', container)
                .find('button')
                .not(':hidden')
                .first()
                .addClass('fake-first');
        },
        'changeViewType' : function(viewType) {
            switch(viewType) {
                case 'grid':
                    $(css.mainContainer).removeClass(css.viewTypes.list).addClass(css.viewTypes.grid);
                    break;
                case 'list':
                default:
                    $(css.mainContainer).addClass(css.viewTypes.list).removeClass(css.viewTypes.grid);
                    break;
            }
        }
    };

	$(document).on('click touch', '#submitComment', function(e) {
		e.preventDefault();
		functions.createComment();
    });   

    $(document).on('click touch', '.acceptAssignment', function(e) {
        functions.updateStatus($(this), 'accept');
    });

    $(document).on('click touch', '.rejectAssignment', function(e) {
        functions.updateStatus($(this), 'reject');
    });

    $(document).on('click touch', '.resetStatus', function(e) {
        functions.updateStatus($(this), 'propose');
    });

    $(document).on('click touch', '#viewChoice li', function() {
        functions.changeViewType($(this).data('viewtype'));
    })

    return {
        data : functions.getAllData,
        functions: functions
    }
}();
