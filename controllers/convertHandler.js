var units = {
  gal: {returnUnit: 'L', factor: 3.78541, string: 'gallons'},
  l: {returnUnit: 'gal', factor: 1 / 3.78541, string: 'liters'},
  mi: {returnUnit: 'km', factor: 1.60934, string: 'miles'},
  km: {returnUnit: 'mi', factor: 1 / 1.60934, string: 'kilometers'},
  lbs: {returnUnit: 'kg', factor: 0.453592, string: 'pounds'},
  kg: {returnUnit: 'lbs', factor: 1 / 0.453592, string: 'kilograms'}
};

function normalizeUnit(unit) {
  var normalized = unit.toLowerCase();
  return normalized === 'l' ? 'L' : normalized;
}

function getNumberValue(numberText) {
  if (!numberText) {
    return 1;
  }

  var pattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\/[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/;
  if (!pattern.test(numberText)) {
    return 'invalid number';
  }

  var parts = numberText.split('/');
  var numerator = Number(parts[0]);
  var denominator = parts.length === 2 ? Number(parts[1]) : 1;
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return 'invalid number';
  }

  var value = numerator / denominator;
  return Number.isFinite(value) ? value : 'invalid number';
}

var convertHandler = {
  getNum: function (input) {
    var unitStart = /[a-zA-Z]/.exec(input);
    return getNumberValue(unitStart ? input.slice(0, unitStart.index) : input);
  },

  getUnit: function (input) {
    var unitStart = /[a-zA-Z]/.exec(input);
    if (!unitStart) {
      return 'invalid unit';
    }

    var unit = normalizeUnit(input.slice(unitStart.index));
    return units[unit.toLowerCase()] ? unit : 'invalid unit';
  },

  getReturnUnit: function (initUnit) {
    if (initUnit === 'invalid unit') {
      return 'invalid unit';
    }

    var unit = units[initUnit.toLowerCase()];
    return unit ? unit.returnUnit : 'invalid unit';
  },

  getString: function (initNum, initUnit, returnNum, returnUnit) {
    var numberInvalid = initNum === 'invalid number';
    var unitInvalid = initUnit === 'invalid unit';
    if (numberInvalid && unitInvalid) {
      return 'invalid number and unit';
    }
    if (numberInvalid) {
      return 'invalid number';
    }
    if (unitInvalid || returnUnit === 'invalid unit') {
      return 'invalid unit';
    }

    var initialUnit = units[initUnit.toLowerCase()];
    var convertedUnit = units[returnUnit.toLowerCase()];
    return initNum + ' ' + initialUnit.string + ' converts to ' + returnNum + ' ' + convertedUnit.string;
  },

  convert: function (initNum, initUnit) {
    if (initNum === 'invalid number') {
      return 'invalid number';
    }
    if (initUnit === 'invalid unit') {
      return 'invalid unit';
    }

    var unit = units[initUnit.toLowerCase()];
    if (!unit) {
      return 'invalid unit';
    }

    return Number((initNum * unit.factor).toFixed(5));
  }
};

module.exports = convertHandler;
