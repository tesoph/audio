<div><img src="assets/img/logo/logo.jpg" alt="logo">
<h1>Audio Visualiser</h1>
</div>


## Stream Two Project: Interactive Frontend Development - Code Institute

This project is an interactive live audio visualiser. It is based on a sketch I had previously written in Processing, [mover_audio](https://github.com/tesoph/mover_audio). This sketch's inspiration was the book The Nature of Code by Daniel Shiffman. For this project I rewrote the sketch in Javascript using the library p5.js and added several features to make it interactive. It requires audio input from the microphone to run. How the audio visualizer looks can be controlled by the user via the settings menu. There is also the ability to save an image of the current frame as a .jpg image, and to open the sketch in fullscreen mode.


## Table of contents
* [Demo](#Demo)
* [Gallery](#Gallery)
* [Features](#Features)
* [Technologies Used](#technologies-used)
* [Testing](#testing)
* [Credits](#credits)


## Demo
A live demo can be found [here](https://tesoph.github.io/audio/).


## Gallery
<p align="center">
  <img src="assets/img/drawings/Audio-eeqsmy.jpg" height="350">
  <img src="assets/img/drawings/Audio-i0gym.jpg" height="350">
  <img src="assets/img/drawings/Audio-9nsjg.jpg"  height="350">
  <img src="assets/img/drawings/myCanvas-6.jpg"  height="350">
</p>


## Features
### Existing Features
* A settings menu to control the variables of the audio visualiser
* Save the current frame as a .jpg file
* Fullscreen mode
* More information modal


## Technologies Used
* Visual Studio Code
* HTML
* CSS
* Javascript
* P5.js 
  * For the audio visualizer sketch
* jQuery
  * For DOM manipulation
* Bootstrap (v4.3.1)
  * For responsive styling and modal component
* [Range Touch](https://rangetouch.com/)
  * To improve sliders on touch devices
* Popper.js
	* For the more information popovers in the settings menu
* [Spectrum Colorpicker](https://briangrinstead.com/blog/input-type-color-polyfill/)
  * Polyfill for color input
* [Google fonts](https://fonts.google.com/)
* [Material Icon font](https://material.io/resources/icons/?style=baseline)
* [Autoprefixer](https://autoprefixer.github.io/)
  

## Testing
### Bugs found in the testing phase
* [GetUserMedia/ Stream API is not supported in all browsers](https://caniuse.com/#feat=stream).
* [The color input type in the settings menu is not supported in all browsers](https://caniuse.com/#search=color%20input)
    * Fix: used [Spectrum Colorpicker](https://briangrinstead.com/blog/input-type-color-polyfill/). "A polyfill for the input[type=color] HTML5 control. This mode needs to work without JavaScript enabled - and fallback to an input[type=text] like other HTML5 inputs."


## Credits
### Acknowledgements
* The code for the attractor and mover classes in main.js is adapted from chapter 2 of the book ["The Nature of Code" by Daniel Shiffman](https://natureofcode.com/book/chapter-2-forces/)

* Thanks to my mentor Brian Macharia for support and advice.