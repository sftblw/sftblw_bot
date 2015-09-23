var T = require('./fn/common/tweetInstance');
var die = require('./fn/common/die');
var help = require('./fn/help');
//var dummyMention = require('./fn/dummyMention');
var poster = require('./fn/common/postAvoidDuplicate');

console.log("sftblw_bot running");

var stream = T.stream('user', {});
var randomImage = require('./fn/randomImage');
var randomReply = require('./fn/randomReply');


///////////////////////////////////
// main
poster("씨에이치-봇이 시작해씁니다. @sftblw");

stream.on('tweet', function (msg) {
    //dummyMention(msg);
    if (!help(msg)) {
      randomImage.processAll(msg);
      randomReply(msg);
    }
});
//
//////////////////////////////////


var baseDir = "/media/networkshare/ccwpc/DaumCloud/사진/desktop/";
//var baseDir = "D:/Clouds/DaumCloud/사진/desktop/";
//var baseDir = "D:/DaumCloud/사진/desktop/";
var commonFormat = [".png", ".jpg", ".gif"];
randomImage.newRandomImagePoster(
  baseDir + "짤방",
  commonFormat,
  "짤방"
);
randomImage.newRandomImagePoster(
  baseDir + "anicap",
  commonFormat,
  "캡처"
);
randomImage.newRandomImagePoster(
  baseDir,
  [".gif"],
  "움짤"
);
