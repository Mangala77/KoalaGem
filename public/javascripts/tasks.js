$(function(){
  var regex = new RegExp(/^\d{1,2}:[0-5]([0-9]){0,1}$/);
  jQuery.validator.addMethod("duration-validation", function(value, element) { 
    //console.log(value);
    //console.log(value.match(regex));
    if(value.match(regex)){
      return true;
    } else {
      return false;
    }
  }, App.translate('errors.durationFormat'));

  $("#client").tokenInput("/companies/"+App.company_id+"/tasks/client_token_search.json", {
      tokenLimit: 1,
      /*minChars: 3,*/
      hintText: App.translate("view.hint"),
      noResultsText: App.translate("view.noResults"),
      searchingText: App.translate("view.searching"),
      prePopulate: JSON.parse($("#client").attr("data-pre")),
      onAdd: function(){
        $("#client").change()
      },
      onDelete: function(){
        $("#task_site_id").empty();
        $("#task_site_id").change() //force to make inline validation work
      }
  });   

  $("#client").live('change', function(){
    var client_id = $(this).val();
    if(client_id.length > 0){
      $("#client").next().remove(); //removing error label
      $.get("/companies/"+App.company_id+"/tasks/change_sites.json", {client_id: client_id}, function(response){
        //console.log(response)
      })
    }
  })

  /* inline validation on keyup/blur */
  $(".required").live('change', function(){
    if($(this).valid()){
      $(this).removeClass("error");
    } else {
      $(this).addClass("error");
    }
  })

  $(".required").live('keyup', function(){
    if($(this).valid()){
      $(this).removeClass("error");
    } else {
      $(this).addClass("error");
    }
  })

  $(".required").live('blur', function(){
    if($(this).valid()){
      $(this).removeClass("error");
    } else {
      $(this).addClass("error");
    }
  })
  
  $(".duration-validation").live('keyup', function(){
    if($(this).valid()){
      $(this).removeClass("error");
    } else {
      $(this).addClass("error");
    }
  })

  $(".duration-validation").live('blur', function(){
    if($(this).valid()){
      $(this).removeClass("error");
    } else {
      $(this).addClass("error");
    }
  })


})
