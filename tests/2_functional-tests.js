var assert = require('node:assert/strict');
var request = require('supertest');
var app = require('../index');

describe('GET /api/convert', function () {
  it('converts a valid input', async function () {
    var response = await request(app).get('/api/convert').query({input: '10L'});
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      initNum: 10,
      initUnit: 'L',
      returnNum: 2.64172,
      returnUnit: 'gal',
      string: '10 liters converts to 2.64172 gallons'
    });
  });

  it('returns an invalid unit error', async function () {
    var response = await request(app).get('/api/convert').query({input: '32g'});
    assert.equal(response.text, 'invalid unit');
  });

  it('returns an invalid number error', async function () {
    var response = await request(app).get('/api/convert').query({input: '3/7.2/4kg'});
    assert.equal(response.text, 'invalid number');
  });

  it('returns an error when both number and unit are invalid', async function () {
    var response = await request(app).get('/api/convert').query({input: '3/7.2/4kilomegagram'});
    assert.equal(response.text, 'invalid number and unit');
  });

  it('defaults to one when no number is provided', async function () {
    var response = await request(app).get('/api/convert').query({input: 'kg'});
    assert.equal(response.status, 200);
    assert.equal(response.body.initNum, 1);
    assert.equal(response.body.initUnit, 'kg');
    assert.equal(response.body.returnNum, 2.20462);
    assert.equal(response.body.string, '1 kilograms converts to 2.20462 pounds');
  });
});
