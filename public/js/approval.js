(()=>{"use strict";var t,n,e=(t={commentTemplate:null,commentCardTemplate:null},{data:(n={init:function(t){$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}})},setDataAttr:function(n,e){t[n]=e},getDataAttr:function(n){return t[n]},getAllData:function(){return t},createComment:function(t){$.ajax({url:t.url,type:"post",data:t.data,success:function(n){t.successCallback(n)}})},buildComments:function(t,n,e,a){void 0===a&&(a="No comments yet."),n.html(""),0===e.length?n.html("<p>"+a+"</p>"):$.each(e,(function(e,a){var o=a.author;void 0===o&&(o=a.authorInfo);var s=t(a.id,a.body,o.name,_moment(a.updated_at).format("YYYY-MM-DD LT"));n.prepend(s)}))},setCommentError:function(t,n){t.html(n)},resetCommentForm:function(t){t.reset()},showCommentsAjaxLoader:function(t){t.find(".ajax-loader").removeClass("d-none")},hideCommentsAjaxLoader:function(t){t.find(".ajax-loader").addClass("d-none")}}).getAllData,functions:n});window.approvalHelper=function(){var t={currentAssignmentId:null},n="#assignmentContainer",a={grid:"ajr-grid",list:"ajr-list"},o={comment:"#commentModal"},s={form:"#newComment",formError:"#commentError"},r={container:".household",comments:".allComments",status:".status",error:".statusError"},c=function(t,n,e){return"\n            <div class='ministeringComment' data-commentid=\"".concat(t,'">\n                <author>').concat(e,'</author>\n                <p class="commentBody">').concat(n,"</p>\n            </div>\n        ")},i={init:function(t){$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}}),$(".household").each((function(){i.handleBtnGroup($(this))})),e.functions.init(),e.functions.setDataAttr("commentTemplate",c)},setDataAttr:function(n,e){t[n]=e},getDataAttr:function(n){return t[n]},getAllData:function(){return t},getActiveContainerById:function(t){return $('[data-assignmentid="'+t+'"] '+r.comments)},createComment:function(){var t=$(s.form),n=t.find("#assignmentId").val();i.setDataAttr("currentAssignmentId",n);var a={url:"/api/assignment/"+n+"/comments/create",data:{form:JSON.stringify(t.serializeArray().reduce((function(t,n){return t[n.name]=n.value,t}),{}))},successCallback:i.commentCreateSuccess};e.functions.createComment(a)},commentCreateSuccess:function(t){t.saved?(e.functions.resetCommentForm($(s.form)[0]),e.functions.buildComments(e.functions.getDataAttr("commentTemplate"),i.getActiveContainerById(i.getDataAttr("currentAssignmentId")),t.comments,"No feedback provided."),$(o.comment).modal("hide")):e.functions.setCommentError($(s.formError),"Could not save your comment. Refresh the page and try again.")},updateStatus:function(t,n){var e=t.closest(r.container),a=e.data("assignmentid");$.ajax({url:"/api/assignment/"+a+"/"+n,type:"post",data:{},success:function(t){t.saved?($(r.status,e).html(t.status),$(e).removeClass().addClass("household "+t.status),i.handleBtnGroup(e)):i.setStatusError("Could not update the status. Refresh the page and try again.")}})},setStatusError:function(t){$(r.error).html(t)},handleBtnGroup:function(t){$(".btn-group",t).find("button").removeClass("fake-last").removeClass("fake-first"),$(".btn-group",t).find("button").not(":hidden").last().addClass("fake-last"),$(".btn-group",t).find("button").not(":hidden").first().addClass("fake-first")},changeViewType:function(t){switch(t){case"grid":$(n).removeClass(a.list).addClass(a.grid);break;case"list":default:$(n).addClass(a.list).removeClass(a.grid)}}};return $(document).on("click touch","#submitComment",(function(t){t.preventDefault(),i.createComment()})),$(document).on("click touch",".acceptAssignment",(function(t){i.updateStatus($(this),"accept")})),$(document).on("click touch",".rejectAssignment",(function(t){i.updateStatus($(this),"reject")})),$(document).on("click touch",".resetStatus",(function(t){i.updateStatus($(this),"propose")})),$(document).on("click touch","#viewChoice li",(function(){i.changeViewType($(this).data("viewtype"))})),{data:i.getAllData,functions:i}}()})();
//# sourceMappingURL=approval.js.map