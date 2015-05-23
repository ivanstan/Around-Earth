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
        },
        timezone: GetTimezoneShort(new Date())
    },
    bindEvents: {
        updateSatellitePosition: null,
        passingOverCountdown: null
    },
    settings: {
        showGroundStations: localStorage.getItem('ground-stations') ? localStorage.getItem('ground-stations') : true,
        nightOverlay: true,
        apogeeInfoWindowOpen: localStorage.getItem('apogeeInfoWindowOpen') ? localStorage.getItem('apogeeInfoWindowOpen') : true,
        perigeeInfoWindowOpen: localStorage.getItem('perigeeInfoWindowOpen') ? localStorage.getItem('perigeeInfoWindowOpen') : true,
        toolbarRightOpen: true,
        tickerLastUpdated: false,
        dashboardOpen: localStorage.getItem('dashboardOpen') ? localStorage.getItem('dashboardOpen') : false,
        activePage: localStorage.getItem('active-tab') ? localStorage.getItem('active-tab') : '#page-map'
    },
    orbit: {},
    satellite: {
        name: 25544,
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
        App.modules.map.init(App.user.position);
        //App.modules.sky.init();

        // SET ACTIVE TAB
        $('.tabs-nav li').removeClass('active');
        $('[href="' + App.settings.activePage + '"]').parent('li').addClass('active');

        // SET VISIBLE PAGE
        $('.tabs-page').hide();
        $(App.settings.activePage).show();

        // INIT PAGE
        switch(App.settings.activePage) {
            case('#page-sky'):

                break;

            default:

        }

        $('.tabs-nav a').click(function(e){
            e.preventDefault();
            $('.tabs-nav li').removeClass('active');
            $(this).parent('li').addClass('active');
            $('.tabs-page').hide();
            var show = $(this).attr('href');
            $(show).show();
            localStorage.setItem('active-tab', show);
        });

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

        if(App.settings.dashboardOpen) {
            $('#toolbar-bottom').removeClass('active');
        } else {
            $('#toolbar-bottom').removeClass('active');
        }

        /* INITIALIZE BOOTSTRAP CONTROLS*/
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();
    });
})(jQuery);





