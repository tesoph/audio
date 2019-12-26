//Audio Visualizer

//The audio visualizer sketch is created in instance mode and attached to the DOM element #sketch-container
let audioVisualizer = new p5(audioVisualizerSketch, document.getElementById("sketch-container"));

//Toolbar
let myToolbar = new toolbar();

//Settings Menu
let mySettingsMenu = new settingsMenu();

/*ettingsMenu.popovers();
settingsMenu.closeMenu();
settingsMenu.setTheme();
settingsMenu.displayLines();
settingsMenu.toggleShapeMode();
settingsMenu.setSensitivity();
settingsMenu.setStrokeWeight();
settingsMenu.setMoverColor();
settingsMenu.displayHighMidMovers();
settingsMenu.setSpeed();
settingsMenu.setNumberOfMovers();*/

//Events

//On page load the sketch variables are set according to the DOM input values
window.addEventListener('load', function () {
    setVariables();
});

function setVariables() {
    //Uncommenting topspeed and sensitivity causes error: p5.Vector.prototype.mult: n is undefined or not a finite numbe
    // audioVisualizer.sensitivity = $('#sensitivity-slider').val();
    // audioVisualizer.topspeed2 = $('#topspeed-slider').val();
    audioVisualizer.myColor = $('#lowMidColor').val();
    audioVisualizer.strokeWidth = $("#stroke-weight-picker").val();
    audioVisualizer.highMidColor = $('#highMidColorPicker').val();
    audioVisualizer.lines = $('#linesCheckbox').is(":checked");
    audioVisualizer.shapeMode = $('#shapeCheckbox').is(":checked");
    audioVisualizer.numberOfMovers = $('#number-of-movers').val();
}

//When any location on the canvas is clicked, audioVisualizer.play() is called which toggles the sketch between pause and play
let sketchContainer = document.getElementById('sketch-container');
sketchContainer.addEventListener('click', audioVisualizer.play);

//Resizing or rotating the window resizes the sketch and re-initializes movers according to new canvas dimensions
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);
function resizeCanvas() {
    let canvasSize = audioVisualizer.getCanvasSize();
    audioVisualizer.resizeCanvas(canvasSize.x, canvasSize.y);
    audioVisualizer.initializeMovers(canvasSize.x, canvasSize.y);
}
//https://webrtchacks.com/guide-to-safari-webrtc/
//BUG FIX: for issue on safari when leaving the tab and then returning, the audio stream would be muted and a new stream created which wasn't linked to the FFT object
//When the window is focused, audioVisualizer.getAudioInput() to create a new audio stream which the sketch then analyzes
//? How to check for/remove old muted streams?
$(window).focus(function (e) {
    console.log("focused");
    audioVisualizer.getAudioInput();
});
