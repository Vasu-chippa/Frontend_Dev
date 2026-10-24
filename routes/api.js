var express = require('express');
var convertHandler = require('../controllers/convertHandler');
var router = express.Router();

router.get('/convert', function (req, res) {
  var input = typeof req.query.input === 'string' ? req.query.input : '';
  var initNum = convertHandler.getNum(input);
  var initUnit = convertHandler.getUnit(input);
  var returnUnit = convertHandler.getReturnUnit(initUnit);
  var returnNum = convertHandler.convert(initNum, initUnit);
  var string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

  res.json({
    initNum: initNum,
    initUnit: initUnit,
    returnNum: returnNum,
    returnUnit: returnUnit,
    string: string
  });
});

module.exports = router;
