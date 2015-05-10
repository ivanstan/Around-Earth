App = {
    modules: {},
    user: {
        marker: null,
        position: {
            latitude: 28.396837,
            longitude: -80.605659,
            altitude: 0
        },
        timezoneOffset: 0,
        timestamp: function () {
            return Math.round(new Date());
        },
        time: function () {
            var now = new Date(App.user.timestamp());
            return now.getFullYear() + '/' + now.getMonth() + '/' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        }
    },
    settings: {
        showGroundStations: true,
        apogeeInfoWindowOpen: null,
        perigeeInfoWindowOpen: null,
        toolbarRightOpen: true,
        tickerLastUpdated: false,
        dashboardOpen: localStorage.getItem('dashboardOpen')
    },
    orbit: {
        apogeeMarker: null,
        perigeeMarker: null,
        apogeeMarkerInfoWindow: null,
        perigeeMarkerInfoWindow: null
    },
    satellite: {
        name: 'ISS (ZARYA)',
        propagator: null,
        data: {
            tle: null
        },
        marker: null
    },
    map: null,
    geocoder: null,
    mapInitialized: false,
    dayNightTerminator: null,
    altitudeChart: null,
    mapFeatures: {
        groundStations: []
    },
    infoWindowStyle: {
        background: '#0F6388',
        opacity: 0.5,
        width: '130px',
        color: '#ffffff'
    },

    toggleSidebar: function () {
        var $sidebar = $('#toolbar-right'),
            width = $sidebar.outerWidth();

        if ($sidebar.is('.active')) {
            $sidebar.removeClass('active').animate({'right': -width}, 300);
            App.settings.toolbarRightOpen = false;
        } else {
            $sidebar.addClass('active').animate({'right': 0}, 200);
            App.settings.toolbarRightOpen = true;
        }

    },

    toggleDashboard: function () {
        var $dashboard = $('#toolbar-bottom'),
            height = $dashboard.outerHeight();

        if ($dashboard.is('.active')) {
            $dashboard.removeClass('active').animate({'bottom': -height}, 300);
            App.settings.dashboardOpen = false;
            localStorage.setItem('dashboardOpen', false);
        } else {
            $dashboard.addClass('active').animate({'bottom': 0}, 200);
            App.settings.dashboardOpen = true;
            localStorage.setItem('dashboardOpen', true);
        }

    },

    repositionToolbarRight: function () {
        var $sidebar = $('#toolbar-right'),
            width = $sidebar.outerWidth();

        $sidebar.css('right', -width);
    },

    initializeMap: function (data) {
        var latitude = parseFloat(data.position.latitude);
        var longitude = parseFloat(data.position.longitude);
        App.geocoder = new google.maps.Geocoder();
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

        if (isNight()) {
            var mapsEngineLayer = new google.maps.visualization.MapsEngineLayer({
                mapId: '10446176163891957399-13737975182519107424-4',
                layerKey: 'layer_00001',
                map: App.map
            });
        }

        App.modules.astronomical.init();

        App.dayNightTerminator = new DayNightOverlay({
            map: App.map,
            fillColor: 'rgba(0,0,0,0.3)',
            date: new Date(Date.UTC())
        });
        App.dayNightTerminator.setDate(Date.UTC());

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
            //App.modules.groundStations.init();
        }
    },

    /**
     * Get satellite data from backend.
     *
     * @param name      Satellite Name
     * @param position  Observer Position
     * @param callback  Callback Function
     */
    getSatelliteData: function(name, position, callback) {
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

    updateSatellitePosition: function (position) {
        if (App.mapInitialized) {
            App.dayNightTerminator.setDate(Date.UTC());

            var date = new Date();
            var time = new Orb.Time(date);
            var geo = App.satellite.propagator.position.geographic(time);
            var observer = new Orb.Observer(App.user.position);
            var observation = new Orb.Observation({"observer": observer, "target": App.satellite.propagator});
            var userView = observation.horizontal(time);

            $('#label-latitude').html(parseFloat(geo.latitude).toFixed(5));
            $('#label-longitude').html(parseFloat(geo.longitude).toFixed(5));
            $('#label-altitude').html(parseFloat(geo.altitude).toFixed(2) + ' km');

            App.satellite.marker.setPosition((new google.maps.LatLng(geo.latitude, geo.longitude)));
            App.updateTicker(geo.latitude, geo.longitude);

            var elevation = userView.elevation * (180/Math.PI);
            App.modules.rightPanel.updateUserView(userView.azimuth, elevation);

            //App.modules.rightPanel.updateRightPanel(data);
            //App.modules.orbit.draw(data);
            //App.modules.altitudeChart.update(data);

        } else {
            $.ajax({
                data: {
                    satellite: App.satellite.name,
                    latitude: position.latitude,
                    longitude: position.longitude,
                    altitude: position.altitude
                },
                method: 'POST',
                url: App.settings.apiEndpoint + 'api/satellite',
                dataType: 'json',
                success: function (data) {


                    if (App.mapInitialized) {
                        App.satellite.marker.setPosition((new google.maps.LatLng(latitude, longitude)));
                    } else {
                        App.satellite.propagator = Orb.Satellite(App.satellite.data.tle);
                        App.initializeMap(data);
                        var interval = 500; // where X is your every X seconds
                        setInterval(App.updateSatellitePosition, interval);
                        App.mapInitialized = true;
                    }

                    App.modules.rightPanel.updateRightPanel(data);
                    App.updateTicker(latitude, longitude);
                    App.modules.orbit.draw(data);
                    App.modules.altitudeChart.update(data);
                }
            });
        }
    },

    updateTicker: function (latitude, longitude) {
        var timestamp = Math.round(+new Date() / 1000);
        if (App.settings.tickerLastUpdated == false || timestamp > App.settings.tickerLastUpdated + 60) {
            App.settings.tickerLastUpdated = timestamp;
            App.geocoder.geocode({'latLng': (new google.maps.LatLng(latitude, longitude))}, function (results, status) {
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

    isInfoWindowOpen: function (infoWindow) {
        var map = infoWindow.getMap();
        return (map !== null && typeof map !== "undefined");
    },

    ajaxLoaderShow: function () {
        if (App.settings.toolbarRightOpen) {
            var left = $(window).width() / 2 - $('#toolbar-right').width();
            $('#ajax-loader').css('left', left);
        } else {
            $('#ajax-loader').css('transform', 'translate(-50%, 0)');
        }
        $('#ajax-loader').show();
    },

    ajaxLoaderHide: function () {
        $('#ajax-loader').hide();
    }
};

(function ($) {
    $(document).ready(function () {
        var height = $(document).height();
        var width = $(document).width();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                position.latitude = position.coords.latitude;
                position.longitude = position.coords.longitude;
                position.altitude = position.coords.altitude ? position.coords.altitude : 0;

                App.user.position = position;
                App.updateSatellitePosition(position);

                if (App.user.marker) {
                    App.user.marker.setPosition((new google.maps.LatLng(position.latitude, position.longitude)));
                }

            }, function () {
                App.updateSatellitePosition(App.user.position);
            }, {
                timeout: 10,
                maximumAge: 75000,
                timeout: 5000
            });
        } else {
            App.updateSatellitePosition(App.user.position);
        }

        if (App.mapInitialized == false) {
            App.updateSatellitePosition(App.user.position);
        }

        if (App.settings.toolbarRightOpen) {
            $('#toolbar-right').addClass('active');
        } else {
            $('#toolbar-right').removeClass('active');
        }

        $('#toolbar-right-toggle').click(App.toggleSidebar);
        $('#toolbar-bottom-toggle').click(App.toggleDashboard);

        $(window).resize(function () {
            if (!App.settings.toolbarRightOpen) {
                App.repositionToolbarRight();
            }
        });

        $('#select-satellite').select2({
            ajax: {

                url: App.settings.apiEndpoint + "api/search-satellites",
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        search: params.term
                    };
                },
                processResults: function (data, page) {
                    return {
                        results: data
                    };
                },
                cache: false
            }
        });
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();

        $('#select-satellite').change(function () {
            App.satellite.name = $(this).val();
            App.ajaxLoaderShow();
            $.ajax({
                data: {
                    satellite: App.satellite.name,
                    latitude: App.user.position.latitude,
                    longitude: App.user.position.longitude,
                    altitude: App.user.position.altitude
                },
                method: 'POST',
                url: App.settings.apiEndpoint + 'api/satellite',
                dataType: 'json',
                success: function (data) {
                    App.satellite.tle = data.tle;
                    App.satellite.propagator = Orb.Satellite(App.satellite.data.tle);

                    App.modules.orbit.draw(data);
                    App.modules.altitudeChart.init(data);
                    App.ajaxLoaderHide()
                },
                error: function (jqXHR, textStatus, errorThrown) {

                }
            });
        });

        if (typeof(Storage) !== "undefined") {
            if (localStorage.getItem('dashboardOpen') == "false") {
                $('#toolbar-bottom').removeClass('active');
                App.settings.dashboardOpen = false;
            }

            App.settings.perigeeInfoWindowOpen = localStorage.getItem('perigeeInfoWindowOpen');
            App.settings.apogeeInfoWindowOpen = localStorage.getItem('apogeeInfoWindowOpen');

        } else {
            App.settings.perigeeInfoWindowOpen = true;
            App.settings.apogeeInfoWindowOpen = true;
        }


    });
})(jQuery)

function isNight() {
    var hr = (new Date()).getHours();
    return (hr > 5 && hr < 20) ? false : true;
}

function secondstotime(secs) {
    var t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    var s = t.toTimeString().substr(0, 8);
    if (secs > 86399)
        s = Math.floor((t - Date.parse("1/1/70")) / 3600000) + s.substr(2);
    return s;
}