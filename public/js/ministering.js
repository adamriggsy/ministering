/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/js/_comments.js":
/*!***********************************!*\
  !*** ./resources/js/_comments.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "commentsHelper": () => (/* binding */ commentsHelper)
/* harmony export */ });
var commentsHelper = function () {
  'use strict';

  var data = {
    'commentTemplate': null,
    'commentCardTemplate': null
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
    'init': function init(createUrl) {
      $.ajaxSetup({
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
      });
    },
    'setDataAttr': function setDataAttr(attr, val) {
      data[attr] = val;
    },
    'getDataAttr': function getDataAttr(attr) {
      return data[attr];
    },
    'getAllData': function getAllData() {
      return data;
    },
    'createComment': function createComment(params) {
      $.ajax({
        url: params.url,
        type: 'post',
        data: params.data,
        success: function success(response) {
          params.successCallback(response);
        }
      });
    },
    'buildComments': function buildComments(template, container, comments, emptyMessage) {
      if (typeof emptyMessage === 'undefined') {
        emptyMessage = 'No comments yet.';
      }

      container.html('');

      if (comments.length === 0) {
        container.html('<p>' + emptyMessage + '</p>');
      } else {
        $.each(comments, function (index, comment) {
          var author = comment.author;

          if (typeof author === 'undefined') {
            author = comment.authorInfo;
          } // let authorInfo = author.name + ' - ' + _moment(comment.updated_at).format('YYYY-MM-DD LT');


          var newComment = template(comment.id, comment.body, author.name, _moment(comment.updated_at).format('YYYY-MM-DD LT'));
          container.prepend(newComment);
        });
      }
    },
    'setCommentError': function setCommentError(container, error) {
      container.html(error);
    },
    'resetCommentForm': function resetCommentForm(form) {
      form.reset();
    },
    'showCommentsAjaxLoader': function showCommentsAjaxLoader(container) {
      container.find('.ajax-loader').removeClass('d-none');
    },
    'hideCommentsAjaxLoader': function hideCommentsAjaxLoader(container) {
      container.find('.ajax-loader').addClass('d-none');
    }
  };
  return {
    data: functions.getAllData,
    functions: functions
  };
}();

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************************!*\
  !*** ./resources/js/ministering.js ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _comments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_comments.js */ "./resources/js/_comments.js");


