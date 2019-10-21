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
    constructor(m_, x_, y_, c_) {
        this.color = c_;
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
strokeWeight(strokeWidth);
       // fill(this.color);
        if(shapeMode==false){
       ellipse(this.location.x, this.location.y, this.mass * 10, this.mass * 10);
        }
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
//var button;
//Boolean variable if true runs the code inside draw
var playing;
let threshold = 80;
//Checkbox to display lines or not
let checkboxLines;
var lines;
let cnv

let captureButton;

let shapeMode=false;
let shapeCheckbox;


var strokeWidth;

let red;
let c;
let highMidColor;

let playImg;
let pauseImg;
w=width;
h=height;
function preload() {
  
    //
}

function setup() {

    playImg = loadImage('assets/img/play.png');
    pauseImg = loadImage('assets/img/pause.PNG');
  //  frameRate( 30 );
    highMidColor=color(255,0,0);
    red = color(255,0,0);
    c=color(0,255,0);
    
    strokeWidth=2;

  captureButton = createButton(" ");
  captureButton.mousePressed(capture);
  captureButton.parent("capture");
  captureButton.style("background:red;color:black;border-radius:50%;width:50px;height:50px;")

    slider = createSlider(0, 255, 80, 1);

    slider.parent("threshold");
    // sliderRange(0, 1000, 10);

    checkboxLines = createCheckbox('Display lines', false);
    checkboxLines.parent("lines");
    checkboxLines.changed(lines);
    lines=false;
    shapeCheckbox = createCheckbox('Shape mode', false);
    shapeCheckbox.parent("shape");
    shapeCheckbox.changed(shape);
    shapeMode=false;
    //Canvas width and height are related to the width and height of the display
   // w = displayWidth / 1.1;
   // h = displayHeight / 1.5;
//w= windowWidth;
//h=windowHeight;

    //initial value is false
    playing = false;

    //creating a canvas and attaching it to the #container div in index.html
  //   cnv = createCanvas(w, h);
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
  //  button = select("#play");
  //  button.mousePressed(togglePlaying);
 cnv.mousePressed(togglePlaying);
    //paused-text settings
    textSize(width / 10);
    textAlign(CENTER, CENTER);

    //Declare attractor object.
    a = new Attractor();

    // var gravity = createVector(0, 0.1);

    // peakDetect = new p5.PeakDetect(1000, 20000, 0.2);
 
    //Create an array of mover objects
    for (let i = 0; i < 5; i++) {
        moversLowMid[i] = new Mover(2, w / 2 + random(-10, 10), h / 2, c);
        moversHighMid[i] = new Mover(2, w / 2 + random(-10, 10), h / 2, highMidColor);
    }
}

function draw() {
    

    let zzz = slider.value();
    //backwards so the slider makes sense
    threshold = map(zzz,0,255,200,20);
    if (playing === true) {
        var spectrum = fft.analyze();
        var highMid = fft.getEnergy("highMid");
        var lowMid = fft.getEnergy("lowMid");
        // var treble = fft.getEnergy("treble");
        var bass = fft.getEnergy("bass");
        // var mid = fft.getEnergy("mid");

        //radius of center ellipse is mapped to the amplitude of the bass frequency
        var bassMap = map(bass, 0, 255, 20, 500);
        var bassMap2 = map(bass, 0, 255, 5, 100);
        noFill();
        ellipse(w / 2, h / 2, bassMap, bassMap);
        fill(255);
        ellipse(w / 2, h / 2, bassMap2, bassMap2);
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
            fill(c);
           // print(c);
            //Movers reverse direction when they meet the edge of the canvas
            moversLowMid[i].checkEdges();
            moversLowMid[i].update();
            moversLowMid[i].display();

            fill(highMidColor);
            moversHighMid[i].checkEdges();
            moversHighMid[i].update();
           
         //   print(highMidColor);
            moversHighMid[i].display();
            fill(255);
        }
if(shapeMode){
    noFill();
       beginShape();
     for (let i = 0; i < 5; i++) {
          vertex( moversLowMid[i].location.x,moversLowMid[i].location.y);
       }
       endShape();
}
    }
    //Paused canvas
    else if (playing == false && getAudioContext().state == "running") {
        background(0);
       // text("paused", width / 2, height / 2);
       imageMode(CENTER);
        image(playImg, w/2, h/2, playImg.width / 2, playImg.height / 2);
    }
    //Pre-start canvas
    else {
        background(0);
        imageMode(CENTER);
        image(playImg, w/2, h/2, playImg.width / 2, playImg.height / 2);
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

function lines() {
    if (this.checked()) {
      console.log('Checking!');
      lines=true;
    } else {
        lines=false;
      console.log('Unchecking!');
    }
  }

function shape() {
    if (this.checked()) {
      console.log('Checking!');
      shapeMode=true;
    } else {
        shapeMode=false;
      console.log('Unchecking!');
    }
  }
function capture(){
    saveCanvas(cnv, 'myCanvas.jpg');
}
  function keyPressed() {
      
    if (keyCode === 32) {
        //saveCanvas(cnv, 'myCanvas.jpg');
        print("HIGH:" + highMidColor + " LOW:" + c)
    } else if (keyCode === RIGHT_ARROW) {
      print("hello");
    }
  }

function analyze() {

}
