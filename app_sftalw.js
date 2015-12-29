// settings
var T = require('./fn/common/tweetInstance');
T.setKey('sftalw.json');
T.user = 'sftalw';
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

var baseDir = '/media/netdrive/ccwpc/hitomiapp/dl2/';
// var baseDir = 'D:/Clouds/DaumCloud/사진/desktop/';
// var baseDir = 'D:/DaumCloud/사진/desktop/';
var commonFormat = ['.png', '.jpg', '.gif'];
randomImage.newRandomImagePoster(
  baseDir,
  commonFormat,
  '.전체?'
);
randomImage.newRandomImagePoster(
  baseDir + 'artist CG',
  commonFormat,
  '.아티스트?'
);
randomImage.newRandomImagePoster(
  baseDir + 'doujinshi',
  commonFormat,
  '.동인지?'
);
randomImage.newRandomImagePoster(
  baseDir + 'doujinshi/all',
  commonFormat,
  '.동인지.창작?'
);
randomImage.newRandomImagePoster(
  baseDir + 'doujinshi/touhou project',
  commonFormat,
  '.동인지.동방?'
);
randomImage.newRandomImagePoster(
  baseDir + 'game CG',
  commonFormat,
  '.게임CG?'
);
randomImage.newRandomImagePoster(
  baseDir + 'manga',
  commonFormat,
  '.망가?'
);
randomImage.newRandomImagePoster(
  baseDir + 'manga/all',
  commonFormat,
  '.망가.창작?'
);

help.helpMsg = '.전체? .아티스트?, .동인지?, .게임CG?, .망가?, .망가.창작? .동인지.창작? .동인지.동방?';

stream.on('tweet', function (msg) {
  // dummyMention(msg);
	if (!help.do(msg)) {
		randomImage.processAll(msg);
		randomReply(msg);
		evalModule(msg);
	}
});

require('node-schedule').scheduleJob('30 * * * *', function () {
	randomImage.processAll({
    entities: {
      user_mentions: [{screen_name: T.user}]
    },
    text: '.전체?'
  });
});

console.log('sftblw_bot running. : ' + T.user);
poster('씨에이치-봇이 시작해씁니다. 모든 기능을 사용할 수 있씁니다. @' + T.admin);
