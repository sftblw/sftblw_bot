var T = require('./fn/common/tweetInstance');

//var dummyMention = require('./fn/dummyMention');
var randomImage = require('./fn/randomImage');

console.log("sftblw_bot running");

var stream = T.stream('user', {});


stream.on('tweet', function (msg) {
    //dummyMention(msg);
    randomImage(msg);
});
