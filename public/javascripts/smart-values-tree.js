function initSmartValuesTree(company_id, structure_id, structure_chains)
{
    var sent_once = false;
    var root = location.protocol + '//' + location.host;
    $("#smart-values")
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
                "beforeSend": function( xhr, s ){
                  if(sent_once == true){
                    $("#smart-values").find("a.jstree-loading").removeClass("jstree-loading");
                    return false;
                  }
                },
                "complete" : function(response){
                        $("#smart-values").bind("check_node.jstree", function (event, data) { 
                          console.log("Otvaryai")
                          if((data.inst._get_parent(data.rslt.obj)).length) { 
                            data.inst._get_parent(data.rslt.obj).open_node(this, false); 
                          } 
                        });
                  sent_once = true;
                  if($.cookie('value_ids')){
                    //console.log("values to check ===========================");
                    //console.log($.cookie("value_ids"));
                    var cook = $.cookie("value_ids").split(",");
                    $.each(cook, function(i){
                      console.log(cook[i]);
                      if(cook[i].length > 0){
                        $("#smart-values").jstree("check_node", cook[i]); //check fields saved in cookie
                        /*$("#smart-values").jstree("open_node", cook[i]); //check fields saved in cookie*/
                      }
                    })
                    var checked_nodes = $("#smart-values").jstree("get_checked")
                      $.each(checked_nodes, function(i){
                        var parent_id = $(checked_nodes[i]).parent().parent().attr("id");
                        if( parent_id != "smart-values"){
                          $("#smart-values").jstree("open_node", "#"+parent_id); //check fields saved in cookie
                        } else {
                          $("#smart-values").jstree("open_node", "#"+$(checked_nodes[i]).attr("id")); //check fields saved in cookie
                        }        
                      })

                    /*$.each(cook, function(){*/
                    /*console.log($(this));*/
                    /*$("#smart-values").jstree("check_node", $(this)); //check fields saved in cookie*/
                    /*})*/
                  }
                /*if (JSON.parse(response.response).success == false){
                  $("#lists").append($("div.lists-mock"));
                  $("div.lists-mock").css("display", "inline-block");
                };
                  if($.cookie("list_ids")){
                    $("#lists").jstree("check_node", $.cookie("list_ids"));   
                    $.cookie("list_ids", null);
                  }*/
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

                "url" : root + "/companies/" + App.company_id + "/submissions/load_smart_search_values",

                    "data" : function (n) {
                        return { 
                          structure_id    : structure_id,
                          structure_chains: structure_chains
                        };
                    }



                /*"data" : function (n) {
                    return {
                        root : n.attr ? false : true,
                        list_id : n.attr ? n.attr("id") : id
                        };
                }*/
            }
            /*"progressive_render"  : true*/
        }
    }).bind("change_state.jstree", function(event, data) { 
        if(data.inst.get_selected().attr('id')!= undefined ) { 

          $("#values_to_search").val(''); //clear values to search
          var checked_values = $("#smart-values").jstree("get_checked");
          var values_to_search = $("#values_to_search").val() == null ? "" : $("#values_to_search").val();

          $.cookie("value_ids", null); //clearing cookie and set new values
          checked_values.each(function(){
            setCheckedValueToCookie($(this)); //set checked value to cookie
            if($(this).attr("smart_value")){
              values_to_search = values_to_search + $(this).attr("parent_value") +":" + $(this).attr("smart_value") + "|";
            }

            $(this).find("ul > li").each(function(){
              values_to_search = values_to_search + $(this).attr("parent_value") +":"+ $(this).attr("smart_value") + "|";
            });
            /*lists_to_cookie = lists_to_cookie + "#" + $(this).attr("id") + ",";*/
          });
          
          $.cookie("values_to_search", values_to_search);
          $("#values_to_search").val(values_to_search);

        } else {
          $.cookie("value_ids", null);
          $("#values_to_search").val(null); //clear values to search
        }
      });
}

    
