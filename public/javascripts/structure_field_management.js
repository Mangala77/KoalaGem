$(function(){
  $("#add_new_field").click(function(){
    var fieldType   = $("#field_type").val();  
    var companyId   = $(this).attr("data-company_id");  
    var structureId = $(this).attr("data-structure_id");  
    $.get("/companies/"+companyId+"/structures/add_new_field",
      {type: fieldType, id: structureId, view: "table"},
      function(data){
        $.each($("#field_container").sortable("toArray"), function(n, element){
          $("#structure_structure_fields_attributes_"+element+"_position").val(n+1);
        });
      })
  })
})
