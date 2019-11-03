let sketch = function (p) {

    class Attractor {
        //Our Attractor is a simple object that doesn’t move. We just need a mass and a location.
        constructor(p_) {
            this.p = p_;
            this.location = p.createVector(p.w / 2, p.h / 2);
            this.mass = 100;
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
            this.radius = this.mass * 10;
        }

        update() {
            //  p.print(p.topseed2);
            this.velocity.add(this.acceleration);
            this.velocity.limit(p.topspeed2);
            this.location.add(this.velocity);
            this.acceleration.mult(0);
        }

        display() {

            //  p.stroke(255);
            p.strokeWeight(p.strokeWidth);
            //fill(this.color);
            //p.fill(p.c);
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
    p.moversList = [];
    p.w = containerWidth;
    p.h = containerHeight;

    p.setup = function () {
        //Initial value set to false to stop sketch from playing until a user gesture on the page
        p.playing = false;
        //creating the sketch canvas with width and height from the parent container
        p.cnv = p.createCanvas(p.w, p.h);
        p.initializeVariables();
        p.initializeMovers();
        p.background(p.backgroundColor);
        p.backgroundColor.setAlpha(5);
        //Get the mic and attach an fft object to analyse the audio from it
        p.getAudioInput();
        p.displayHighMid = false;
    };

    p.draw = function () {
        //Create a gradual fade effect on the background
        p.fadeBackground();
        p.stroke(p.strokeColor);

        if (p.playing) {
            p.analyzeAudio();
            p.drawBass();
            //Move according to the bolume of the audio
            p.moveMovers(p.moversLowMid, p.threshold, p.lowMid);
            if (p.displayHighMid) {
                p.moveMovers(p.moversHighMid, p.threshold, p.treble);
            }
            //   peakDetect.update(fft);
            for (let i = 0; i < p.numberOfMovers; i++) {
                p.fill(p.myColor); 
                p.moversLowMid[i].checkEdges();
                //?if you pass in the topspeed it goes v slow
                //  p.moversLowMid[i].update(p.topspeed2);
                p.moversLowMid[i].update();
                p.moversLowMid[i].display();
                if (p.displayHighMid) {
                    p.fill(p.highMidColor);
                    p.moversHighMid[i].checkEdges();
                    p.moversHighMid[i].update();
                    p.moversHighMid[i].display();
                }
            }

            //shape mode
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
    p.makeShapeMode = function (i_) {
        //needs to be in draw()
        let i=i_;
        p.vertex(p.moversLowMid[i].location.x, p.moversLowMid[i].location.y);
    }
    p.initializeVariables = function () {
        p.numberOfMovers = 40;
        p.moversLowMid = [];
        p.moversHighMid = [];
        p.strokeWidth = 1;
        p.shapeMode = false;
        p.backgroundColor = p.color(0, 0, 0);
        p.strokeColor = p.color(255, 255, 255);
        p.topspeed2 = 5;
        p.sensitivity = 90;
    }

    p.initializeMovers = function () {
        //? Array of array of movers(?)

        //Use list and weight to bias the size of the movers (more small movers than large one)
        let list = [1, 2, 3, 4, 5];
        let weight = [0.3, 0.4, 0.1, 0.1, 0.1];
        //Make new attractor and movers orientated to canvas center
        p.a = new Attractor(p);
        for (let i = 0; i < p.numberOfMovers; i++) {
            //  p.randomMass = p.floor(p.random(1,4));
            //  p.print(p.randomMass);
            p.moversLowMid[i] = new Mover(this, getRandomItem(list, weight), p.w / 2 + p.random(-10, 10), p.h / 2, p.myColor);
            //  p.moversLowMid[i] = new Mover(this, 1, p.w / 2 + p.random(-10, 10), p.h / 2, p.c);
            p.moversHighMid[i] = new Mover(this, 2, p.w / 2 + p.random(-10, 10), p.h / 2, p.highMidColor);
        }
    }

    p.getAudioInput = function () {
        //Audio input comes from the microphone
        p.mic;
        p.mic = new p5.AudioIn()
        p.mic.start();
        //FFT object analyzes the audio input
        p.fft = new p5.FFT();
        p.fft.setInput(p.mic);
    }

    p.changeBackgroundColor = function (bgCol_) {
        if (bgCol_ === "white") {
            p.backgroundColor = p.color(255, 255, 255, 5);
            p.strokeColor = p.color(0, 0, 0);
        } else if (bgCol_ === "black") {
            p.backgroundColor = p.color(0, 0, 0, 5);
            p.strokeColor = p.color(255, 255, 255);
        }
    }

    p.fadeBackground = function () {
        //Creating a gradual fade effect on the background by drawing a 100% width and height slightly transparent rectangle on top of the sketch
        p.noStroke();
        p.fill(p.backgroundColor);
        p.rect(0, 0, p.w, p.h);
    }

    p.analyzeAudio = function () {
        p.spectrum = p.fft.analyze();
        // p.highMid = p.fft.getEnergy("highMid");
        p.lowMid = p.fft.getEnergy("lowMid");
        p.treble = p.fft.getEnergy("treble");
        p.bass = p.fft.getEnergy("bass");
        // var mid = fft.getEnergy("mid");
        //Sensitivity value from slider mapped backwards to threshold so that the amplitude can be > threshold
        p.threshold = p.map(p.sensitivity, 30, 170, 170, 30);
    }

    p.drawBass = function () {
        //radius of center ellipse is mapped to the amplitude of the bass frequency
        p.bassMap = p.map(p.bass, 0, 255, 20, 500);
        p.bassStrokeWeight = p.map(p.bass, 0, 255, 0, 10);
        // var bassMap2 = map(bass, 0, 255, 5, 100);
        p.noFill();
        p.strokeWeight(p.bassStrokeWeight);
        p.stroke(p.strokeColor);
        p.ellipse(p.w / 2, p.h / 2, p.bassMap, p.bassMap);
        //fill(255);
        // ellipse(w / 2, h / 2, bassMap2, bassMap2);
    }

    /*
    p.attractMovers = function () {
        //Loop through the array of movers
        for (let i = 0; i < p.numberOfMovers; i++) {
            p.f = p.a.attract(p.moversLowMid[i]);
            p.f.normalize();
            p.f.mult(1);
            p.moversLowMid[i].applyForce(p.f);
            p.fill(255);
        }
    }

    p.repelMovers = function () {
        //Loop through the array of movers
        for (let i = 0; i < p.numberOfMovers; i++) {
            if (p.lowMid > p.threshold) {
                p.t = p.a.repel(p.moversLowMid[i]);
                p.t.normalize();
                p.t.mult(1);
                p.moversLowMid[i].applyForce(p.t);
            }
        }
    }*/

    p.moveMovers = function (movers_, threshold_, frequencyRange_) {
        p.threshold = threshold_
        p.movers = movers_;
        p.frequencyRange = frequencyRange_;
        //Loop through the array of movers
        for (let i = 0; i < p.numberOfMovers; i++) {
            //Movers are attracted to the Attractor object in center of canvas
            p.f = p.a.attract(p.movers[i]);
            p.f.normalize();
            p.f.mult(1);
            p.movers[i].applyForce(p.f);

            //If a certain frequency is above a certain amplitude threshold the movers are repelled by the attractor object
            if (p.frequencyRange > p.threshold) {
                p.t = p.a.repel(p.movers[i]);
                p.t.normalize();
                p.t.mult(1);
                p.movers[i].applyForce(p.t);
            }
        }
    }

    p.togglePlaying = function () {
        //Start Audio context on user gesture
        if (p.getAudioContext().state !== 'running') {
            p.userStartAudio();
        }
        if (p.playing == true) {
            p.playing = false;
            p.noLoop();
        } else {
            p.playing = true;
            p.loop();
        }
    }

    p.toggleLines = function () {
        if (this.checked()) {
            console.log('Checking!');
            lines = true;
        } else {
            lines = false;
            console.log('Unchecking!');
        }
    }

    p.capture = function () {
        //?Which is better
        // p.saveCanvas(p.cnv, 'myCanvas.jpg');
        p.save('myCanvas.jpg');
    }

    p.windowResized = function (w_, h_) {
        p.w = w_;
        p.h = h_;
        p.resizeCanvas(p.w, p.h);
        p.initializeMovers();
    }


    // https://codetheory.in/weighted-biased-random-number-generation-with-javascript-based-on-probability// Weighted random number generation
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
        // end of function
    };
};
