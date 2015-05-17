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
    bindEvents: {
        updateSatellitePosition: null,
        passingOverCountdown: null
    },
    settings: {
        showGroundStations: true,
        apogeeInfoWindowOpen: null,
        perigeeInfoWindowOpen: null,
        toolbarRightOpen: true,
        tickerLastUpdated: false,
        dashboardOpen: localStorage.getItem('dashboardOpen')
    },
    orbit: {},
    satellite: {
        name: 'ISS (ZARYA)',
        propagator: null,
        data: {
            tle: null
        },
        marker: null
    },
    map: null,
    geoCoder: null,
    mapInitialized: false,
    mapFeatures: {
        groundStations: [],
        dayNightTerminator: null
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

    isInfoWindowOpen: function (infoWindow) {
        var map = infoWindow.getMap();
        return (map !== null && typeof map !== "undefined");
    },

    ajaxLoaderShow: function () {
        var $ajaxLoader = $('#ajax-loader');
        if (App.settings.toolbarRightOpen) {
            var left = $(window).width() / 2 - $('#toolbar-right').width();
            $ajaxLoader.css('left', left);
        } else {
            $ajaxLoader.css('transform', 'translate(-50%, 0)');
        }
        $ajaxLoader.show();
    },

    ajaxLoaderHide: function () {
        $('#ajax-loader').hide();
    }
};

(function ($) {
    $(document).ready(function () {
        Telemetry.init();

        var height = $(document).height();
        var width = $(document).width();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                position.latitude = position.coords.latitude;
                position.longitude = position.coords.longitude;
                position.altitude = position.coords.altitude ? position.coords.altitude : 0;

                App.user.position = position;

                if (App.user.marker) {
                    App.user.marker.setPosition((new google.maps.LatLng(position.latitude, position.longitude)));
                }

            }, function () {

            }, {
                timeout: 2000,
                maximumAge: 75000
            });
        }

        App.modules.map.init(App.user.position);

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

        var $satelliteSelect = $('#select-satellite');
        $satelliteSelect.select2({
            ajax: {
                url: App.settings.apiEndpoint + "api/search-satellites",
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {search: params.term};
                },
                processResults: function (data, page) {
                    return {results: data};
                },
                cache: false
            }
        });
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();

        $satelliteSelect.change(function () {
            App.satellite.name = $(this).val();
            App.ajaxLoaderShow();
            App.modules.map.getSatelliteData(App.satellite.name, App.user.position, function () {
                App.satellite.propagator = Orb.Satellite(App.satellite.data.tle);
                App.modules.orbit.draw(App.satellite.data);
                App.modules.altitudeChart.init(App.satellite.data);
                App.ajaxLoaderHide();
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
})(jQuery);

function isNight() {
    var hr = (new Date()).getHours();
    return !(hr > 5 && hr < 20);
}

function secondstotime(secs) {
    var t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    var s = t.toTimeString().substr(0, 8);
    if (secs > 86399)
        s = Math.floor((t - Date.parse("1/1/70")) / 3600000) + s.substr(2);
    return s;
}

function drawCircle(point, radius, dir) {
    var d2r = Math.PI / 180;   // degrees to radians
    var r2d = 180 / Math.PI;   // radians to degrees
    var earthsradius = 6371; // 3963 is the radius of the earth in kilometers

    var points = 32;

    // find the raidus in lat/lon
    var rlat = (radius / earthsradius) * r2d;
    var rlng = rlat / Math.cos(point.lat() * d2r);

    var extp = new Array();
    if (dir==1) {
        var start=0;
        var end=points+1; // one extra here makes sure we connect the path
    } else {
        var start=points+1;
        var end=0;
    }
    for (var i=start; (dir==1 ? i < end : i > end); i=i+dir)
    {
        var theta = Math.PI * (i / (points/2));
        ey = point.lng() + (rlng * Math.cos(theta)); // center a + radius x * cos(theta)
        ex = point.lat() + (rlat * Math.sin(theta)); // center b + radius y * sin(theta)
        extp.push(new google.maps.LatLng(ex, ey));
    }
    return extp;
}