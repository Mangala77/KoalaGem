var id = null
var company_id = null

function initStructureFieldsTree(company_id, structure_id)
{
    var sent_once = false;
    var root = location.protocol + '//' + location.host;
    $("#structure-fields")
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
                    $("#structure-fields").find("a.jstree-loading").removeClass("jstree-loading");
                    return false;
                  }
                },
                "complete" : function(response){
                  if (JSON.parse(response.response).success == false){
                    $("#structure-fields").append("<div class='no-fields'>"+App.translate("view.noFields")+"</div>")
                  }
                  sent_once = true;
                  if($.cookie("field_ids")){
                    var cook = $.cookie("field_ids").split(",");
                    $.each(cook, function(i){
                      console.log(cook[i]);
                      if(cook[i].length > 0){
                        $("#structure-fields").jstree("check_node", cook[i]); //check fields saved in cookie
                      }
                    })
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

                "url" : root + "/companies/" + company_id + "/submissions/load_structure_fields_data",

                    "data" : function (n) {
                        return { 
                          structure_id : structure_id 
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
          $("#select-criterias").enable();
        } else {
          $("#select-criterias").disable();
          $("#values_to_search").val(null); //clear values to search
          $.cookie("value_ids", null);
        }
          
          var structure_id = $("#structure_id").val();
          var structure_chains = $("#structure-fields").jstree("get_checked");  
          var structures_to_send = {};
          var aliases = new Array;

          $.cookie("field_ids", null); //clearing cookie and set new checked fields
          structure_chains.each(function(){
          setCheckedFieldsToCookie($(this)); //set checked field to cookie
          })

      });
}
