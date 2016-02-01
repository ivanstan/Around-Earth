'use strict';

angular.module('App.version', [
  'App.version.interpolate-filter',
  'App.version.version-directive'
])

.value('version', '0.1');
