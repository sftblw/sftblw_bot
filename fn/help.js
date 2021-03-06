var filter = require('./common/filterTweet');
var T = require('./common/tweetInstance');
var die = require('./common/die');
var poster = require('./common/postAvoidDuplicate');

module.exports = {
	helpMsg: '가능한 명령어는 {"도움말", "짤방", "캡처", "움짤", "예아니오", "그루브버스트 (숫자)", "스테미너 (숫자)/(숫자))"} 입니다.',
	do: function (msg) {
	  // console.dir(msg, {depth:0, colors: true});
		if ((!filter.isRetweet(msg)) && filter.isMention(msg, T.user)) {
			if (msg.text.search(this.helpMsg.slice(0, 10)) === -1) { // 도움말 메시지가 그대로 전달되지 않은 경우
				if (msg.text.search('도움말') !== -1) {
					T.t.post('statuses/update', {status: '@' + msg.user.screen_name + ' ' + this.helpMsg, in_reply_to_status_id: msg.id_str}
					, function (err, data, response) {
						if (err) die(err);
					});
					return true;
				} else if (filter.hasCommand(msg, ['살아있', '싸라있'])) {
					T.t.post('statuses/update', {status:
						'씨에이치-봇은 살아있습니다.' + ' @'+ msg.user.screen_name + ' @' + T.admin
						, in_reply_to_status_id: msg.id_str
					}
					, function (err, data, response) {
						if (err) die(err);
					});
					return true;
				} else if (filter.hasCommand(msg, ['주거랏', '죽어라', '주거라', '죽거라', '봇종료']) && (filter.fromUser(msg, T.user) || filter.fromUser(msg, T.admin))) {
					poster('씨에이치-봇, 그 명을 받들고 죽겠사옵니다... (비장) @' + T.admin);
					die({'error': 'suicided.'});
				}
			} else { // 도움말 메시지가 그대로 전달된 경우
				return true; // 다른 작업을 막는다
			}
		}
	}
}
