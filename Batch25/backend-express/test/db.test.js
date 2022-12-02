'use strict';
const expect = require('chai').expect;
// var assert = require('assert');

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      expect([1, 2, 3].indexOf(4)).to.be.equal(-1);
      // assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
