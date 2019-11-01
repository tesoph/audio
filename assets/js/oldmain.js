/*
function unloadHandler()
{
    if (_scriptSettings.browser.isIE) {
        // Run some unload code for Internet Explorer
        //...
    }
}*/

window.addEventListener('onbeforeunload', function (e) {
    // the absence of a returnValue property on the event will guarantee the browser unload happens
  //  alert("on before unload");
    //delete e['returnValue'];
   // e.returnValue = '';
  });

//https://stackoverflow.com/questions/3239834/window-onbeforeunload-not-working-on-the-ipad
  var isOnIOS = navigator.userAgent.match(/iPad/i)|| navigator.userAgent.match(/iPhone/i);
var eventName = isOnIOS ? "pagehide" : "beforeunload";
window.addEventListener(eventName, function (event) { 
   // window.event.cancelBubble = true; // Don't know if this works on iOS but it might!
   //event.returnValue = '';
   //https://stackoverflow.com/questions/8788802/prevent-safari-loading-from-cache-when-back-button-is-clicked
   document.body.opacity = 0; 
} );

//https://stackoverflow.com/questions/8788802/prevent-safari-loading-from-cache-when-back-button-is-clicked
/*
$(window).bind("onpageshow", function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});
*/
//https://stackoverflow.com/questions/40727989/is-onbeforeunload-cached-on-safari-macos
window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};

https://guwii.com/cache-issues-with-forwards-and-back-history-in-safari/
function unloadingWebsite(e) {
    // Do something just before the user leaves:
    // Eg: Hide/close your menu/reset settings/clear cookies etc, whatever you need to do.
   // document.body.classList.add("unloaded");
  //if (e.persisted) {
  // window.location.reload();
}
}
window.addEventListener("pagehide", function(e) {
    unloadingWebsite(e);
});
window.addEventListener("pageshow", function(e) {
    // You can use the pageshow function if required to double ensure that everything is reset on the page load.
    // Most of the time the "pagehide" event will provide the solution.
    unloadingWebsite(e);
});


///////////Reference////
//https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
//window.onresize = function() {
//document.body.height = window.innerHeight;
//}
//window.onresize(); // called to initially set the height.


/*
var constraints = { audio: true, video: { width: 1280, height: 720 } }; 

navigator.mediaDevices.getUserMedia(constraints)
  .then(function() {
    console.log('getUserMedia completed successfully.');
  })
  .catch(function(error) {
    console.log(error.name + ": " + error.message);
  });*/
  //**
 // * Illustrates how to handle getting the correct deviceId for
 // * a user's stored preference, while accounting for Safari's
 // * security protocol of serving a random deviceId per page load.
 // */
  
 // These would be pulled from some persistent storage...
 var storedVideoDeviceId = '1234';
 var storedVideoDeviceLabel = 'Front camera';
  
 function getDeviceId(devices) {
   var videoDeviceId;
   // Try matching by ID first.
   for (var i = 0; i < devices.length; ++i) {
     var device = devices[i];
     console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
     if (deviceInfo.kind === 'audioinput') {
       if (device.deviceId == storedVideoDeviceId) {
         videoDeviceId = device.deviceId;
         break;
       }
     }
   }
   if (!videoDeviceId) {
     // Next try matching by label.
     for (var i = 0; i < devices.length; ++i) {
       var device = devices[i];
       if (deviceInfo.kind === 'audioinput') {
         if (device.label == storedVideoDeviceLabel) {
           videoDeviceId = device.deviceId;
           break;
         }
       }
     }
     // Sensible default.
     if (!videoDeviceId) {
       videoDeviceId = devices[0].deviceId;
     }
   }
   // Now, the discovered deviceId can be used in getUserMedia() requests.
   var constraints = {
    // audio: true,
     audio: {
       deviceId: {
         exact: videoDeviceId,
       },
     },
   };

   navigator.mediaDevices.getUserMedia(constraints).
     then(function(stream) {
       console.log("reached");
     }).catch(function(error) {
       console.error('getUserMedia() error: ', error);
     });
  
 }
 function handleSuccess(stream) {
   stream.getTracks().forEach(function(track) {
     track.stop();
   });
   navigator.mediaDevices.enumerateDevices().
     then(getDeviceId).catch(function(error) {
       console.error('enumerateDevices() error: ', error);
     });
 }
  // Safari requires the user to grant device access before providing
// all necessary device info, so do that first.
var constraints = {
    audio: true,
    //video: true,
  };
  navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(function(error) {
      console.error('getUserMedia() error: ', error);
    });

    //////

function makeAudioOnlyStreamFromExistingStream(stream) {
    var audioStream = stream.clone();
    var videoTracks = audioStream.getVideoTracks();
    for (var i = 0, len = videoTracks.length; i < len; i++) {
      audioStream.removeTrack(videoTracks[i]);
    }
    console.log('created audio only stream, original stream tracks: ', stream.getTracks());
    console.log('created audio only stream, new stream tracks: ', audioStream.getTracks());
    return audioStream;
  }
   
  function makeVideoOnlyStreamFromExistingStream(stream) {
    var videoStream = stream.clone();
    var audioTracks = videoStream.getAudioTracks();
    for (var i = 0, len = audioTracks.length; i < len; i++) {
      videoStream.removeTrack(audioTracks[i]);
    }
    console.log('created video only stream, original stream tracks: ', stream.getTracks());
    console.log('created video only stream, new stream tracks: ', videoStream.getTracks());
    return videoStream;
  }
  function handleSuccess(stream) {
    var audioOnlyStream = makeAudioOnlyStreamFromExistingStream(stream);
    var videoOnlyStream = makeVideoOnlyStreamFromExistingStream(stream);
    // Do stuff with all the streams...
  }
  function handleError(error) {
    console.error('getUserMedia() error: ', error);
  }
  var constraints = {
    audio: true,
   // video: true,
  };
  navigator.mediaDevices.getUserMedia(constraints).
      then(handleSuccess).catch(handleError);