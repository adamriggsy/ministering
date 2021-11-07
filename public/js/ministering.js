(()=>{"use strict";var t,e,n=(t={commentTemplate:null,commentCardTemplate:null},{data:(e={init:function(t){$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}})},setDataAttr:function(e,n){t[e]=n},getDataAttr:function(e){return t[e]},getAllData:function(){return t},createComment:function(t){$.ajax({url:t.url,type:"post",data:t.data,success:function(e){t.successCallback(e)}})},buildComments:function(t,e,n,o){void 0===o&&(o="No comments yet."),e.html(""),0===n.length?e.html("<p>"+o+"</p>"):$.each(n,(function(n,o){var a=o.author;void 0===a&&(a=o.authorInfo);var s=t(o.id,o.body,a.name,_moment(o.updated_at).format("YYYY-MM-DD LT"));e.prepend(s)}))},setCommentError:function(t,e){t.html(e)},resetCommentForm:function(t){t.reset()},showCommentsAjaxLoader:function(t){t.find(".ajax-loader").removeClass("d-none")},hideCommentsAjaxLoader:function(t){t.find(".ajax-loader").addClass("d-none")}}).getAllData,functions:e});window.ministeringHelper=function(){var t={households:null,unassignedHouseholds:!1,activeHousehold:null,ac:!1},e={container:"#activeHousehold",household:{container:"#householdContainer",name:".householdName",husband:".husbandName",wife:".wifeName",minTo:"#assignedToVisitContainer",assignedReceive:"#visitingHousehold"},ministering:{container:"#ministeringInfo",assigned:{container:"#assignedToVisitContainer"},visiting:{container:"#visitingHousehold"}},comments:{container:"#householdComments",allComments:"#commentsContainer",view:"#view",form:"#newComment",formError:"#commentError",nav:{view:"#commentNavView",create:"#commentNavCreate"}}},o=function(t,e,n,o){return"\n            <div class='houseComment' data-commentid=\"".concat(t,'">\n                <author>').concat(n," - ").concat(o,'</author>\n                <p class="commentBody">').concat(e,"</p>\n            </div>\n        ")},a={init:function(t){$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}}),a.setDataAttr("households",t),n.functions.init(),n.functions.setDataAttr("commentTemplate",o)},setDataAttr:function(e,n){t[e]=n},getDataAttr:function(e){return t[e]},getAllData:function(){return t},getHouseholdById:function(e){return t.households.filter((function(t){return t.id===e}))[0]},resetDataTable:function(){$.fn.dataTable.isDataTable("#allHouseholdsTable")&&$("#allHouseholdsTable").DataTable().destroy(),$("#allHouseholdsTable").DataTable({paging:!1,order:[],columns:[{targets:0,orderable:!1,width:"1%"},{targets:1,width:"5%"},{targets:2,width:"5%"},{targets:3,width:"5%"},{targets:4,width:"14%"},{targets:5,width:"14%"},{targets:6,orderable:!1,width:"5%"}]})},getHouseholdComments:function(){n.functions.showCommentsAjaxLoader($(e.comments.view)),$.getJSON("/api/household/"+t.activeHousehold.id+"/comments",(function(t){n.functions.buildComments(n.functions.getDataAttr("commentTemplate"),$(e.comments.allComments),t),n.functions.hideCommentsAjaxLoader($(e.comments.view))}))},createComment:function(){var t=$(e.comments.form),o={url:"/api/household/"+a.getDataAttr("activeHousehold").id+"/comments/create",data:{form:JSON.stringify(t.serializeArray().reduce((function(t,e){return t[e.name]=e.value,t}),{}))},successCallback:a.commentCreateSuccess};n.functions.createComment(o)},commentCreateSuccess:function(t){t.saved?($(e.comments.nav.view).find(".nav-link").click(),n.functions.showCommentsAjaxLoader($(e.comments.view)),n.functions.buildComments(n.functions.getDataAttr("commentTemplate"),$(e.comments.allComments),t.comments,"No comments yet."),n.functions.hideCommentsAjaxLoader($(e.comments.view)),n.functions.resetCommentForm($(e.comments.form)[0])):n.functions.setCommentError($(e.comments.formError),"Could not save your comment. Refresh the page and try again.")}};return $(document).on("click touch","#commentSubmit",(function(t){t.preventDefault(),a.createComment()})),$(document).on("click touch","#commentNavCreate",(function(){n.functions.setCommentError($(e.comments.formError),"")})),$(document).on("show.bs.modal","#assignmentFeedbackModal",(function(t){var e=$(t.relatedTarget).closest(".household"),o=$(this),s=a.getHouseholdById(e.data("householdid")),m=[];o.removeClass("approved rejected proposed").addClass(s.ministeredByStatus),_.each(s.ministered_by.comments,(function(t){console.log(t),m.push(t)})),$("#assignStatus",o).html(_.upperFirst(s.ministeredByStatus)),$(".householdName",o).html(s.fullHouseholdName),$(".assignedNames",o).html(s.ministeringComp1+" & "+s.ministeringComp2),n.functions.buildComments(n.functions.getDataAttr("commentTemplate"),$("#aFeedbackContainer",o),m)})),{data:a.getAllData,functions:a}}()})();
//# sourceMappingURL=ministering.js.map