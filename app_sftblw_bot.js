// settings
var T = require('./fn/common/tweetInstance');
T.setKey('sftblw_bot.json');
T.user = 'sftblw_bot';
T.admin = 'sftblw';

var help = require('./fn/help');
var poster = require('./fn/common/postAvoidDuplicate');
var filter = require('./fn/common/filterTweet');
var stream = T.t.stream('user', {});
var randomImage = require('./fn/randomImage');
var randomReply = require('./fn/randomReply');
var evalModule = require('./fn/evalModule');
var replier = require('./fn/replier');

console.log('sftblw_bot booting... : ' + T.user);
poster('씨에이치-봇이 기동 준비중입니다. @' + T.admin);

var baseDir = '/media/networkshare/ccwpc/DaumCloud/사진/desktop/';
// var baseDir = 'D:/Clouds/DaumCloud/사진/desktop/';
// var baseDir = 'D:/DaumCloud/사진/desktop/';
var commonFormat = ['.png', '.jpg', '.gif'];
randomImage.newRandomImagePoster(
  baseDir + '짤방',
  commonFormat,
  '짤방'
);
randomImage.newRandomImagePoster(
  baseDir + 'anicap',
  commonFormat,
  ['캡처', '캡쳐']
);
randomImage.newRandomImagePoster(
  baseDir,
  ['.gif'],
  '움짤'
);

help.helpMsg = '가능한 명령어는 {"도움말", "짤방", "캡처", "움짤", "예아니오", "그루브버스트 (숫자)", "스테미너 (숫자)/(숫자))"} 입니다. 나머지는 관리용.';

stream.on('tweet', function (msg) {
  // dummyMention(msg);
	if (!help.do(msg)) {
		randomImage.processAll(msg);
		randomReply(msg);
		evalModule(msg);
		replier(msg, function (msg) {
			if (
				(msg.text.search(/^@\S* 그루브버스트 /) !== -1)
			) return true;
		}, function (msg) {
			try {
				var txt = msg.text;
				txt = txt.replace(/^@\S* 그루브버스트 /, '');
				var time = Number.parseInt(txt);
				var d = new Date();
				d.setMinutes(d.getMinutes() + (50 - time) * 5);
				return '예정 시간은 ' + d.toString() + ' 입니다.';
			} catch (e) {
				return e.toString();
			}
		});
		replier(msg, function (msg) {
			if (
				(msg.text.search(/^@\S* 스테미너 /) !== -1)
			) return true;
		}, function (msg) {
			try {
				var txt = msg.text;
				txt = txt.replace(/^@\S* 스테미너 /, '');
				var txts = txt.split('/');
				var time = Number.parseInt(txts[0]);
				var maxTime = Number.parseInt(txts[1]);
				var d = new Date();
				d.setMinutes(d.getMinutes() + (maxTime - time) * 5);
				return '예정 시간은 ' + d.toString() + ' 입니다.';
			} catch (e) {
				return e.toString();
			}
		});
	}
});

require('node-schedule').scheduleJob('0 0 * * *', function () {
	var d = new Date();
	if (d.getHours() === 0) {
		poster('오늘은 ' + (d.getMonth() + 1).toString() + '월 ' + d.getDate().toString() + '일 입니다.');
	} else {
		poster('현재 ' + (new Date().getHours()) + '시 입니다' + ['☆', '★', '♡', '♥', '♪', '♬', '♩'][Math.random(7) | 0]);
	}
});

console.log('sftblw_bot running. : ' + T.user);
poster('씨에이치-봇이 시작해씁니다. 모든 기능을 사용할 수 있씁니다. @' + T.admin);
