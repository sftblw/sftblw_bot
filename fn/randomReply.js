var filter = require('./common/filterTweet');
var T = require('./common/tweetInstance');
var fs = require('fs');
var die = require('./common/die');

module.exports = function (msg) {
  if ((!filter.isRetweet(msg)) && filter.isMention(msg, "sftblw")) {
    if (msg.text.search("예아니오") !== -1) {
      var random = Math.random() * 100;
      var randText = (random >= 50) ? "예" : "아니오";
      randText += " (" + Math.round(random) + "%)";
      T.post('statuses/update', {status: "@" + msg.user.screen_name + " " + randText, in_reply_to_status_id: msg.id_str  }
      , function (err, data, response) {
          if (err) die(err);
      });
    }
  }
}
