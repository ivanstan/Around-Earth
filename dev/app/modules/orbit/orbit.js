'use strict';

angular.module('App.orbit', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/orbit', {
    templateUrl: 'modules/orbit/orbit.html',
    controller: 'OrbitController'
  });
}])

.controller('OrbitController', [function() {

}]);