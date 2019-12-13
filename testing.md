# Testing
[Main README.md file](README.md)
[View website in GitHub Pages](https://tesoph.github.io/audio/)

## Table of Contents
* [Automated Testing](#Automated-Testing)
    * [Validation Services](#Validation-services)
    * [Jasmine](#Jasmine)
* [User Stories Testing](#user-stores-testing)
* [Manual Testing](#manual-testing)
* [Bugs found during testing](#Bugs-found-during-testing)

## Automated Testing
### Validation Services
<a href="http://jigsaw.w3.org/css-validator/check/referer">
        <img style="border:0;width:88px;height:31px"
            src="http://jigsaw.w3.org/css-validator/images/vcss"
            alt="Valid CSS!" /></a>

* The [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/) was used to validate the CSS.
* The [W3c Markup Validation Service](https://validator.w3.org) was used to validate each page of html.
* Chrome DevTools was used to test each page across all media query breakpoints to ensure the responsive design works as expected and there is no screen width at which there is overflow or misplaced elements.
  
### Jasmine  

## User Stories Testing

## Manual Testing
The website has been manually tested to ensure it passes the following test cases:

* Sketch
	* When the website is first opened it requires the user permission to allow microphone input.
	* When the website is first opened a play button is displayed over the sketch to indicate the user needs to click. This allows an audio context to be created on user gesture.
	* When the sketch is clicked anywhere, the sketch is paused and a play icon is displayed.
	* When the window is resized or orientation is changed, the sketch canvas resizes to fit the new screen and new movers and attractor are created to fit new canvas size.
	* When the user resumes focus on the sketch after navigating to another page, a new microphone stream is created.
	* The sketch is initialised with values according to the html inputs on page load.
	* The sketch analyses audio input from the microphone to draw an image.

* User settings menu
  * Clicking the settings button toggles the user settings menu.
  * The theme radio button selects between "dark" (sets background color to black and stroke color to white) and "light" (sets background color to white and stroke color to black).

* Camera button
  * Clicking the camera button saves a .jpg image of the current frame to the user's download folder with the filename "Audio-X.jpg" where X is a string of random characters.
  
* More information modal
  * Clicking the more information button opens a modal displaying information about the sketch.
  * When the modal is opened:
      *  the user settings menu is hidden if it was visible.
      *  the sketch is paused.
  * Clicking the 'X' icon in the upper right corner or clicking the close button at the bottom of the modal closes the modal.
  * When the modal is closed:
      * The user settings menu shown again if it was visible when the modal was opened.
      * The sketch loops again. 

* Fullscreen button
	* Clicking the fullscreen button opens the sketch canvas in full screen
	* When clicked the resizeCanvas() function is called to reinitalize the sketch according to new screen size
	* Following displayed instructions exits the fullscreen and calls the resizeCanvas() function

## Bugs found during testing
* [GetUserMedia/ Stream API is not supported in all browsers](https://caniuse.com/#feat=stream).
* [The color input type in the settings menu is not supported in all browsers](https://caniuse.com/#search=color%20input)
    * Fix: used [Spectrum Colorpicker](https://briangrinstead.com/blog/input-type-color-polyfill/). "A polyfill for the input[type=color] HTML5 control. This mode needs to work without JavaScript enabled - and fallback to an input[type=text] like other HTML5 inputs."
* Popovers in the settings menu weren't dismissable on next click due to a naming conflict between bootstrap and jQuery UI. jQuery UI was removed from the project due to large file size while not being necessary.