$( document ).ready(function() {      
    var isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

    if (isMobile) {
        //Conditional script here
    }
 });

//https://stackoverflow.com/questions/29209308/window-localstorage-setitem-not-working-on-mobile-phone
//So finally found the solution, I need to set webSettings.setDomStorageEnabled(true); on android code and after this localstorage is working perfectlly.
//webSettings.setDomStorageEnabled(true);

//autoOpen:false stops the confirmation dialog from appearing on page load
$("#dialog-confirm").dialog({
    autoOpen: false,
});

//Get the height and width of the container so to set the canvas width and height 
let sketchContainer = document.getElementById('sketch-container');
let positionInfo = sketchContainer.getBoundingClientRect();
var containerHeight = positionInfo.height;
var containerWidth = positionInfo.width;
console.log("h:" + containerHeight);

//Enable popovers everywhere
$(function () {
    $('[data-toggle="popover"]').popover()
})

/*
//Popovers (doesn't work -conflict between jquery UI js and bootstrap js)
$(function () {
    $('[data-toggle="popover"]').popover()
})
$('.popover-dismiss').popover({
    trigger: 'focus'
})
*/

//Create sketch and attach it to #container div
var myp5 = new p5(sketch, document.getElementById("sketch-container"));

myp5.sensitivity = document.getElementById('sensitivity-slider').value;


