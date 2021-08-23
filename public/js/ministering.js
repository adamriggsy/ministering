var ministeringHelper = function () {
    'use strict';

    var data = {
    	'households' : null,
    	'unassignedHouseholds': false,
    	'activeHousehold': null,
    	'ac': false
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
    }

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
    	},
    	'setAutocomplete' : function() {
			$("#assignHouseholdContainer").html('').append('<input type="text" class="form-control" id="assignHousehold" placeholder="Start typing..." autocomplete="off">');
			functions.setDataAttr('ac', false);


			const field = document.getElementById('assignHousehold');
		    let ac = new Autocomplete(field, {
		        data: ministeringHelper.functions.getDataAttr('unassignedHouseholds'),
		        maximumItems: 10,
		        treshold: 1,
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
                    console.log(response);
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
                "columnDefs": [
                    {
                        "targets": 3,
                        "orderable": false
                    },
                    {
                        "targets": 4,
                        "orderable": false
                    },
                    {
                        "targets": 5,
                        "orderable": false
                    },
                    {
                        "targets": 6,
                        "orderable": false
                    },
                ]
            });
    	}
    }

    $(document).on('click touch', '.assignHousehold', function() {
    	functions.workOnHousehold($(this).closest(css.household.container));
    });

    $(document).on('click touch', '.removeVisiting', function() {
    	functions.removeActiveVisiting();
    });

    $(document).on('click touch', '.removeAssigned', function() {
    	functions.removeAssignedMinTo($(this).closest('.minToHouse'));
    });

    return {
        data : functions.getAllData,
        functions: functions
    }
}();
