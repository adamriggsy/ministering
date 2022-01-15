import {commentsHelper} from './_comments.js';

window.householdsHelper = function () {
    'use strict';

    var data = {
        'households': {},
        'currentHouseholdId': null,
        'householdSearch': null,
        'ac': null,
        'maxCommentsShown': 4
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
            'formError': '#commentError',
            'commentCount': '.count',
            'buttons': '.commentBtns'
        },
        'household': {
            'container': '#householdsContainer .household',
            'comments': '.allComments',
            'name': '.householdName',
            'count': '.count',
            'commentButton': '.commentBtn'
        },
        'search': {
            'input': '#searchHouseholds'
        }
    };

    const commentTemplate = function commentTemplate(id, body, authorName, commentDate ) {
        return `
            <div class='householdComment' data-commentid="${id}">
                <author>${authorName} - ${commentDate}</author>
                <p class="commentBody">${body}</p>
            </div>
        `;
    };

    const commentCardTemplate = function commentCardTemplate(id, body, authorName, commentDate) {
        return `
            <div class='householdComment-card' data-commentid="${id}">
                <author>
                    <p class="authorName">
                        ${authorName}
                    </p>
                    <p class="commentDate">
                        ${commentDate}
                    </p>
                </author>
                <p class="commentBody">${body}</p>
            </div>
        `;
    };

    var functions = {
    	'init' : function(householdSearch) {
    		$.ajaxSetup({
			    headers: {
			        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			    }
			});

            functions.setDataAttr('householdSearch', householdSearch);
            functions.setDataAttr('maxCommentsShown', $(css.mainContainer).data('maxcommentsshown'));
            functions.setAutocomplete();

            commentsHelper.functions.init();
            commentsHelper.functions.setDataAttr('commentTemplate', commentTemplate);
            commentsHelper.functions.setDataAttr('commentCardTemplate', commentCardTemplate);
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
            return $('[data-householdid="' + householdId + '"] ');
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
                functions.replaceHouseholdComments(response.comments);
                
                commentsHelper.functions.resetCommentForm(
                    $(css.comments.form)[0]
                );

                let activeContainer = functions.getActiveContainerById(functions.getDataAttr('currentHouseholdId'));
                
                commentsHelper.functions.buildComments(
                    commentsHelper.functions.getDataAttr('commentCardTemplate'),
                    activeContainer.find(css.household.comments),
                    response.comments,
                    'No comments yet.'
                );

                let numComments = response.comments.length;
                let maxShown = parseInt($(css.mainContainer).data('maxcommentsshown'));
                
                activeContainer.find(css.comments.commentCount).text(numComments);
                if(numComments > maxShown) {
                    activeContainer.addClass('showAllCommentsBtn')
                }

                functions.handleBtnGroup(activeContainer.find(css.comments.buttons));

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
                commentsHelper.functions.getDataAttr('commentTemplate'),
                $(css.modals.household.comments, modal),
                houseData.comments,
                'No comments yet.'
            );
        },
        'replaceHouseholdComments' : function(hComments) {
            let wantedHousehold = _.find(data.households, function(household) {
                return (household.id === parseInt(functions.getDataAttr('currentHouseholdId')))
            });

            wantedHousehold['comments'] = hComments;
        }, 
        'getHouseholdById' : function(id) {
            return data.households[id];
        },
        'handleBtnGroup' : function(container) {
            let countVisible = container.find('button').not(':hidden').length;

            if(countVisible === 1) {
                container.removeClass('btn-group').addClass('full-width');
            } else {
                container.addClass('btn-group').removeClass('full-width');
            }
        },
        'setAutocomplete' : function() {
            $("#householdSearch").html('').append('<input type="text" class="form-control form-control-lg" id="searchHouseholds" placeholder="Find a household..." autocomplete="off">');
            functions.setDataAttr('ac', false);

            const field = document.getElementById('searchHouseholds');
            let ac = new Autocomplete(field, {
                data: householdsHelper.functions.getDataAttr('householdSearch'),
                maximumItems: 10,
                treshold: 1,
                highlightTyped: false,
                onSelectItem: ({label, value}) => {
                    functions.getHouseholdData(parseInt(value));
                }
            });

            functions.setDataAttr('ac', ac);
        },
        'showHousehold' : function(hData) {
            let hContainer = $(css.household.container).first().clone();
            
            commentsHelper.functions.buildComments(
                commentsHelper.functions.getDataAttr('commentCardTemplate'),
                $(css.household.comments, hContainer),
                hData.comments
            );

            let countClass = hData.comments.length > functions.getDataAttr('maxCommentsShown') ? 'showAllCommentsBtn' : '';

            hContainer.removeClass().addClass('household ' + countClass);
            hContainer.attr('data-householdid', hData.household.id);
            $(css.household.name, hContainer).text(hData.household.fullHouseholdName);
            $(css.household.count, hContainer).text(hData.comments.length);

            functions.resetHouseholdVisibility(hContainer);
            $(css.mainContainer).prepend(hContainer);

            functions.handleBtnGroup(hContainer.find(css.comments.buttons));

            $(css.search.input).val('');
        },
        'getHouseholdData' : function(householdId) {
            $.getJSON('/api/household/' + householdId, function( response ) {
                functions.addToHouseholds(response);
                functions.showHousehold(response);
            });
        },
        'addToHouseholds': function(hData) {
            data.households[hData.household.id] = {
                ...hData.household,
                'comments': hData.comments
            }
        },
        'toggleHouseholdVisibility': function(container) {
            container.find('.canHide').toggle(850);
            container.find('.content-hide').toggleClass('bi-plus-circle-dotted bi-dash-circle-dotted');
        },
        'resetHouseholdVisibility': function(container) {
            container.find('.canHide').show();
            container.find('.content-hide').removeClass().addClass('content-hide bi-dash-circle-dotted');
        }
    };

	$(document).on('click touch', '#submitComment', function(e) {
		e.preventDefault();
		functions.createComment();
    });

    $(document).on('click touch', '.content-hide', function(e) {
        e.preventDefault();
        functions.toggleHouseholdVisibility($(this).closest('.household'));
    });

    return {
        data : functions.getAllData,
        functions: functions
    }
}();
