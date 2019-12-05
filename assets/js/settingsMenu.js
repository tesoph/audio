let settingsMenu = {

    popovers: function () {
        $(function () {
            $('[data-toggle="popover"]').popover();
        });
        $('.popover-dismiss').popover({
            trigger: 'focus'
        });
    },
    closeMenu: function () {
        $("#close-settings").on("click", function () {
            $("#settings-menu").toggle();
        });
    },
    setTheme: function () {
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
    },
    displayLines: function () {
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
    },
    toggleShapeMode:function(){
        document.getElementById("shapeCheckbox").onchange = function () {
            if (this.checked) {
                audioVisualizer.shapeMode = true;
            } else {
                audioVisualizer.shapeMode = false;
            }
        };
    },
    setSensitivity:function(){
        let sensitivitySlider = document.getElementById("sensitivity-slider");

        sensitivitySlider.onchange = function () {
            changeSensitivity();
        };
    
        function changeSensitivity() {
            audioVisualizer.sensitivity = sensitivitySlider.value;
    }
    },
  setStrokeWeight:function(){
    let SWslider = document.getElementById("stroke-weight-picker");
    SWslider.oninput = changeStrokeWeight;
    function changeStrokeWeight(event) {
        audioVisualizer.strokeWidth = event.target.value;
    }
    
  },
setMoverColor:function(){
    //Color input type polyfill https://bgrins.github.io/spectrum/
//BUG FIX: defaults to text input for browsers that don't support input type color
//ERROR [Intervention] Unable to preventDefault inside passive event listener due to target being treated as passive. See <URL>
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
},
displayHighMidMovers:function(){
    document.getElementById("highMidCheckbox").onchange = function () {
        console.log("checked");
        if (this.checked == true) {
            audioVisualizer.displayHighMid = true;
        } else {
            audioVisualizer.displayHighMid = false;
        }
    };
},
setSpeed:function(){
    let topspeedSlider = document.getElementById("topspeed-slider");
topspeedSlider.oninput = function () {
    audioVisualizer.topspeed2 = Math.floor(topspeedSlider.value);
};
},
setNumberOfMovers:function(){
    let numMovers = document.getElementById("number-of-movers");
    numMovers.oninput = function () {
        audioVisualizer.numberOfMovers = Math.floor(numMovers.value);
    }; 
},
};