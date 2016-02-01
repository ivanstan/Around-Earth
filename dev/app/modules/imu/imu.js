'use strict';

angular.module('App.imu', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/imu', {
    templateUrl: 'modules/imu/imu.html',
    controller: 'ImuController'
  });
}])

.controller('ImuController', [function() {

}]);