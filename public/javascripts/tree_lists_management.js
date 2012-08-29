var id = null
var company_id = null

function initTree(id, company_id)
{
    var root = location.protocol + '//' + location.host;
    $("#lists")
    .jstree({
        "plugins" : [ "themes", "json_data", "ui", "crrm", "dnd", "contextmenu", "types"],
        "core" : { "initially_open" : [ id ] },
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
                "complete" : function (){
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
                  },

                "url" : root + "/companies/" + company_id + "/lists/" + id + "/edit",
                "data" : function (n) {
                    return {
                        root : n.attr ? false : true,
                        list_id : n.attr ? n.attr("id") : id
                        };
                }
            },
            "progressive_render"  : true
        }
    })
    .bind("drag_node.jstree", function(e, data){
        alert("hovered");
        })
     .bind("create.jstree", function (e, data) {
        $.post(
            root + "/companies/" + company_id + "/lists/children",
            {
                "operation" : "create_node",
                "id" : data.rslt.parent.attr("id").replace("node_",""),
                "title" : data.rslt.name,
                "position" : data.rslt.position
            },
            function (r) {
                if(r.status == true) {
                    $(data.rslt.obj).attr("id", "node_" + r.id);
                }
                else {
                    $.jstree.rollback(data.rlbk);
                }
            }
            );
    })
    .bind("rename.jstree", function (e, data) {
        $.post(
            root + "/companies/" + company_id + "/lists/children",
            {
                "operation" : "rename_node",
                "id" : data.rslt.obj.attr("id").replace("node_",""),
                "title" : data.rslt.new_name
            },
            function (r) {
                if(r.status != true) {
                    $.jstree.rollback(data.rlbk);
                }
            }
            );
    })
    .bind("remove.jstree", function (e, data) {
        data.rslt.obj.each(function () {
            $.post(
                root + "/companies/" + company_id + "/lists/children",
                {
                    "operation" : "remove_node",
                    "root_id"   : id,
                    "id" : data.rslt.obj.attr("id").replace("node_",""),
                    "child_id" : this.id.replace("node_","")
                },
                function (r) {
                    if(r.status != true) {
                        $.jstree.rollback(data.rlbk);
                    }
                }
                );
        });
    })
    .bind("move_node.jstree", function (e, data) {
        data.rslt.o.each(function (i) {
            $.ajax({
                async : false,
                type: 'POST',
                url: root + "/companies/" + company_id + "/lists/children",
                data : {
                    "operation" : "move_node",
                    "id" : $(this).attr("id").replace("node_",""),
                    "parent_id" : data.rslt.np.attr("id").replace("node_",""),
                    "position" : data.rslt.cp + i,
                    "title" : data.rslt.name,
                    "copy" : data.rslt.cy ? 1 : 0
                },
                success : function (r) {
                    if(r.status != true) {
                        $.jstree.rollback(data.rlbk);
                    }
                    else {
                        $(data.rslt.oc).attr("id", "node_" + r.id);
                        if(data.rslt.cy && $(data.rslt.oc).children("UL").length) {
                            data.inst.refresh(data.inst._get_parent(data.rslt.oc));
                        }
                    }
                    $("#analyze").click();
                }
            });
        });
    });


}
