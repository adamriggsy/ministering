import {commentsHelper} from './_comments.js';

window.companionshipHelper = function () {
    'use strict';

    let data = {
    	'companionships' : null,
    	'unassignedIndividuals': false,
    	'activeCompanionship': null,
    	'ac': false,
      'newCompanionship': {
        'firstCompanion': null,
        'secondCompanion': null
      }
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

    let functions = {
    	'init' : function(companionships) {
    		$.ajaxSetup({
			    headers: {
			        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			    }
  			});

    		
        functions.setDataAttr('companionships', companionships);
        functions.getUnassignedIndividuals();
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
      'getUnassignedIndividuals' : function() {
        $.getJSON('/api/individuals/unassigned', function( response ) {
          functions.setDataAttr('unassignedIndividuals', response);
          functions.setDataAttr('ac', false);
          functions.setAutocomplete();
        });
      },
    	'setAutocomplete' : function() {
        let acInput = document.createElement('input');
        acInput.type = 'text';
        acInput.classList.add('form-control');
        acInput.placeholder = 'Start typing...';
        acInput.autocomplete = 'off';

        let acInput2 = acInput.cloneNode(true);

        acInput.id = 'addFirstCompanion';
        acInput2.id = 'addSecondCompanion';
        $("#addCompanionshipInfo #addCompanionship1").html('').append(acInput); 
        $("#addCompanionshipInfo #addCompanionship2").html('').append(acInput2); 

        functions.setDataAttr('ac', false);
        
        let acOptions = {
            data: functions.getDataAttr('unassignedIndividuals'),
            maximumItems: 10,
            treshold: 1,
            highlightTyped: false
        };

        let acOptions1 = {
          ...acOptions,
          ...{
            onSelectItem: ({label, value}) => {
                functions.addCompanion('first', value);
            }
          }
        }

        let acOptions2 = {
          ...acOptions,
          ...{
            onSelectItem: ({label, value}) => {
                functions.addCompanion('second', value);
            }
          }
        }

        const field = document.getElementById('addFirstCompanion');
		    let ac = new Autocomplete(field, acOptions1);

        const field2 = document.getElementById('addSecondCompanion');
        let ac2 = new Autocomplete(field2, acOptions2);

		    functions.setDataAttr('ac', ac);
    	},
      'addCompanion': function(whichComp, id) {
        if(whichComp === 'first') {
          data.newCompanionship.firstCompanion = id;
        } else {
          data.newCompanionship.secondCompanion = id;
        }

        functions.handleFinalizeBtn();
      },
      'handleFinalizeBtn': function() {
        let finalizeBtn = $("#finalizeNewCompanionship");
        if(functions.canSubmitNewCompanionship()) {
          finalizeBtn.removeClass('disabled');
        } else {
          finalizeBtn.addClass('disabled');
        }
      },
      'finalizeNewCompanionship' : function() {
        $("#addCompanionshipError, #addCompanionshipSuccess").addClass('d-none');

        if(functions.canSubmitNewCompanionship()) {
          $.ajax({
              url: '/api/createNewCompanionship',
              type: 'post',
              data: {
                companionship: data.newCompanionship
              },
              success: function(response) {
                  if(response.success) {
                      let companionshipClone = $("#allCompanionshipsTable .companionship").first().clone();
                      companionshipClone.data('companionshipid', response.companionship.id);
                      $('.comp_1', companionshipClone).text(response.companionship.firstCompanion.fullName);
                      $('.comp_2', companionshipClone).text(response.companionship.secondCompanion.fullName);
                      
                      $('#allCompanionshipsTable').append(companionshipClone);
                      $("#addCompanionshipSuccess").removeClass('d-none');
                      
                      $("#addFirstCompanion, #addSecondCompanion").val('');
                      functions.addCompanion('first', null);
                      functions.addCompanion('second', null);
                  } else {
                    $("#addCompanionshipError").text(response.error).removeClass('d-none');
                  }
              }
          });
        }
      },
      'canSubmitNewCompanionship' : function() {
        return data.newCompanionship.firstCompanion !== null && data.newCompanionship.secondCompanion !== null;
      },
    	'getCompanionshipById' : function(id) {
    		let filteredCompanionships = data.companionships.filter(function(companionship) {
                return (companionship.id === id);
            });
            return filteredCompanionships[0];
    	},
      'deleteUser' : function() {
        let activeCompanionship = functions.getDataAttr('activeCompanionship');
        $.ajax({
            url: '/api/companionship/' + activeCompanionship.id + '/delete',
            type: 'post',
            success: function(response) {
                if(response.success) {
                    $(".companionship[data-companionshipid='" + activeCompanionship.id + "']").remove();
                    $("#companionshipManagementModal .modal-body").append('<p class="alert alert-success">Companionship was removed successfully.</p>');
                } else {
                    $("#companionshipManagementModal .modal-body").append('<p class="alert alert-danger">Could not remove companionship. Please try again later.</p>');
                }
            }
        });
      }
    };

    $(document).on('click', '#deleteCompanionship', function(e) {
        e.preventDefault();
        functions.deleteUser();
    });

    $(document).on('change', '#addFirstCompanion', function(e) {
        if($(this).val() === '') {
          functions.addCompanion('first', null);
        }
    });

    $(document).on('change', '#addSecondCompanion', function(e) {
        if($(this).val() === '') {
          functions.addCompanion('second', null);
        }
    });

    $(document).on('click', '#finalizeNewCompanionship', function(e) {
        e.preventDefault();
        functions.finalizeNewCompanionship();
    });

    $(document).on('show.bs.modal', '#companionshipManagementModal', function(e) {
        let btn = $(e.relatedTarget);
        let parent = btn.closest('.companionship');
        functions.workOnCompanionship(parent);
    });

    $(document).on('show.bs.modal', '#companionshipFeedbackModal', function(e) {
        let btn = $(e.relatedTarget);
        let parent = btn.closest('.companionship');
        let modal = $(this);
        let householdData = functions.getCompanionshipById(parent.data('householdid'));
        let companionshipComments = [];

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

    return {
        data : functions.getAllData,
        functions: functions
    }
}();
