'use strict';

require('config');

var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
// Auction House data is updated every hour, at HH:36:58
rule.minute = 37;
var updateAuctionStatisticsJob = require('./jobs/updateAuctionStatistics.js');

schedule.scheduleJob(rule, updateAuctionStatisticsJob);