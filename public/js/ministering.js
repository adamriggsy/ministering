var ministeringHelper = function () {
    'use strict';

    var data = {
    	'households' : null,
    	'unassignedHouseholds': false,
    	'activeHousehold': null,
    	'ac': false,
    	'commentTemplate': null
    };

    var css = {
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
    	}
    };

    var functions = {
    	'init' : function(households) {
    		$.ajaxSetup({
			    headers: {
			        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			    }
			});

    		functions.setDataAttr('households', households);
    		functions.getUnassignedHouseholds();
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
    		var filteredHouseholds = data.households.filter(function(household) {
                return (household.id === id);
            });
            return filteredHouseholds[0];
    	},
    	'getUnassignedHouseholds' : function() {
    		$.getJSON('/api/households/unassigned', function( response ) {
				functions.setDataAttr('unassignedHouseholds', response);
				functions.setDataAttr('ac', false);
				functions.setAutocomplete();
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
    		var householdKey = data.households.findIndex(function(household) {
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
    		$.getJSON('/api/household/' + data.activeHousehold.id + '/comments', function( comments ) {
				
				functions.buildComments(comments);
				functions.hideCommentsAjaxLoader();
			});
    	},
    	'createComment' : function() {
    		const form = $(css.activeHousehold.comments.form);

    		let activeHousehold = functions.getDataAttr('activeHousehold');


    		$.ajax({
                url: '/api/household/' + activeHousehold.id + '/comments/create',
                type: 'post',
                data: {
                	form: JSON.stringify(form.serializeArray().reduce(function(m,o){  m[o.name] = o.value; return m;}, {}))
                },
                success: function(response) {
                    if(response.saved) {
                    	$(css.activeHousehold.comments.nav.view).find('.nav-link').click();
                    	functions.buildComments(response.comments);
                    	functions.resetCommentForm();
                    } else {
                    	functions.setCommentError('Could not save your comment. Refresh the page and try again.');
                    }
                }
            });
    	},
    	'buildComments' : function(comments) {
    		$(css.activeHousehold.comments.allComments).html('');
    		functions.showCommentsAjaxLoader();

    		$.each(comments, function(index, comment) {
				let authorInfo = comment.author.name + ' - ' + _moment(comment.updated_at).format('YYYY-MM-DD LT');
				let newComment = data.commentTemplate(comment.id, comment.body, authorInfo);
				$(css.activeHousehold.comments.allComments).append(newComment);
			});

			functions.hideCommentsAjaxLoader();
    	},
    	'setCommentError' : function(error) {
    		$(css.activeHousehold.comments.formError).html(error);
    	},
    	'resetCommentForm' : function() {
    		$(css.activeHousehold.comments.form)[0].reset();
    	},
    	'showCommentsAjaxLoader' : function() {
    		$(css.activeHousehold.comments.view).find('.ajax-loader').removeClass('d-none');
    	},
    	'hideCommentsAjaxLoader' : function() {
    		$(css.activeHousehold.comments.view).find('.ajax-loader').addClass('d-none');
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
    	functions.setCommentError('');
    });

    return {
        data : functions.getAllData,
        functions: functions
    }
}();
