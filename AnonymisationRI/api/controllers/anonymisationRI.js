'use strict';

var request = require('request-promise');

module.exports = {queryOldRes, registerToRegistry, receiveAnonyRes};

function registerToRegistry(req, res, next) {
  /**
   * register a new data sharing event to the Registry
   **/
  res.json({message:  "register successfully!"});
}

function queryOldRes(req, res, next) {
  /**
   * query if old result exist in Registry
   **/
  res.json({
    data_provider: "test_provider",
    data_consumer: "test_consumer",
    time_stamp: "2006-01-02 15:04:05",
    dataID: "test_data_007",
    ifExist: 0,
    budget_used: 10
  });
}

function receiveAnonyRes(req, res, next) {
  /**
   * receive anonymised result from anonymisation interface
   **/

  res.json({
    final_status: 111,
    final_result: 111
  });
}
