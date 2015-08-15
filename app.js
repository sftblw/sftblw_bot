var T = require('./fn/common/tweetInstance');

var RandomImage = require('./fn/randomimage');
var randImg = RandomImage();

var dummyMention = require('./fn/dummyMention');

console.log("sftblw_bot running");

var stream = T.stream('user', {});


stream.on('tweet', function (msg) {
    dummyMention(msg);
});
