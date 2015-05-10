/**
 * Created by Ivan on 4/29/2015.
 */
/**
 * Created by Ivan on 4/29/2015.
 */
App.modules.orbit = {
    satelliteOrbit: null,

    initialize: function() {

    },

    draw: function (data) {
        var orbit = [];

        var apogee = {
            altitude: 0
        }

        var perigee = {
            altitude: 9007199254740992
        }

        for (i in data.orbit) {
            var latitude = parseFloat(data.orbit[i].latitude);
            var longitude = parseFloat(data.orbit[i].longitude);
            orbit.push((new google.maps.LatLng(latitude, longitude)));

            if (data.orbit[i].altitude > apogee.altitude) {
                apogee = data.orbit[i]
            }

            if (data.orbit[i].altitude < perigee.altitude) {
                perigee = data.orbit[i]
            }
        }

        if (App.orbit.apogeeMarker == null) {
            App.orbit.apogeeMarker = new google.maps.Marker({
                position: (new google.maps.LatLng(parseFloat(apogee.latitude), parseFloat(apogee.longitude))),
                icon: {
                    url: 'images/apogee.png',
                    size: new google.maps.Size(30, 30),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(20, 20)
                },
                map: App.map
            });

            App.orbit.apogeeMarkerInfoWindow = new InfoBox({
                content: 'Apogee<br>Altitude: ' + parseFloat(apogee.altitude).toFixed(2) + ' km',
                pixelOffset: new google.maps.Size(-65, 15),
                boxStyle: App.infoWindowStyle
            });

            if(App.settings.apogeeInfoWindowOpen) {
                App.orbit.apogeeMarkerInfoWindow.open(App.map, App.orbit.apogeeMarker);
            }

            google.maps.event.addListener(App.orbit.apogeeMarker, 'click', function () {
                if (App.isInfoWindowOpen(App.orbit.apogeeMarkerInfoWindow)) {
                    App.orbit.apogeeMarkerInfoWindow.close();
                    localStorage.setItem('apogeeInfoWindowOpen', false);
                    App.settings.apogeeInfoWindowOpen = false;
                } else {
                    localStorage.setItem('apogeeInfoWindowOpen', true);
                    App.settings.apogeeInfoWindowOpen = true;
                    App.orbit.apogeeMarkerInfoWindow.open(App.map, App.orbit.apogeeMarker);
                }
            });

        } else {
            App.orbit.apogeeMarker.content = 'Apogee<br>Altitude: ' + parseFloat(apogee.altitude).toFixed(2) + ' km';
            App.orbit.apogeeMarker.setPosition(apogeePosition);
        }

        if (App.orbit.perigeeMarker == null) {
            App.orbit.perigeeMarker = new google.maps.Marker({
                position: (new google.maps.LatLng(parseFloat(perigee.latitude), parseFloat(perigee.longitude))),
                icon: {
                    url: 'images/perigee.png',
                    size: new google.maps.Size(30, 30),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(20, 20)
                },
                map: App.map
            });

            App.orbit.perigeeMarkerInfoWindow = new InfoBox({
                content: 'Perigee<br>Altitude: ' + parseFloat(perigee.altitude).toFixed(2) + ' km',
                pixelOffset: new google.maps.Size(-65, 15),
                boxStyle: App.infoWindowStyle
            });

            if(App.settings.perigeeInfoWindowOpen) {
                App.orbit.perigeeMarkerInfoWindow.open(App.map, App.orbit.perigeeMarker);
            }

            google.maps.event.addListener(App.orbit.perigeeMarker, 'click', function () {
                if (App.isInfoWindowOpen(App.orbit.perigeeMarkerInfoWindow)) {
                    App.orbit.perigeeMarkerInfoWindow.close();
                    localStorage.setItem('perigeeInfoWindowOpen', false);
                    App.settings.perigeeInfoWindowOpen = false;

                } else {
                    App.orbit.perigeeMarkerInfoWindow.open(App.map, App.orbit.perigeeMarker);
                    localStorage.setItem('perigeeInfoWindowOpen', true);
                    App.settings.perigeeInfoWindowOpen = true;
                }
            });

        } else {
            App.orbit.perigeeMarker.content = 'Perigee<br>Altitude: ' + parseFloat(perigee.altitude).toFixed(2) + ' km';
            App.orbit.perigeeMarker.setPosition(perigeePosition);
        }

        if (App.modules.orbit.satelliteOrbit) {
            App.modules.orbit.satelliteOrbit.setMap(null);
        }

        App.modules.orbit.satelliteOrbit = new google.maps.Polyline({
            path: orbit,
            geodesic: false,
            strokeColor: '#ffffff', // orbitPath color
            strokeOpacity: 0.5,
            strokeWeight: 2
        });

        App.modules.orbit.satelliteOrbit.setMap(App.map);
    }

}