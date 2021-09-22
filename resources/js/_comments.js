export const commentsHelper = function () {
    'use strict';

    let data = {
        'commentTemplate': null,
        'commentCardTemplate': null
    };

    let css = {
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

    let functions = {
    	'init' : function(createUrl) {
    		$.ajaxSetup({
			    headers: {
			        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			    }
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
        'createComment' : function(params) {
    		$.ajax({
                url: params.url,
                type: 'post',
                data: params.data,
                success: function(response) {
                    params.successCallback(response);
                }
            });
    	},
    	'buildComments' : function(template, container, comments, emptyMessage) {
    		if(typeof emptyMessage === 'undefined') {
                emptyMessage = 'No comments yet.';
            }

            container.html('');

            if(comments.length === 0) {
                container.html('<p>' + emptyMessage + '</p>');
            }else {
    		    $.each(comments, function(index, comment) {
                    console.log(comment);
                    console.log(template);
                    let author = comment.author;

                    if(typeof author === 'undefined') {
                        author = comment.authorInfo;
                    }
                    
    				// let authorInfo = author.name + ' - ' + _moment(comment.updated_at).format('YYYY-MM-DD LT');
    				let newComment = template(comment.id, comment.body, author.name, _moment(comment.updated_at).format('YYYY-MM-DD LT'));
    				container.prepend(newComment);
    			});
            }
    	},
    	'setCommentError' : function(container, error) {
    		container.html(error);
    	},
    	'resetCommentForm' : function(form) {
    		form.reset();
    	},
        'showCommentsAjaxLoader' : function(container) {
            container.find('.ajax-loader').removeClass('d-none');
        },
        'hideCommentsAjaxLoader' : function(container) {
            container.find('.ajax-loader').addClass('d-none');
        }
    };

    return {
        data : functions.getAllData,
        functions: functions
    }
}();