window.ministeringHelper = function () {
  'use strict';

  var data = {
    'households': null,
    'unassignedHouseholds': false,
    'activeHousehold': null,
    'ac': false
  };
  var css = {
    'activeHousehold': {
      'container': '#activeHousehold',
      'household': {
        'container': '#householdContainer',
        'name': '.householdName',
        'husband': '.husbandName',
        'wife': '.wifeName',
        'minTo': '#assignedToVisitContainer',
        'assignedReceive': '#visitingHousehold'
      },
      'ministering': {
        'container': '#ministeringInfo',
        'assigned': {
          'container': '#assignedToVisitContainer'
        },
        'visiting': {
          'container': '#visitingHousehold'
        }
      },
      'comments': {
        'container': '#householdComments',
        'allComments': '#commentsContainer',
        'view': '#view',
        'form': '#newComment',
        'formError': '#commentError',
        'nav': {
          'view': '#commentNavView',
          'create': '#commentNavCreate'
        }
      }
    },
    'household': {
      'container': '.household',
      'last_name': '.hh_lastName',
      'husband': '.hh_husbandName',
      'wife': '.hh_wifeName',
      'minSis': '.hh_ministeringSis',
      'minBro': '.hh_ministeringBro',
      'minTo': '.hh_ministeringTo'
    }
  };

  var commentTemplate = function commentTemplate(id, body, authorName, commentDate) {
    return "\n            <div class='houseComment' data-commentid=\"".concat(id, "\">\n                <author>").concat(authorName, " - ").concat(commentDate, "</author>\n                <p class=\"commentBody\">").concat(body, "</p>\n            </div>\n        ");
  };

  var functions = {
    'init': function init(households) {
      $.ajaxSetup({
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
      });
      functions.setDataAttr('households', households);
      _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.init();
      _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.setDataAttr('commentTemplate', commentTemplate);
    },
    'setDataAttr': function setDataAttr(attr, val) {
      data[attr] = val;
    },
    'getDataAttr': function getDataAttr(attr) {
      return data[attr];
    },
    'getAllData': function getAllData() {
      return data;
    },
    //  	'workOnHousehold' : function(householdEl) {
    //  		let householdData = functions.getHouseholdById(householdEl.data('householdid'));
    //  		functions.setDataAttr('activeHousehold', householdData);
    //  		let ah = css.activeHousehold;
    //  		let $ah = $(ah.container);
    //  		$ah.attr('data-activeid', householdData.id);
    //  		$(ah.household.name, $ah).html(householdData.last_name);
    //  		$(ah.household.husband, $ah).html(householdData.husbandName);
    //  		$(ah.household.wife, $ah).html(householdData.wifeName);
    //  		$(ah.household.minTo, $ah).html('');
    //  		$.each(householdData.ministerTo, function(key, val) {
    //  			$(ah.household.minTo, $ah).append(
    //  				'<p class="minToHouse" data-householdid="' + key + '">' 
    //  				+ val 
    //  				+ '<i class="removeAssigned bi-x-circle small text-danger"></i>'
    //  				+ '</p>'
    // 	);
    //  		});
    //  		$(ah.household.assignedReceive).children().remove();
    //  		if(householdData.ministeringBrother !== '') {
    //  			$(ah.household.assignedReceive).append('<p>' + householdData.ministeringBrother + '</p>');
    //  		}
    //  		if(householdData.ministeringSister !== '') {
    //  			$(ah.household.assignedReceive).append('<p>' + householdData.ministeringSister + '</p>');
    //  		}
    //  		$(css.activeHousehold.container).removeClass('d-none');
    //  		functions.getHouseholdComments();
    //  	},
    //  	'setAutocomplete' : function() {
    // $("#assignHouseholdContainer").html('').append('<input type="text" class="form-control" id="assignHousehold" placeholder="Start typing..." autocomplete="off">');
    // functions.setDataAttr('ac', false);
    // const field = document.getElementById('assignHousehold');
    //    let ac = new Autocomplete(field, {
    //        data: ministeringHelper.functions.getDataAttr('unassignedHouseholds'),
    //        maximumItems: 10,
    //        treshold: 1,
    //        highlightTyped: false,
    //        onSelectItem: ({label, value}) => {
    //            functions.assignHousehold(value);
    //        }
    //    });
    //    functions.setDataAttr('ac', ac);
    // // $("#assignHousehold").val('');
    //  	},
    'getHouseholdById': function getHouseholdById(id) {
      var filteredHouseholds = data.households.filter(function (household) {
        return household.id === id;
      });
      return filteredHouseholds[0];
    },
    //  	'getUnassignedHouseholds' : function() {
    //  		$.getJSON('/api/households/unassigned', function( response ) {
    // 	functions.setDataAttr('unassignedHouseholds', response);
    // 	functions.setDataAttr('ac', false);
    // 	functions.setAutocomplete();
    // });
    //  	},
    //  	'assignHousehold' : function(assignedId) {
    //  		let activeHousehold = functions.getDataAttr('activeHousehold');
    //  		$.ajax({
    //              url: '/api/assign',
    //              type: 'post',
    //              data: {
    //              	householdId: activeHousehold.id,
    //                  assignedId: assignedId
    //              },
    //              success: function(response) {
    //                  functions.updateHouseholds(response.household);
    //                  functions.updateHouseholds(response.assignedHousehold);
    //                  $(css.activeHousehold.household.minTo).append(
    // 			'<p class="minToHouse" data-householdid="' + response.assignedHousehold.id + '">' 
    //   				+ response.assignedHousehold.householdName 
    //   				+ '<i class="removeAssigned bi-x-circle small text-danger"></i>'
    //   				+ '</p>'
    //              	);
    //                  $("#assignHousehold").val('');
    //                  functions.getUnassignedHouseholds();
    //                  functions.resetDataTable();
    //              }
    //          });
    //  	},
    //  	'updateHouseholds' : function(household) {
    //  		functions.replaceHouseholdData(household);
    //  		let row = $(".household[data-householdid='" + household.id + "']");
    //  		$(css.household.minSis, row).html(household.ministeringSister);
    //  		$(css.household.minBro, row).html(household.ministeringBrother);
    //  		$(css.household.minTo, row).html('');
    //  		$.each(household.ministerTo, function(key, val) {
    //  			$(css.household.minTo, row).append('<p>' + val + '</p>');
    //  		});
    //  	},
    //  	'replaceHouseholdData' : function(hData) {
    //  		let householdKey = _.findIndex(data.households, function(household) {
    //              return (household.id === hData.id);
    //          });
    //          data.households[householdKey] = hData;
    //  	}, 
    //  	'removeActiveVisiting' : function() {
    //  		let activeHousehold = functions.getDataAttr('activeHousehold');
    //  		if($(css.activeHousehold.household.assignedReceive).children().length > 0) {
    //   		$.ajax({
    //               url: '/api/remove-visiting',
    //               type: 'post',
    //               data: {
    //               	householdId: activeHousehold.id
    //               },
    //               success: function(response) {
    //                   functions.updateHouseholds(response.household);
    //                   functions.updateHouseholds(response.otherHousehold);
    //                   $(css.activeHousehold.household.assignedReceive).html('');
    //                   $("#assignHousehold").val('');
    //                   functions.getUnassignedHouseholds();
    //                   functions.resetDataTable();
    //               }
    //           });
    //   	}
    //  	},
    //  	'removeAssignedMinTo' : function(clickedEl) {
    //  		let assignedId = clickedEl.data('householdid');
    //  		let activeHousehold = functions.getDataAttr('activeHousehold');
    //  		$.ajax({
    //              url: '/api/remove-assigned',
    //              type: 'post',
    //              data: {
    //              	householdId: activeHousehold.id,
    //              	assignedId: assignedId
    //              },
    //              success: function(response) {
    //                  functions.updateHouseholds(response.household);
    //                  functions.updateHouseholds(response.otherHousehold);
    //                  $(css.activeHousehold.household.minTo + " .minToHouse[data-householdid='" + assignedId + "']").remove();
    //                  $("#assignHousehold").val('');
    //                  functions.getUnassignedHouseholds();
    //                  functions.resetDataTable();
    //              }
    //          });
    //  	},
    'resetDataTable': function resetDataTable() {
      if ($.fn.dataTable.isDataTable('#allHouseholdsTable')) {
        $('#allHouseholdsTable').DataTable().destroy();
      }

      $("#allHouseholdsTable").DataTable({
        paging: false,
        "order": [],
        // "autoWidth": false,
        "columns": [{
          "targets": 0,
          "orderable": false,
          "width": '1%'
        }, {
          "targets": 1,
          "width": '5%'
        }, {
          "targets": 2,
          "width": '5%'
        }, {
          "targets": 3,
          "width": '5%'
        }, {
          "targets": 4,
          "width": '14%'
        }, {
          "targets": 5,
          "width": '14%'
        }, {
          "targets": 6,
          "width": '5%'
        }]
      });
    },
    'getHouseholdComments': function getHouseholdComments() {
      _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.showCommentsAjaxLoader($(css.activeHousehold.comments.view));
      $.getJSON('/api/household/' + data.activeHousehold.id + '/comments', function (comments) {
        _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.buildComments(_comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.getDataAttr('commentTemplate'), $(css.activeHousehold.comments.allComments), comments);
        _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.hideCommentsAjaxLoader($(css.activeHousehold.comments.view));
      });
    },
    'createComment': function createComment() {
      var form = $(css.activeHousehold.comments.form);
      var activeHousehold = functions.getDataAttr('activeHousehold');
      var params = {
        'url': '/api/household/' + activeHousehold.id + '/comments/create',
        'data': {
          form: JSON.stringify(form.serializeArray().reduce(function (m, o) {
            m[o.name] = o.value;
            return m;
          }, {}))
        },
        'successCallback': functions.commentCreateSuccess
      };
      _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.createComment(params);
    },
    'commentCreateSuccess': function commentCreateSuccess(response) {
      if (response.saved) {
        $(css.activeHousehold.comments.nav.view).find('.nav-link').click();
        _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.showCommentsAjaxLoader($(css.activeHousehold.comments.view));
        _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.buildComments(_comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.getDataAttr('commentTemplate'), $(css.activeHousehold.comments.allComments), response.comments, 'No comments yet.');
        _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.hideCommentsAjaxLoader($(css.activeHousehold.comments.view));
        _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.resetCommentForm($(css.activeHousehold.comments.form)[0]);
      } else {
        _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.setCommentError($(css.activeHousehold.comments.formError), 'Could not save your comment. Refresh the page and try again.');
      }
    }
  }; // $(document).on('click touch', '.assignHousehold', function() {
  // 	functions.workOnHousehold($(this).closest(css.household.container));
  // 	$([document.documentElement, document.body]).animate({
  //      scrollTop: $(css.activeHousehold.container).offset().top
  //  }, 1000);
  // });
  // $(document).on('click touch', '.removeVisiting', function() {
  // 	functions.removeActiveVisiting();
  // });
  // $(document).on('click touch', '.removeAssigned', function() {
  // 	functions.removeAssignedMinTo($(this).closest('.minToHouse'));
  // });
  // $(document).on('click touch', '#activeClose', function() {
  // 	$(css.activeHousehold.container).addClass('d-none');
  // });

  $(document).on('click touch', '#commentSubmit', function (e) {
    e.preventDefault();
    functions.createComment();
  });
  $(document).on('click touch', '#commentNavCreate', function () {
    _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.setCommentError($(css.activeHousehold.comments.formError), '');
  });
  $(document).on('show.bs.modal', '#assignmentFeedbackModal', function (e) {
    var btn = $(e.relatedTarget);
    var parent = btn.closest('.household');
    var modal = $(this);
    var householdData = functions.getHouseholdById(parent.data('householdid'));
    var assignmentComments = [];
    modal.removeClass('approved rejected proposed').addClass(householdData.ministeredByStatus);

    _.each(householdData.ministered_by.comments, function (comment) {
      assignmentComments.push(comment);
    });

    $("#assignStatus", modal).html(_.upperFirst(householdData.ministeredByStatus));
    $(".householdName", modal).html(householdData.fullHouseholdName);
    $(".assignedNames", modal).html(householdData.ministeringComp1 + ' & ' + householdData.ministeringComp2);
    _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.buildComments(_comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.getDataAttr('commentTemplate'), $("#aFeedbackContainer", modal), assignmentComments);
  });
  return {
    data: functions.getAllData,
    functions: functions
  };
}();
})();

/******/ })()
;