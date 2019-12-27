"use strict";

/**
* Audio Visualizer sketch namespace
* @namespace audioVisualizerSketch
*/
let audioVisualizerSketch = function (p) {
    /**
    * Checks if the device is mobile to apply relative sizing to the movers 
    * @type {boolean}
    */
    let isMobile = window.matchMedia("only screen and (max-width: 576px)").matches;

    /**
    * The setup function executes once when the sketch begins
    * @function setup
    * @memberof audioVisualizerSketch
    */
    p.setup = function () {
        //Get the width and height of the canvas from the parent container
        p.w = p.getCanvasSize().x;
        p.h = p.getCanvasSize().y;
        /**
        * @name playing
        * @desc Boolean to control play/pause. Initial value set to false to stop sketch from playing until a user gesture on the page
        * @type {boolean}
        */
        p.playing = false;
        /**
       * @name createCanvas
       * @desc variable to store the sketch canvas
       * @type {object}
       */
        p.cnv = p.createCanvas(p.w, p.h);
        //drawing a plain black background to the canvas 
        p.background(p.color(0));
        //Initializing the variables
        p.initializeVariables();
        //Array of movers initialised with max (100) number of movers
        p.initializeMovers(p.w, p.h);
        p.getAudioInput();

        //Uncomment if(!window.jasmine) to run Jasmine tests without the script throwing an error
        if (!window.jasmine) {
        //Check if the browser supports media stream API and check if given permission
        //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        let constraints = { audio: true, video: false };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
                p.getAudioInput();
                console.log("a");
            })
            .catch(function (error) {
                if (error.name === 'PermissionDeniedError' || 'NotAllowedError') {
                    alert('Permissions have not been granted to use your microphone, you need to allow the page access to your microphone in order for the audio visualizer to work.');
                }
                else {
                    alert('Sorry, your browser does not support microphone input streaming so the audio visualizer will not respond to sound');
                }
                console.log('getUserMedia error: ' + error.name, error);
            });
         }
    };

    /**
    * The statements in draw() are executed until the program is stopped. Each statement is executed in sequence and after the last line is read, the first line is executed again.
    * @memberof audioVisualizerSketch
    * @function draw
    */
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

    //The following code for the Attractor and Mover classes is adapted from chapter 2 of the book "The Nature of Code" by Daniel Shiffman. (https://natureofcode.com/book/chapter-2-forces/)
    class Attractor {
        /**
        * Attractor object
        * @class Attractor
        * @memberof audioVisualizerSketch
        * @constructor
        * @param {object} p_ - This sketch instance 
        **/
        constructor(p_) {
            this.p = p_;
            this.location = p.createVector(p.w / 2, p.h / 2);
            this.mass = 100;
            this.velocity = p.createVector(0, 0);
            this.g = 1;
            this.acceleration = p.createVector(-0.1, 0.1);
            this.topspeed = 3;
        }
        /**
        * displays the attractor
        * radius and stroke weight relative to volume of bass frequency
        * @method display
        * @memberof audioVisualizerSketch.Attractor
        **/
        display() {
            p.stroke(0);
            p.bassMap = p.map(p.bass, 0, 255, 20, 500);
            p.bassStrokeWeight = p.map(p.bass, 0, 255, 0, 10);
            p.noFill();
            p.strokeWeight(p.bassStrokeWeight);
            p.stroke(p.strokeColor);
            p.ellipse(this.location.x, this.location.y, p.bassMap, p.bassMap);
        }
        /**
        * @method attract
        * @param m - The mover that is being attracted to the attractor
        * @memberof audioVisualizerSketch.Attractor
        **/
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
        /**
        * @method repel
        * @param m - The mover that is being repelled by the attractor
        * @memberof audioVisualizerSketch.Attractor
        **/
        repel(m) {
            let force = p5.Vector.sub(m.location, this.location);
            let distance = force.mag();
            distance = p.constrain(distance, 5, 25);
            force.normalize();
            let strength = (this.g * this.mass * m.mass) / (distance * distance);
            force.mult(strength);
            return force;
        }
    }

    class Mover {
        /**
        * Mover class
        * @constructor
        * @memberof audioVisualizerSketch
        * @param {object} p_ - This sketch instance 
        * @param {number} m_ - The mass of the mover
        * @param {number} x_ - The x location of the mover
        * @param {number} y_ - The y location of the mover
        * @param {array}  c_ - The color of the mover stored as RGBA values
        **/
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
        /**
        *Calls the update, display and checkEdges methods
        * @method run
        * @memberof audioVisualizerSketch.Mover
        */
        run() {
            this.update();
            this.display();
            this.checkEdges();
        }
        /**
        * Updates the mover velocity, location, acceleration
        * @method update
        * @memberof audioVisualizerSketch.Mover
        */
        update() {
            this.velocity.add(this.acceleration);
            this.velocity.limit(p.topspeed2);
            this.location.add(this.velocity);
            this.acceleration.mult(0);
        }
        /**
        * Displays the mover object
        * @method display
        * @memberof audioVisualizerSketch.Mover
        */
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
        /**
        * @method applyForce
        * @param force - The force to apply
        * @memberof audioVisualizerSketch.Mover
        */
        applyForce(force) {
            var f = p5.Vector.div(force, this.mass);
            this.acceleration.add(f);
        }
        /**
        * Reverses direction of the mover if it reaches this.radius distance from the edge of the sketch canvas
        * @method checkEdges
        * @memberof audioVisualizerSketch.Mover
        */
        checkEdges() {
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

    //Methods belonging to the audio visualizer
    /**
    * @method getCanvasSize
    * @desc Gets width and height of the sketch canvas parent container
    * @returns {object}
    * object.x - the width of the container
    * object.y - the height of the container
    * @memberof audioVisualizerSketch
    */
    p.getCanvasSize = function () {
        let sketchContainer = document.getElementById('sketch-container');
        let positionInfo = sketchContainer.getBoundingClientRect();
        let containerHeight = positionInfo.height;
        let containerWidth = positionInfo.width;
        return {
            x: containerWidth,
            y: containerHeight,
        };
    }

    /**
    * 
    * @method makeShapeMode
    * @param i_ - The index of the mover array
    * @memberof audioVisualizerSketch
    */
    p.makeShapeMode = function (i_) {
        let i = i_;
        p.vertex(p.moversLowMid[i].location.x, p.moversLowMid[i].location.y);
    };

    /**
    * Gives the variables hardcoded values so that the sketch can run independantly of the DOM input values and can be tested using Jasmine
    * @method initializeVariables 
    * @memberof audioVisualizerSketch
    */
    p.initializeVariables = function () {
        p.displayHighMid = false;
        p.sensitivity = 90;
        p.myColor = p.color(0, 0, 0);
        p.strokeWidth = 1;
        p.highMidColor = p.color(5, 5, 5);
        p.lines = true;
        p.shapeMode = true;
        p.topspeed2 = 5;
        p.numberOfMovers = 50;
        p.moversLowMid = [];
        p.moversHighMid = [];
        p.backgroundColor = p.color(0, 0, 0, 5);
        p.strokeColor = p.color(255);
        p.print("setting up variables");
    };

    /**
    * @method initializeMovers
    * @param width_ - The width of the sketch canvas
    * @param height_ - The height of the sketch canvas
    * @desc Creates 2 arrays: 1 array of mover class which responds to low mid tones and 1 array of mover class which responds to high mid tones
    * @memberof audioVisualizerSketch
    */
    p.initializeMovers = function (width_, height_) {
        p.w = width_;
        p.h = height_;
        //Use list and weight to bias the size of the movers (more small movers than large one)
        let list = [2, 4, 6, 8, 10];
        let weight = [0.3, 0.4, 0.1, 0.1, 0.1];
        //Make new attractor and movers orientated to canvas center
        p.a = new Attractor(p);
        for (let i = 0; i < 100; i++) {
            p.moversLowMid[i] = new Mover(this, p.getRandomItem(list, weight), p.w / 2 + p.random(-10, 10), p.h / 2, p.myColor);
            p.moversHighMid[i] = new Mover(this, 2, p.w / 2 + p.random(-10, 10), p.h / 2, p.highMidColor);
        }
    };

    /**
    * @method rand
    * @desc returns a random number
    * @param min - The minimum number
    * @param max - The maximum number
    * @author https://codetheory.in/weighted-biased-random-number-generation-with-javascript-based-on-probability
    * @memberof audioVisualizerSketch
    */
    p.rand = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    /**
    * @method getRandomItem
    * @desc returns a random number
    * @param list - array containing the numbers to choose from
    * @param weight - array of the numbers to weight the list array by
    * @author https://codetheory.in/weighted-biased-random-number-generation-with-javascript-based-on-probability
    * @memberof audioVisualizerSketch
    */
    p.getRandomItem = function (list, weight) {
        let total_weight = weight.reduce(function (prev, cur, i, arr) {
            return prev + cur;
        });
        let random_num = p.rand(0, total_weight);
        let weight_sum = 0;
        for (let i = 0; i < list.length; i++) {
            weight_sum += weight[i];
            weight_sum = +weight_sum.toFixed(2);
            if (random_num <= weight_sum) {
                return list[i];
            }
        }
    };

    /**
    * @method getAudioInput
    * @desc Creates p5.sound object AudioIn: AudioIn streams audio input from the microphone. Creates p5.sound object FFT: FFT analyzes the audio stream
    * @memberof audioVisualizerSketch
    */
    p.getAudioInput = function () {
        //Audio input comes from the microphone
        p.mic = new p5.AudioIn();
        p.mic.start();
        //FFT object analyzes the audio input
        p.fft = new p5.FFT();
        p.fft.setInput(p.mic);
    };

    /**
    * @method fadeBackground
    * @desc Creates a gradual fade effect on the background by drawing a 100% width and height slightly transparent rectangle on top of the sketch each time draw is called
    * @memberof audioVisualizerSketch
    */
    p.fadeBackground = function () {
        p.noStroke();
        p.fill(p.backgroundColor);
        p.rect(0, 0, p.w, p.h);
    };

    /**
    * @method analyzeAudio
    * @desc Calls analyze method on fft object
    * @memberof audioVisualizerSketch
    */
    p.analyzeAudio = function () {
        p.fft.analyze();
        p.highMid = p.fft.getEnergy("highMid");
        p.lowMid = p.fft.getEnergy("lowMid");
        p.bass = p.fft.getEnergy("bass");
        //Sensitivity value from slider mapped backwards to threshold so that the amplitude can be > threshold
        p.threshold = p.map(p.sensitivity, 30, 170, 170, 30);
    };

    /**
    * @method repelMovers
    * @desc attracts the movers to the attractor object
    * @param movers_ - The array of movers to be moved
    * @memberof audioVisualizerSketch
    */
    p.attractMovers = function (movers_) {
        let movers = movers_;
        for (let i = 0; i < p.numberOfMovers; i++) {
            p.t = p.a.attract(movers[i]);
            p.t.normalize();
            p.t.mult(1);
            movers[i].applyForce(p.t);
        }
    };

    /**
    * @method repelMovers
    * @desc repels the movers from the attractor if the amplitude of the frequency range is above a certain threshold
    * @param movers_ - The array of movers to be moved
    * @param threshold - The amplitude over which the movers are repelled from the attactor
    * @param frequencyRange_ - The frequency range the movers will be influenced by
    * @memberof audioVisualizerSketch
    */
    p.repelMovers = function (movers_, threshold_, frequencyRange_) {
        //Loop through the array of movers
        let movers = movers_;
        let threshold = threshold_;
        let frequencyRange = frequencyRange_;
        for (let i = 0; i < p.numberOfMovers; i++) {
            if (frequencyRange > threshold) {
                p.t = p.a.repel(movers[i]);
                p.t.normalize();
                p.t.mult(1.055);
                movers[i].applyForce(p.t);
            }
        }
    };

    /**
    * @method moveMovers
    * @desc Calls both attractMovers and repelMovers
    * @param movers_ - The array of movers to be moved
    * @param threshold - The amplitude over which the movers are repelled from the attactor
    * @param frequencyRange_ - The frequency range the movers will be influenced by
    * @memberof audioVisualizerSketch
    */
    p.moveMovers = function (movers_, threshold_, frequencyRange_) {
        let threshold = threshold_;
        let movers = movers_;
        let frequencyRange = frequencyRange_;
        p.attractMovers(movers);
        p.repelMovers(movers, threshold, frequencyRange);
    };

    /**
    * @method play
    * @desc Displays play button and pauses sketch if sketch is playing when the canvas is clicked. Hides play button and resumes sketch if sketch is paused when the canvas is clicked
    * @memberof audioVisualizerSketch
    */
    p.play = function () {
        let playButton = document.getElementById("play");
        if (p.playing) {
            playButton.style.display = "inline";
            p.playing = false;
            p.noLoop();
        } else {
            playButton.style.display = "none";
            //Audio context must be started by a user gesture on the page
            if (p.getAudioContext().state !== 'running') {
                p.userStartAudio();
            }
            p.playing = true;
            p.loop();
        }
    };
};