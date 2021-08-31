import {commentsHelper} from './_comments.js';

window.householdsHelper = function () {
    'use strict';

    var data = {
        'households': null,
        'currentHouseholdId': null
    };

    var css = css = {
        'mainContainer': '#householdsContainer',
        'modals': {
            'comment': '#commentModal',
            'household': {
                'container': '#householdModal',
                'comments': '.allComments'
            }
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

    const commentTemplate = function commentTemplate(id, body, author ) {
        return `
            <div class='householdComment' data-commentid="${id}">
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

            functions.setDataAttr('households', households);

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
        'getActiveContainerById' : function(householdId) {
            return $('[data-householdid="' + householdId + '"] ' + css.household.comments);
        },
    	'createComment' : function() {
    		const form = $(css.comments.form);
            const householdId = form.find('#householdId').val();
            
            functions.setDataAttr('currentHouseholdId', householdId);
            let params = {
                'url' : '/api/household/' + householdId + '/comments/create',
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
                    functions.getActiveContainerById(functions.getDataAttr('currentHouseholdId')),
                    response.comments,
                    'No comments yet.'
                );
                $(css.modals.comment).modal('hide');
            } else {
                commentsHelper.functions.setCommentError(
                    $(css.comments.formError),
                    'Could not save your comment. Refresh the page and try again.'
                );
            }
        },
        'populateHouseholdModal' : function(referrerBtn) {
            let householdId = referrerBtn.closest('.household').data('householdid');
            let houseData = functions.getHouseholdById(householdId);
            let modal = $(css.modals.household.container);
            functions.setDataAttr('currentHouseholdId');
            
            modal.find('.householdName').text(houseData.fullHouseholdName);

            commentsHelper.functions.buildComments(
                $(css.modals.household.comments, modal),
                houseData.comments,
                'No comments yet.'
            );
        },
        'getHouseholdById' : function(id) {
            let filteredHouseholds = data.households.filter(function(household) {
                return (household.id === id);
            });
            return filteredHouseholds[0];
        }
    };

	$(document).on('click touch', '#submitComment', function(e) {
		e.preventDefault();
		functions.createComment();
    });   

    return {
        data : functions.getAllData,
        functions: functions
    }
}();
