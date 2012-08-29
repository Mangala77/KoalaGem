$(document).ready(function(){
    $("div[id*='dailyview']").mask('Chargement...');
    var duration;
    var pixel_scale;

    $('td[data-clickable-user]').click(function(){
       sendCreateTaskRequest($(this).attr("data-clickable-user"), formatted_date);
    })

    $("#change_scale").click(function(){
       changeScale(formatted_date);
    })
    
    $("#change_scale").hover(function(){
      if($(this).parent().addClass("ui-state-hover"));
    }, function(){
      if($(this).parent().removeClass("ui-state-hover"));
    })

    if($('#dailyview-working_day').length > 0){
      pixel_scale = 23;
      pixel_offset = 736; //800 pixels for 8.00 hours
    } else if($('#dailyview-all_day').length > 0){
      pixel_scale = 10;
      pixel_offset = 0;
    }

    $.each($("div[id*='drag-task']"), function(){
        var dragg_and_resize = true;
        var duration = parseInt($(this).attr('data-duration'));
        var hours    = parseInt($(this).attr('data-hours'));
        var minutes  = parseInt($(this).attr('data-minutes'));
        var day      = parseInt($(this).attr('data-day'));
        var month    = parseInt($(this).attr('data-month'));
        var year     = parseInt($(this).attr('data-year'));

        date_with_duration = new Date(year, month - 1, day, hours, minutes + duration );
        date_without_duration = new Date(year, month - 1, day, hours, minutes);

        if (formatted_date != null){
          current_date = new Date(formatted_date);
        } else {
          current_date = new Date();
        }

        if(current_date.getDate() == day && (current_date.getMonth()) == month-1){
           start_point = (((hours * 60 + minutes) / 15) * pixel_scale) - pixel_offset;
           end_point = (duration / 15 * pixel_scale);
           $(this).css("left", start_point+"px");
           $(this).css("width", end_point+"px");
           $(this).parent().css('display', 'block');
           $(this).css("display", "block");
           $(this).attr("data-drag-resize", true);
        } else if((current_date.getDate() == date_with_duration.getDate()) && (current_date.getMonth() == date_with_duration.getMonth())){
           start_point = 0;
           end_point = (((date_with_duration.getHours() * 60 + date_with_duration.getMinutes()) / 15) * pixel_scale);
           $(this).css("left", start_point+"px");
           $(this).css("width", end_point+"px");
           $(this).parent().css('display', 'block');
           $(this).css("display", "block");
           $(this).css("opacity", "0.3");
           $(this).attr("data-drag-resize", false);
        } else if((date_without_duration < current_date) && (current_date < date_with_duration)){
           start_point = 0;
           end_point = (duration / 15 * pixel_scale);
           $(this).css("left", start_point+"px");
           $(this).css("width", end_point+"px");
           $(this).parent().css('display', 'block');
           $(this).css("display", "block");
           $(this).css("opacity", "0.3");
           $(this).attr("data-drag-resize", false);
        } 
        })

      $("div[data-drag-resize='true']").draggable({ axis: 'x', containment: 'parent', grid: [pixel_scale, 1], addClasses: false, scroll: false }).
      resizable({  grid: [pixel_scale, 0], containment: 'parent', minWidth: pixel_scale, handles: 'e',
      stop: function(event, ui) {
      $("#calendar").unmask();
        var r = /\d+$/;
        var task_id = ui.helper.attr("id").match(r);
        end_width = ui.helper.css('width');
        duration = parseInt(end_width.replace("px", '')) / pixel_scale * 15; 

       $("div[id*='dailyview']").mask('Chargement...');
       $.ajax({
        type: 'PUT',
        url: task_id,
        data: {'task[duration]': duration, update_choice: 'current'},
        complete: function(){
        $("#calendar").unmask();
        }
        });
      }}).click(function(event){
        event.stopPropagation();
        var r = /\d+$/;
        var task_id = $(this).attr("id").match(r);
          requestForEdit(task_id);
        });

      $("div[data-drag-resize='true']").parent().droppable({
      drop: function(event, ui) {
      var r = /\d+$/;
      /* need for compability with Firefox (WTF) */
      if(ui.draggable.attr("id") != ''){
        var task_id = ui.draggable.attr("id").match(r);
        var start_point = ui.draggable.css("left");
        var duration = parseInt(ui.draggable.css("width").replace("px", '')) / pixel_scale * 15;

        var pixels = parseInt(start_point.replace("px", '')) + pixel_offset;
        var general_minutes = pixels / pixel_scale * 15;

        //creates UTC date and javascript adds default timezone offset for it (Rails will then decrement timezone offset to UTC)
        var new_date = new Date(Date.UTC(parseInt(ui.draggable.attr("data-year")), parseInt(ui.draggable.attr("data-month")) - 1, parseInt(ui.draggable.attr("data-day")), parseInt(general_minutes / 60), general_minutes % 60));
        /*console.log(" ======= DATE TO UTC ==========");*/
        /*console.log(new_date);*/
        /*console.log(new_date.toUTCString());*/
        
        $("div[id*='dailyview']").mask('Chargement...');
        $.ajax({
          type: 'PUT',
          url: task_id,
          data: {'task[start_date]': new_date.toString(), 'task[duration]': duration, update_choice: 'current'},
          complete: function(){
          $("#calendar").unmask();
          }
        });
      }
      }
      })
  //-------------------------------  
    $("div[id*='dailyview']").unmask();
})
