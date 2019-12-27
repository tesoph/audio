## Testing
[Main README.md file](README.md)

[View website in GitHub Pages](https://tesoph.github.io/audio/)

## Table of Contents
- [Testing](#testing)
- [Table of Contents](#table-of-contents)
- [Automated Testing](#automated-testing)
  - [Validation Services](#validation-services)
  - [Jasmine](#jasmine)
    - [Difference between audioVisualizer.js and audioVisualizerJasminejs](#difference-between-audiovisualizerjs-and-audiovisualizerjasminejs)
- [User Stories Testing](#user-stories-testing)
- [Manual Testing](#manual-testing)
- [Solved bugs found during testing](#solved-bugs-found-during-testing)
- [Unsolved bugs during testing](#unsolved-bugs-during-testing)

## Automated Testing
### Validation Services
<a href="http://jigsaw.w3.org/css-validator/check/referer">
        <img style="border:0;width:88px;height:31px"
            src="http://jigsaw.w3.org/css-validator/images/vcss"
            alt="Valid CSS!" /></a>

* The [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/) was used to validate the CSS.
* The [W3c Markup Validation Service](https://validator.w3.org) was used to validate each page of html.
  
### Jasmine  

Automated testing using Jasmine 3.1 was undertaken after the project was completed and succsessfully tested as written in the [Manual Testing](#manual-testing) section. This approach was chosen because of unfamiliarity with the Jasmine framework.
During the automated testing phase, it was discovered that it is difficult to test the front-end with Jasmine. As the settings menu and toolbar is heavily dependant on the front-end UI, most functionality of these elements has been left untested. The majority of the automated testing focuses on the audioVisualizer.js module.

The files for jasmine testing can be found here:
* HTML page to run jasmine tests from: [test.html](assets/jasmine-testing/test.html)
* JavaScript specifications (tests): [fileSpec.js](assets/jasmine-testing/spec/fileSpec.js)
* Alternative version of audioVisualizer.js for Jasmine testing: [audioVisualizer.js](https://github.com/tesoph/audio/tree/master/assets/jasmine-testing/src/audioVisualizerJasmine.js)
  
The live results of the Jasmine tests can be viewed in the browser [here](https://tesoph.github.io/audio/assets/jasmine-testing/test.html).

#### Difference between audioVisualizer.js and audioVisualizerJasminejs
* The following code block in audioVisualizer.js causes Jasmine to throw errors. 
```js
let constraints = { audio: true, video: false };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
                p.getAudioInput();
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
```
* This can be resolved if the previous code block is wrapped with `if (!window.jasmine){}` but this solution is not included in the deployed version of the audioVisualizer.js,
* Instead, for jasmine testing a [seperate js file](https://github.com/tesoph/audio/tree/master/assets/jasmine-testing/src/audioVisualizerJasmine.js) was created with the only difference to the deployed audioVisualizer.js file being the inclusion of `if(!window.jasmine){}` wrapping the above code block at [line 43](https://github.com/tesoph/audio/tree/master/assets/jasmine-testing/src/audioVisualizerJasmine.js#L43).

## User Stories Testing

As a user:

* I would like to create an image using sound.
    * Audio input is taken from the microphone, allowing the user to use any sound/noise of their choice.
    * The settings menu allows the user to choose how they would like the sound to be visualized.
* I would like to save images I have created.
    * The toolbar displayed over the canvas has a clearly labelled camera button which saves an image of the current frame to the user's downloads folder.
* I would like to be able to view in fullscreen.
    * The toolbar displayed over the canvas has a clearly labelled fullscreen button which opens the canvas in fullscreen.
* I would like the user interface to be easy to use.
    * The settings menu is transparent and displayed over the sketch canvas which allows immediate visual feedback when a setting is changed. This allows the user to easily understand what each setting does.
    * The settings menu contains popovers which explain what the less explicit settings are for. The popovers are marked with a question mark and are highlighted and color set to red when the are hovered over to alert the user that they are clickable.
    * Each input element in the settings menu and each button in the toolbar is outlined when focused to make it navigable with a screen reader.
  
## Manual Testing
* Chrome DevTools was used to test each page across all media query breakpoints to ensure the responsive design works as expected and there is no screen width at which there is overflow or misplaced elements.

The following manual testing was undertaken on:
* Desktop: macOS Mojave on the latest versions of Chrome (version 79), Firefox (version 71) and Safari (version 12.1.1) browsers.
* Tablet: ipadOS 13.3 on the latest version of Safari browser.
* Mobile: Android version 8 on the latest versions of Chrome and Firefox browsers.
  
The website has been manually tested to ensure it passes the following test cases:

**Audio Visualizer**
* When the website is first opened it promts the user for permission to allow microphone input.
    * If permission is denied an alert is displayed with the message `'Permissions have not been granted to use your microphone, you need to allow the page access to your microphone in order for the audio visualizer to work.'`
    * If permission has not been denied but the browser is unable to use the get media stream API, an alert is displayed with the message `'Sorry, your browser does not support microphone input streaming so the audio visualizer will not respond to sound'`
* When the website is first opened a play button is displayed over the sketch to indicate the user needs to click. This allows an audio context to be created on user gesture.
* When the sketch canvas is clicked anywhere, the sketch is paused and the play icon is displayed over the canvas.
* When the window is resized or orientation is changed, the sketch canvas resizes to fit the new screen and new movers and attractor are created to fit the new canvas size.
* When the user resumes focus on the sketch after navigating to another page, the sketch doesn't freeze.
* The sketch is initialised with the values of html inputs on page load.

**Settings menu**
* Clicking the settings button toggles the visibility of the settings menu.
* The theme radio button selects between "dark" (sets background color to black and stroke color to white) and "light" (sets background color to white and stroke color to black).

**Camera button**
* Clicking the camera button saves a .jpg image of the current frame to the user's download folder with the filename "Audio-X.jpg", where X is a string of length 6 of random characters.
  
**More information modal**
* Clicking the more information button opens the more-information modal displayed over the center of the sketch canvas.
* When the modal is opened:
      *  The user settings menu is hidden if it was visible when the modal was opened.
      *  The sketch is paused.
* Clicking the 'X' icon in the upper right corner of the modal closes the modal.
* When the modal is closed:
      * The user settings menu shown again if it was visible when the modal was opened.
      * The sketch loops again. 

**Fullscreen button**
* Clicking the fullscreen button opens the sketch canvas in full screen
* The sketch canvas is resized according to the fullscreen size.
* The attractor is displayed at the center of the new canvas.
* The movers are related to the new attractor position.
* Following the displayed instructions according to the browser exits the fullscreen.

**Window Events**
* When the window is resized or orientation is changed:
    * The sketch canvas is resized accordingly.
    * The attractor is displayed at the center of the new canvas.
    * The movers are related to the new attractor position.

## Solved bugs found during testing
1. **GetUserMedia/ Stream API is not supported in all browsers**. 
* [Caniuse.com support table](https://caniuse.com/#feat=stream).
* The following code [from MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) was put into the setup() function which is called once when the audio visualizer object is created.
```js
let constraints = { audio: true, video: false };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
                p.getAudioInput();
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
```
* This code checks if matching media is available. If it is not found or permission to use it is denied, it alerts the user to the respective situation.
   
2. **```<input type="color">``` in the settings menu is not supported in all browsers.** 
    * [Caniuse.com support table](https://caniuse.com/#search=color%20input)
    * Fix: used [Spectrum Colorpicker](https://briangrinstead.com/blog/input-type-color-polyfill/). "A polyfill for the input[type=color] HTML5 control. This mode needs to work without JavaScript enabled - and fallback to an input[type=text] like other HTML5 inputs."
  
3. **Popovers in the settings menu not dismissable on next click** 
   * Reason: This was found to be due to a naming conflict between bootstrap and jQuery UI. 
   * Fix: jQuery UI was removed from the project. While researching this bug, I realised that jQuery has a very large file size while not being necessary for this project.
  
4. **```The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page.```**
   - Reason: Web Audio API does not allow audio stream from the microphone to automatically start.
   - Fix: https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
   - ```if (p.getAudioContext().state !== 'running') { p.userStartAudio();``` was inserted into the play() method of the audio visualizer so that when any location on the canvas is clicked the audio context is started. It is suggested to the user that they need to take this action by the play button displayed over the canvas. 
```js
//When any location on the canvas is clicked, audioVisualizer.play() is called which toggles the sketch between pause and play
sketchContainer.addEventListener('click', audioVisualizer.play);

audioVisualizer.play = function () {
       if (p.getAudioContext().state !== 'running') {
                p.userStartAudio();
            }
    };
```
5. **Sliders in the settings menu were not displaying while testing**
   - Reason: [Chrome disables input=range styling in responsive mode](https://bugs.chromium.org/p/chromium/issues/detail?id=807625)
   - Fix: [Custom CSS rules for inputs](https://stackoverflow.com/questions/41170867/html5-sliders-disappear-under-chromes-device-mode). 
   - This also prompted me to write custom css rules for inputs for different browsers so the visual remains consistent across them.

6. **Some mobile browsers would place the bottom of the canvas to be off the screen**
   - Reason: Some mobile browsers do not include address bar height in viewport height so the sketch-container CSS style height:100vh would render the bottom of the sketch-container div off the screen
   - Fix: https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

## Unsolved bugs during testing
 - Mic input doesn't work on latest version of Android firefox.