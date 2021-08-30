(()=>{"use strict";var e,o,t=(e={commentTemplate:null},{data:(o={init:function(e){$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}})},setDataAttr:function(o,t){e[o]=t},getDataAttr:function(o){return e[o]},getAllData:function(){return e},createComment:function(e){$.ajax({url:e.url,type:"post",data:e.data,success:function(o){e.successCallback(o)}})},buildComments:function(o,t,n){void 0===n&&(n="No comments yet."),o.html(""),0===t.length?o.html("<p>"+n+"</p>"):$.each(t,(function(t,n){var s=n.author.name+" - "+_moment(n.updated_at).format("YYYY-MM-DD LT"),a=e.commentTemplate(n.id,n.body,s);o.prepend(a)}))},setCommentError:function(e,o){e.html(o)},resetCommentForm:function(e){e.reset()},showCommentsAjaxLoader:function(e){e.find(".ajax-loader").removeClass("d-none")},hideCommentsAjaxLoader:function(e){e.find(".ajax-loader").addClass("d-none")}}).getAllData,functions:o});window.ministeringHelper=function(){var e={households:null,unassignedHouseholds:!1,activeHousehold:null,ac:!1},o={container:"#activeHousehold",household:{container:"#householdContainer",name:".householdName",husband:".husbandName",wife:".wifeName",minTo:"#assignedToVisitContainer",assignedReceive:"#visitingHousehold"},ministering:{container:"#ministeringInfo",assigned:{container:"#assignedToVisitContainer"},visiting:{container:"#visitingHousehold"}},comments:{container:"#householdComments",allComments:"#commentsContainer",view:"#view",form:"#newComment",formError:"#commentError",nav:{view:"#commentNavView",create:"#commentNavCreate"}}},n={container:".household",last_name:".hh_lastName",husband:".hh_husbandName",wife:".hh_wifeName",minSis:".hh_ministeringSis",minBro:".hh_ministeringBro",minTo:".hh_ministeringTo"},s=function(e,o,t){return"\n            <div class='houseComment' data-commentid=\"".concat(e,'">\n                <author>').concat(t,'</author>\n                <p class="commentBody">').concat(o,"</p>\n            </div>\n        ")},a={init:function(e){$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}}),a.setDataAttr("households",e),a.getUnassignedHouseholds(),t.functions.init(),t.functions.setDataAttr("commentTemplate",s)},setDataAttr:function(o,t){e[o]=t},getDataAttr:function(o){return e[o]},getAllData:function(){return e},workOnHousehold:function(e){var t=a.getHouseholdById(e.data("householdid"));a.setDataAttr("activeHousehold",t);var n=o,s=$(n.container);s.data("activeid",t.id),$(n.household.name,s).html(t.last_name),$(n.household.husband,s).html(t.husbandName),$(n.household.wife,s).html(t.wifeName),$(n.household.minTo,s).html(""),$.each(t.ministerTo,(function(e,o){$(n.household.minTo,s).append('<p class="minToHouse" data-householdid="'+e+'">'+o+'<i class="removeAssigned bi-x-circle small text-danger"></i></p>')})),$(n.household.assignedReceive).children().remove(),""!==t.ministeringBrother&&$(n.household.assignedReceive).append("<p>"+t.ministeringBrother+"</p>"),""!==t.ministeringSister&&$(n.household.assignedReceive).append("<p>"+t.ministeringSister+"</p>"),$(o.container).removeClass("d-none"),a.getHouseholdComments()},setAutocomplete:function(){$("#assignHouseholdContainer").html("").append('<input type="text" class="form-control" id="assignHousehold" placeholder="Start typing..." autocomplete="off">'),a.setDataAttr("ac",!1);var e=document.getElementById("assignHousehold"),o=new Autocomplete(e,{data:ministeringHelper.functions.getDataAttr("unassignedHouseholds"),maximumItems:10,treshold:1,highlightTyped:!1,onSelectItem:function(e){e.label;var o=e.value;a.assignHousehold(o)}});a.setDataAttr("ac",o)},getHouseholdById:function(o){return e.households.filter((function(e){return e.id===o}))[0]},getUnassignedHouseholds:function(){$.getJSON("/api/households/unassigned",(function(e){a.setDataAttr("unassignedHouseholds",e),a.setDataAttr("ac",!1),a.setAutocomplete()}))},assignHousehold:function(e){var t=a.getDataAttr("activeHousehold");$.ajax({url:"/api/assign",type:"post",data:{householdId:t.id,assignedId:e},success:function(e){a.updateHouseholds(e.household),a.updateHouseholds(e.assignedHousehold),$(o.household.minTo).append('<p class="minToHouse" data-householdid="'+e.assignedHousehold.id+'">'+e.assignedHousehold.householdName+'<i class="removeAssigned bi-x-circle small text-danger"></i></p>'),$("#assignHousehold").val(""),a.getUnassignedHouseholds(),a.resetDataTable()}})},updateHouseholds:function(e){a.replaceHouseholdData(e);var o=$(".household[data-householdid='"+e.id+"']");$(n.minSis,o).html(e.ministeringSister),$(n.minBro,o).html(e.ministeringBrother),$(n.minTo,o).html(""),$.each(e.ministerTo,(function(e,t){$(n.minTo,o).append("<p>"+t+"</p>")}))},replaceHouseholdData:function(o){var t=e.households.findIndex((function(e){return e.id===o.id}));e.households[t]=o},removeActiveVisiting:function(){var e=a.getDataAttr("activeHousehold");$(o.household.assignedReceive).children().length>0&&$.ajax({url:"/api/remove-visiting",type:"post",data:{householdId:e.id},success:function(e){a.updateHouseholds(e.household),a.updateHouseholds(e.otherHousehold),$(o.household.assignedReceive).html(""),$("#assignHousehold").val(""),a.getUnassignedHouseholds(),a.resetDataTable()}})},removeAssignedMinTo:function(e){var t=e.data("householdid"),n=a.getDataAttr("activeHousehold");$.ajax({url:"/api/remove-assigned",type:"post",data:{householdId:n.id,assignedId:t},success:function(e){a.updateHouseholds(e.household),a.updateHouseholds(e.otherHousehold),$(o.household.minTo+" .minToHouse[data-householdid='"+t+"']").remove(),$("#assignHousehold").val(""),a.getUnassignedHouseholds(),a.resetDataTable()}})},resetDataTable:function(){$.fn.dataTable.isDataTable("#allHouseholdsTable")&&$("#allHouseholdsTable").DataTable().destroy(),$("#allHouseholdsTable").DataTable({paging:!1,order:[],columns:[{targets:0,orderable:!1,width:"1%"},{targets:1,width:"5%"},{targets:2,width:"5%"},{targets:3,width:"5%"},{targets:4,orderable:!1,width:"14%"},{targets:5,orderable:!1,width:"14%"},{targets:6,orderable:!1,width:"14%"},{targets:7,orderable:!1,width:"14%"}]})},getHouseholdComments:function(){t.functions.showCommentsAjaxLoader($(o.comments.view)),$.getJSON("/api/household/"+e.activeHousehold.id+"/comments",(function(e){t.functions.buildComments($(o.comments.allComments),e),t.functions.hideCommentsAjaxLoader($(o.comments.view))}))},createComment:function(){var e=$(o.comments.form),n={url:"/api/household/"+a.getDataAttr("activeHousehold").id+"/comments/create",data:{form:JSON.stringify(e.serializeArray().reduce((function(e,o){return e[o.name]=o.value,e}),{}))},successCallback:a.commentCreateSuccess};t.functions.createComment(n)},commentCreateSuccess:function(e){e.saved?($(o.comments.nav.view).find(".nav-link").click(),t.functions.showCommentsAjaxLoader($(o.comments.view)),t.functions.buildComments($(o.comments.allComments),e.comments,"No comments yet."),t.functions.hideCommentsAjaxLoader($(o.comments.view)),t.functions.resetCommentForm($(o.comments.form)[0])):t.functions.setCommentError($(o.comments.formError),"Could not save your comment. Refresh the page and try again.")}};return $(document).on("click touch",".assignHousehold",(function(){a.workOnHousehold($(this).closest(n.container)),$([document.documentElement,document.body]).animate({scrollTop:$(o.container).offset().top},1e3)})),$(document).on("click touch",".removeVisiting",(function(){a.removeActiveVisiting()})),$(document).on("click touch",".removeAssigned",(function(){a.removeAssignedMinTo($(this).closest(".minToHouse"))})),$(document).on("click touch","#activeClose",(function(){$(o.container).addClass("d-none")})),$(document).on("click touch","#commentSubmit",(function(e){e.preventDefault(),a.createComment()})),$(document).on("click touch","#commentNavCreate",(function(){t.functions.setCommentError($(o.comments.formError),"")})),{data:a.getAllData,functions:a}}()})();
//# sourceMappingURL=ministering.js.map