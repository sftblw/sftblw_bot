var T = require('./tweetInstance');
var die = require('./die');

function PostStartMsg(msg, num) {
  if (msg === undefined) msg = "기본 메시지입니다.";
  if (num === undefined) num = 0;
  var msgToPost = msg;
  if (num !== 0) msgToPost = num.toString() + " : " + msg;
  T.post('statuses/update', {status: msgToPost  }
  , function (err, data, response) {
      if (err) {
        if (err.code != 187) {
          die(err);
        } else {
          PostStartMsg(msg, num+1);
        }
      }
  });
}

module.exports = PostStartMsg;
