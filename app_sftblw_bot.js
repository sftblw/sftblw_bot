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

var baseDir = '/media/netdrive/ccwpc/DaumCloud/사진/desktop/';
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

help.helpMsg = '상세 설명은 http://sftblw.moe/sftblw_bot.html 를 읽어주세요. 명령어는 짤방, 캡처, 움짤, 예아니오, 그루브버스트 현재스테미너, 스테미너 현재/최고치 가 있습니다.';

var makeExpectedTimeString = require('./jobs/common/makeExpectedTimeString');

var dereste = require('./jobs/dereste');
var hello = require('./jobs/hello');
var vs = require('./jobs/vs');

var randomcharacter = require('./fn/randomcharacter');
var touhouRandomCharacter = randomcharacter(); // new (...) ugly.
touhouRandomCharacter.initialize('랜덤동방', './res/touhou_character.json', './res/touhou_character/', '랜덤동방');

stream.on('tweet', function (msg) {
	// dummyMention(msg);
	if (!help.do(msg)) {
		randomImage.processAll(msg);
		randomReply(msg);
		evalModule(msg);

		dereste.groove(msg);
		dereste.stamina(msg);

		hello.hello(msg);
		vs.vs(msg);

		touhouRandomCharacter.process(msg);
	}
});

require('node-schedule').scheduleJob('0 * * * *', function () {
	var d = new Date();
	if (d.getHours() === 0) {
		poster('오늘은 ' + (d.getMonth() + 1).toString() + '월 ' + d.getDate().toString() + '일 입니다.');
	} else {
		var time = new Date().getHours();
		var tweet = '현재 ' + (time < 12 ? '오전 ' + time.toString() : '오후 ' + ((time == 12) ? 12 : (time % 12)).toString()) + '시 입니다' + ['☆', '★', '♡', '♥', '♪', '♬', '♩'][(Math.random() * 7) | 0];

		poster(tweet);
	}
});

require('node-schedule').scheduleJob('30 */2 * * *', function () {
	randomImage.processAll({
    entities: {
      user_mentions: [{screen_name: T.user}]
    },
    text: ['캡처', '짤방'][(Math.random() * 2) | 0]
  });
});

console.log('sftblw_bot running. : ' + T.user);
poster('씨에이치-봇이 시작해씁니다. 모든 기능을 사용할 수 있씁니다. @' + T.admin);
