	$(function() {
    $("#save_report_settings").click(function(event){
      event.preventDefault();

      var listsToSave = $(".removable-lists");
      var numericToSave = $(".removable-numeric");
      var listsArray = toArray(listsToSave);
      var numericArray = toArray(numericToSave);
      $("#numeric_field_ids").val(numericArray);
      $("#list_field_ids").val(listsArray);

      $("#report_settings_form").submit();
    })

    //*classic* mode support
    $("#add-list").click(function(event){
      event.preventDefault();
      var addable = $(".addable-lists:selected").clone();
      $(".addable-lists:selected").detach();
      $.each(addable, function(index, value){
        $(value).removeClass('addable-lists').addClass('removable-lists')
      });
      $("#removable-list-container").append(addable);
      
    });

    $("#remove-list").click(function(event){
      event.preventDefault();
      var removable = $(".removable-lists:selected").clone();
      $(".removable-lists:selected").detach();
      $.each(removable, function(index, value){
        $(value).removeClass('removable-lists').addClass('addable-lists')
      });
      $("#addable-list-container").append(removable);
    });

    $("#add-numeric").click(function(event){
      event.preventDefault();
      var addable = $(".addable-numeric:selected").clone();
      $(".addable-numeric:selected").detach();
      $.each(addable, function(index, value){
        $(value).removeClass('addable-numeric').addClass('removable-numeric')
      });
      $("#removable-numeric-container").append(addable);
      
    });

    $("#remove-numeric").click(function(event){
      event.preventDefault();
      var removable = $(".removable-numeric:selected").clone();
      $(".removable-numeric:selected").detach();
      $.each(removable, function(index, value){
        $(value).removeClass('removable-numeric').addClass('addable-numeric')
      });
      $("#addable-numeric-container").append(removable);
    });

	});

  function toArray(elements){
    var array = new Array;
    $.each(elements, function(index, value){
      array.push($(value).attr("id"));
    })
    return array.join(",");
  }
