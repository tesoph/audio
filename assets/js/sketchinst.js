let sketch = function (p) {

class Attractor {
    //Our Attractor is a simple object that doesn’t move. We just need a mass and a location.
    constructor(p_) {
        this.p = p_;
        this.location = p.createVector(width / 2, height / 2);
        this.mass = 60;
        this.velocity = p.createVector(1, 2);
        this.g = 1;
    }

    display() {
        p.stroke(0);
        p.fill(175, 200);
        p.ellipse(this.location.x, this.location.y, 20, 20);
    }

    update() {
        this.location.p.add(this.velocity);
    }


    attract(m) {
        var force = p5.Vector.sub(this.location, m.location);
        var distance = force.mag();
        distance = p.constrain(distance, 5, 25);
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
        distance = p.constrain(distance, 5, 25);
        force.normalize();
        //What’s the force’s magnitude?
        var strength = (this.g * this.mass * m.mass) / (distance * distance);
        force.mult(strength);

        //Return the force so that it can be applied!
        return force;
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
        }

        update() {
            this.velocity.add(this.acceleration);
            this.velocity.limit(this.topspeed);
            this.location.add(this.velocity);
            this.acceleration.mult(0);
        }

        display() {
            p.stroke(255);
            p.strokeWeight(p.strokeWidth);
            // fill(this.color);
            if (p.shapeMode == false) {
                p.ellipse(this.location.x, this.location.y, this.mass * 10, this.mass * 10);
            }
            if (p.lines) {
                p.line(width / 2, height / 2, this.location.x, this.location.y);
            }


            p.fill(255);
        }
        applyForce(force) {
            var f = p5.Vector.div(force, this.mass);
            this.acceleration.add(f);
        }

        checkEdges() {
            if (this.location.x > p.w) {
                this.velocity.x *= -1;
                //     this.acceleration.x *= -1;
            } else if (this.location.x < 0) {
                this.velocity.x *= -1;
                //     this.acceleration.x *= -1;
            }

            if (this.location.y > p.h) {
                this.velocity.y *= -1;
                // this.acceleration.y *= -1;
            } else if (this.location.y < 0) {
                this.velocity.y *= -1;
                //   this.acceleration.y *= -1;
            }

        }
    }
   
    let w=width;
    let h=height;
    p.moversLowMid = [];
    p.moversHighMid=[];
  //  for (let i = 0; i < 5; i++) {
       // p.moversLowMid[i] = new Mover(this,2, w / 2 + p.random(-10, 10), h / 2, p.c);
      //  p.moversHighMid[i] = new Mover(2, w / 2 + random(-10, 10), h / 2, highMidColor);
  //  }

    p.setup = function () {

        p.playImg = p.loadImage('assets/img/play.png');

      //  p.highMidColor = p.color(255, 0, 0);
        p.red = p.color(255, 0, 0);
     //   p.c = p.color(0, 255, 0);

        p.strokeWidth = 2;
        p.lines = false;
        p.shapeMode = false;
        p.playing = false;

        //creating a canvas and attaching it to the #container div in index.html
        //   cnv = createCanvas(w, h);
        p.cnv = p.createCanvas(w, h);
       
        p.background(0);
        p.cnv.mousePressed(p.togglePlaying);
        //Audio input comes from the microphone
        p.mic;
        p.mic = new p5.AudioIn()
        p.mic.start();

        //FFT object analyzes the audio input
        p.fft = new p5.FFT();
        p.fft.setInput(p.mic);

        //Play/pause button when pressed calls function togglePlaying
  //      p.cnv.mousePressed(togglePlaying);

        //Declare attractor object.
       a = new Attractor();
       for (let i = 0; i < 5; i++) {
        p.moversLowMid[i] = new Mover(this, 2, w / 2 + p.random(-10, 10), h / 2, p.c);
          p.moversHighMid[i] = new Mover(this, 2, w / 2 + p.random(-10, 10), h / 2, p.highMidColor);
    }

     
    };

    p.draw = function () {
       
                //  p.sensitivity = 100;
                  p.threshold = p.map(p.sensitivity, 20, 230, 230, 20);
            
               if (p.playing === true) {
                p.spectrum = p.fft.analyze();
                p.highMid = p.fft.getEnergy("highMid");
                 p.lowMid = p.fft.getEnergy("lowMid");
                 // var treble = fft.getEnergy("treble");
                 p.bass = p.fft.getEnergy("bass");
                 // var mid = fft.getEnergy("mid");
     
                 //radius of center ellipse is mapped to the amplitude of the bass frequency
                 p.bassMap = p.map(p.bass, 0, 255, 20, 500);
                // var bassMap2 = map(bass, 0, 255, 5, 100);
                 p.noFill();
                 p.ellipse(w / 2, h / 2, p.bassMap, p.bassMap);
                 //fill(255);
                // ellipse(w / 2, h / 2, bassMap2, bassMap2);
                 //   peakDetect.update(fft);
     
                 //Creating a gradual fade effect on the background 
                 p.noStroke();
               p.fill(0, 0, 0, 5);
                 p.rect(0, 0, width, height);
                 p.stroke(0);
     
                 p.fill("white");
     
                 //Loop through the array of movers
                 for (let i = 0; i < 5; i++) {
                     //Movers are attracted to the Attractor object in center of canvas
                     p.f = a.attract(p.moversLowMid[i]);
                     p.x = a.attract(p.moversHighMid[i]);
                     p.f.normalize();
                     p.f.mult(1);
                   p.x.normalize();
                    p.x.mult(1);
                     p.moversLowMid[i].applyForce(p.f);
                    p.moversHighMid[i].applyForce(p.x);
     
                     //If a certain frequency is above a certain amplitude threshold the movers are repelled by the attractor object
                     if (p.lowMid > p.threshold) {
                         p.t = a.repel(p.moversLowMid[i]);
                         p.t.normalize();
                         p.t.mult(1);
                         p.moversLowMid[i].applyForce(p.t);
                     }
                     if (p.highMid > p.threshold) {
                         //below commented out code has interesting effect
                         // var t = a.repel(moversLowMid[i]);
                         p.t = a.repel(p.moversHighMid[i]);
                         p.t.normalize();
                         p.t.mult(1);
                         p.moversHighMid[i].applyForce(p.t);
                     }
                     p.fill(p.c);
                     // print(c);
                     //Movers reverse direction when they meet the edge of the canvas
                     p.moversLowMid[i].checkEdges();
                     p.moversLowMid[i].update();
                     p.moversLowMid[i].display();
     
                    p.fill(p.highMidColor);
                 p.moversHighMid[i].checkEdges();
                    p.moversHighMid[i].update();
                    p.moversHighMid[i].display();
                     p.fill(255);
                 }
                 /*
                 if (shapeMode) {
                     noFill();
                     beginShape();
                     for (let i = 0; i < 5; i++) {
                         vertex(moversLowMid[i].location.x, moversLowMid[i].location.y);
                     }
                     endShape();
                 }*/
           }
               //Paused canvas
               else if (p.playing == false && p.getAudioContext().state == "running") {
                   p.background(0);
                   // text("paused", width / 2, height / 2);
                   p.imageMode(p.CENTER);
                   p.image(p.playImg, w / 2, h / 2, p.playImg.width / 2, p.playImg.height / 2);
               }
               //Pre-start canvas
               else {
                   p.background(0);
                   p.imageMode(p.CENTER);
                   p.image(p.playImg, w / 2, h / 2, p.playImg.width / 2, p.playImg.height / 2);
               }
       
       
    };
  p.togglePlaying = function() {

        //Start Audio context on user gesture
        if (p.getAudioContext().state !== 'running') {
            p.userStartAudio();
        }
        if (p.playing == true) {
            p.playing = false;
        } else if (p.playing == false) {
            //clear the background (to remove "paused" text)
            p.background(0);
            p.playing = true;
        }
    }
};

let myp5 = new p5(sketch, document.getElementById("container"));