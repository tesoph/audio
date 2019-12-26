let settingsMenu = function() {
    //Enable popovers everywhere
    $(function () {
        $('[data-toggle="popover"]').popover();
    });

    //Enable popover dismiss on next click
    $('.popover-dismiss').popover({
        trigger: 'focus'
    });
    
    //Close the settings menu
    $("#close-settings").on("click", function () {
        $("#settings-menu").fadeToggle(250);
    });

    //Background Color radio
    $('input:radio[name ="backgroundColorRadio"]').on('click change', setBackgroundColor);
    function setBackgroundColor() {
        let bgCol = document.querySelector('input[name="backgroundColorRadio"]:checked').value;
        if (bgCol === "light") {
            audioVisualizer.backgroundColor = audioVisualizer.color(255, 255, 255, 5);
            audioVisualizer.strokeColor = audioVisualizer.color(0, 0, 0);
        } else if (bgCol === "dark") {
            audioVisualizer.backgroundColor = audioVisualizer.color(0, 0, 0, 5);
            audioVisualizer.strokeColor = audioVisualizer.color(255, 255, 255);
        }
    }

    //Display lines checkbox
    let linesCheckbox = document.getElementById("linesCheckbox");
    linesCheckbox.onchange = function () {
        displayLines();
    };
    function displayLines() {
        if ($('#linesCheckbox').is(":checked")) {
            audioVisualizer.lines = true;
        } else {
            audioVisualizer.lines = false;
        }
    }

    //ShapeMode checkbox
    document.getElementById("shapeCheckbox").onchange = function () {
        if (this.checked) {
            audioVisualizer.shapeMode = true;
        } else {
            audioVisualizer.shapeMode = false;
        }
    };

    //Sensitivity to noise slider
    let sensitivitySlider = document.getElementById("sensitivity-slider");
    sensitivitySlider.addEventListener("change", () => {
        this.changeSensitivity();
    });
    this.changeSensitivity = function() {
        audioVisualizer.sensitivity = sensitivitySlider.value;
    }

    //Stroke Weight slider
    let SWslider = document.getElementById("stroke-weight-picker");
    SWslider.oninput = changeStrokeWeight;
    function changeStrokeWeight(event) {
        audioVisualizer.strokeWidth = event.target.value;
    }

    //Movers color picker
    //Color input type polyfill https://bgrins.github.io/spectrum/
    //BUG FIX: defaults to text input for browsers that don't support input type color
    $("#lowMidColor").spectrum({
        move: function (tinycolor) {
            let c = tinycolor;
            let alph = c.getAlpha();
            c.setAlpha(alph);
            console.log(c.toRgbString());
            audioVisualizer.myColor = c.toRgbString();
        },
        showAlpha: true
    });

    $("#highMidColorPicker").spectrum({
        move: function (tinycolor) {
            let c = tinycolor;
            let alph = c.getAlpha();
            c.setAlpha(alph);
            console.log(c.toRgbString());
            audioVisualizer.highMidColor = c.toRgbString();
        },
        showAlpha: true
    });

    //Display high mid tone movers checkbox
    document.getElementById("highMidCheckbox").onchange = function () {
        console.log("checked");
        if (this.checked == true) {
            audioVisualizer.displayHighMid = true;
        } else {
            audioVisualizer.displayHighMid = false;
        }
    };

    //Speed slider
    let topspeedSlider = document.getElementById("topspeed-slider");
    topspeedSlider.oninput = function () {
        audioVisualizer.topspeed2 = Math.floor(topspeedSlider.value);
    };

    //Number of movers slider
    let numMovers = document.getElementById("number-of-movers");
    numMovers.oninput = function () {
        audioVisualizer.numberOfMovers = Math.floor(numMovers.value);
    };
};