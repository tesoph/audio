
describe('Testing the audioVisualizer', () => {
    var audioVisualizer;
    var fixture;

    beforeEach(function () {
        fixture = setFixtures(`
            <div id="sketch-container" style="width:1000px;height:1000px;"></div>
            <div id="play"></div>
        `)
        audioVisualizer = new p5(audioVisualizerSketch, document.getElementById("sketch-container"));
    });


    it('calling the moveMovers method should call attractmovers and repelmovers methods', () => {
        spyOn(audioVisualizer, "attractMovers");
        spyOn(audioVisualizer, "repelMovers");
        audioVisualizer.moveMovers(audioVisualizer.moversLowMid, 30, audioVisualizer.lowMid);
        expect(audioVisualizer.attractMovers).toHaveBeenCalled();
        expect(audioVisualizer.repelMovers).toHaveBeenCalled();
    });

    it('if the volume of a certain frequency is over a specificed threshold, the attractor should repel the movers', () => {
        spyOn(audioVisualizer.a, "repel");
        let movers = audioVisualizer.moversLowMid;
        let threshold = 50;
        let frequencyRange = 60;
        // console.log(attractor);
        //can't normalize property t of undefined. the force is undefined?
        audioVisualizer.moveMovers(movers, threshold, frequencyRange);
        expect(audioVisualizer.a.repel).toHaveBeenCalled();
    });

    it('the audio visualizer should contain an array of movers of length 100', () => {
        expect(audioVisualizer.moversLowMid.length).toBe(100);
    });

    it('if the sketch is paused, pressing the play button will unpause the sketch', () => {
        audioVisualizer.playing = false;
        audioVisualizer.play();
        expect(audioVisualizer.playing).toBe(true);
    });


    it('The attractor should be located in the center of the canvas', () => {
        let canvasSize = audioVisualizer.getCanvasSize();
        //X is the equivalent of width and Y is the equivalent of height
        let canvasWidthCenter = (canvasSize.x) / 2;
        let canvasHeightCenter = (canvasSize.y) / 2;

        audioVisualizer.initializeMovers(canvasSize.x, canvasSize.y);

        expect(audioVisualizer.a.location.x).toBe(canvasWidthCenter);
        expect(audioVisualizer.a.location.y).toBe(canvasHeightCenter);
    });

    it('when the window is resized, the initializeMovers and resizeCanvas methods are called', () => {
        spyOn(audioVisualizer, "resizeCanvas");
        spyOn(audioVisualizer, "initializeMovers");

        function resizeCanvas() {
            let canvasSize = audioVisualizer.getCanvasSize();
            audioVisualizer.resizeCanvas(canvasSize.x, canvasSize.y);
            audioVisualizer.initializeMovers(canvasSize.x, canvasSize.y);
        }
        resizeCanvas();

        expect(audioVisualizer.resizeCanvas).toHaveBeenCalled();
        expect(audioVisualizer.initializeMovers).toHaveBeenCalled();
    });

    it('should create the sketch canvas size according to the width and height of the parent container', () => {
        let canvasSize = audioVisualizer.getCanvasSize();

        expect(canvasSize.x).toBe(1000);
        expect(canvasSize.y).toBe(1000);
        expect(audioVisualizer.w).toBe(1000);
        expect(audioVisualizer.h).toBe(1000);
    });

});

/*Testing the Toolbar */
describe('Toolbar button click events', function () {
    var audioVisualizer;
    var t;

    beforeEach(function () {
        setFixtures(` <button id="cameraButton" class="toolbar-button"></button>
                      <div id="toolbar-container" class="toolbar-container">
            <div class="row justify-content-center">
                <!--More information-->
                <button id="informationButton" class="toolbar-button" data-toggle="modal"
                    data-target="#information-modal"><i class="material-icons-outlined oi">
                        info
                    </i></button>
                <!--Settings menu-->
                <button id="settingsButton" class="toolbar-button"><i class="material-icons-outlined oi">
                        settings_applications
                    </i></button>
                <!--Save an image-->
                <button id="cameraButton" class="toolbar-button"><i class="material-icons-outlined oi">
                        camera_alt
                    </i></button>
                <!--Full screen-->
                <button id="fullScreenButton" class="toolbar-button"><i class="material-icons-outlined oi">
                        all_out
                    </i></button>
            </div>
        </div>
        <div id="settings-menu"></div>
        <div id="sketch-container"></div>
    `)

        audioVisualizer = new p5(audioVisualizerSketch, document.getElementById("sketch-container"));
    });

    it("Clicking the settings button should toggle the settings menu visibility", function () {

        $("#settingsButton").on("click", function () {
            $("#settings-menu").toggle();
        });
        let menu = document.getElementById("settings-menu");
        let btn = document.getElementById('settingsButton');

        spyEvent = spyOnEvent('#settingsButton', 'click');
        $('#settingsButton').trigger("click");

        expect('click').toHaveBeenTriggeredOn('#settingsButton');
        expect(spyEvent).toHaveBeenTriggered();
        expect(menu).toBeHidden();
    });

    it("Clicking the camera button should call the audioVisualizer.saveCanvas method", function () {
        spyOn(audioVisualizer, "saveCanvas");
    
        let btn = document.getElementById('cameraButton');
       btn.addEventListener('click', event => {
            //Generate unique filename for each image saved so that a previous image is not overwritten from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
            let r = Math.random().toString(36).substring(7);
            let filename = `Audio-${r}.jpg`;
            audioVisualizer.saveCanvas(audioVisualizer.cnv, filename);
        });
        spyEvent = spyOnEvent('#cameraButton', 'click');
        $('#cameraButton').trigger("click");

        expect('click').toHaveBeenTriggeredOn('#cameraButton');
        expect(spyEvent).toHaveBeenTriggered();
        expect(audioVisualizer.saveCanvas).toHaveBeenCalled();
    });
});

