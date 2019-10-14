//Code for attraction and repulsion forces adapted from Nature of Code chapters 1-3

let w=1000;
let h=700;

class Attractor {
    //Our Attractor is a simple object that doesn’t move. We just need a mass and a location.
    constructor() {
        this.location = createVector(w/2, h/2);
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
            // location.x = 0;
            this.velocity.x *= -1;
            // velocity.y *=-1;
        } else if (this.location.x < 0) {
            //  location.x = width;
            this.velocity.x *= -1;
            //  velocity.y *=-1;
        }

        if (this.location.y > h) {
            //  location.y = 0;
            this.velocity.y *= -1;
            //  velocity.x*=-1;
        } else if (this.location.y < 0) {
            // location.y = h;
            this.velocity.y *= -1;
            // velocity.x*=-1;
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
    constructor(m_, x_, y_) {
        this.location = createVector(x_, y_);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(-0.001, 0.01);
        this.topspeed =5;
        this.mass = m_;
    }
    //Our object has two PVectors: location and velocity.
    //float rad = radians(frameCount);
    //float angleCount = 7;    //// 1 - ...
    //float angle = getRandomAngle(direction);
    //boolean reachedBorder = false;
    // PVector wind=new PVector(0.01,0);



    update() {
        // println(rad);
        //Motion 101: Location changes by velocity.
        // acceleration = PVector.random2D();
        // acceleration.normalize();
        //acceleration.mult(0.2);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.topspeed);
        this.location.add(this.velocity);
        this.acceleration.mult(0);
    }

    display() {
        stroke(0);
        fill(175);
        ellipse(this.location.x, this.location.y, this.mass * 10, this.mass * 10);
        // ellipse(location.x, location.y, mass*10, mass*10);
         line(width/2,height/2,this.location.x,this.location.y);
    }
  applyForce(force) {
        //Making a copy of the PVector before using it!
        //PVector f =force.get();
        //f.div(mass);
        var f = p5.Vector.div(force, this.mass);
        this.acceleration.add(f);
    }

    checkEdges() {
        if (this.location.x > w) {
          
            // location.x = 0;
            this.velocity.x *= -1;
            this.acceleration.x *= -1;
            // velocity.y *=-1;
        } else if (this.location.x < 0) {
            //  location.x = width;
            this.velocity.x *= -1;
            this.acceleration.x *= -1;
            //  velocity.y *=-1;
        }

        if (this.location.y > h) {
        
            //  location.y = 0;
            this.velocity.y *= -1;
            this.acceleration.y *= -1;
            //  velocity.x*=-1;
        } else if (this.location.y < 0) {
            // location.y = height;
            this.velocity.y *= -1;
            this.acceleration.y *= -1;
            // velocity.x*=-1;
        }

    }
}

//Mover[] movers = new Mover[250];
//var a = new Attractor();
// PVector wind=new PVector(900,0);PVector gravity = new PVector(0,0.1);
//var gravity = createVector(0,0.1);
let movers = [];
var song;
var slider;
var button;
var jumpButton;
var start;

window.onload = function() {
    var context = new AudioContext();
    // Setup all nodes
  }

document.querySelector('button').addEventListener('click', function() {
    context.resume().then(() => {
      console.log('Playback resumed successfully');
    });
  });

function setup() {
    start=false;
  var mic;
  button=createButton("play");
  button.mousePressed(togglePlaying);
  var myDiv = createDiv('click to start audio');
  myDiv.position(0, 0);

  //var mySynth = new p5.MonoSynth();

  // This won't play until the context has started
  //mySynth.play('A6');

  // Start the audio context on a click/touch event
  userStartAudio().then(function() {
     myDiv.remove();
   });
 // slider = createSlider(0,1,0,0.1);
  //song = loadSound("broke.mp3", loaded);
 // jumpButton = createButton("jump");
 // jumpButton.mousePressed(jumpSong);


//Declare Mover object.
mover = new Mover(1,10,50);
 a =new Attractor();

    var gravity = createVector(0, 0.1);
  //  mic = new p5.AudioIn()
  //  mic.start();
    createCanvas(w, h);
    background(0);
    //fft = new p5.FFT();
    //fft.setInput(mic);
   // peakDetect = new p5.PeakDetect(1000, 20000, 0.2);
  for (let i = 0; i < 50; i++) {
        movers[i] = new Mover(2, w/ 2 + random(-10, 10), h / 2);
    }
 /* for (let i = 0; i < 50; i++) {
        moversb[i] = new Mover(2, w/ 2 + random(-10, 10), h / 2);
    }*/

}

function jumpSong(){
    var len = song.duration();
    song.jump(len/2);
}

function loaded(){
   //
}

function togglePlaying(){
    mic = new p5.AudioIn()
    mic.start();
    fft = new p5.FFT();
    fft.setInput(mic);
    peakDetect = new p5.PeakDetect(1000, 20000, 0.2);
    start=true;

  
}



    function draw() {
        if(start===true){
        //fft.analyze();
        var spectrum = fft.analyze();
        var highMid =fft.getEnergy("highMid");
            var lowMid =fft.getEnergy("lowMid");
        var treble =fft.getEnergy("treble");
        var bass=fft.getEnergy("bass");
       var mid=fft.getEnergy("mid");

       var bassMap = map(bass,0,255,50,500);
      if(bass>50){
     //  ellipse(20,20,bass,bass); 
      }
        peakDetect.update(fft);
        noStroke();
        fill(0, 0, 0, 5);
        rect(0, 0, width, height);
        stroke(0);
        a.display();
      //  a.update();
      a.checkEdges();
      
      ellipse(w/2,h/2,bassMap,bassMap);
      
      //hats
      if(treble >30){
          let c = color("red");
          fill(c);
                    ellipse(w/2,h/2,treble, treble);
      }
          fill("white");
      for (let i = 0; i < 50; i++) {
          /*
        if ( peakDetect.isDetected ) {
            console.log("detected");
            var t = a.repel(movers[i]);
            t.normalize();
            t.mult(100);
            movers[i].applyForce(t);
          } else {
            console.log("not detected");
            var f = a.attract(movers[i]);
            f.normalize();
            f.mult(1);
            movers[i].applyForce(f);
           
          }
          movers[i].checkEdges();
          movers[i].update();
         movers[i].display();*/
    
         var f = a.attract(movers[i]);
         f.normalize();
         f.mult(1);
         movers[i].applyForce(f);
        
        
        
            if ( lowMid >80) {
                var t = a.repel(movers[i]);
                t.normalize();
                t.mult(1);
                movers[i].applyForce(t);
           
       
            }
            movers[i].checkEdges();
            movers[i].update();
         movers[i].display();
   
    

    }
     
}
    }