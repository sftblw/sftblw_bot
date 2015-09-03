var filter = require('./common/filterTweet');
var T = require('./common/tweetInstance');
var die = require('./common/die');

module.exports = function (msg) {
    var helpMsg = "사용 가능 명령어 : 짤방, 애니캡처, 목록갱신, 도움말";
    //console.dir(msg, {depth:0, colors: true});
    if ((!filter.isRetweet(msg)) && filter.isMention(msg, "sftblw")) {
      if (msg.text.search("도움말") !== -1) {
        T.post('statuses/update', {status: "@" + msg.user.screen_name + " " + helpMsg, in_reply_to_status_id: msg.id_str  }
        , function (err, data, response) {
            if (err) die(err);
        });
      }
    }
}
