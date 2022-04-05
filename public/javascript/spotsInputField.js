$(document).ready(function (){
    /* Creates input fields on focusout  */
    $( "#total-spots-input" )
        .focusout(function () {
            $( "#num-spots-input" ).empty();
            var num_spots = $( "#total-spots" ).val();
            createSpotInput(num_spots);
        });

    /* Creates input fields on Enter press */
    $( "#total-spots-input" )
        .keypress(function (key) {
            $( "#num-spots-input" ).empty();
            const num_spots = $( "#total-spots" ).val();
            const key_code = key.keyCode ||key.which;

            if (key_code == 13) {
                createSpotInput(num_spots);
            }
        });

    $('select').formSelect();

});

function createSpotInput (num_spots) {
    for (let i = 1; i < parseInt(num_spots) + 1; i++) {
        const newComponent = `<div class="row">
                                <div class="col s1">
                                    <span>Spot ${i}:</span>
                                </div>
                                <div class="input-field col s3">
                                    <input type="text" name="spot_name"  placeholder="Spot name" required>
                                </div>
                                <div class="input-field col s3">
                                    <input type="text" name="secret"  placeholder="Spot hash(Mac address)" required>
                                </div>
                                <div class="input-field col s3">
                                    <input type="number" name="firmware_version"  placeholder="Firmware Version" required>
                                </div>
                            </div>`
        $("#num-spots-input").append(newComponent);

    }
}
