/**
 * Created by Ivan on 5/1/2015.
 */
App.modules.rightPanel = {

    updateRightPanel: function () {
        var data = App.satellite.data;

        $('#label-latitude').html(parseFloat(data.position.latitude).toFixed(5));
        $('#label-longitude').html(parseFloat(data.position.longitude).toFixed(5));
        $('#label-altitude').html(parseFloat(data.position.altitude).toFixed(2) + ' km');
        $('#label-epoch').html(data.tle.epoch_year + data.tle.epoch_day);
        $('#label-raan').html(data.tle.right_ascension);
        $('#label-argp').html(data.tle.arg_perigee);
        $('#label-ecce').html(data.tle.eccentricity);
        $('#label-inclination').html(data.tle.inclination);
        $('#label-mean-motion').html(data.tle.mean_motion);
        $('#label-ma').html(data.tle.mean_anomaly);
        $('#label-drag').html(data.tle.bstar);
        $('#label-satellite').html(data.satellite);
        var periodMins = parseInt(data.tle.orbit_time / 60);
        $('#label-period').html('~' + periodMins + ' min');
        $('#label-orbit-number').html(data.tle.orbit);
        $('#label-velocity').html(parseFloat(data.tle.range_velocity).toFixed(2) + ' km/h');
        $('#passing-over-time').html(secondstotime(data.next_pass.until));

        if(App.bindEvents.passingOverCountdown == null) {
            App.bindEvents.passingOverCountdown = setInterval(function () {
                App.satellite.data.next_pass.until -= 1;
                $('#passing-over-time').html(secondstotime(App.satellite.data.next_pass.until));
            }, 1000);
        }

    },

    updateUserView: function(azimuth, elevation) {
        var compass_rotation = azimuth;
        var elevation = elevation * -1;

        $('#user-view-elevation #label-elvation').html(parseInt(elevation) + '°');
        $('#user-view-compass #label-azimuth').html(parseInt(compass_rotation) + '°');
        $('#user-view-compass #station').css('transform', 'rotate(' + compass_rotation + 'deg)');
        $('#user-view-elevation #elevation').attr('transform', 'rotate(' + elevation + ' 0 55)');
    }
}

