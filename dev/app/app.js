'use strict';


// Declare app level module which depends on views, and components
angular.module('App', [
  'ngRoute',
  'App.imu',
  'App.orbit',
  'App.earth',
  'App.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/imu'});

  console.log(myAppConfig.bananaHammocks);
}]);

angular.constant('myAppConfig', {ver: '1.2.2', bananas: 6, hammocks: 3, bananaHammocks: true});


var nApp = {
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