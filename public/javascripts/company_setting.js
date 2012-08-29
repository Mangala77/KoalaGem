$(function(){
  if($("#company_setting_map_type").val() == "none"){
    $("#company_setting_map_view_type").hide();
    $("#map_view_type_label").hide();
  }

  $("#company_setting_map_type").change(function(){
    switch($(this).val()){
      case "none":
        $("#company_setting_map_view_type").hide();
        $("#map_view_type_label").hide();
        break
      case "google":
        $("#company_setting_map_view_type").show();
        $("#map_view_type_label").show();
        addMapTypesFor("google");
        break
      case "bing":
        $("#company_setting_map_view_type").show();
        $("#map_view_type_label").show();
        addMapTypesFor("bing");
        break  
    }
  })    
})

function addMapTypesFor(type){
  var options;
  switch(type){
    case "google":
      options = ["<option value='roadmap' selected='selected'>"+App.translate('maps.roadmap')+"</option>",
                 "<option value='satellite'>"+App.translate('maps.satellite')+"</option>",
                    "<option value='terrain'>"+App.translate('maps.terrain')+"</option>",
                    "<option value='hybrid'>"+App.translate('maps.hybrid')+"</option>"]
      break
    case "bing":
      options = ["<option value='Road' selected='selected'>"+App.translate('maps.roadmap')+"</option>",
                 "<option value='Aerial'>"+App.translate('maps.aerial')+"</option>"]
      break
  }
  $("#company_setting_map_view_type").empty();
  $("#company_setting_map_view_type").append(options.join(""))
}
