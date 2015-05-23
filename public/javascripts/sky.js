/**
 * Created by Ivan on 5/17/2015.
 */
App.modules.sky = {

    init: function() {
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', App.modules.sky.deviceOrientation, false);
        }

        //App.modules.sky.augmentedReality();
    },

    deviceOrientation: function(e) {
        // gamma is the left-to-right tilt in degrees, where right is positive
        var roll = Math.round(e.gamma);
        // beta is the front-to-back tilt in degrees, where front is positive
        var pitch = Math.round(e.beta);
        // alpha is the compass direction the device is facing in degrees
        var dir = Math.round(e.alpha);

        $('#beta').html(pitch);
        $('#alpha').html(dir);
        $('#gamma').html(roll);

        var r_pitch = pitch * (-1);
        $('#sky-overlay').css('transform', 'translateY(' + pitch + 'px)');

        console.log(e);


        //document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
        //document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
        //document.getElementById("doDirection").innerHTML = Math.round(dir);
        //
        //// Apply the transform to the image
        //var logo = document.getElementById("imgLogo");
        //logo.style.webkitTransform = "rotate("+ tiltLR +"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
        //logo.style.MozTransform = "rotate("+ tiltLR +"deg)";
        //logo.style.transform = "rotate("+ tiltLR +"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
        // Some other fun rotations to try...
        //var rotation = "rotate3d(0,1,0, "+ (tiltLR*-1)+"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
        //var rotation = "rotate("+ tiltLR +"deg) rotate3d(0,1,0, "+ (tiltLR*-1)+"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";


    },

    augmentedReality: function() {
        var video = document.querySelector('#augmented-reality');
        if (navigator.getUserMedia) {
            navigator.getUserMedia('video', function(stream) {
                video.src = stream;
                video.controls = true;
                localMediaStream = stream;
            }, App.modules.sky.augmentedRealityFailed);
        } else if (navigator.webkitGetUserMedia) {
            navigator.webkitGetUserMedia({video: true}, function(stream) {
                video.src = window.URL.createObjectURL(stream);
                video.controls = false;
                localMediaStream = stream;
            }, App.modules.sky.augmentedRealityFailed);
        } else {
            App.modules.sky.augmentedRealityFailed({target: video});
        }
    },

    augmentedRealityFailed: function() {

    },

    destroy: function() {
        window.addEventListener('deviceorientation',App.modules.sky.deviceOrientation, false);
    }

}