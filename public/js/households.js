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
    'commentTemplate': null
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
    'buildComments': function buildComments(container, comments, emptyMessage) {
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
          }

          var authorInfo = author.name + ' - ' + _moment(comment.updated_at).format('YYYY-MM-DD LT');

          var newComment = data.commentTemplate(comment.id, comment.body, authorInfo);
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
  !*** ./resources/js/households.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _comments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_comments.js */ "./resources/js/_comments.js");


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
      'formError': '#commentError',
      'commentCount': '.count',
      'buttons': '.commentBtns'
    },
    'household': {
      'container': '.household',
      'comments': '.allComments'
    }
  };

  var commentTemplate = function commentTemplate(id, body, author) {
    return "\n            <div class='householdComment' data-commentid=\"".concat(id, "\">\n                <author>").concat(author, "</author>\n                <p class=\"commentBody\">").concat(body, "</p>\n            </div>\n        ");
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
    'getActiveContainerById': function getActiveContainerById(householdId) {
      return $('[data-householdid="' + householdId + '"] ');
    },
    'createComment': function createComment() {
      var form = $(css.comments.form);
      var householdId = form.find('#householdId').val();
      functions.setDataAttr('currentHouseholdId', householdId);
      var params = {
        'url': '/api/household/' + householdId + '/comments/create',
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
        var activeContainer = functions.getActiveContainerById(functions.getDataAttr('currentHouseholdId'));
        _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.buildComments(activeContainer.find(css.household.comments), response.comments, 'No comments yet.');
        console.log(activeContainer);
        console.log(activeContainer.find(css.comments.commentCount));
        console.log(response.comments.length);
        var numComments = response.comments.length;
        var maxShown = parseInt($(css.mainContainer).data('maxcommentsshown'));
        activeContainer.find(css.comments.commentCount).text(numComments);

        if (numComments > maxShown) {
          activeContainer.addClass('showAllCommentsBtn');
        }

        functions.handleBtnGroup(activeContainer.find(css.comments.buttons));
        $(css.modals.comment).modal('hide');
      } else {
        _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.setCommentError($(css.comments.formError), 'Could not save your comment. Refresh the page and try again.');
      }
    },
    'populateHouseholdModal': function populateHouseholdModal(referrerBtn) {
      var householdId = referrerBtn.closest('.household').data('householdid');
      var houseData = functions.getHouseholdById(householdId);
      var modal = $(css.modals.household.container);
      functions.setDataAttr('currentHouseholdId');
      modal.find('.householdName').text(houseData.fullHouseholdName);
      _comments_js__WEBPACK_IMPORTED_MODULE_0__.commentsHelper.functions.buildComments($(css.modals.household.comments, modal), houseData.comments, 'No comments yet.');
    },
    'getHouseholdById': function getHouseholdById(id) {
      var filteredHouseholds = data.households.filter(function (household) {
        return household.id === id;
      });
      return filteredHouseholds[0];
    },
    'handleBtnGroup': function handleBtnGroup(container) {
      var countVisible = $('.btn-group', container).find('button').not(':hidden').length;

      if (countVisible === 1) {
        container.removeClass('btn-group').addClass('full-width');
      } else {
        container.addClass('btn-group').removeClass('full-width');
      }
    }
  };
  $(document).on('click touch', '#submitComment', function (e) {
    e.preventDefault();
    functions.createComment();
  });
  return {
    data: functions.getAllData,
    functions: functions
  };
}();
})();

/******/ })()
;