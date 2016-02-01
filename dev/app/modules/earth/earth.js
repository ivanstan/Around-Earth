'use strict';

angular.module('App.earth', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/earth', {
    templateUrl: 'modules/earth/earth.html',
    controller: 'EarthController'
  });
}])

.controller('EarthController', [function() {
      //Telemetry.init();
      //nApp.modules.map.init(nApp.user.position);
      //App.modules.sky.init();

      // SET ACTIVE TAB
      $('.tabs-nav li').removeClass('active');
      $('[href="' + nApp.settings.activePage + '"]').parent('li').addClass('active');

      // SET VISIBLE PAGE
      $('.tabs-page').hide();
      $(nApp.settings.activePage).show();

      // INIT PAGE
      switch(nApp.settings.activePage) {
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
          nApp.user.position = position;
          if (nApp.user.marker) {
              nApp.user.marker.setPosition((new google.maps.LatLng(position.latitude, position.longitude)));
          }

        }, function () {

        }, {
          timeout: 2000,
          maximumAge: 75000
        });
      }

      if (nApp.settings.toolbarRightOpen) {
        $('#toolbar-right').addClass('active');
      } else {
        $('#toolbar-right').removeClass('active');
      }

      $('#toolbar-right-toggle').click(nApp.toggleSidebar);
      $('#toolbar-bottom-toggle').click(nApp.toggleDashboard);

      $(window).resize(function () {
        if (!nApp.settings.toolbarRightOpen) {
            nApp.repositionToolbarRight();
        }
      });

      var $satelliteSelect = $('#select-satellite');
      $satelliteSelect.select2({
        ajax: {
          url: nApp.settings.apiEndpoint + "api/search-satellites",
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
        nApp.satellite.name = $(this).val();
        nApp.ajaxLoaderShow();
        nApp.modules.map.getSatelliteData(nApp.satellite.name, nApp.user.position, function () {
          nApp.satellite.propagator = Orb.Satellite(nApp.satellite.data.tle);
          nApp.modules.orbit.draw(nApp.satellite.data);
          nApp.modules.altitudeChart.init(nApp.satellite.data);
          nApp.ajaxLoaderHide();
        });
      });

      if(nApp.settings.dashboardOpen) {
        $('#toolbar-bottom').removeClass('active');
      } else {
        $('#toolbar-bottom').removeClass('active');
      }
}]);