var Twit = require('twit');
var keys = require('./config/keys.json');
var schedule = require('node-schedule');

var RandomImage = require('./fn/randomimage');
var randImg = RandomImage();

var T = new Twit(keys);

console.log("sftblw_bot running");

var stream = T.stream('user', {});


stream.on('tweet', function (msg) {
    //console.dir(msg, {depth:0, colors: true});
    if ((!isRetweet(msg)) && isMention(msg, "sftblw")) {
      placeHolderJob(msg);
    }
});

function placeHolderJob(msg) {
  // 중복 호출 방지를 위한 static 사용자
  if (placeHolderJob.userCallCountMap === undefined) {
    placeHolderJob.userCallCountMap = {"메롱":{}, "야호":{}};
  }

  function countTimeOutCall(namespace, user_screen_name, call) {
    // 키가 없는 경우 0으로 초기화
    if (placeHolderJob.userCallCountMap[namespace][user_screen_name] === undefined) placeHolderJob.userCallCountMap[namespace][user_screen_name] = 1;

    // n초 뒤를 계산
    var t = new Date(); t.setSeconds(t.getSeconds() + placeHolderJob.userCallCountMap[namespace][user_screen_name]*3);

    // 시간 디버깅
    // console.log(new Date());
    // console.log(t);
    // console.log(placeHolderJob.userCallCountMap[namespace][user_screen_name]);

    // 시간 증가
    placeHolderJob.userCallCountMap[namespace][user_screen_name] += 1;
    schedule.scheduleJob(t, function () {
      call();
      t.setSeconds(t.getSeconds() + placeHolderJob.userCallCountMap[namespace][user_screen_name]*10);
      schedule.scheduleJob(t, function () {

        // 시간 감소
        placeHolderJob.userCallCountMap[namespace][user_screen_name] -= 1;
      });
    }) ;
  }

  if (msg.text.search("메롱") !== -1) {
    countTimeOutCall("메롱", msg.user.screen_name, function () {
      T.post('statuses/update', {status: "@" + msg.user.screen_name + " 야호!", in_reply_to_status_id: msg.id_str  }
      , function (err, data, response) {
          if (err) console.log(err);
      });
    });

      //console.log("wow");
  }
  if (msg.text.search("야호") !== -1) {
    countTimeOutCall("야호", msg.user.screen_name, function () {
      T.post('statuses/update', {status: "@" + msg.user.screen_name + " 고만하세요", in_reply_to_status_id: msg.id_str  }
      , function (err, data, response) {
          // console.log("posted");
          if (err) console.log(err);
      });
      //console.log("wow");
    });
  }
}


function isRetweet(msg) {
    //console.dir(msg.retweeted_status, {depth:0, colors: true});
    if (msg.retweeted_status !== undefined) {
        return true;
    } else {
        return false;
    }
}
// toUser가 정의된 경우, string 인 경우만 지원, 해당 사용자에게 보낸 멘션만 걸러냄
function isMention(msg, toUser) {
    if (msg.entities.user_mentions.length > 0) {
        //console.dir(msg.entities.user_mentions, {depth:2, colors: true});
        if (toUser === undefined) {
            return true;
        } else {
            for (var i = 0; i < msg.entities.user_mentions.length; i++){
                var user = msg.entities.user_mentions[i];
                if (user.screen_name === toUser) {
                    return true;
                }
            }
            return false;
        }
    } else {
        return false;
    }
}
