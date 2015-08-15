var Twit = require('twit');
var keys = require('../../config/keys.json');
var T = new Twit(keys);
module.exports = T;
