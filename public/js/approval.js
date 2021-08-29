var approvalHelper = function () {
    'use strict';

    var data = {
        'commentTemplate': null
    };

    var css = {
        'modals': {
            'comment': '#commentModal'
        },
        'comments': {
            'form': '#newComment',
            'formError': '#commentError'
        },
        'household': {
            'container': '.household',
            'comments': '.allComments'
        }
    };

    var functions = {
    	'init' : function(households) {
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
    		let container = $('[data-ministerid="' + ministerId + '"] ' + css.household.comments);

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
    	}
    };

	$(document).on('click touch', '#submitComment', function(e) {
		e.preventDefault();
        console.log('submitComment clicked');
		functions.createComment();
    });   

    return {
        data : functions.getAllData,
        functions: functions
    }
}();
