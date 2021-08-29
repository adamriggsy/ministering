var approvalHelper = function () {
    'use strict';

    var data = {
        'commentTemplate': null
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
        'getActiveContainerById' : function(ministerId) {
            return $('[data-ministerid="' + ministerId + '"] ' + css.household.comments);
        },
    	'createComment' : function() {
    		const form = $(css.comments.form);
            const ministerId = form.find('#ministerId').val();

    		$.ajax({
                url: '/api/minister-to/' + ministerId + '/comments/create',
                type: 'post',
                data: {
                	form: JSON.stringify(form.serializeArray().reduce(function(m,o){  m[o.name] = o.value; return m;}, {}))
                },
                success: function(response) {
                    if(response.saved) {
                    	functions.resetCommentForm();
                        functions.buildComments(response.comments, ministerId);
                        $(css.modals.comment).modal('hide');
                    } else {
                    	functions.setCommentError('Could not save your comment. Refresh the page and try again.');
                    }
                }
            });
    	},
    	'buildComments' : function(comments, ministerId) {
    		let container = functions.getActiveContainerById(ministerId);

            container.html('');
    		
    		$.each(comments, function(index, comment) {
				let authorInfo = comment.author.name + ' - ' + _moment(comment.updated_at).format('YYYY-MM-DD LT');
				let newComment = data.commentTemplate(comment.id, comment.body, authorInfo);
				container.prepend(newComment);
			});
    	},
    	'setCommentError' : function(error) {
    		$(css.comments.formError).html(error);
    	},
    	'resetCommentForm' : function() {
    		$(css.comments.form)[0].reset();
    	},
        'updateStatus' : function(btn, status) {
            let container = btn.closest(css.household.container);
            let ministerId = container.data('ministerid');
            let householdId = container.data('householdid');

            $.ajax({
                url: '/api/minister-to/household/' + householdId + '/' + status,
                type: 'post',
                data: {},
                success: function(response) {
                    if(response.saved) {
                        $(css.household.status, container).html(response.status),
                        console.log($(css.household.container, container));
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
