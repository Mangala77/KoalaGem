$(function(){

  $("#user_id").live('change', function(){
    var user_id = $(this).val();
    $.get("/companies/"+App.company_id+"/tasks/filter_clients_for_calendar_view.js", {user_id: user_id}, function(response){
    })
  })

  $("#client_select").live('change', function(){
    var client_id = $(this).val();
    var user_id = $("#user_id").val();
    $.get("/companies/"+App.company_id+"/tasks/filter_sites_for_calendar_view.js", {client_id: client_id, user_id : user_id}, function(response){
    })
  })

  $("#filter_tasks_form").submit(function(event){
    event.preventDefault();
    var client_id = $("#client_select").val();
    var site_id = $("#site").val();
    var user_id = $("#user_id").val();

    $.get("/companies/"+App.company_id+"/tasks/calendar", {user_id : user_id, client : client_id, site: site_id}, function(resp){
      $("#calendar").fullCalendar( 'removeEvents');
      $.each(resp, function(i,v){
        $("#calendar").fullCalendar( 'renderEvent', v);
      })
    })
  })
})

