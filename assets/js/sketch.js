//Code for attraction and repulsion forces adapted from Nature of Code chapters 1-3

let w;
let h;

class Attractor {
    //Our Attractor is a simple object that doesn’t move. We just need a mass and a location.
    constructor() {
        this.location = createVector(width / 2, height / 2);
        this.mass = 60;
        this.velocity = createVector(1, 2);
        this.g = 1;
    }

    display() {
        stroke(0);
        fill(175, 200);
        ellipse(this.location.x, this.location.y, 20, 20);
    }
    update() {
        this.location.add(this.velocity);
    }


    checkEdges() {
        if (this.location.x > w) {
            this.velocity.x *= -1;
        } else if (this.location.x < 0) {
            this.velocity.x *= -1;
        }

        if (this.location.y > h) {
            this.velocity.y *= -1;
        } else if (this.location.y < 0) {
            this.velocity.y *= -1;
        }

    }

    attract(m) {
        var force = p5.Vector.sub(this.location, m.location);
        var distance = force.mag();
        distance = constrain(distance, 5, 25);
        force.normalize();
        //What’s the force’s magnitude?
        var strength = (this.g * this.mass * m.mass) / (distance * distance);
        force.mult(strength);

        //Return the force so that it can be applied!
        return force;
    }

    repel(m) {
        var force = p5.Vector.sub(m.location, this.location);
        var distance = force.mag();
        distance = constrain(distance, 5, 25);
        force.normalize();
        //What’s the force’s magnitude?
        var strength = (this.g * this.mass * m.mass) / (distance * distance);
        force.mult(strength);

        //Return the force so that it can be applied!
        return force;
    }

}


class Mover {
    constructor(m_, x_, y_, r_, g_, b_) {
        this.color = color(r_, g_, b_);
        this.location = createVector(x_, y_);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(-0.001, 0.01);
        this.topspeed = 5;
        this.mass = m_;
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.topspeed);
        this.location.add(this.velocity);
        this.acceleration.mult(0);
    }

    display() {
        stroke(255);

        fill(this.color);
       ellipse(this.location.x, this.location.y, this.mass * 10, this.mass * 10);
       if(lines){
        line(width / 2, height / 2, this.location.x, this.location.y);
       }
        fill(255);
    }
    applyForce(force) {
        var f = p5.Vector.div(force, this.mass);
        this.acceleration.add(f);
    }

    checkEdges() {
        if (this.location.x > w) {
            this.velocity.x *= -1;
            //     this.acceleration.x *= -1;
        } else if (this.location.x < 0) {
            this.velocity.x *= -1;
            //     this.acceleration.x *= -1;
        }

        if (this.location.y > h) {
            this.velocity.y *= -1;
            // this.acceleration.y *= -1;
        } else if (this.location.y < 0) {
            this.velocity.y *= -1;
            //   this.acceleration.y *= -1;
        }

    }
}

//Arrays of movers
let moversLowMid = [];
let moversHighMid = [];
//Controls the threshold variable
var slider;
//Play/pause button
var button;
//Boolean variable if true runs the code inside draw
var playing;
let threshold = 80;
//Checkbox to display lines or not
let checkbox;
var lines;
let cnv
function preload() {
    //
}

