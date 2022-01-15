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
/*!**********************************!*\
  !*** ./resources/js/approval.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _comments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_comments.js */ "./resources/js/_comments.js");


window.approvalHelper = function () {
  'use strict';

  var data = {
    'currentAssignmentId': null
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

  var commentTemplate = function commentTemplate(id, body, author) {
    return "\n            <div class='ministeringComment' data-commentid=\"".concat(id, "\">\n                <author>").concat(author, "</author>\n                <p class=\"commentBody\">").concat(body, "</p>\n            </div>\n        ");
  };

  var functions = {
    'init': function init(households) {
      $.ajaxSetup({
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
      });
      $('.household').each(function () {
        functions.handleBtnGroup($(this));
      });
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
    'getActiveContainerById': function getActiveContainerById(assignmentId) {
      return $('[data-assignmentid="' + assignmentId + '"] ' + css.household.comments);
    },
    'createComment': function createComment() {
      var form = $(css.comments.form);
      var assignmentId = form.find('#assignmentId').val();
      functions.setDataAttr('currentAssignmentId', assignmentId);
      var params = {
        'url': '/api/assignment/' + assignmentId + '/comments/create',
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
        _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.resetCommentForm($(css.comments.form)[0]);
        _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.buildComments(_comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.getDataAttr('commentTemplate'), functions.getActiveContainerById(functions.getDataAttr('currentAssignmentId')), response.comments, 'No feedback provided.');
        $(css.modals.comment).modal('hide');
      } else {
        _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.setCommentError($(css.comments.formError), 'Could not save your comment. Refresh the page and try again.');
      }
    },
    'updateStatus': function updateStatus(btn, status) {
      var container = btn.closest(css.household.container);
      var assignmentId = container.data('assignmentid'); // let householdId = container.data('householdid');

      $.ajax({
        url: '/api/assignment/' + assignmentId + '/' + status,
        type: 'post',
        data: {},
        success: function success(response) {
          if (response.saved) {
            $(css.household.status, container).html(response.status);
            $(container).removeClass().addClass('household ' + response.status);
            functions.handleBtnGroup(container);
          } else {
            functions.setStatusError('Could not update the status. Refresh the page and try again.');
          }
        }
      });
    },
    'setStatusError': function setStatusError(error) {
      $(css.household.error).html(error);
    },
    'handleBtnGroup': function handleBtnGroup(container) {
      $('.btn-group', container).find('button').removeClass('fake-last').removeClass('fake-first');
      $('.btn-group', container).find('button').not(':hidden').last().addClass('fake-last');
      $('.btn-group', container).find('button').not(':hidden').first().addClass('fake-first');
    },
    'changeViewType': function changeViewType(viewType) {
      switch (viewType) {
        case 'grid':
          $(css.mainContainer).removeClass(css.viewTypes.list).addClass(css.viewTypes.grid);
          break;

        case 'list':
        default:
          $(css.mainContainer).addClass(css.viewTypes.list).removeClass(css.viewTypes.grid);
          break;
      }
    },
    'filterAssignments': function filterAssignments(status) {
      $("#assignmentContainer .household").addClass('d-none');
      $("#assignmentContainer .household." + status).removeClass('d-none');

      if (status === 'all' || status === '') {
        $("#assignmentContainer .household").removeClass('d-none');
      }
    }
  };
  $(document).on('click touch', '#submitComment', function (e) {
    e.preventDefault();
    functions.createComment();
  });
  $(document).on('click touch', '.acceptAssignment', function (e) {
    functions.updateStatus($(this), 'accept');
  });
  $(document).on('click touch', '.rejectAssignment', function (e) {
    functions.updateStatus($(this), 'reject');
  });
  $(document).on('click touch', '.resetStatus', function (e) {
    functions.updateStatus($(this), 'propose');
  });
  $(document).on('click touch', '#viewChoice li', function () {
    functions.changeViewType($(this).data('viewtype'));
  });
  $(document).on('click touch', '#filterChoice li', function () {
    functions.filterAssignments($(this).data('status'));
  });
  return {
    data: functions.getAllData,
    functions: functions
  };
}();
})();

/******/ })()
;