window.onload = function () {


    let sketchContainer = document.getElementById("sketch-container");
    sketchContainer.addEventListener('click', play);
    function play() {
        console.log("k");
        let playButton = document.getElementById("play");
        if (myp5.playing) {
            playButton.style.display = "inline";
        } else {
            playButton.style.display = "none";
        }
        myp5.togglePlaying();
    }
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    //New getUserMedia() request kills existing stream track
    //If your application grabs media streams from multiple getUserMedia()  requests, you are likely in for problems with iOS. From my testing, the issue can be summarized as follows: if getUserMedia()  requests a media type requested in a previous getUserMedia() , the previously requested media track’s muted  property is set to true, and there is no way to programmatically unmute it. Data will still be sent along a peer connection, but it’s not of much use to the other party with the track muted! This limitation is currently expected behavior on iOS. https://webrtchacks.com/guide-to-safari-webrtc/

    $(window).focus(function (e) {
        console.log("focused");
        myp5.getAudioInput();
    });

    function resizeCanvas() {
        var sketchContainer = document.getElementById('sketch-container');
        var positionInfo = sketchContainer.getBoundingClientRect();
        var containerHeight = positionInfo.height;
        var containerWidth = positionInfo.width;
        myp5.windowResized(containerWidth, containerHeight);

    }

    //Set sketch variables according to ui menu settings on load
    myp5.myColor = $('#lowMidColor').val();
    myp5.highMidColor = $('#highMidColorPicker').val();
    myp5.strokeWidth = $("#stroke-weight-picker").val();




    /////////Action buttons/////////
    //Settings button (Opens settings menu)
    $("#buttonX").on("click", function () {
        $("#toggler").toggle("slide", {}, 100);
    });

    //Make settings menu draggable
    $("#gui").draggable();

    //Camera button
    $("#camera").on("click", function () {
        //?Not working on andoird chrome
        alert("Hello! Camera button was pressed!");
       // $(".ui-dialog-titlebar").hide();
        //Code for setting local storage item from: https://jsfiddle.net/h5q7pe3m/1/
        //Sets local storage item so user won't be asked again to confirm saving an image
        $(".no").on("click", function () {
           // localStorage.setItem('hideAlert2', true);
            sessionStorage.setItem('hideAlert2', true);
        });
       // if (!localStorage.hideAlert2 || localStorage == null) {
        if (!sessionStorage.hideAlert2 || !isMobile) {
            $(function () {
                myp5.noLoop();
                //Dialog opens to confirm the user wants to save a picture
                //if yes it calls the myp5 function capture()
                //If no closes dialog box
                $("#dialog-confirm").dialog({
                    autoOpen: true,
                    resizable: false,
                    height: "auto",
                    width: 300,
                    closeOnEscape: true,
                    //?why doesn't modal:true freeze sketch
                    modal: true,
                    buttons: {
                        "Save": function () {
                            myp5.capture();
                            $(this).dialog("close");
                            myp5.loop();
                        },
                        Cancel: function () {
                            $(this).dialog("close");
                            myp5.loop();
                        }
                    },
                    //position: "center" 
                });
            });
        } else {
            //  {
            myp5.capture();
        }
    });

    //More information button
    $('#informationButton').on('click', function () {
        // let vis = record if settings menu was open when more information button was clicked.
        let vis = $("#toggler").is(":visible");
        let hid = $("#toggler").is(":hidden");
        //Show the modal
        if ($("#information-modal").is(":hidden")) {
            $('#information-modal').modal('show');
        }
        //Pause sketch while modal is showing.
        myp5.noLoop();
        //If settings menu was open, hide it.
        if (vis) {
            $("#toggler").hide();
        }
        $('#information-modal').on('hidden.bs.modal', function () {
            //if the settings menu was open when more information button was clicked, show it again.
            //?Always is true? Except the first time.
            if (vis && !hid) {
                $("#toggler").show();
            }
            //Play sketch when modal is closed.
            myp5.loop();
        });
    });

    //Settings button (Opens settings menu)
    $("#fullScreenButton").on("click", function () {
        //?On Android samsung internet browser launches into fullscreen when opened
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
        let sketchContainer = document.getElementById("sketch-container");
        launchIntoFullscreen(sketchContainer);
    });

    /////////Settings Menu//////////
    //For changing sketch variables 

    $("#close-settings").on("click", function () {
        $("#toggler").toggle("slide", {}, 100);
    });

    //Background Color radio
    $('input[type="radio"]').on('click change', function (e) {
        let bgCol = document.querySelector('input[name="backgroundColorRadio"]:checked').value;
        myp5.changeBackgroundColor(bgCol);
    });

    //Display lines checkbox
    document.getElementById("linesCheckbox").onchange = function () {
        if (this.checked == true) {
            myp5.lines = true;
        } else {
            myp5.lines = false;
        }
    }

    //Shape mode checkbox
    document.getElementById("shapeCheckbox").onchange = function () {
        if (this.checked == true) {
            myp5.shapeMode = true;
        } else {
            myp5.shapeMode = false;
        }
    }

    //To get the sensitivity value from the slider before input
    //  myp5.sensitivity = document.getElementById('sensitivity-slider').value;
    //Sensitivity slider
    let sensitivitySlider = document.getElementById("sensitivity-slider");
    sensitivitySlider.oninput = function () {
        myp5.sensitivity = this.value;
    }

    //To keep the movers moving
    // var intervalID = setInterval(randomizeSensitivity, 5000);
    /* let randomSensitivity = (function (sens_) {
         let min = 1;
         let max = 4;
         let sens = sens_
         let randomNumber = Math.floor(Math.random() * (max - min)) + min;
         let randomSensitivity_ = sens + randomNumber;
         console.log("r" + randomSensitivity_);
         return randomSensitivity_;
     })();
 
     let intervalID = setInterval(randomSensitivity, 5000, myp5.sensitivity);
 */

    //randomizeSensitivty to replicate moving the sensitivity slider, which seems to help if the movers get stuck.
    let intervalID = setInterval(randomizeSensitivity, 5000);
    function randomizeSensitivity() {
        let min = 1;
        let max = 5;
        let sens_ = myp5.sensitivty;
        let randomNumber = Math.floor(Math.random() * (max - min)) + min;
        let randomSensitivity = sens_ + randomNumber;
        myp5.sensitvity = randomSensitivity;
        // console.log("new sensitivity:" + myp5.sensitivity);
    }

    //Stroke Weight slider
    let SWslider = document.getElementById("stroke-weight-picker");
    SWslider.oninput = function () {
        myp5.strokeWidth = this.value;
    }

    //Low mid movers color picker
    let lowMidColor = document.getElementById("lowMidColor");
    lowMidColor.oninput = function () {
        myp5.myColor = this.value;
    }

    //High mid movers color picker
    let highMidColorPicker = document.getElementById("highMidColorPicker");
    highMidColorPicker.oninput = function () {
        myp5.highMidColor = this.value;
    }

    //Display high mid movers checkbox
    document.getElementById("highMidCheckbox").onchange = function () {
        if (this.checked == true) {
            myp5.displayHighMid = true;
        } else {
            myp5.displayHighMid = false;
        }
    }

    //Topspeed slider
    let topspeedSlider = document.getElementById("topspeed-slider");
    topspeedSlider.oninput = function () {
        myp5.topspeed2 = Math.floor(topspeedSlider.value);
    }

}

//? Doesn't seem to be working 
if ("onpagehide" in window) {
    window.addEventListener("pageshow", myLoadHandler, false);
    window.addEventListener("pagehide", myUnloadHandler, false);
} else {
    window.addEventListener("load", myLoadHandler, false);
    window.addEventListener("unload", myUnloadHandler, false);
    window.addEventListener("beforeunload", myUnloadHandler, false);
}

function myUnloadHandler(evt) {
    if (evt.persisted) {
        localStorage.removeItem('hideAlert2');
        return;
    }
    localStorage.removeItem('hideAlert2');

}
//Code from: https://stackoverflow.com/questions/9943220/how-to-delete-a-localstorage-item-when-the-browser-window-tab-is-closed#targetText=Using%20vanilla%20JavaScript%20you%20could,the%20close%20window%2Ftab%20action.
//when browser closed - remove local storage item from image save dialog confirmation

$(window).on("unload", function (e) {
   // localStorage.removeItem('hideAlert2');
});
