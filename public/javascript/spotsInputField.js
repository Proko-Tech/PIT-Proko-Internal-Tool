$(document).ready(function (){
    /* Creates input fields on focusout  */
    $( "#total-spots-input" )
    .focusout(function() {
    $( "#num-spots-input" ).empty();
    var num_spots = $( "#total-spots" ).val();
    for (var i = 1; i < parseInt(num_spots) + 1; i++) {
        $( "#num-spots-input" ).append("<span><h6> Level " + i + ":</h6></span>" +
                                    "<input id=\"num-spots\" placeholder=\"Number of spots\" type=\"text\" class=\validate\">");
    }
    });

    /* Creates input fields on Enter press */
    $( "#total-spots-input" )
    .keypress(function(key) {
    $( "#num-spots-input" ).empty();
    var num_spots = $( "#total-spots" ).val();
    var key_code = key.keyCode ||key.which;

    if (key_code == 13) {
        for (var i = 1; i < parseInt(num_spots) + 1; i++) {
            $( "#num-spots-input" ).append("<span><h6> Level " + i + ":</h6></span>" +
                                    "<input id=\"num-spots\" placeholder=\"Number of spots\" type=\"text\" class=\validate\">");
        }
    }
    });
});