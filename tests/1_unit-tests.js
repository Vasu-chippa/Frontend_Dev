var assert = require('node:assert/strict');
var convertHandler = require('../controllers/convertHandler');

describe('convertHandler', function () {
  it('reads a whole number input', function () {
    assert.equal(convertHandler.getNum('10L'), 10);
  });

  it('reads a decimal number input', function () {
    assert.equal(convertHandler.getNum('2.5kg'), 2.5);
  });

  it('reads a fractional input', function () {
    assert.equal(convertHandler.getNum('1/2gal'), 0.5);
  });

  it('reads a fractional input with a decimal', function () {
    assert.equal(convertHandler.getNum('2.5/6kg'), 2.5 / 6);
  });

  it('returns an error on a double fraction', function () {
    assert.equal(convertHandler.getNum('3/2/3mi'), 'invalid number');
  });

  it('defaults to one when no numerical input is provided', function () {
    assert.equal(convertHandler.getNum('kg'), 1);
  });

  it('reads each valid input unit', function () {
    [
      ['gal', 'gal'], ['GAL', 'gal'], ['L', 'L'], ['l', 'L'],
      ['mi', 'mi'], ['KM', 'km'], ['lbs', 'lbs'], ['KG', 'kg']
    ].forEach(function (testCase) {
      assert.equal(convertHandler.getUnit(testCase[0]), testCase[1]);
    });
  });

  it('returns an error for an invalid input unit', function () {
    assert.equal(convertHandler.getUnit('10kilomegagram'), 'invalid unit');
  });

  it('returns the correct return unit for each valid input unit', function () {
    [
      ['gal', 'L'], ['L', 'gal'], ['mi', 'km'],
      ['km', 'mi'], ['lbs', 'kg'], ['kg', 'lbs']
    ].forEach(function (testCase) {
      assert.equal(convertHandler.getReturnUnit(testCase[0]), testCase[1]);
    });
  });

  it('spells out each valid unit', function () {
    [
      ['gal', 'L', '1 gallons converts to 1 liters'],
      ['L', 'gal', '1 liters converts to 1 gallons'],
      ['mi', 'km', '1 miles converts to 1 kilometers'],
      ['km', 'mi', '1 kilometers converts to 1 miles'],
      ['lbs', 'kg', '1 pounds converts to 1 kilograms'],
      ['kg', 'lbs', '1 kilograms converts to 1 pounds']
    ].forEach(function (testCase) {
      assert.equal(
        convertHandler.getString(1, testCase[0], 1, testCase[1]),
        testCase[2]
      );
    });
  });

  it('converts gal to L', function () {
    assert.equal(convertHandler.convert(1, 'gal'), 3.78541);
  });

  it('converts L to gal', function () {
    assert.equal(convertHandler.convert(1, 'L'), 0.26417);
  });

  it('converts mi to km', function () {
    assert.equal(convertHandler.convert(1, 'mi'), 1.60934);
  });

  it('converts km to mi', function () {
    assert.equal(convertHandler.convert(1, 'km'), 0.62137);
  });

  it('converts lbs to kg', function () {
    assert.equal(convertHandler.convert(1, 'lbs'), 0.45359);
  });

  it('converts kg to lbs', function () {
    assert.equal(convertHandler.convert(1, 'kg'), 2.20462);
  });
});
