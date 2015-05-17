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
        if(App.modules.astronomical.sunMarker == null || App.modules.astronomical.moonMarker == null) {
            App.modules.astronomical.getAstronomicalPosition(App.modules.astronomical.setupAstronomicalMarkers);
        }

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

    getMoonContext: function(data) {
        var context = 'Moon <br><br>';
        //context += 'Azimuth: ' + parseFloat(data.moon.azimuth).toFixed(2) + '<br>';
        //context += 'Elevation: ' + parseFloat(data.moon.altitude).toFixed(2) + '<br><br>';
        context += 'Moon rise: ' + moment.unix(data.moon.rise).format('HH:m:s') + ' ' + App.user.timezone + '<br>';
        context += 'Moon set: ' + moment.unix(data.moon.set).format('HH:m:s') + ' ' + App.user.timezone;
        return context;
    },

    getSunContext: function(data) {
        var context = 'Sun <br><br>';
        //context += 'Azimuth: ' + parseFloat(data.sun.azimuth).toFixed(2) + '<br>';
        //context += 'Elevation: ' + parseFloat(data.sun.altitude).toFixed(2) + '<br><br>';
        context += 'Sun rise: ' + moment.unix(data.sun.rise).format('HH:m:s') + ' ' + App.user.timezone + '<br>';
        context += 'Sun set: ' + moment.unix(data.sun.set).format('HH:m:s') + ' ' + App.user.timezone;
        return context;
    },

    setupAstronomicalMarkers: function (data) {
        // SUN
        App.modules.astronomical.sunMarker = new google.maps.Marker({
            position: (new google.maps.LatLng(data.sun.latitude, data.sun.longitude)),
            context: App.modules.astronomical.getSunContext(data),
            icon: {
                url: 'images/sun.png'
            },
            map: App.map
        });

        //google.maps.event.addListener(App.modules.astronomical.sunMarker, 'click', function (event) {
        //    App.modules.contextualPopup.show(this.context);
        //});

        App.orbit.sunMarkerInfoWindow = new InfoBox({
            content: 'Sun',
            boxStyle: App.infoWindowStyle,
            pixelOffset: new google.maps.Size(-65, 5)
        });
        App.orbit.sunMarkerInfoWindow.open(App.map, App.modules.astronomical.sunMarker);

        // MOON
        App.modules.astronomical.moonMarker = new google.maps.Marker({
            position: (new google.maps.LatLng(data.moon.latitude, data.moon.longitude)),
            context: App.modules.astronomical.getMoonContext(data),
            icon: {
                url: 'images/moon.png'
            },
            map: App.map
        });

        //google.maps.event.addListener(App.modules.astronomical.moonMarker, 'click', function (event) {
        //    App.modules.contextualPopup.show(this.context);
        //});

        App.orbit.moonMarkerInfoWindow = new InfoBox({
            content: 'Moon',
            boxStyle: App.infoWindowStyle,
            pixelOffset: new google.maps.Size(-65, 5)
        });
        App.orbit.moonMarkerInfoWindow.open(App.map, App.modules.astronomical.moonMarker);
    },

    updateAstronomicalMarkers: function (data) {
        App.modules.astronomical.sunMarker.context = App.modules.astronomical.getSunContext(data);
        App.modules.astronomical.moonMarker.context = App.modules.astronomical.getMoonContext(data);
        App.modules.astronomical.sunMarker.setPosition((new google.maps.LatLng(data.sun.latitude, data.sun.longitude)));
        App.modules.astronomical.moonMarker.setPosition((new google.maps.LatLng(data.moon.latitude, data.moon.longitude)));
    }

}