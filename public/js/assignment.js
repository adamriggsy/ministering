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
/*!************************************!*\
  !*** ./resources/js/assignment.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _comments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_comments.js */ "./resources/js/_comments.js");


window.assignmentHelper = function () {
  'use strict';

  var data = {
    'companionships': null,
    'unassignedHouseholds': false,
    'activeCompanionship': null,
    'ac': false,
    'tickerTemplate': null
  };
  var css = {
    'activeCompanionship': {
      'container': '#activeCompanionship',
      'companionship': {
        'container': '#companionshipContainer',
        'comp1': '.companionship1',
        'comp2': '.companionship2',
        'minTo': '#assignedToVisitContainer'
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
        'container': '#companionshipComments',
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
    'ticker': {
      'mainContainer': '#unassignedTicker',
      'container': '#unassignedTicker .ticker'
    }
  };

  var commentTemplate = function commentTemplate(id, body, authorName, commentDate) {
    return "\n            <div class='houseComment' data-commentid=\"".concat(id, "\">\n                <author>").concat(authorName, " - ").concat(commentDate, "</author>\n                <p class=\"commentBody\">").concat(body, "</p>\n            </div>\n        ");
  };

  var tickerTemplate = function tickerTemplate(content) {
    return "\n            <div class=\"ticker__item\">".concat(content, "</div>\n        ");
  };

  var functions = {
    'init': function init(companionships) {
      $.ajaxSetup({
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
      });
      functions.setDataAttr('companionships', companionships);
      functions.setDataAttr('tickerTemplate', tickerTemplate);
      functions.getUnassignedHouseholds();
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
    'workOnCompanionship': function workOnCompanionship(companionshipEl) {
      var companionshipData = functions.getCompanionshipById(companionshipEl.data('companionshipid'));
      functions.setDataAttr('activeCompanionship', companionshipData);
      var ac = css.activeCompanionship;
      var $ac = $(ac.container);
      $ac.attr('data-activeid', companionshipData.id);
      $ac.attr('data-companionshipid', companionshipData.id);
      $(ac.companionship.comp1, $ac).html(companionshipData.firstCompanion.fullName);
      $(ac.companionship.comp2, $ac).html(companionshipData.secondCompanion.fullName);
      $(ac.companionship.minTo).html(companionshipEl.find('.assignments').html());
    },
    'setAutocomplete': function setAutocomplete() {
      $("#assignHouseholdContainer").html('').append('<input type="text" class="form-control" id="assignHousehold" placeholder="Start typing..." autocomplete="off">');
      functions.setDataAttr('ac', false);
      var field = document.getElementById('assignHousehold');
      var ac = new Autocomplete(field, {
        data: assignmentHelper.functions.getDataAttr('unassignedHouseholds'),
        maximumItems: 10,
        treshold: 1,
        highlightTyped: false,
        onSelectItem: function onSelectItem(_ref) {
          var label = _ref.label,
              value = _ref.value;
          functions.assignHousehold(value);
        }
      });
      functions.setDataAttr('ac', ac);
    },
    'getCompanionshipById': function getCompanionshipById(id) {
      var filteredCompanionships = data.companionships.filter(function (companionship) {
        return companionship.id === id;
      });
      return filteredCompanionships[0];
    },
    'getUnassignedHouseholds': function getUnassignedHouseholds() {
      $.getJSON('/api/households/unassigned', function (response) {
        functions.setDataAttr('unassignedHouseholds', response);
        functions.setDataAttr('ac', false);
        functions.setAutocomplete();
        functions.updateTicker();
      });
    },
    'assignHousehold': function assignHousehold(assignedId) {
      var activeCompanionship = functions.getDataAttr('activeCompanionship');
      $.ajax({
        url: '/api/assign',
        type: 'post',
        data: {
          companionshipId: activeCompanionship.id,
          assignedId: assignedId
        },
        success: function success(response) {
          if (response.success) {
            var householdHtml = '<p class="household" data-householdid="' + response.assignedHousehold.id + '">' + '<i class="status-circle bi bi-dash-circle-fill text-black-50"></i>' + response.assignedHousehold.householdName + '<i class="removeAssigned bi-x-circle small text-danger"></i>' + '</p>';
            $(css.activeCompanionship.companionship.minTo).append(householdHtml);
            $(".companionship[data-companionshipid='" + activeCompanionship.id + "'] .assignments").append(householdHtml);
            $("#assignHousehold").val('');
            functions.getUnassignedHouseholds();
          }
        }
      });
    },
    'removeAssignedMinTo': function removeAssignedMinTo(clickedEl) {
      var assignedId = clickedEl.data('householdid');
      var activeCompanionship = functions.getDataAttr('activeCompanionship');
      var companionshipId = clickedEl.closest('.companionship').data('companionshipid');
      $.ajax({
        url: '/api/remove-assigned',
        type: 'post',
        data: {
          householdId: assignedId,
          companionshipId: companionshipId
        },
        success: function success(response) {
          if (response.success) {
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
    'updateTicker': function updateTicker() {
      var unassignedHouseholds = _.clone(functions.getDataAttr('unassignedHouseholds'));

      var shuffled = _.shuffle(_.shuffle(unassignedHouseholds));

      $(css.ticker.container).html('');
      $(css.ticker.container).append(data.tickerTemplate('Unassigned Households: '));
      $.each(_.slice(shuffled, 0, 50), function (key, household) {
        $(css.ticker.container).append(data.tickerTemplate(household.label));
      });
    }
  };
  $(document).on('show.bs.modal', '#assignmentManagementModal', function (e) {
    var btn = $(e.relatedTarget);
    var parent = btn.closest('.companionship');
    functions.workOnCompanionship(parent);
  });
  $(document).on('show.bs.modal', '#assignmentFeedbackModal', function (e) {
    var btn = $(e.relatedTarget);
    var parent = btn.closest('.household');
    var modal = $(this);
    var householdData = functions.getCompanionshipById(parent.data('householdid'));
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
  $(document).on('click touch', '.removeAssigned', function () {
    functions.removeAssignedMinTo($(this).closest('.household'));
  }); //   $(document).on('click touch', '#commentSubmit', function(e) {
  // e.preventDefault();
  // functions.createComment();
  //   });   
  //   $(document).on('click touch', '#commentNavCreate', function() {
  //   	commentsHelper.functions.setCommentError(
  //           $(css.activeHousehold.comments.formError),
  //           ''
  //       );
  //   });

  $(document).on('click touch', '#tickerClose', function () {
    $(css.ticker.mainContainer).remove();
  });
  return {
    data: functions.getAllData,
    functions: functions
  };
}();
})();

/******/ })()
;