/*Testing the settings menu */
describe('Settings menu input change events', function () {
    var audioVisualizer;
    let sm;
    beforeEach(function () {
        wrapper = setFixtures(`
            <div id="sketch-container"></div>
            <div id="settings-menu">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 settings-header">
                        <i class="material-icons-outlined settings-icon">
                            settings_applications
                        </i>
                        <button id="close-settings" class="custom-close">X</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        Theme:
                        <input type="radio" id="backgroundColorRadioDark" value="dark" name="backgroundColorRadio"
                            checked>
                        <label for="backgroundColorRadioDark">Dark</label>
                        <input type="radio" id="backgroundColorRadioLight" value="light" name="backgroundColorRadio">
                        <label for="backgroundColorRadioLight">Light</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <label for="sensitivity-slider">Sensitivity to noise</label>
                        <input type="range" name="sensitivity-slider" id="sensitivity-slider" min="30" max="170"
                            value="90" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <label for="number-of-movers">Number of movers</label>
                        <input type="range" name="number-of-movers" id="number-of-movers" min="1" max="75" step="1"
                            value="50" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <label for="topspeed-slider">Speed</label>
                        <input type="range" name="topspeed-slider" id="topspeed-slider" min="2" max="6" step="1"
                            value="4" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <label for="stroke-weight-picker">Stroke weight</label>
                        <input type="range" name="stroke-weight" id="stroke-weight-picker" min="1" max="10" value="1" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <label for="linesCheckbox">Display lines</label>
                        <input type="checkbox" id="linesCheckbox" name="linesCheckbox">
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <label for="shapeCheckbox">Shape mode</label>
                        <input type="checkbox" id="shapeCheckbox" name="shapeCheckbox">
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <p>Low mid tones</p>
                        <a tabindex="0" class="btn" role="button" data-toggle="popover" data-trigger="focus"
                            data-content="These circles react to sound in the low mid tones, frequency range: 140-400Hz"><i
                                class="material-icons-outlined oi">
                                help_outline
                            </i></a>
                        <label for="lowMidColor">Color </label>
                        <input type="color" class='basic'id="lowMidColor" name="lowMidColor" value="#808080">
                        <label for="lowMidCheckbox">Display</label>
                        <input type="checkbox" id="lowMidCheckbox" name="lowMidCheckbox" checked disabled>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <p>High mid tones</p>
                        <a tabindex="0" class="btn" role="button" data-toggle="popover" data-trigger="focus"
                            data-content="These circles react to sound in the high mid tones, frequency range: 2600-5200Hz."><i
                                class="material-icons-outlined oi">
                                help_outline
                            </i></a>
                        <label for="highMidColorPicker">Color</label>
                        <input type="color" class='basic' id="highMidColorPicker" name="highMidColorPicker" value="#85a7e5">
                        <label for="highMidCheckbox">Display</label>
                        <input type="checkbox" id="highMidCheckbox" name="highMidCheckbox">
                    </div>
                </div>
            </div>
        </div>
        `)
        audioVisualizer = new p5(audioVisualizerSketch, document.getElementById("sketch-container"));
        sm = new settingsMenu();
    });

    it("checking the shape mode checkbox results in audiovisualizer.shapeMode being set to true", function () {
        //Initial value set to false
        audioVisualizer.shapeMode = false;

        document.getElementById("shapeCheckbox").onchange = function () {
            if (this.checked) {
                audioVisualizer.shapeMode = true;
            } else {
                audioVisualizer.shapeMode = false;
            }
        };

        let shapeModeCheckbox = document.getElementById('shapeCheckbox');
        spyEvent = spyOnEvent('#shapeCheckbox', 'click');
        $('#shapeCheckbox').trigger("click");

        expect('click').toHaveBeenTriggeredOn('#shapeCheckbox');
        expect(spyEvent).toHaveBeenTriggered();
        expect(shapeModeCheckbox).toBeChecked();
        expect(audioVisualizer.shapeMode).toBe(true);
    });

    it("changing the sensitivty slider value changes the value of the audiovisualizer sensitivty variable to match", function () {
       let sensitivitySlider = document.getElementById("sensitivity-slider");
     
       function changeSensitivity() {
           audioVisualizer.sensitivity = sensitivitySlider.value;
        }
        sensitivitySlider.value = 30;
       
        changeSensitivity();
        spyOnEvent('#sensitivity-slider', 'click');
        $('#sensitivity-slider').click();

        expect('click').toHaveBeenTriggeredOn('#sensitivity-slider');
        expect(audioVisualizer.sensitivity).toBe('30');
    });
});

/*Testing the AudioVisualizer functions */
describe("Button Click Event Tests", function () {
    var spyEvent;
    var audioVisualizer;

    beforeEach(function () {
        setFixtures(`
            <div id="sketch-container"></div>
        `)
        audioVisualizer = new p5(audioVisualizerSketch, document.getElementById("sketch-container"));
        spyOn(audioVisualizer, "play");
    });

    it("clicking the sketch container should call the play method of the audio visualizer", function () {
        let sketchContainer = document.getElementById('sketch-container');
        sketchContainer.addEventListener('click', audioVisualizer.play);

        spyEvent = spyOnEvent('#sketch-container', 'click');
        $('#sketch-container').trigger("click");

        expect('click').toHaveBeenTriggeredOn('#sketch-container');
        expect(spyEvent).toHaveBeenTriggered();
        expect(audioVisualizer.play).toHaveBeenCalled();
    });
});