let sketchContainer = document.getElementById('sketch-container');
let positionInfo = sketchContainer.getBoundingClientRect();
let containerHeight = positionInfo.height;
let containerWidth = positionInfo.width;

//Create a sketch instance and attach it to the container
var myp5 = new p5(sketch, document.getElementById("sketch-container"));

window.addEventListener('load', function () {
    //Set sketch variables according to the settings input values
    setVariables();
})

function setVariables() {
    //Uncommenting topspeed and sensitivity causes issues
    // myp5.sensitivity = $('#sensitivity-slider').val();
    myp5.myColor = $('#lowMidColor').val();
    myp5.strokeWidth = $("#stroke-weight-picker").val();
    myp5.highMidColor = $('#highMidColorPicker').val();
    myp5.lines = $('#linesCheckbox').is(":checked");
    myp5.shapeMode = $('#shapeCheckbox').is(":checked");
    // myp5.topspeed2 = $('#topspeed-slider').val();
    myp5.numberOfMovers = $('#number-of-movers').val();
    console.log("a");
}

sketchContainer.addEventListener('click', play);

function play() {
    let playButton = document.getElementById("play");
    if (myp5.playing) {
        playButton.style.display = "inline";
        myp5.playing = false;
        myp5.noLoop();
    } else {
        playButton.style.display = "none";
        //Audio context must be started by a user gesture on the page
        if (myp5.getAudioContext().state !== 'running') {
            myp5.userStartAudio();
        }
        myp5.playing = true;
        myp5.loop();
    }
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);

function resizeCanvas() {
    let sketchContainer = document.getElementById('sketch-container');
    let positionInfo = sketchContainer.getBoundingClientRect();
    let containerHeight = positionInfo.height;
    let containerWidth = positionInfo.width;
    myp5.resizeCanvas(containerWidth, containerHeight);
    myp5.initializeMovers(containerWidth, containerHeight);
}

//https://webrtchacks.com/guide-to-safari-webrtc/
//Fix for issue on safari when leaving the tab and then returning, the audio stream would be muted and a new stream created which wasn't linked to the FFT object
$(window).focus(function (e) {
    console.log("focused");
    getAudioInput();
});

function getAudioInput() {
    //Audio input comes from the microphone
    myp5.mic;
    myp5.mic = new p5.AudioIn()
    myp5.mic.start();
    //FFT object analyzes the audio input
    myp5.fft = new p5.FFT();
    myp5.fft.setInput(myp5.mic);
    myp5.peakDetect = new p5.PeakDetect();
    myp5.peakDetect.update(myp5.fft);
}

/////////Action buttons/////////
//Settings button (Opens settings menu)
$("#settingsButton").on("click", function () {
    $("#toggler").toggle();
});

//Camera button
$("#cameraButton").on("click", function () {
    //Generate unique filename for each image saved so that a previous image is not overwritten
    //https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    let r = Math.random().toString(36).substring(7);
    let filename = `Audio-${r}.jpg`;
    myp5.saveCanvas(myp5.cnv, filename);
});

//More information button
$('#informationButton').on('click', function () {
    // let vis = record if settings menu was open when more information button was clicked.
    let vis = $("#toggler").is(":visible");
    //Show the modal
    if ($("#information-modal").is(":hidden")) {
        $('#information-modal').modal('show');
    }
    //Pause sketch while modal is showing.
    myp5.noLoop();
    //If settings menu was open when the information button was clicked, hide it
    if (vis) {
        $("#toggler").hide();
    }
    $('#information-modal').on('hidden.bs.modal', function () {
        //if the settings menu was open when more information button was clicked, show it again. 
        if (vis === true) {
            $("#toggler").show();
        }
        //reset vis to false on close
        vis = false;
        //Play sketch when modal is closed.
        myp5.loop();
    });
});

//FullScreen Button
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

/////////Settings Menu//////////
//For changing sketch variables 
//Enable popovers everywhere
$(function () {
    $('[data-toggle="popover"]').popover()
})

//Enable popover dismiss on next click:
$('.popover-dismiss').popover({
    trigger: 'focus'
})

//Close the settings menu
$("#close-settings").on("click", function () {
    $("#toggler").toggle();
});

//Background Color radio
$('input[type="radio"]').on('click change', setBackgroundColor);

function setBackgroundColor() {
    let bgCol = document.querySelector('input[name="backgroundColorRadio"]:checked').value;
    if (bgCol === "white") {
        myp5.backgroundColor = myp5.color(255, 255, 255, 5);
        myp5.strokeColor = myp5.color(0, 0, 0);
    } else if (bgCol === "black") {
        myp5.backgroundColor = myp5.color(0, 0, 0, 5);
        myp5.strokeColor = myp5.color(255, 255, 255);
    }
}

//Display lines checkbox
let linesCheckbox = document.getElementById("linesCheckbox");

linesCheckbox.onchange = function () {
    displayLines();
}

function displayLines() {
    if ($('#linesCheckbox').is(":checked")) {
        myp5.lines = true;
    } else {
        myp5.lines = false;
    }
}

/*
//Display lines checkbox
document.getElementById("linesCheckbox").onchange = function () {
    if (this.checked) {
        myp5.lines = true;
    } else {
        myp5.lines = false;
    }
}
*/

//Shape mode checkbox
document.getElementById("shapeCheckbox").onchange = function () {
    if (this.checked) {
        myp5.shapeMode = true;
    } else {
        myp5.shapeMode = false;
    }
}

let sensitivitySlider = document.getElementById("sensitivity-slider");

sensitivitySlider.onchange = function () {
    changeSensitivity();
}

function changeSensitivity() {
    myp5.sensitivity = sensitivitySlider.value;
}

//RandomizedSensitivity to replicate moving the sensitivty slider which seemed to help if a mover got stuck 
setInterval(randomizeSensitivity, 5000);

function randomizeSensitivity() {
    let sens = myp5.sensitivity;
    sens += getRandomNumber() / 2;
    console.log("new sensitivity:" + sens);
}

function getRandomNumber() {
    let min = -1;
    let max = +2;
    let randomNo = Math.floor(Math.random() * (max - min)) + min;
    if (randomNo === 0) {
        randomNo = 1;
    }
    console.log(randomNo);
    return randomNo;
}

//Stroke Weight Slider
let SWslider = document.getElementById("stroke-weight-picker");
SWslider.oninput = changeStrokeWeight;
function changeStrokeWeight(event) {
    myp5.strokeWidth = event.target.value;
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

//No. of movers
let numMovers = document.getElementById("number-of-movers");
numMovers.oninput = function () {
    myp5.numberOfMovers = Math.floor(numMovers.value);
}





/*
//Code from: https://stackoverflow.com/questions/9943220/how-to-delete-a-localstorage-item-when-the-browser-window-tab-is-closed#targetText=Using%20vanilla%20JavaScript%20you%20could,the%20close%20window%2Ftab%20action.
//when browser closed - remove local storage item from image save dialog confirmation

$(window).on("unload", function (e) {
    // localStorage.removeItem('hideAlert2');
});

//https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

var isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

if (isMobile) {
    //alert("Mobile browser detected!");
    //Conditional script here
}

*/