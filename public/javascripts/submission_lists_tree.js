var id = null
var company_id = null

function initTree(company_id)
{
    var root = location.protocol + '//' + location.host;
    $("#lists")
    .jstree({
        "plugins" : [ "themes", "json_data", "ui", "crrm", "checkbox", "types"],
        "types" : {
			"types" : {
				"root" : {
					"icon" : {
						"image" : "http://static.jstree.com/v.1.0rc/_docs/_drive.png" 
					},
					"max_depth" : 16
				}
			}
		},
        "json_data" : {
            "ajax" : {
                "complete" : function(response){
                if (JSON.parse(response.response).success == false){
                  $("#lists").append($("div.lists-mock"));
                  $("div.lists-mock").css("display", "inline-block");
                };
                  if($.cookie("list_ids")){
                    $("#lists").jstree("check_node", $.cookie("list_ids"));   
                    $.cookie("list_ids", null);
                  }
                },
                /*"complete" : function (){
                  var map = {};
                  $("li[id]").each(function(){
                      var seen = {};
                  $('li[id][rel!="root"]').each(function() {
                      var id = $(this).attr("id");
                      if (seen[id])
                          $(this).remove();
                      else
                          seen[id] = true;
                  })
                  }); 
                  },*/

                "url" : root + "/companies/" + company_id + "/submissions/load_tree_data",

                    "data" : function (n) {
                        return { 
                          list_id : n.attr ? n.attr("id") : 0 
                        };
                    }



                /*"data" : function (n) {
                    return {
                        root : n.attr ? false : true,
                        list_id : n.attr ? n.attr("id") : id
                        };
                }*/
            },
            /*"progressive_render"  : true*/
        }
    })
}
