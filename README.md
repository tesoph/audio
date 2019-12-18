<div><img src="assets/img/logo/logo2.jpg" alt="logo">
<h1>Audio Visualizer</h1>
</div>


## Stream Two Project: Interactive Frontend Development - Code Institute

This project is an interactive live audio visualizer. It is based on a sketch I had previously written in Processing, [mover_audio](https://github.com/tesoph/mover_audio). This sketch's inspiration was the book *The Nature of Code: Simulating Natural Systems with Processing* by Daniel Shiffman. For this project I rewrote the sketch in Javascript using the library p5.js and added several features to make it interactive. It requires audio input from the microphone to run. The appearance of the audio visualizer can be controlled by the user via the settings menu.


## Table of contents
- [Stream Two Project: Interactive Frontend Development - Code Institute](#stream-two-project-interactive-frontend-development---code-institute)
- [Table of contents](#table-of-contents)
- [Demo](#demo)
- [Gallery](#gallery)
- [UX](#ux)
  - [User Stories](#user-stories)
  - [Wireframes](#wireframes)
- [Features](#features)
  - [Existing Features](#existing-features)
  - [Features Left to Implement](#features-left-to-implement)
- [Technologies Used](#technologies-used)
  - [p5.sound Classes Used](#p5sound-classes-used)
- [Deployment](#deployment)
  - [How this project was deployed to GitHub Pages](#how-this-project-was-deployed-to-github-pages)
  - [How to run this project locally](#how-to-run-this-project-locally)
- [Testing](#testing)
- [Credits](#credits)
  - [Code](#code)
  - [Acknowledgements](#acknowledgements)


## Demo
A live demo can be found [here](https://tesoph.github.io/audio/).


## Gallery
<p align="center">
  <img src="assets/img/drawings/Audio-eeqsmy.jpg" height="350">
  <img src="assets/img/drawings/Audio-i0gym.jpg" height="350">
  <img src="assets/img/drawings/Audio-9nsjg.jpg"  height="350">
  <img src="assets/img/drawings/myCanvas-6.jpg"  height="350">
</p>


## UX
### User Stories
The following user stories were used to focus on the features the site should have.

As a user:
* I would like to have fun using the site.
* I would like to create an image using sound.
* I would like to save images I have created.
* I would like to be able to view in fullscreen.
* I would like the user interface to be intuitive to use.

### Wireframes
These wireframes were created using [Procreate](https://procreate.art/).

* [Index.html](https://i.ibb.co/41ztsSd/img-3.jpg)
* [Toolbar](https://i.ibb.co/XSHxJ7z/img-4.jpg)
* [Settings menu](https://i.ibb.co/Ykp7TRf/img.jpg)

## Features
### Existing Features
**Toolbar**
   * The toolbar contains four action buttons: more information, settings, camera, and fullscreen.
   * Each button is labelled with an icon that clearly expresses its purpose.
   * Each button is outlined when focused so that it is navigable with a screen reader.
  
**More information modal**
   * Displays information about how the audio visualizer works.
   * Explains what each button in the toolbar does.
   * Toggles the settings menu visibility so that they are not both shown at the same time. This is to improve readability. 
  
**Settings Menu**
   * The settings menu controls the variables of the audio visualiser through DOM input elements.
   * It is displayed on page load so that the user is immediately aware that they can interact with the settings.
   * It is diplayed on top of the sketch canvas and is transparent so that the results of any change in settings are immediately visible.
   * Each input is outlined when focused so that it is navigable with a screen reader.
  
**Camera**
   * The camera button saves the current frame of the audio visualiser as a .jpg image.
   * The filename of the image is randomised so that saving multiple images does not overwrite a previous image.
  
**Fullscreen**
   * The fullscreen button opens the canvas element in fullscreen.


### Features Left to Implement
* Mp3 mode
  * Ability to upload an mp3 file and analyse this file as audio input instead of using microphone input
* Ability to save video with sound
* User submitted image gallery
  * User has the option to upload their image to a gallery page and view other user-submitted images


## Technologies Used
* Visual Studio Code
* HTML
* CSS
* Javascript
* [p5.js](https://p5js.org/)
  * Javascript library that is an interpretation of Processing.
* [p5.sound.js](https://p5js.org/reference/#/libraries/p5.sound)
  * Builds on the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
* [p5.dom.js](https://p5js.org/reference/#/libraries/p5.dom)
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
* [jShint](https://jshint.com/)

### p5.sound Classes Used
* p5.AudioIn - microphone
* p5.Amplitude - Analyze volume (amplitude)
* p5.FFT - Analyze amplitude over time / frequency.

## Deployment 
This project was developed using the code editor Visual Studio Code, committed to git and pushed to GitHub using the terminal. 

This site is hosted using GitHub pages, deployed directly from the master branch. The deployed site will update automatically upon new commits to the master branch. In order for the site to deploy correctly on GitHub pages, the landing page must be named `index.html`.

### How this project was deployed to GitHub Pages
1. Log into GitHub
2. Select the repository
3. Select the repository settings
4. Navigate to the GitHub Pages secction
5. Set Source to the Master Branch. This automatically refreshes the page and deploys the website.

### How to run this project locally
1. Install Git following [these instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
2. Go to the [repository](https://github.com/tesoph/audio)
3. Click "clone or download"
4. Copy the clone URL 
5. Open command line interface
6. Create a directory
```console
mkdir repo
```
7. Change the current working directory to the directory from the previous step
```console
cd repo
```
8. Clone the repository to this directory 
```console
git clone https://github.com/USERNAME/REPOSITORY
```
9. Press enter
10. To cut ties with this GitHub repository, navigate to the directory it is in and type `git remote rm origin` into the command line.


## Testing
Testing information can be found in separate [testing.md](testing.md) file


## Credits
### Code
* audioVisualizer.js
    * The code for the attractor and mover classes in audioVisualizer.js is adapted from [chapter 2 of the book "The Nature of Code" by Daniel Shiffman](https://natureofcode.com/book/chapter-2-forces/).
    * Code to check if the browser supports media stream API from [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia).
    * Code to generate weighted random numbers from [codetheory.in](https://codetheory.in/weighted-biased-random-number-generation-with-javascript-based-on-probability) by [Rishabh](https://twitter.com/_rishabhp).
    * How to deal with resetting the sketch on screen rotation or orientation change was informed by [this coding train tutorial](https://www.youtube.com/watch?v=lm8Y8TD4CTM).
  
* toolbar.js
    * Code to generate a random string of characters from [StackOverflow](https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript).
    * Code to launch fullscreen from [David Walsh Blog](https://davidwalsh.name/fullscreen).
  
* settingsMenu.js
   * Code for spectrum colorpicker from [brgins.github.io](https://bgrins.github.io/spectrum/).
  
* main.css
   * Styling cross-browser compatible range inputs with CSS from [css-tricks.com](https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/*/).
  
### Acknowledgements

* This README was created following the format of and has taken inspiration from Code Institute student [AJGreaves's README](https://github.com/AJGreaves/picflip/blob/master/README.md).
  
* Thanks to my mentor Brian Macharia for support and advice.



**This is for educational use.**