function setup() {
 
    slider = createSlider(0, 255, 80, 1);
    slider.position(10, 10);
    slider.style("display:block; position:static;");
    slider.parent("threshold");
    // sliderRange(0, 1000, 10);

    checkbox = createCheckbox('Display lines', false);
    checkbox.parent("lines");
    checkbox.changed(myCheckedEvent);
    lines=false;
    //Canvas width and height are related to the width and height of the display
    w = displayWidth / 1.1;
    h = displayHeight / 1.5;

    //initial value is false
    playing = false;

    //creating a canvas and attaching it to the #container div in index.html
     cnv = createCanvas(w, h);
    cnv.parent("container");
    background(0);

    //Audio input comes from the microphone
    var mic;
    mic = new p5.AudioIn()
    mic.start();

    //FFT object analyzes the audio input
    fft = new p5.FFT();
    fft.setInput(mic);
    peakDetect = new p5.PeakDetect(1000, 20000, 0.2);

    //Play/pause button when pressed calls function togglePlaying
    button = select("#play");
    button.mousePressed(togglePlaying);

    //paused-text settings
    textSize(width / 10);
    textAlign(CENTER, CENTER);

    //Declare attractor object.
    a = new Attractor();

    // var gravity = createVector(0, 0.1);

    // peakDetect = new p5.PeakDetect(1000, 20000, 0.2);

    //Create an array of mover objects
    for (let i = 0; i < 5; i++) {
        moversLowMid[i] = new Mover(2, w / 2 + random(-10, 10), h / 2, 255, 0, 0);
        moversHighMid[i] = new Mover(2, w / 2 + random(-10, 10), h / 2, 0, 255, 0);
    }
}

function draw() {
    threshold = slider.value();
    if (playing === true) {
        var spectrum = fft.analyze();
        var highMid = fft.getEnergy("highMid");
        var lowMid = fft.getEnergy("lowMid");
        // var treble = fft.getEnergy("treble");
        var bass = fft.getEnergy("bass");
        // var mid = fft.getEnergy("mid");

        //radius of center ellipse is mapped to the amplitude of the bass frequency
        var bassMap = map(bass, 0, 255, 50, 300);
        ellipse(w / 2, h / 2, bassMap, bassMap);

        //   peakDetect.update(fft);

        //Creating a gradual fade effect on the background 
        noStroke();
        fill(0, 0, 0, 5);
        rect(0, 0, width, height);
        stroke(0);

        fill("white");

        //Loop through the array of movers
        for (let i = 0; i < 5; i++) {
            //Movers are attracted to the Attractor object in center of canvas
            var f = a.attract(moversLowMid[i]);
            var x = a.attract(moversHighMid[i]);
            f.normalize();
            f.mult(1);
            x.normalize();
            x.mult(1);
            moversLowMid[i].applyForce(f);
            moversHighMid[i].applyForce(x);

            //If a certain frequency is above a certain amplitude threshold the movers are repelled by the attractor object
            if (lowMid > threshold) {
                var t = a.repel(moversLowMid[i]);
                t.normalize();
                t.mult(1);
                moversLowMid[i].applyForce(t);
            }
            if (highMid > threshold) {
                //below commented out code has interesting effect
                // var t = a.repel(moversLowMid[i]);
                var t = a.repel(moversHighMid[i]);
                t.normalize();
                t.mult(1);
                moversHighMid[i].applyForce(t);
            }

            //Movers reverse direction when they meet the edge of the canvas
            moversLowMid[i].checkEdges();
            moversLowMid[i].update();
            moversLowMid[i].display();

            moversHighMid[i].checkEdges();
            moversHighMid[i].update();
            moversHighMid[i].display();
        }

       // beginShape();
       // for (let i = 0; i < 5; i++) {
        //    vertex( moversLowMid[i].location.x,moversLowMid[i].location.y);
      //  }
       // endShape();
    }
    //Paused canvas
    else if (playing == false && getAudioContext().state == "running") {
        background(150);
        text("paused", width / 2, height / 2);
    }
    //Pre-start canvas
    else {
        background(0);
    }
}

function togglePlaying() {

    //Start Audio context on user gesture
    if (getAudioContext().state !== 'running') {
        userStartAudio();
    }
    if (playing == true) {
        playing = false;
    } else if (playing == false) {
        //clear the background (to remove "paused" text)
        background(0);
        playing = true;
    }
}

function myCheckedEvent() {
    if (this.checked()) {
      console.log('Checking!');
      lines=true;
    } else {
        lines=false;
      console.log('Unchecking!');
    }
  }

  function keyPressed() {
    if (keyCode === 32) {
        saveCanvas(cnv, 'myCanvas.jpg');
    } else if (keyCode === RIGHT_ARROW) {
      print("hello");
    }
  }

function analyze() {

}
