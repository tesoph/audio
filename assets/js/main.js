//Get width and height of parent container to size the sketch canvas with
function getCanvasSize() {
    let sketchContainer = document.getElementById('sketch-container');
    let positionInfo = sketchContainer.getBoundingClientRect();
    let containerHeight = positionInfo.height;
    let containerWidth = positionInfo.width;
    return {
        x: containerWidth,
        y: containerHeight,
    };
}

//Sketch run in instance mode
let sketch = function (p) {

    //The following code for the Attractor and Mover classes is adapted from chapter 2 of the book "The Nature of Code" by Daniel Shiffman. (https://natureofcode.com/book/chapter-2-forces/)
    class Attractor {
        constructor(p_) {
            this.p = p_;
            this.location = p.createVector(p.w / 2, p.h / 2);
            this.mass = 100;
            this.velocity = p.createVector(0, 0);
            this.g = 1;
            this.acceleration = p.createVector(-0.1, 0.1);
            this.topspeed = 3;
        }

        display() {
            p.stroke(0);
            p.bassMap = p.map(p.bass, 0, 255, 20, 500);
            p.bassStrokeWeight = p.map(p.bass, 0, 255, 0, 10);
            p.noFill();
            p.strokeWeight(p.bassStrokeWeight);
            p.stroke(p.strokeColor);
            p.ellipse(this.location.x, this.location.y, p.bassMap, p.bassMap);
        }

        update() {
            this.acceleration = p5.Vector.random2D();
            this.velocity.add(this.acceleration);
            this.velocity.limit(this.topspeed);
            this.location.add(this.velocity);
            this.acceleration.mult(0);
        }

        attract(m) {
            let force = p5.Vector.sub(this.location, m.location);
            let distance = force.mag();
            distance = p.constrain(distance, 5, 25);
            force.normalize();
            //What’s the force’s magnitude?
            let strength = (this.g * this.mass * m.mass) / (distance * distance);
            force.mult(strength);
            //Return the force so that it can be applied
            return force;
        }

        repel(m) {
            let force = p5.Vector.sub(m.location, this.location);
            let distance = force.mag();
            distance = p.constrain(distance, 5, 25);
            force.normalize();
            let strength = (this.g * this.mass * m.mass) / (distance * distance);
            force.mult(strength);
            return force;
        }

        checkEdges() {
            //Reverse direction if reaches this.radius distance from edge of sketch
            if (this.location.x > p.w - 20) {
                this.velocity.x *= -1;
            } else if (this.location.x < 0 + 20) {
                this.velocity.x *= -1;
            }
            if (this.location.y > p.h - 20) {
                this.velocity.y *= -1;
            } else if (this.location.y < 0 + 20) {
                this.velocity.y *= -1;
            }
        }
    }

    class Mover {
        constructor(p_, m_, x_, y_, c_) {
            this.p = p_;
            this.color = c_;
            this.location = p.createVector(x_, y_);
            this.velocity = p.createVector(0, 0);
            this.acceleration = p.createVector(-0.001, 0.01);
            this.topspeed = 5;
            this.mass = m_;
            if (isMobile) {
                this.radius = this.mass;
            } else {
                this.radius = this.mass * 5;
            }
        }

        run() {
            this.update();
            this.display();
            this.checkEdges();
        }

        update() {
            this.velocity.add(this.acceleration);
            this.velocity.limit(p.topspeed2);
            this.location.add(this.velocity);
            this.acceleration.mult(0);
        }

        display() {
            p.strokeWeight(p.strokeWidth);
            if (p.shapeMode == false) {
                p.ellipse(this.location.x, this.location.y, this.radius, this.radius);
            }
            if (p.lines) {
                p.line(p.w / 2, p.h / 2, this.location.x, this.location.y);
            }
            p.fill(255);
        }

        applyForce(force) {
            var f = p5.Vector.div(force, this.mass);
            this.acceleration.add(f);
        }

        checkEdges() {
            //Reverse direction if reaches this.radius distance from edge of sketch
            if (this.location.x > p.w - this.radius) {
                this.velocity.x *= -1;
            } else if (this.location.x < 0 + this.radius) {
                this.velocity.x *= -1;
            }
            if (this.location.y > p.h - this.radius) {
                this.velocity.y *= -1;
            } else if (this.location.y < 0 + this.radius) {
                this.velocity.y *= -1;
            }
        }
    }
    //End of Attractor and Mover classes

    // The setup function executes once when the sketch begins
    p.setup = function () {
        let canvasSize = getCanvasSize();
        p.w = canvasSize.x;
        p.h = canvasSize.y;
        //Initial value set to false to stop sketch from playing until a user gesture on the page
        p.playing = false;
        //creating the sketch canvas with width and height from the parent container
        p.cnv = p.createCanvas(p.w, p.h);
        //drawing a plain black background to the canvas 
        p.background(p.color(0));
        //Initializing the variables
        p.initializeVariables();
        //Array of movers initialised with max (100) number of movers
        p.initializeMovers(p.w, p.h);
        //Number of movers then changed to match slider input value
        //Get the mic and attach an fft object to analyse the audio from it
        p.getAudioInput();
    };

    // The statements in draw() are executed until the program is stopped. Each statement is executed in sequence and after the last line is read, the first line is executed again.
    p.draw = function () {
        //Create a gradual fade effect on the background
        p.fadeBackground();
        p.stroke(p.strokeColor);
        //If the sketch is not paused
        if (p.playing) {
            p.analyzeAudio();
            //Display the attractor (circles in the center of the canvas whose radius is related to the volume of the bass)
            p.a.display();
            //Attract the movers to the attractor
            p.attractMovers(p.moversLowMid);
            //Repel the movers from the attractor if a certain frequency is over a certain threshold
            p.repelMovers(p.moversLowMid, p.threshold, p.lowMid);
            //Toggle display of the movers related to the high mid tone frequency
            if (p.displayHighMid) {
                p.moveMovers(p.moversHighMid, p.threshold, p.highMid);
            }
            //For each of the movers, run()
            //run() contains update, checkedges,and display methods of the mover class
            for (let i = 0; i < p.numberOfMovers; i++) {
                p.fill(p.myColor);
                p.moversLowMid[i].run();
                if (p.displayHighMid) {
                    p.fill(p.highMidColor);
                    p.moversHighMid[i].run();
                }
            }
            //shape mode
            //Attempts to make a shape based on the vertexes of the low mid tone movers
            if (p.shapeMode) {
                p.noFill();
                p.beginShape();
                for (let i = 0; i < p.numberOfMovers; i++) {
                    p.makeShapeMode(i);
                }
                p.endShape();
            }
        }
    };

    //Functions
    p.makeShapeMode = function (i_) {
        let i = i_;
        p.vertex(p.moversLowMid[i].location.x, p.moversLowMid[i].location.y);
    }

    p.initializeVariables = function () {
        //Giving the variables hardcoded values so that the sketch can run independantly of the DOM input values (?)
        p.displayHighMid = false;
        p.sensitivity = 100
        p.myColor = p.color(0, 0, 0);
        p.strokeWidth = 1
        p.highMidColor = p.color(5, 5, 5);
        p.lines = true;
        p.shapeMode = true;
        p.topspeed2 = 5;
        p.numberOfMovers = 50;
        p.moversLowMid = [];
        p.moversHighMid = [];
        p.strokeColor = p.color(5, 5, 5);
        setBackgroundColor();
        p.print("setting up variables");
    }

    p.initializeMovers = function (width_, height_) {
        p.w = width_;
        p.h = height_;
        //Use list and weight to bias the size of the movers (more small movers than large one)
        let list = [2, 4, 6, 8, 10];
        let weight = [0.3, 0.4, 0.1, 0.1, 0.1];
        //Make new attractor and movers orientated to canvas center
        p.a = new Attractor(p);
        for (let i = 0; i < 75; i++) {
            p.moversLowMid[i] = new Mover(this, getRandomItem(list, weight), p.w / 2 + p.random(-10, 10), p.h / 2, p.myColor);
            p.moversHighMid[i] = new Mover(this, 2, p.w / 2 + p.random(-10, 10), p.h / 2, p.highMidColor);
        }
    }

    // Following code for weighted random number generation from https://codetheory.in/weighted-biased-random-number-generation-with-javascript-based-on-probability// Weighted random number generation
    let rand = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    let getRandomItem = function (list, weight) {
        let total_weight = weight.reduce(function (prev, cur, i, arr) {
            return prev + cur;
        });
        let random_num = rand(0, total_weight);
        let weight_sum = 0;
        for (let i = 0; i < list.length; i++) {
            weight_sum += weight[i];
            weight_sum = +weight_sum.toFixed(2);
            if (random_num <= weight_sum) {
                return list[i];
            }
        }
    };// end of weighted random number generation

    p.getAudioInput = function () {
        //Audio input comes from the microphone
        p.mic;
        p.mic = new p5.AudioIn()
        p.mic.start();
        //FFT object analyzes the audio input
        p.fft = new p5.FFT();
        p.fft.setInput(p.mic);
        p.peakDetect = new p5.PeakDetect();
        p.peakDetect.update(p.fft);
        //    p.peakDetect.onPeak(p.triggerBeat);
    }

    p.fadeBackground = function () {
        //Creating a gradual fade effect on the background by drawing a 100% width and height slightly transparent rectangle on top of the sketch each time draw is called
        p.noStroke();
        p.fill(p.backgroundColor);
        p.rect(0, 0, p.w, p.h);
    }

    p.analyzeAudio = function () {
        p.spectrum = p.fft.analyze();
        p.highMid = p.fft.getEnergy("highMid");
        p.lowMid = p.fft.getEnergy("lowMid");
        // p.treble = p.fft.getEnergy("treble");
        p.bass = p.fft.getEnergy("bass");
        // var mid = fft.getEnergy("mid");
        //Sensitivity value from slider mapped backwards to threshold so that the amplitude can be > threshold
        p.threshold = p.map(p.sensitivity, 30, 170, 170, 30);
    }

    p.attractMovers = function (movers_) {
        let movers = movers_;
        for (let i = 0; i < p.numberOfMovers; i++) {
            p.t = p.a.attract(movers[i]);
            p.t.normalize();
            p.t.mult(1);
            movers[i].applyForce(p.t);
        }
    }

    p.repelMovers = function (movers_, threshold_, frequencyRange_) {
        //Loop through the array of movers
        let movers = movers_;
        let threshold = threshold_
        let frequencyRange = frequencyRange_;
        for (let i = 0; i < p.numberOfMovers; i++) {
            if (frequencyRange > threshold) {
                p.t = p.a.repel(movers[i]);
                p.t.normalize();
                p.t.mult(1.055);
                movers[i].applyForce(p.t);
            }
        }
    }

    p.moveMovers = function (movers_, threshold_, frequencyRange_) {
        let threshold = threshold_;
        let movers = movers_;
        let frequencyRange = frequencyRange_;
        p.attractMovers(movers);
        p.repelMovers(movers, threshold, frequencyRange);
    }
};
//End of audiovisualizer sketch

