$(function(){
    /*triggering smart search visibility*/
    if(!usingSmartSearch()){
      $("#list-container").css("display", "none");
      $("#smart-search").css("margin-left", "25px");
      resizeGrid($(window).width());
    }

    $("#trigger_smart_search").change(function(){
      if($(this).attr("checked") == true){
        $.cookie('smart_search_visibility', true);
        $("#list-container").css("display", "table-cell");
        resizeGrid($(window).width() - 250);
        /*resizeGrid(950);*/
        var height = parseInt($("div.ui-jqgrid").css("height")) - 5;
        $("#list-container").css("height", height);
        $("#smart-search").css("margin-left", "0px");
      } else {
        $.cookie('smart_search_visibility', false);
        $("#list-container").css("display", "none");
        resizeGrid($(window).width());
        $("#smart-search").css("margin-left", "25px");
        $("#values_to_search").val("");
        clearCookies();
        if($("#structure-fields").length > 0){
          $("#structure-fields").jstree("uncheck_all");
        }
        if($("#smart-values").length > 0){
          $("#smart-values").jstree("uncheck_all");
        }
      }  
    })
    /*----------------------------------------------*/

    if(window.location.search.length == 0){
      clearCookies(); // clearing cookies if we are not searching submissions
    }

    if($.cookie("values_to_search")){
      $("#values_to_search").val($.cookie("values_to_search")); //set values to search from cookie (to avoid loosing search criterias on repeated search with same criteria)
    }

    var structure_fields_div = '<div id="buttons-container"><input id="select-criterias" disabled="disabled" type="submit" value="'+App.translate('view.selectCriteria')+'" /></div><div id="structure-fields"></div>';
    var smart_values_div = '<div id="buttons-container"><input id="select-fields" type="submit" value="'+App.translate('view.selectFields')+'"/></div><div id="smart-values"></div>';

  //render structure fields
  $("#structure_id").change(function(){
    clearCookies(); //clearing checked fields
    $("#values_to_search").val(''); //clear values to search
    var structure_id = $(this).val();
    $("#buttons-container").remove();
    $("#smart-values").remove();
    $("#structure-fields").remove();
    $("#list-container").append(structure_fields_div);

    initStructureFieldsTree(App.company_id, structure_id);
  })  

  //"Select criteria" button handler
  $("#select-criterias").live('click', function(){
    var structure_id = $("#structure_id").val();
    var structure_chains = $("#structure-fields").jstree("get_checked");  
    var structures_to_send = {};
    var aliases = new Array;

    $.cookie("field_ids", null); //clearing cookie and set new checked fields
    structure_chains.each(function(){
    setCheckedFieldsToCookie($(this)); //set checked field to cookie
    //check if 'this' is checked child node and it has parent
    var name = "";
    var parent = $(this).closest("ul").closest("li");
    if(parent.length > 0){
      name = $.trim(parent.attr("name")); //get valid parent name
      //find checked children
      parent.find("ul > li").each(function(){
        if($(this).hasClass("jstree-checked")){
          aliases.push($.trim($(this).attr("name")))  
        }
      })
    } else {
      name = $.trim($(this).attr("name")); //get valid child name
      $(this).find("ul > li").each(function(){
        aliases.push($.trim($(this).attr("name"))); //find ckecked child nodes if they are
      });
    }
    
    structures_to_send[name] = aliases.length > 0 ? aliases : "";
    $.cookie('structures_to_send', JSON.stringify(structures_to_send));
    aliases = []; //clearing aliases
  });


    $("#buttons-container").remove();
    $("#structure-fields").remove();
    $("#list-container").prepend(smart_values_div);

    initSmartValuesTree(App.company_id, structure_id, structures_to_send);
  })

  //Get back structure fields tree
  $("#select-fields").live('click', function(){
    $.cookie("value_ids", null);
    $.cookie("structures_to_send", null);
    $("#values_to_search").val(null);
    var structure_id = $("#structure_id").val();
    $("#buttons-container").remove();
    $("#smart-values").remove();
    $("#list-container").prepend(structure_fields_div);
    initStructureFieldsTree(App.company_id, structure_id);
  })

  $("#submission_search_form").submit(function(){
    if($.cookie("value_ids") == null){
      clearCookies();
    }    
  })

  //sends image urls to server
  $("#download_all_images").click(function(){
    var ids_to_send = new Array();
    var submission_ids = jQuery("#list").jqGrid('getGridParam','selarrrow');
    $.each(submission_ids, function(i,v){
      if($("tr[id="+v+"]").find("a.lightbox").length > 0){ 
        ids_to_send.push(v);
      }
    });
    
    if (ids_to_send.length > 0){
      $("#submission_ids").val(ids_to_send);  
      $("#images_form").submit();
    } else {
      if(App.locale == "en"){
        alert(App.translations.en.view.noImages);
      } else {
        alert(App.translations.fr.view.noImages);
      }
    }
  })
})

function setCheckedFieldsToCookie(field){
  if(field.attr("id") != "" ){
    var values = $.cookie("field_ids") == null ? '' : $.cookie("field_ids");
    var fields_to_cookie = values + "#" + field.attr("id") + ",";
    $.cookie("field_ids", fields_to_cookie);
  }
}

function setCheckedValueToCookie(value){
  if(value.attr("id") != "" ){
    var values = $.cookie("value_ids") == null ? '' : $.cookie("value_ids");
    var values_to_cookie = values + "#" + value.attr("id") + ",";
    $.cookie("value_ids", values_to_cookie);
    /*console.log("checked values ==================");*/
    /*console.log($.cookie("value_ids"));*/
  }
}

function clearCookies(){
  $.cookie("value_ids", null);
  $.cookie("field_ids", null);
  $.cookie("values_to_search", null);
  $.cookie('structures_to_send', null);
}

function usingSmartSearch(){
  return $("#trigger_smart_search").attr("checked") == true
}
