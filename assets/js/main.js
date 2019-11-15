let sketchContainer = document.getElementById('sketch-container');
let positionInfo = sketchContainer.getBoundingClientRect();
let containerHeight = positionInfo.height;
let containerWidth = positionInfo.width;

//Create a sketch instance and attach it to the container
var audioVisualizer = new p5(sketch, document.getElementById("sketch-container"));

window.addEventListener('load', function () {
    //Set sketch variables according to the settings input values
    setVariables();
})

function setVariables() {
    //Uncommenting topspeed and sensitivity causes issues
    // audioVisualizer.sensitivity = $('#sensitivity-slider').val();
    audioVisualizer.myColor = $('#lowMidColor').val();
    audioVisualizer.strokeWidth = $("#stroke-weight-picker").val();
    audioVisualizer.highMidColor = $('#highMidColorPicker').val();
    audioVisualizer.lines = $('#linesCheckbox').is(":checked");
    audioVisualizer.shapeMode = $('#shapeCheckbox').is(":checked");
    // audioVisualizer.topspeed2 = $('#topspeed-slider').val();
    audioVisualizer.numberOfMovers = $('#number-of-movers').val();
    console.log("a");
}

sketchContainer.addEventListener('click', play);

function play() {
    let playButton = document.getElementById("play");
    if (audioVisualizer.playing) {
        playButton.style.display = "inline";
        audioVisualizer.playing = false;
        audioVisualizer.noLoop();
    } else {
        playButton.style.display = "none";
        //Audio context must be started by a user gesture on the page
        if (audioVisualizer.getAudioContext().state !== 'running') {
            audioVisualizer.userStartAudio();
        }
        audioVisualizer.playing = true;
        audioVisualizer.loop();
    }
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);

function resizeCanvas() {
    let sketchContainer = document.getElementById('sketch-container');
    let positionInfo = sketchContainer.getBoundingClientRect();
    let containerHeight = positionInfo.height;
    let containerWidth = positionInfo.width;
    audioVisualizer.resizeCanvas(containerWidth, containerHeight);
    audioVisualizer.initializeMovers(containerWidth, containerHeight);
}

//https://webrtchacks.com/guide-to-safari-webrtc/
//Fix for issue on safari when leaving the tab and then returning, the audio stream would be muted and a new stream created which wasn't linked to the FFT object
$(window).focus(function (e) {
    console.log("focused");
    getAudioInput();
});

function getAudioInput() {
    //Audio input comes from the microphone
    audioVisualizer.mic;
    audioVisualizer.mic = new p5.AudioIn()
    audioVisualizer.mic.start();
    //FFT object analyzes the audio input
    audioVisualizer.fft = new p5.FFT();
    audioVisualizer.fft.setInput(audioVisualizer.mic);
    audioVisualizer.peakDetect = new p5.PeakDetect();
    audioVisualizer.peakDetect.update(audioVisualizer.fft);
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
    audioVisualizer.saveCanvas(audioVisualizer.cnv, filename);
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
    audioVisualizer.noLoop();
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
        audioVisualizer.loop();
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
        audioVisualizer.backgroundColor = audioVisualizer.color(255, 255, 255, 5);
        audioVisualizer.strokeColor = audioVisualizer.color(0, 0, 0);
    } else if (bgCol === "black") {
        audioVisualizer.backgroundColor = audioVisualizer.color(0, 0, 0, 5);
        audioVisualizer.strokeColor = audioVisualizer.color(255, 255, 255);
    }
}

//Display lines checkbox
let linesCheckbox = document.getElementById("linesCheckbox");

linesCheckbox.onchange = function () {
    displayLines();
}

function displayLines() {
    if ($('#linesCheckbox').is(":checked")) {
        audioVisualizer.lines = true;
    } else {
        audioVisualizer.lines = false;
    }
}

/*
//Display lines checkbox
document.getElementById("linesCheckbox").onchange = function () {
    if (this.checked) {
        audioVisualizer.lines = true;
    } else {
        audioVisualizer.lines = false;
    }
}
*/

//Shape mode checkbox
document.getElementById("shapeCheckbox").onchange = function () {
    if (this.checked) {
        audioVisualizer.shapeMode = true;
    } else {
        audioVisualizer.shapeMode = false;
    }
}

let sensitivitySlider = document.getElementById("sensitivity-slider");

sensitivitySlider.onchange = function () {
    changeSensitivity();
}

function changeSensitivity() {
    audioVisualizer.sensitivity = sensitivitySlider.value;
}

//RandomizedSensitivity to replicate moving the sensitivty slider which seemed to help if a mover got stuck 
setInterval(randomizeSensitivity, 5000);

function randomizeSensitivity() {
    let sens = audioVisualizer.sensitivity;
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
    audioVisualizer.strokeWidth = event.target.value;
}

//Low mid movers color picker
let lowMidColor = document.getElementById("lowMidColor");
lowMidColor.oninput = function () {
    audioVisualizer.myColor = this.value;
}

//High mid movers color picker
let highMidColorPicker = document.getElementById("highMidColorPicker");
highMidColorPicker.oninput = function () {
    audioVisualizer.highMidColor = this.value;
}

//Display high mid movers checkbox
document.getElementById("highMidCheckbox").onchange = function () {
    if (this.checked == true) {
        audioVisualizer.displayHighMid = true;
    } else {
        audioVisualizer.displayHighMid = false;
    }
}

//Topspeed slider
let topspeedSlider = document.getElementById("topspeed-slider");
topspeedSlider.oninput = function () {
    audioVisualizer.topspeed2 = Math.floor(topspeedSlider.value);
}

//No. of movers
let numMovers = document.getElementById("number-of-movers");
numMovers.oninput = function () {
    audioVisualizer.numberOfMovers = Math.floor(numMovers.value);
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