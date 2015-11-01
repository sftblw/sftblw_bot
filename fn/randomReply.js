var filter = require('./common/filterTweet');
var T = require('./common/tweetInstance');
// var fs = require('fs');
var die = require('./common/die');

module.exports = function (msg) {
	if ((!filter.isRetweet(msg)) && filter.isMention(msg, 'sftblw')) {
		if (msg.text.search('예아니오') !== -1) {
			if (msg.text.search('여장') !== -1) {
				var randTextArray = [
          '그런 거 없어요 안 팔아요',
          '못 해요',
          '엄ㅁ마 살려주세요',
          '봇 그만 괴롭히세요...',
          '그거 말고 딴 거 물어보세요',
          '일단 님 먼저',
          '하하하하 이싸람이 하하하하'
        ];
				T.post(
					'statuses/update',
					{status: '@' + msg.user.screen_name + ' ' + randTextArray[Math.floor(Math.random() * randTextArray.length)], in_reply_to_status_id: msg.id_str},
					function (err, data, response) {
						if (err) die(err);
					}
				);
			} else {
				var random = Math.random() * 100;
				var randText = (random >= 50) ? '예' : '아니오';
				randText += ' (' + Math.round(random) + '%)';
				T.post('statuses/update',
					{status: '@' + msg.user.screen_name + ' ' + randText, in_reply_to_status_id: msg.id_str},
					function (err, data, response) {
						if (err) die(err);
					}
				);
			}
		}
	}
};
