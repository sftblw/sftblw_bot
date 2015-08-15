var filter = require('./common/filterTweet');
var schedule = require('node-schedule');
var T = require('./common/tweetInstance');

module.exports = function (msg) {
    //console.dir(msg, {depth:0, colors: true});
    if ((!filter.isRetweet(msg)) && filter.isMention(msg, "sftblw")) {
      placeHolderJob(msg);
    }
}

function placeHolderJob(msg) {

  // 중복 호출 방지를 위한 static 사용자
  if (placeHolderJob.userCallCountMap === undefined) {
    placeHolderJob.userCallCountMap = {"메롱":{}, "야호":{}};
  }

  function countTimeOutCall(namespace, user_screen_name, call) {
    // 키가 없는 경우 0으로 초기화
    if (placeHolderJob.userCallCountMap[namespace][user_screen_name] === undefined) placeHolderJob.userCallCountMap[namespace][user_screen_name] = 0;

    // n초 뒤를 계산
    var t = new Date(); t.setSeconds(t.getSeconds() + placeHolderJob.userCallCountMap[namespace][user_screen_name]*30);

    // 시간 증가
    placeHolderJob.userCallCountMap[namespace][user_screen_name] += 1;
    var waitValue = placeHolderJob.userCallCountMap[namespace][user_screen_name];
    schedule.scheduleJob(t, function () {
      call(waitValue);
      t.setSeconds(t.getSeconds() + placeHolderJob.userCallCountMap[namespace][user_screen_name]*60);
      schedule.scheduleJob(t, function () {

        // 시간 감소
        placeHolderJob.userCallCountMap[namespace][user_screen_name] -= 1;
      });
    }) ;
  }

  if (msg.text.search("메롱") !== -1) {
    countTimeOutCall("메롱", msg.user.screen_name, function (waitValue) {
      T.post('statuses/update', {status: "@" + msg.user.screen_name + " 야호! [" + waitValue + "]", in_reply_to_status_id: msg.id_str  }
      , function (err, data, response) {
          if (err) console.log(err);
      });
    });

      //console.log("wow");
  }
  if (msg.text.search("야호") !== -1) {
    countTimeOutCall("야호", msg.user.screen_name, function (waitValue) {
      T.post('statuses/update', {status: "@" + msg.user.screen_name + " 고만하세요 [" + waitValue + "]", in_reply_to_status_id: msg.id_str  }
      , function (err, data, response) {
          // console.log("posted");
          if (err) console.log(err);
      });
      //console.log("wow");
    });
  }
}
