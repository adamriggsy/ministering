import {commentsHelper} from './_comments.js';

window.ministeringHelper = function () {
    'use strict';

    let data = {
    	'households' : null,
    	'unassignedHouseholds': false,
    	'activeHousehold': null,
    	'ac': false,
        'tickerTemplate': null
    };

    let css = {
    	'activeHousehold' : {
    		'container' : '#activeHousehold',
    		'household' : {
    			'container' : '#householdContainer',
    			'name' : '.householdName',
    			'husband': '.husbandName',
    			'wife' : '.wifeName',
    			'minTo' : '#assignedToVisitContainer',
    			'assignedReceive' : '#visitingHousehold'
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
    			'container' : '#householdComments',
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
    	'household' : {
    		'container' : '.household',
    		'last_name' : '.hh_lastName',
    		'husband' : '.hh_husbandName',
    		'wife' : '.hh_wifeName',
    		'minSis' : '.hh_ministeringSis',
    		'minBro' : '.hh_ministeringBro',
    		'minTo' : '.hh_ministeringTo'
    	},
        'ticker' : {
            'mainContainer': '#unassignedTicker',
            'container' : '#unassignedTicker .ticker'
        }
    };

    const commentTemplate = function commentTemplate(id, body, authorName, $commentDate ) {
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
    	'init' : function(households) {
    		$.ajaxSetup({
			    headers: {
			        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			    }
			});

    		functions.setDataAttr('households', households);
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
    	'workOnHousehold' : function(householdEl) {
    		let householdData = functions.getHouseholdById(householdEl.data('householdid'));
    		functions.setDataAttr('activeHousehold', householdData);
    		
    		let ah = css.activeHousehold;
    		let $ah = $(ah.container);
    		$ah.data('activeid', householdData.id);
    		$(ah.household.name, $ah).html(householdData.last_name);
    		$(ah.household.husband, $ah).html(householdData.husbandName);
    		$(ah.household.wife, $ah).html(householdData.wifeName);

    		$(ah.household.minTo, $ah).html('');
    		$.each(householdData.ministerTo, function(key, val) {
    			$(ah.household.minTo, $ah).append(
    				'<p class="minToHouse" data-householdid="' + key + '">' 
    				+ val 
    				+ '<i class="removeAssigned bi-x-circle small text-danger"></i>'
    				+ '</p>'
				);
    		});

    		$(ah.household.assignedReceive).children().remove();
    		if(householdData.ministeringBrother !== '') {
    			$(ah.household.assignedReceive).append('<p>' + householdData.ministeringBrother + '</p>');
    		}
    		if(householdData.ministeringSister !== '') {
    			$(ah.household.assignedReceive).append('<p>' + householdData.ministeringSister + '</p>');
    		}

    		$(css.activeHousehold.container).removeClass('d-none');

    		functions.getHouseholdComments();
    	},
    	'setAutocomplete' : function() {
			$("#assignHouseholdContainer").html('').append('<input type="text" class="form-control" id="assignHousehold" placeholder="Start typing..." autocomplete="off">');
			functions.setDataAttr('ac', false);


			const field = document.getElementById('assignHousehold');
		    let ac = new Autocomplete(field, {
		        data: ministeringHelper.functions.getDataAttr('unassignedHouseholds'),
		        maximumItems: 10,
		        treshold: 1,
		        highlightTyped: false,
		        onSelectItem: ({label, value}) => {
		            functions.assignHousehold(value);
		        }
		    });

		    functions.setDataAttr('ac', ac);
			
			// $("#assignHousehold").val('');
    	},
    	'getHouseholdById' : function(id) {
    		let filteredHouseholds = data.households.filter(function(household) {
                return (household.id === id);
            });
            return filteredHouseholds[0];
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
    		let activeHousehold = functions.getDataAttr('activeHousehold');

    		$.ajax({
                url: '/api/assign',
                type: 'post',
                data: {
                	householdId: activeHousehold.id,
                    assignedId: assignedId
                },
                success: function(response) {
                    functions.updateHouseholds(response.household);
                    functions.updateHouseholds(response.assignedHousehold);

                    $(css.activeHousehold.household.minTo).append(
						'<p class="minToHouse" data-householdid="' + response.assignedHousehold.id + '">' 
	    				+ response.assignedHousehold.householdName 
	    				+ '<i class="removeAssigned bi-x-circle small text-danger"></i>'
	    				+ '</p>'
                	);

                    $("#assignHousehold").val('');
                    functions.getUnassignedHouseholds();
                    functions.resetDataTable();
                }
            });
    	},
    	'updateHouseholds' : function(household) {
    		functions.replaceHouseholdData(household);

    		let row = $(".household[data-householdid='" + household.id + "']");

    		$(css.household.minSis, row).html(household.ministeringSister);
    		$(css.household.minBro, row).html(household.ministeringBrother);

    		$(css.household.minTo, row).html('');
    		$.each(household.ministerTo, function(key, val) {
    			$(css.household.minTo, row).append('<p>' + val + '</p>');
    		});
    	},
    	'replaceHouseholdData' : function(hData) {
    		let householdKey = data.households.findIndex(function(household) {
                return (household.id === hData.id);
            });
            
            data.households[householdKey] = hData;
    	}, 
    	'removeActiveVisiting' : function() {
    		let activeHousehold = functions.getDataAttr('activeHousehold');

    		if($(css.activeHousehold.household.assignedReceive).children().length > 0) {
	    		$.ajax({
	                url: '/api/remove-visiting',
	                type: 'post',
	                data: {
	                	householdId: activeHousehold.id
	                },
	                success: function(response) {
	                    functions.updateHouseholds(response.household);
	                    functions.updateHouseholds(response.otherHousehold);

	                    $(css.activeHousehold.household.assignedReceive).html('');

	                    $("#assignHousehold").val('');
	                    functions.getUnassignedHouseholds();
	                    functions.resetDataTable();
	                }
	            });
	    	}
    	},
    	'removeAssignedMinTo' : function(clickedEl) {
    		let assignedId = clickedEl.data('householdid');
    		let activeHousehold = functions.getDataAttr('activeHousehold');

    		$.ajax({
                url: '/api/remove-assigned',
                type: 'post',
                data: {
                	householdId: activeHousehold.id,
                	assignedId: assignedId
                },
                success: function(response) {
                    functions.updateHouseholds(response.household);
                    functions.updateHouseholds(response.otherHousehold);

                    $(css.activeHousehold.household.minTo + " .minToHouse[data-householdid='" + assignedId + "']").remove();

                    $("#assignHousehold").val('');
                    functions.getUnassignedHouseholds();
                    functions.resetDataTable();
                }
            });
    	},
    	'resetDataTable' : function() {
    		if ( $.fn.dataTable.isDataTable('#allHouseholdsTable') ) {
				$('#allHouseholdsTable').DataTable().destroy();

			}

			$("#allHouseholdsTable").DataTable({
                paging: false,
                "order": [],
                // "autoWidth": false,
                "columns": [
                    {
                        "targets": 0,
                        "orderable": false,
                        "width": '1%'
                    },
                    {
                        "targets": 1,
                        "width": '5%'
                    },
                    {
                        "targets": 2,
                        "width": '5%'
                    },
                    {
                        "targets": 3,
                        "width": '5%'
                    },
                    {
                        "targets": 4,
                        "orderable": false,
                        "width": '14%'
                    },
                    {
                        "targets": 5,
                        "orderable": false,
                        "width": '14%'
                    },
                    {
                        "targets": 6,
                        "orderable": false,
                        "width": '14%'
                    },
                    {
                        "targets": 7,
                        "orderable": false,
                        "width": '14%'
                    },
                ]
            });
    	}, 
    	'getHouseholdComments' : function() {
    		commentsHelper.functions.showCommentsAjaxLoader(
                $(css.activeHousehold.comments.view)
            );

            $.getJSON('/api/household/' + data.activeHousehold.id + '/comments', function( comments ) {
				
				commentsHelper.functions.buildComments(
                    commentsHelper.functions.getDataAttr('commentTemplate'),
                    $(css.activeHousehold.comments.allComments),
                    comments
                );
				commentsHelper.functions.hideCommentsAjaxLoader(
                    $(css.activeHousehold.comments.view)
                );
			});
    	},
    	'createComment' : function() {
    		const form = $(css.activeHousehold.comments.form);
    		let activeHousehold = functions.getDataAttr('activeHousehold');
            let params = {
                'url' : '/api/household/' + activeHousehold.id + '/comments/create',
                'data' : {
                    form: JSON.stringify(form.serializeArray().reduce(function(m,o){  m[o.name] = o.value; return m;}, {}))
                },
                'successCallback' : functions.commentCreateSuccess
            };

            commentsHelper.functions.createComment(params);
    	},
        'commentCreateSuccess' : function(response) {
            if(response.saved) {
                $(css.activeHousehold.comments.nav.view).find('.nav-link').click();

                commentsHelper.functions.showCommentsAjaxLoader(
                    $(css.activeHousehold.comments.view)
                );
                
                commentsHelper.functions.buildComments(
                    commentsHelper.functions.getDataAttr('commentTemplate'),
                    $(css.activeHousehold.comments.allComments),
                    response.comments,
                    'No comments yet.'
                );

                commentsHelper.functions.hideCommentsAjaxLoader(
                    $(css.activeHousehold.comments.view)
                );
                
                commentsHelper.functions.resetCommentForm($(css.activeHousehold.comments.form)[0]);
            } else {
                commentsHelper.functions.setCommentError(
                    $(css.activeHousehold.comments.formError),
                    'Could not save your comment. Refresh the page and try again.'
                );
            }
        },
    	'updateTicker' : function() {
            let unassignedHouseholds = _.clone(functions.getDataAttr('unassignedHouseholds'));

            let shuffled = _.shuffle(unassignedHouseholds);

            $(css.ticker.container).append(data.tickerTemplate('Unassigned Households: '));

            $.each(_.slice(shuffled,0,50), function(key, household) {
                $(css.ticker.container).append(data.tickerTemplate(household.label));
            });
        }
    };

    $(document).on('click touch', '.assignHousehold', function() {
    	functions.workOnHousehold($(this).closest(css.household.container));
    	$([document.documentElement, document.body]).animate({
	        scrollTop: $(css.activeHousehold.container).offset().top
	    }, 1000);
    });

    $(document).on('click touch', '.removeVisiting', function() {
    	functions.removeActiveVisiting();
    });

    $(document).on('click touch', '.removeAssigned', function() {
    	functions.removeAssignedMinTo($(this).closest('.minToHouse'));
    });

    $(document).on('click touch', '#activeClose', function() {
    	$(css.activeHousehold.container).addClass('d-none');
    });

	$(document).on('click touch', '#commentSubmit', function(e) {
		e.preventDefault();
		functions.createComment();
    });   

    $(document).on('click touch', '#commentNavCreate', function() {
    	commentsHelper.functions.setCommentError(
            $(css.activeHousehold.comments.formError),
            ''
        );
    });

    $(document).on('click touch', '#tickerClose', function() {
        $(css.ticker.mainContainer).remove();
    });

    return {
        data : functions.getAllData,
        functions: functions
    }
}();
