import {commentsHelper} from './_comments.js';

window.assignmentHelper = function () {
    'use strict';

    let data = {
    	'companionships' : null,
    	'unassignedHouseholds': false,
    	'activeCompanionship': null,
    	'ac': false,
        'tickerTemplate': null
    };

    let css = {
    	'activeCompanionship' : {
    		'container' : '#activeCompanionship',
    		'companionship' : {
    			'container' : '#companionshipContainer',
    			'comp1': '.companionship1',
    			'comp2' : '.companionship2',
    			'minTo' : '#assignedToVisitContainer'
    		},
    		'ministering' : {
    			'container' : '#ministeringInfo',
    			'assigned' : {
    				'container' : '#assignedToVisitContainer'
    			},
    			'visiting' : {
    				'container' : '#visitingHousehold'
    			}
    		},
    		'comments' : {
    			'container' : '#companionshipComments',
    			'allComments' : '#commentsContainer',
    			'view' : '#view',
    			'form' : '#newComment',
    			'formError' : '#commentError',
    			'nav' : {
    				'view' : '#commentNavView',
    				'create' : '#commentNavCreate'
    			}
    		}
    	},
        'ticker' : {
            'mainContainer': '#unassignedTicker',
            'container' : '#unassignedTicker .ticker'
        }
    };

    const commentTemplate = function commentTemplate(id, body, authorName, commentDate ) {
        return `
            <div class='houseComment' data-commentid="${id}">
                <author>${authorName} - ${commentDate}</author>
                <p class="commentBody">${body}</p>
            </div>
        `;
    };

    const tickerTemplate = function tickerTemplate(content) {
        return `
            <div class="ticker__item">${content}</div>
        `;
    }

    let functions = {
    	'init' : function(companionships) {
    		$.ajaxSetup({
			    headers: {
			        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			    }
			});

    		
            functions.setDataAttr('companionships', companionships);
            functions.setDataAttr('tickerTemplate', tickerTemplate);
    		functions.getUnassignedHouseholds();
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
    	'workOnCompanionship' : function(companionshipEl) {
            let companionshipData = functions.getCompanionshipById(companionshipEl.data('companionshipid'));

    		functions.setDataAttr('activeCompanionship', companionshipData);

    		let ac = css.activeCompanionship;
    		let $ac = $(ac.container);
    		
            $ac.attr('data-activeid', companionshipData.id);
            $ac.attr('data-companionshipid', companionshipData.id);
            $(ac.companionship.comp1, $ac).html(companionshipData.firstCompanion.fullName);
            $(ac.companionship.comp2, $ac).html(companionshipData.secondCompanion.fullName);

            $(ac.companionship.minTo).html(companionshipEl.find('.assignments').html());
    	},
    	'setAutocomplete' : function() {
			$("#assignHouseholdContainer").html('').append('<input type="text" class="form-control" id="assignHousehold" placeholder="Start typing..." autocomplete="off">');
			functions.setDataAttr('ac', false);


			const field = document.getElementById('assignHousehold');
		    let ac = new Autocomplete(field, {
		        data: assignmentHelper.functions.getDataAttr('unassignedHouseholds'),
		        maximumItems: 10,
		        treshold: 1,
		        highlightTyped: false,
		        onSelectItem: ({label, value}) => {
		            console.log(label, value);
                    functions.assignHousehold(value);
		        }
		    });

		    functions.setDataAttr('ac', ac);
    	},
    	'getCompanionshipById' : function(id) {
    		let filteredCompanionships = data.companionships.filter(function(companionship) {
                return (companionship.id === id);
            });
            return filteredCompanionships[0];
    	},
    	'getUnassignedHouseholds' : function() {
    		$.getJSON('/api/households/unassigned', function( response ) {
				functions.setDataAttr('unassignedHouseholds', response);
				functions.setDataAttr('ac', false);
				functions.setAutocomplete();
                functions.updateTicker();
			});
    	},
        'assignHousehold' : function(assignedId) {
    		let activeCompanionship = functions.getDataAttr('activeCompanionship');

            $.ajax({
                url: '/api/assign',
                type: 'post',
                data: {
                	companionshipId: activeCompanionship.id,
                    assignedId: assignedId
                },
                success: function(response) {

                    if(response.success) {
                        let householdHtml = '<p class="household" data-householdid="' + response.assignedHousehold.id + '">' 
                            + response.assignedHousehold.householdName 
                            + '<i class="removeAssigned bi-x-circle small text-danger"></i>'
                            + '</p>';
                        
                        $(css.activeCompanionship.companionship.minTo).append(householdHtml);
                        $("#companionships .companionship[data-companionshipid='" + activeCompanionship.id + "'] .assignments").append(householdHtml);

                        $("#assignHousehold").val('');
                        functions.getUnassignedHouseholds();
                    }
                }
            });
    	},
    	'removeAssignedMinTo' : function(clickedEl) {
    		let assignedId = clickedEl.data('householdid');
    		let activeCompanionship = functions.getDataAttr('activeCompanionship');
            let companionshipId = clickedEl.closest('.companionship').data('companionshipid');

    		$.ajax({
                url: '/api/remove-assigned',
                type: 'post',
                data: {
                	householdId: assignedId,
                	companionshipId: companionshipId
                },
                success: function(response) {
                    if(response.success) {
                        $('.companionship[data-companionshipid="' + companionshipId + '"]').find(".household[data-householdid='" + assignedId + "']").remove();

                        $("#assignHousehold").val('');
                        functions.getUnassignedHouseholds();
                    }
                }
            });
    	},
   //  	'getCompanionshipComments' : function() {
   //  		commentsHelper.functions.showCommentsAjaxLoader(
   //              $(css.activeHousehold.comments.view)
   //          );

   //          $.getJSON('/api/household/' + data.activeHousehold.id + '/comments', function( comments ) {
				
			// 	commentsHelper.functions.buildComments(
   //                  commentsHelper.functions.getDataAttr('commentTemplate'),
   //                  $(css.activeHousehold.comments.allComments),
   //                  comments
   //              );
			// 	commentsHelper.functions.hideCommentsAjaxLoader(
   //                  $(css.activeHousehold.comments.view)
   //              );
			// });
   //  	},
    	// 'createComment' : function() {
    	// 	const form = $(css.activeHousehold.comments.form);
    	// 	let activeHousehold = functions.getDataAttr('activeHousehold');
     //        let params = {
     //            'url' : '/api/household/' + activeHousehold.id + '/comments/create',
     //            'data' : {
     //                form: JSON.stringify(form.serializeArray().reduce(function(m,o){  m[o.name] = o.value; return m;}, {}))
     //            },
     //            'successCallback' : functions.commentCreateSuccess
     //        };

     //        commentsHelper.functions.createComment(params);
    	// },
     //    'commentCreateSuccess' : function(response) {
     //        if(response.saved) {
     //            $(css.activeHousehold.comments.nav.view).find('.nav-link').click();

     //            commentsHelper.functions.showCommentsAjaxLoader(
     //                $(css.activeHousehold.comments.view)
     //            );
                
     //            commentsHelper.functions.buildComments(
     //                commentsHelper.functions.getDataAttr('commentTemplate'),
     //                $(css.activeHousehold.comments.allComments),
     //                response.comments,
     //                'No comments yet.'
     //            );

     //            commentsHelper.functions.hideCommentsAjaxLoader(
     //                $(css.activeHousehold.comments.view)
     //            );
                
     //            commentsHelper.functions.resetCommentForm($(css.activeHousehold.comments.form)[0]);
     //        } else {
     //            commentsHelper.functions.setCommentError(
     //                $(css.activeHousehold.comments.formError),
     //                'Could not save your comment. Refresh the page and try again.'
     //            );
     //        }
     //    },
    	'updateTicker' : function() {
            let unassignedHouseholds = _.clone(functions.getDataAttr('unassignedHouseholds'));

            let shuffled = _.shuffle(_.shuffle(unassignedHouseholds));

            $(css.ticker.container).html('');
            $(css.ticker.container).append(data.tickerTemplate('Unassigned Households: '));

            $.each(_.slice(shuffled,0,50), function(key, household) {
                $(css.ticker.container).append(data.tickerTemplate(household.label));
            });
        }
    };

    $(document).on('show.bs.modal', '#assignmentManagementModal', function(e) {
        let btn = $(e.relatedTarget);
        let parent = btn.closest('.companionship');
        functions.workOnCompanionship(parent);
    });

    $(document).on('show.bs.modal', '#assignmentFeedbackModal', function(e) {
        let btn = $(e.relatedTarget);
        let parent = btn.closest('.household');
        let modal = $(this);
        let householdData = functions.getCompanionshipById(parent.data('householdid'));
        let assignmentComments = [];

        modal
            .removeClass('approved rejected proposed')
            .addClass(householdData.ministeredByStatus);

        _.each(householdData.ministered_by.comments, function(comment){
            assignmentComments.push(comment);
        });
    
        $("#assignStatus", modal).html(_.upperFirst(householdData.ministeredByStatus));
        $(".householdName", modal).html(householdData.fullHouseholdName);
        $(".assignedNames", modal).html(householdData.ministeringComp1 + ' & ' + householdData.ministeringComp2);

        commentsHelper.functions.buildComments(
            commentsHelper.functions.getDataAttr('commentTemplate'),
            $("#aFeedbackContainer", modal),
            assignmentComments
        );
    });

    $(document).on('click touch', '.removeAssigned', function() {
    	functions.removeAssignedMinTo($(this).closest('.household'));
    });

  //   $(document).on('click touch', '#commentSubmit', function(e) {
		// e.preventDefault();
		// functions.createComment();
  //   });   

  //   $(document).on('click touch', '#commentNavCreate', function() {
  //   	commentsHelper.functions.setCommentError(
  //           $(css.activeHousehold.comments.formError),
  //           ''
  //       );
  //   });

    $(document).on('click touch', '#tickerClose', function() {
        $(css.ticker.mainContainer).remove();
    });

    return {
        data : functions.getAllData,
        functions: functions
    }
}();
