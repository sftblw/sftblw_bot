var filter = require('./common/filterTweet');
var schedule = require('node-schedule');
var T = require('./common/tweetInstance');
var dirVisit = require("./common/directoryVisitor");
var fs = require('fs');

var baseDir = "/media/networkshare/ccwpc/DaumCloud/사진/desktop/짤방";
//var baseDir = "D:/Clouds/DaumCloud/사진/desktop/짤방";
var imgList = (function () {
  var list = [];
  var onImgVisitor = {
    onVisitFile: function (file) {
      //console.log(file.format);
      if (
        (file.format === ".png") ||
        (file.format === ".jpg")
      ) {
        list.push(file);
      }
    }
  };
  var ImgVisitor = new dirVisit.ListVisitor(onImgVisitor);
  var rootDir = new dirVisit.Directory(baseDir);
  ImgVisitor.visit(rootDir);
  //console.dir(list);
  return list;
})();

//console.dir(imgList);

module.exports = function (msg) {
  if(filter.isMention(msg, "sftblw")) {
    if (msg.text.search("짤방") !== -1) {
      imgFile = imgList[Math.floor(Math.random()*imgList.length)];
      //console.dir(imgFile);
      // from website
      var b64img = fs.readFileSync(imgFile.dir, {encoding: 'base64'});
      // first we must post the media to Twitter
      T.post('media/upload', { media_data: b64img }, function (err, data, response) {

        // now we can reference the media and post a tweet (media will attach to the tweet)
        var mediaIdStr = data.media_id_string
        var params = { status: "@" + msg.user.screen_name + " " + imgFile.name, media_ids: [mediaIdStr] };

        T.post('statuses/update', params, function (err, data, response) {
          //console.log(data)
          if (err) {
            console.log(err);
          }
        });
      });
    }
  }
};
