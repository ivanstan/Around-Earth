'use strict';

describe('App.version module', function() {
  beforeEach(module('App.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
