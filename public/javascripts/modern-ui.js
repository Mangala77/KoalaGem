$(function() {
  $( "ul#sortable1" ).sortable({
    connectWith: "ul",
    placeholder: 'ui-state-highlight',
    forcePlaceholderSize: true
  });

  $( "ul#sortable2" ).sortable({
    connectWith: "ul",
    //dropOnEmpty: false,
    receive: function(event, ui) {
    },
    remove: function(event, ui) {},
    placeholder: 'ui-state-highlight',
    forcePlaceholderSize: true
  });

  $( "ul#sortable3" ).sortable({
    connectWith: "ul",
    placeholder: 'ui-state-highlight',
    forcePlaceholderSize: true
  });

  $( "ul#sortable4" ).sortable({
    connectWith: "ul",
    //dropOnEmpty: false,
    receive: function(event, ui) {
    },
    remove: function(event, ui) {},
    placeholder: 'ui-state-highlight',
    forcePlaceholderSize: true
  });


  $( "#sortable1, #sortable2", "#sortable3", "#sortable4" ).disableSelection();

  $("#save_report_settings").click(function(event){
    event.preventDefault();

    var list_result = $('#sortable2').sortable('toArray');
    var numeric_result = $('#sortable4').sortable('toArray');

    $("#numeric_field_ids").val(numeric_result);
    $("#list_field_ids").val(list_result);

    $("#report_settings_form").submit();
  })
});

