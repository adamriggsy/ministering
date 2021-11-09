(()=>{"use strict";var n,t,e=(n={commentTemplate:null,commentCardTemplate:null},{data:(t={init:function(n){$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}})},setDataAttr:function(t,e){n[t]=e},getDataAttr:function(t){return n[t]},getAllData:function(){return n},createComment:function(n){$.ajax({url:n.url,type:"post",data:n.data,success:function(t){n.successCallback(t)}})},buildComments:function(n,t,e,o){void 0===o&&(o="No comments yet."),t.html(""),0===e.length?t.html("<p>"+o+"</p>"):$.each(e,(function(e,o){var a=o.author;void 0===a&&(a=o.authorInfo);var i=n(o.id,o.body,a.name,_moment(o.updated_at).format("YYYY-MM-DD LT"));t.prepend(i)}))},setCommentError:function(n,t){n.html(t)},resetCommentForm:function(n){n.reset()},showCommentsAjaxLoader:function(n){n.find(".ajax-loader").removeClass("d-none")},hideCommentsAjaxLoader:function(n){n.find(".ajax-loader").addClass("d-none")}}).getAllData,functions:t});window.assignmentHelper=function(){var n={companionships:null,unassignedHouseholds:!1,activeCompanionship:null,ac:!1,tickerTemplate:null},t={container:"#activeCompanionship",companionship:{container:"#companionshipContainer",comp1:".companionship1",comp2:".companionship2",minTo:"#assignedToVisitContainer"},ministering:{container:"#ministeringInfo",assigned:{container:"#assignedToVisitContainer"},visiting:{container:"#visitingHousehold"}},comments:{container:"#companionshipComments",allComments:"#commentsContainer",view:"#view",form:"#newComment",formError:"#commentError",nav:{view:"#commentNavView",create:"#commentNavCreate"}}},o={mainContainer:"#unassignedTicker",container:"#unassignedTicker .ticker"},a=function(n,t,e,o){return"\n            <div class='houseComment' data-commentid=\"".concat(n,'">\n                <author>').concat(e," - ").concat(o,'</author>\n                <p class="commentBody">').concat(t,"</p>\n            </div>\n        ")},i=function(n){return'\n            <div class="ticker__item">'.concat(n,"</div>\n        ")},s={init:function(n){$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}}),s.setDataAttr("companionships",n),s.setDataAttr("tickerTemplate",i),s.getUnassignedHouseholds(),e.functions.init(),e.functions.setDataAttr("commentTemplate",a)},setDataAttr:function(t,e){n[t]=e},getDataAttr:function(t){return n[t]},getAllData:function(){return n},workOnCompanionship:function(n){var e=s.getCompanionshipById(n.data("companionshipid"));s.setDataAttr("activeCompanionship",e);var o=t,a=$(o.container);a.attr("data-activeid",e.id),a.attr("data-companionshipid",e.id),$(o.companionship.comp1,a).html(e.firstCompanion.fullName),$(o.companionship.comp2,a).html(e.secondCompanion.fullName),$(o.companionship.minTo).html(n.find(".assignments").html())},setAutocomplete:function(){$("#assignHouseholdContainer").html("").append('<input type="text" class="form-control" id="assignHousehold" placeholder="Start typing..." autocomplete="off">'),s.setDataAttr("ac",!1);var n=document.getElementById("assignHousehold"),t=new Autocomplete(n,{data:assignmentHelper.functions.getDataAttr("unassignedHouseholds"),maximumItems:10,treshold:1,highlightTyped:!1,onSelectItem:function(n){n.label;var t=n.value;s.assignHousehold(t)}});s.setDataAttr("ac",t)},getCompanionshipById:function(t){return n.companionships.filter((function(n){return n.id===t}))[0]},getUnassignedHouseholds:function(){$.getJSON("/api/households/unassigned",(function(n){s.setDataAttr("unassignedHouseholds",n),s.setDataAttr("ac",!1),s.setAutocomplete(),s.updateTicker()}))},assignHousehold:function(n){var e=s.getDataAttr("activeCompanionship");$.ajax({url:"/api/assign",type:"post",data:{companionshipId:e.id,assignedId:n},success:function(n){if(n.success){var o='<p class="household" data-householdid="'+n.assignedHousehold.id+'">'+n.assignedHousehold.householdName+'<i class="removeAssigned bi-x-circle small text-danger"></i></p>';$(t.companionship.minTo).append(o),$("#companionships .companionship[data-companionshipid='"+e.id+"'] .assignments").append(o),$("#assignHousehold").val(""),s.getUnassignedHouseholds()}}})},removeAssignedMinTo:function(n){var t=n.data("householdid"),e=(s.getDataAttr("activeCompanionship"),n.closest(".companionship").data("companionshipid"));$.ajax({url:"/api/remove-assigned",type:"post",data:{householdId:t,companionshipId:e},success:function(n){n.success&&($('.companionship[data-companionshipid="'+e+'"]').find(".household[data-householdid='"+t+"']").remove(),$("#assignHousehold").val(""),s.getUnassignedHouseholds())}})},updateTicker:function(){var t=_.clone(s.getDataAttr("unassignedHouseholds")),e=_.shuffle(_.shuffle(t));$(o.container).html(""),$(o.container).append(n.tickerTemplate("Unassigned Households: ")),$.each(_.slice(e,0,50),(function(t,e){$(o.container).append(n.tickerTemplate(e.label))}))}};return $(document).on("show.bs.modal","#assignmentManagementModal",(function(n){var t=$(n.relatedTarget).closest(".companionship");s.workOnCompanionship(t)})),$(document).on("show.bs.modal","#assignmentFeedbackModal",(function(n){var t=$(n.relatedTarget).closest(".household"),o=$(this),a=s.getCompanionshipById(t.data("householdid")),i=[];o.removeClass("approved rejected proposed").addClass(a.ministeredByStatus),_.each(a.ministered_by.comments,(function(n){i.push(n)})),$("#assignStatus",o).html(_.upperFirst(a.ministeredByStatus)),$(".householdName",o).html(a.fullHouseholdName),$(".assignedNames",o).html(a.ministeringComp1+" & "+a.ministeringComp2),e.functions.buildComments(e.functions.getDataAttr("commentTemplate"),$("#aFeedbackContainer",o),i)})),$(document).on("click touch",".removeAssigned",(function(){s.removeAssignedMinTo($(this).closest(".household"))})),$(document).on("click touch","#tickerClose",(function(){$(o.mainContainer).remove()})),{data:s.getAllData,functions:s}}()})();
//# sourceMappingURL=assignment.js.map