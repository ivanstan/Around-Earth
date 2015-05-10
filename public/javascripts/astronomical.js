/**
 * Created by Ivan on 4/30/2015.
 */
App.modules.astronomical = {

    /*
     Update Interval in number of seconds
     */
    updateInterval: 60,
    sunMarker: null,
    moonMarker: null,

    init: function () {
        // SETUP MARKERS
        App.modules.astronomical.getAstronomicalPosition(App.modules.astronomical.setupAstronomicalMarkers);

        // UPDATE MARKERS
        var interval = 1000 * App.modules.astronomical.updateInterval;
        setInterval((function () {
            App.modules.astronomical.getAstronomicalPosition(App.modules.astronomical.updateAstronomicalMarkers);
        }), interval);
    },

    getAstronomicalPosition: function (callback) {
        $.ajax({
            data: App.user.position,
            url: App.settings.apiEndpoint + 'api/astronomical-position',
            dataType: 'json',
            success: function (data) {
                callback(data);
            }
        });
    },

    setupAstronomicalMarkers: function (data) {
        // SUN
        App.modules.astronomical.sunMarker = new google.maps.Marker({
            position: (new google.maps.LatLng(data.sun.latitude, data.sun.longitude)),
            icon: {
                url: 'images/sun.png'
            },
            map: App.map
        });

        App.orbit.sunMarkerInfoWindow = new InfoBox({
            content: 'Sun',
            boxStyle: App.infoWindowStyle,
            pixelOffset: new google.maps.Size(-65, 5)
        });
        App.orbit.sunMarkerInfoWindow.open(App.map, App.modules.astronomical.sunMarker);

        // MOON
        App.modules.astronomical.moonMarker = new google.maps.Marker({
            position: (new google.maps.LatLng(data.moon.latitude, data.moon.longitude)),
            icon: {
                url: 'images/moon.png'
            },
            map: App.map
        });

        App.orbit.moonMarkerInfoWindow = new InfoBox({
            content: 'Moon',
            boxStyle: App.infoWindowStyle,
            pixelOffset: new google.maps.Size(-65, 5)
        });
        App.orbit.moonMarkerInfoWindow.open(App.map, App.modules.astronomical.moonMarker);
    },

    updateAstronomicalMarkers: function (data) {
        App.modules.astronomical.sunMarker.setPosition((new google.maps.LatLng(data.sun.latitude, data.sun.longitude)));
        App.modules.astronomical.moonMarker.setPosition((new google.maps.LatLng(data.moon.latitude, data.moon.longitude)));
    }

}