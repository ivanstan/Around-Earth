/**
 * Created by Ivan on 5/11/2015.
 */
App.modules.map = {

    init: function(position) {
        App.mapInitialized = true;
        App.modules.map.getSatelliteData(App.satellite.name, position, function () {

            App.satellite.propagator = Orb.Satellite({
                'first_line': App.satellite.data.tle.first_line,
                'second_line': App.satellite.data.tle.second_line
            });
            App.modules.map.setupMap(App.satellite.data);
            var interval = 500; // where X is your every X seconds
            App.bindEvents.updateSatellitePosition = setInterval(App.modules.map.updateSatellitePosition, interval);

            App.modules.rightPanel.updateRightPanel();
            App.modules.map.updatePassingOver(App.satellite.data.position.latitude, App.satellite.data.position.longitude);
            App.modules.orbit.draw(App.satellite.data);
            App.modules.altitudeChart.update(App.satellite.data);
        });
    },

    setupMap: function (data) {
        var latitude = parseFloat(data.position.latitude);
        var longitude = parseFloat(data.position.longitude);
        App.geoCoder = new google.maps.Geocoder();
        App.modules.altitudeChart.init(data);

        var options = {
            styles: styles,
            center: (new google.maps.LatLng(latitude, longitude)),
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            minZoom: 2,
            backgroundColor: isNight() ? '#0f1f51' : '#3646a7'
        };

        App.map = new google.maps.Map(document.getElementById("map"), options);

        if (App.settings.nightOverlay && isNight()) {
            var mapsEngineLayer = new google.maps.visualization.MapsEngineLayer({
                mapId: '10446176163891957399-13737975182519107424-4',
                layerKey: 'layer_00001',
                map: App.map
            });
        }

        App.modules.astronomical.init();

        App.mapFeatures.dayNightTerminator = new DayNightOverlay({
            map: App.map,
            fillColor: 'rgba(0,0,0,0.3)',
            date: new Date(Date.UTC())
        });
        App.mapFeatures.dayNightTerminator.setDate(Date.UTC());

        App.satellite.marker = new google.maps.Marker({
            position: (new google.maps.LatLng(latitude, longitude)),
            icon: {
                url: 'images/station-white.png',
                size: new google.maps.Size(169, 62),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(32, 11),
                scaledSize: new google.maps.Size(64, 22)
            },
            map: App.map
        });

        App.user.marker = new google.maps.Marker({
            position: (new google.maps.LatLng(App.user.position.latitude, App.user.position.longitude)),
            icon: {
                url: 'images/location.png'
                //size: new google.maps.Size(81, 81),
                //origin: new google.maps.Point(0, 0),
                //anchor: new google.maps.Point(40, 55)
            },
            draggable: true,
            map: App.map
        });

        google.maps.event.addListener(App.user.marker, 'dragend', function (event) {
            App.user.position.latitude = event.latLng.lat();
            App.user.position.longitude = event.latLng.lng();
        });

        google.maps.event.addListener(App.user.marker, 'click', function (event) {
            App.modules.contextualPopup.init('user');
        });

        $('#label-satellite').html(data.satellite);

        if (App.settings.showGroundStations) {
            App.modules.groundStations.init();
        }
    },

    destroy: function() {
        App.mapInitialized = false;
    },

    updateSatellitePosition: function (position) {
        var time = new Orb.Time((new Date()));
        var geo = App.satellite.propagator.position.geographic(time);
        var observer = new Orb.Observer(App.user.position);
        var observation = new Orb.Observation({"observer": observer, "target": App.satellite.propagator});
        var userView = observation.horizontal(time);

        App.satellite.data.position.latitude = parseFloat(geo.latitude).toFixed(5);
        App.satellite.data.position.longitude = parseFloat(geo.longitude).toFixed(5);
        App.satellite.data.position.altitude = parseFloat(geo.altitude).toFixed(5);


        if(App.mapInitialized == true) {
            App.mapFeatures.dayNightTerminator.setDate(Date.UTC());
            App.satellite.marker.setPosition((new google.maps.LatLng(geo.latitude, geo.longitude)));
            //App.modules.orbit.draw(data);
        }

        App.modules.map.updatePassingOver(geo.latitude, geo.longitude);

        var elevation = userView.elevation * (180 / Math.PI);
        App.modules.rightPanel.updateUserView(userView.azimuth, elevation);

        App.modules.rightPanel.updateRightPanel();

        //App.modules.altitudeChart.update(data);
    },

    updatePassingOver: function (latitude, longitude) {
        var timestamp = Math.round(+new Date() / 1000);
        if (App.settings.tickerLastUpdated == false || timestamp > App.settings.tickerLastUpdated + 60) {
            App.settings.tickerLastUpdated = timestamp;
            App.geoCoder.geocode({'latLng': (new google.maps.LatLng(latitude, longitude))}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        $('#label-passing-over').html(results[0].formatted_address);
                    } else {
                        $('#label-passing-over').html('Ocean');
                    }
                }
            });
        }
    },

    /**
     * Get satellite data from backend.
     *
     * @param name      Satellite Name
     * @param position  Observer Position
     * @param callback  Callback Function
     */
    getSatelliteData: function (name, position, callback) {
        $.ajax({
            data: {
                satellite: name,
                latitude: position.latitude,
                longitude: position.longitude,
                altitude: position.altitude
            },
            method: 'POST',
            url: App.settings.apiEndpoint + 'api/satellite',
            dataType: 'json',
            success: function (data) {
                data.position.latitude = parseFloat(data.position.latitude);
                data.position.longitude = parseFloat(data.position.longitude);
                App.satellite.data = data;

                callback();
            }
        });
    },

}