//Variable to track if the device is a mobile phone (to apply relative sizing to the movers)
let isMobile = window.matchMedia("only screen and (max-width: 576px)").matches;

//The audio visualiser sketch is created in instance mode and attached to the DOM element #sketch-container
let audioVisualizer = new p5(sketch, document.getElementById("sketch-container"));

//On load the sketch variables are set according to the DOM input values
window.addEventListener('load', function () {
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
}

//When any location on the sketch is clicked, the sketch is toggled between pause and play.
let sketchContainer = document.getElementById('sketch-container');
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

//Resizing or rotating the window resizes the sketch and re-initializes movers according to new dimensions
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);
function resizeCanvas() {
    let canvasSize =getCanvasSize();
    audioVisualizer.resizeCanvas(canvasSize.x, canvasSize.y);
    audioVisualizer.initializeMovers(canvasSize.x, canvasSize.y);
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
  //  audioVisualizer.peakDetect = new p5.PeakDetect();
    audioVisualizer.peakDetect.update(audioVisualizer.fft);
}

/////////Toolbar/////////
//Settings button (Opens settings menu)
$("#settingsButton").on("click", function () {
    $("#settings-menu").fadeToggle(250);
});

//Camera button
$("#cameraButton").on("click", function () {
    //Generate unique filename for each image saved so that a previous image is not overwritten from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    let r = Math.random().toString(36).substring(7);
    let filename = `Audio-${r}.jpg`;
    audioVisualizer.saveCanvas(audioVisualizer.cnv, filename);
});

//More information button
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
    $("#settings-menu").toggle();
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
/*
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
*/
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