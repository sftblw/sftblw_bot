var T = require('./fn/common/tweetInstance');

//var dummyMention = require('./fn/dummyMention');
var randomImage = require('./fn/randomImage');

console.log("sftblw_bot running");

var stream = T.stream('user', {});

var baseDir = "/media/networkshare/ccwpc/DaumCloud/사진/desktop/";
//var baseDir = "D:/Clouds/DaumCloud/사진/desktop/";
var commonFormat = [".png", ".jpg", ".gif"];
randomImage.newRandomImagePoster(
  baseDir + "짤방",
  commonFormat,
  "짤방"
);
randomImage.newRandomImagePoster(
  baseDir + "anicap",
  commonFormat,
  "애니캡처"
);


stream.on('tweet', function (msg) {
    //dummyMention(msg);
    randomImage.postAll(msg);
});
