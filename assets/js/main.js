//https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
// We listen to the resize event


//window.onresize = function() {
//document.body.height = window.innerHeight;
//}
//window.onresize(); // called to initially set the height.
//Get the height and width of the container so to set the canvas width and height 
var element = document.getElementById('container');
var positionInfo = element.getBoundingClientRect();
var containerHeight = positionInfo.height;
var containerWidth = positionInfo.width;
console.log("h:" + containerHeight);

//Popovers (doesn't work -conflict between jquery UI js and bootstrap js)
$(function () {
    $('[data-toggle="popover"]').popover()
})
$('.popover-dismiss').popover({
    trigger: 'focus'
})

//Create sketch and attach it to #container div
var myp5 = new p5(sketch, document.getElementById("container"));

var elem = document.getElementById("container");
if (elem.requestFullscreen) {
    elem.requestFullscreen();
}
window.onload = function () {

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    function resizeCanvas() {

        ///////////////???????timeout?

        // We execute the same script as before
        //let vh = window.innerHeight * 0.01;
        //document.documentElement.style.setProperty('--vh', `${vh}px`); 
        var element = document.getElementById('container');
        var positionInfo = element.getBoundingClientRect();
        var containerHeight = positionInfo.height;
        var containerWidth = positionInfo.width;
        console.log("h:" + containerHeight);
        // myp5.resizeCanvas(window.innerWidth, window.innerHeight);
        myp5.windowResized(containerWidth, containerHeight);
        // window.setTimeout(myp5.windowResized(containerWidth, containerHeight), 2*1000);
        //  myp5.windowResized(containerWidth, containerHeight);

        // var myp5 = new p5(sketch, document.getElementById("container"));
    }

    //autoOpen:false stops the confirmation dialog from appearing on page load
    $("#dialog-confirm").dialog({
        autoOpen: false,
    });

    //Set color variables according to ui menu settings on load
    myp5.c = $('#lowMidColor').val();
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
        $(".ui-dialog-titlebar").hide();
        //First have to change the autoOpen setting
        // Getter
        var autoOpen = $("#dialog-confirm").dialog("option", "autoOpen");
        // Setter
        $("#dialog-confirm").dialog("option", "autoOpen", true);
        //Code for setting local storage item from: https://jsfiddle.net/h5q7pe3m/1/
        $(".no").on("click", function () {
            localStorage.setItem('hideAlert', true);
        });
        if (!localStorage.hideAlert) {
            $(function () {
                myp5.noLoop();
                //Dialog opens to confirm the user wants to save a picture
                //if yes it calls the myp5 function capture()
                //If no closes dialog box
                $("#dialog-confirm").dialog({
                    resizable: false,
                    height: "auto",
                    width: 300,
                    //why doesn't modal:true freeze sketch
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
                    }
                });
            });
        } else {
            myp5.capture();
        }
    });

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
    //Settings button (Opens settings menu)
    $("#fullScreenButton").on("click", function () {
        let elem = document.getElementById("container");
        launchIntoFullscreen(elem);
    });

    /////////Settings Menu//////////
    $("#close-settings").on("click", function () {
        $("#toggler").toggle("slide", {}, 100);
    });
    
    //Display lines checkbox
    document.getElementById("linesCheckbox").onchange = function () {
        if (this.checked == true) {
            console.log("display lines checked");
            myp5.lines = true;
        } else {
            console.log("display lines unchecked")
            myp5.lines = false;
        }
    }

    //Shape mode checkbox
    document.getElementById("shapeCheckbox").onchange = function () {
        if (this.checked == true) {
            console.log("shape mode checked");
            myp5.shapeMode = true;
        } else {
            console.log("shape mode unchecked")
            myp5.shapeMode = false;
        }
    }

    //Sensitivity slider
    let sensitivitySlider = document.getElementById("sensitivity-slider");
    sensitivitySlider.oninput = function () {
        myp5.sensitivity = this.value;
    }

    //Stroke Weight slider
    let SWslider = document.getElementById("stroke-weight-picker");
    SWslider.oninput = function () {
        myp5.strokeWidth = this.value;
    }

    //Low mid movers color picker
    let lowMidColor = document.getElementById("lowMidColor");
    lowMidColor.oninput = function () {
        myp5.c = this.value;
    }

    //High mid movers color picker
    let highMidColorPicker = document.getElementById("highMidColorPicker");
    highMidColorPicker.oninput = function () {
        highMidColor = this.value;
    }

}//END ONLOAD

//Code from: https://stackoverflow.com/questions/9943220/how-to-delete-a-localstorage-item-when-the-browser-window-tab-is-closed#targetText=Using%20vanilla%20JavaScript%20you%20could,the%20close%20window%2Ftab%20action.
//when browser closed - remove local storage item from image save dialog confirmation
$(window).on("unload", function (e) {
    localStorage.removeItem('hideAlert');
});
