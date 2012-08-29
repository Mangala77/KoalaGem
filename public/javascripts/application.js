  $(document).ready(function() {

    $("#save_search").on("click", function(event) {
        event.preventDefault(); // don't trigger default

        // get the value inside the text field
      
        $.post('/home/callback', , function(data) {
            // log the result from the server, or whatever...
            console.log(data);
        });
    });
   
});


