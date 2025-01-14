/**
 * Created by Ivan on 4/29/2015.
 */
/**
 * Created by Ivan on 4/29/2015.
 */
App.modules.orbit = {

    satelliteOrbit: null,
    apogeeMarker: null,
    perigeeMarker: null,
    apogeeMarkerInfoWindow: null,
    perigeeMarkerInfoWindow: null,

    initialize: function() {

    },

    draw: function (data) {
        var orbit = [];

        var apogee = {
            altitude: 0
        };

        var perigee = {
            altitude: 9007199254740992
        };

        var orbitData = [];
        var orbits = 2;
        var timeDelta = 30;
        var timestamp = Math.floor(Date.now() / 1000);
        //calculate orbit line
        var calcPeriodHalf = Math.round(data.tle.orbit_time / 2 * orbits);
        var startTime = timestamp - calcPeriodHalf;
        var endTime = timestamp + calcPeriodHalf;
        while(startTime < endTime) {
            var time = new Orb.Time((new Date(startTime * 1000)));
            var geo = App.satellite.propagator.position.geographic(time);

            var point = {
                'latitude': geo.latitude,
                'longitude': geo.longitude,
                'altitude': geo.altitude
            };

            orbitData.push(point);

            startTime += timeDelta;
        }

        for (var i in orbitData) {
            var latitude = parseFloat(orbitData[i].latitude);
            var longitude = parseFloat(orbitData[i].longitude);
            orbit.push((new google.maps.LatLng(latitude, longitude)));

            if (orbitData[i].altitude > apogee.altitude) {
                apogee = orbitData[i]
            }

            if (orbitData[i].altitude < perigee.altitude) {
                perigee = orbitData[i]
            }
        }

        if (App.modules.orbit.apogeeMarker == null) {
            App.modules.orbit.apogeeMarker = new google.maps.Marker({
                position: (new google.maps.LatLng(parseFloat(apogee.latitude), parseFloat(apogee.longitude))),
                icon: {
                    url: 'images/apogee.png',
                    size: new google.maps.Size(30, 30),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(20, 20)
                },
                map: App.map
            });

            App.modules.orbit.apogeeMarkerInfoWindow = new InfoBox({
                content: 'Apogee<br>Altitude: ' + parseFloat(apogee.altitude).toFixed(2) + ' km',
                pixelOffset: new google.maps.Size(-65, 15),
                boxStyle: App.infoWindowStyle
            });

            if(App.settings.apogeeInfoWindowOpen) {
                App.modules.orbit.apogeeMarkerInfoWindow.open(App.map, App.modules.orbit.apogeeMarker);
            }

            google.maps.event.addListener(App.modules.orbit.apogeeMarker, 'click', function () {
                if (App.isInfoWindowOpen(App.modules.orbit.apogeeMarkerInfoWindow)) {
                    App.modules.orbit.apogeeMarkerInfoWindow.close();
                    localStorage.setItem('apogeeInfoWindowOpen', false);
                    App.settings.apogeeInfoWindowOpen = false;
                } else {
                    localStorage.setItem('apogeeInfoWindowOpen', true);
                    App.settings.apogeeInfoWindowOpen = true;
                    App.modules.orbit.apogeeMarkerInfoWindow.open(App.map, App.modules.orbit.apogeeMarker);
                }
            });

        } else {
            App.modules.orbit.apogeeMarker.content = 'Apogee<br>Altitude: ' + parseFloat(apogee.altitude).toFixed(2) + ' km';
            App.modules.orbit.apogeeMarker.setPosition((new google.maps.LatLng(parseFloat(apogee.latitude), parseFloat(apogee.longitude))));
        }

        if (App.modules.orbit.perigeeMarker == null) {
            App.modules.orbit.perigeeMarker = new google.maps.Marker({
                position: (new google.maps.LatLng(parseFloat(perigee.latitude), parseFloat(perigee.longitude))),
                icon: {
                    url: 'images/perigee.png',
                    size: new google.maps.Size(30, 30),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(20, 20)
                },
                map: App.map
            });

            App.modules.orbit.perigeeMarkerInfoWindow = new InfoBox({
                content: 'Perigee<br>Altitude: ' + parseFloat(perigee.altitude).toFixed(2) + ' km',
                pixelOffset: new google.maps.Size(-65, 15),
                boxStyle: App.infoWindowStyle
            });

            if(App.settings.perigeeInfoWindowOpen) {
                App.modules.orbit.perigeeMarkerInfoWindow.open(App.map, App.modules.orbit.perigeeMarker);
            }

            google.maps.event.addListener(App.modules.orbit.perigeeMarker, 'click', function () {
                if (App.isInfoWindowOpen(App.modules.orbit.perigeeMarkerInfoWindow)) {
                    App.modules.orbit.perigeeMarkerInfoWindow.close();
                    localStorage.setItem('perigeeInfoWindowOpen', false);
                    App.settings.perigeeInfoWindowOpen = false;

                } else {
                    App.modules.orbit.perigeeMarkerInfoWindow.open(App.map, App.modules.orbit.perigeeMarker);
                    localStorage.setItem('perigeeInfoWindowOpen', true);
                    App.settings.perigeeInfoWindowOpen = true;
                }
            });

        } else {
            App.modules.orbit.perigeeMarker.content = 'Perigee<br>Altitude: ' + parseFloat(perigee.altitude).toFixed(2) + ' km';
            App.modules.orbit.perigeeMarker.setPosition((new google.maps.LatLng(parseFloat(perigee.latitude), parseFloat(perigee.longitude))));
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