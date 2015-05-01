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

        // SETUP ORBIT
        //App.modules.astronomical.getAstronomicalOrbit(App.modules.astronomical.setupAstronomicalOrbit);

        // UPDATE MARKERS
        var interval = 1000 * App.modules.astronomical.updateInterval;
        setInterval((function () {
            App.modules.astronomical.getAstronomicalPosition(App.modules.astronomical.updateAstronomicalMarkers);
        }), interval);
    },

    getAstronomicalOrbit: function (callback) {
        $.ajax({
            url: App.settings.apiEndpoint + 'api/astronomical-orbit',
            dataType: 'json',
            success: function (data) {
                callback(data);
            }
        });
    },

    getAstronomicalPosition: function (callback) {
        $.ajax({
            url: App.settings.apiEndpoint + 'api/astronomical-position',
            dataType: 'json',
            success: function (data) {
                callback(data);
            }
        });
    },

    setupAstronomicalMarkers: function (data) {
        // SUN
        var sunPosition = new google.maps.LatLng(data.sun.latitude, data.sun.longitude);
        App.modules.astronomical.sunMarker = new google.maps.Marker({
            position: sunPosition,
            map: App.map
        });

        App.orbit.sunMarkerInfoWindow = new InfoBox({
            content: 'Sun',
            boxStyle: App.infoWindowStyle,
            pixelOffset: new google.maps.Size(-65, 5)
        });
        App.orbit.sunMarkerInfoWindow.open(App.map, App.modules.astronomical.sunMarker);

        // MOON
        var moonPosition = new google.maps.LatLng(data.moon.latitude, data.moon.longitude);
        App.modules.astronomical.moonMarker = new google.maps.Marker({
            position: moonPosition,
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
        var sunPosition = new google.maps.LatLng(data.sun.latitude, data.sun.longitude);
        App.modules.astronomical.sunMarker.setPosition(sunPosition);

        var moonPosition = new google.maps.LatLng(data.moon.latitude, data.moon.longitude);
        App.modules.astronomical.moonMarker.setPosition(moonPosition);
    },

    setupAstronomicalOrbit: function (data) {
        sunOrbit = [];
        moonOrbit = [];

        for (var j in data.sun_orbit) {
            var latitude = parseFloat(data.sun_orbit[j].latitude);
            var longitude = parseFloat(data.sun_orbit[j].longitude);

            var point = new google.maps.LatLng(latitude, longitude);
            sunOrbit.push(point);
        }

        for (var i in data.moon_orbit) {
            var latitude = parseFloat(data.moon_orbit[i].latitude);
            var longitude = parseFloat(data.moon_orbit[i].longitude);

            var point = new google.maps.LatLng(latitude, longitude);
            moonOrbit.push(point);
        }

        App.modules.astronomical.sunOrbit = new google.maps.Polyline({
            path: sunOrbit,
            geodesic: false,
            strokeColor: '#ffffff', // orbitPath color
            strokeOpacity: 0.5,
            strokeWeight: 2
        });
        App.modules.astronomical.sunOrbit.setMap(App.map);

        App.modules.astronomical.moonOrbit = new google.maps.Polyline({
            path: moonOrbit,
            geodesic: false,
            strokeColor: '#ffffff', // orbitPath color
            strokeOpacity: 0.5,
            strokeWeight: 2
        });
        App.modules.astronomical.moonOrbit.setMap(App.map);
    }

}