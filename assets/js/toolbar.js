function toolbar() {
    this.toggleSettings= function () {
        $("#settingsButton").on("click", function () {
            $("#settings-menu").fadeToggle(250);
        });
    },
    this.toggleMoreInformation= function () {
        $('#informationButton').on('click', function () {
            // let vis = record if settings menu was open when more information button was clicked.
            let vis = $("#settings-menu").is(":visible");
            //Show the modal
            if ($("#information-modal").is(":hidden")) {
                $('#information-modal').modal('show');
            }
            //Pause sketch while modal is showing.
            audioVisualizer.noLoop();
            //If settings menu was open when the information button was clicked, hide it
            if (vis) {
                $("#settings-menu").hide();
            }
            $('#information-modal').on('hidden.bs.modal', function () {
                //if the settings menu was open when more information button was clicked, show it again. 
                if (vis === true) {
                    $("#settings-menu").show();
                }
                //reset vis to false on close
                vis = false;
                //Play sketch when modal is closed.
                audioVisualizer.loop();
            });
        });
    },
    this.savePicture= function () {
        $("#cameraButton").on("click", function () {
            //Generate unique filename for each image saved so that a previous image is not overwritten from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
            let r = Math.random().toString(36).substring(7);
            let filename = `Audio-${r}.jpg`;
            audioVisualizer.saveCanvas(audioVisualizer.cnv, filename);
        });
    },
    this.toggleFullscreen= function () {
        $("#fullScreenButton").on("click", function () {
            launchIntoFullscreen(sketchContainer);
            //https://davidwalsh.name/fullscreen
            function launchIntoFullscreen(element) {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }
        });
    }
};