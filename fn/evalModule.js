var filter = require('./common/filterTweet');
var T = require('./common/tweetInstance');
var die = require('./common/die');
var poster = require('./common/postAvoidDuplicate');

module.exports = function (msg) {
	if ((!filter.isRetweet(msg)) && filter.isMention(msg, 'sftblw') && filter.fromUser(msg, 'sftblw')) {
		if (msg.text.search(/^@\S* eval /) !== -1) {

			var targetText = msg.text.replace(/^@\S* eval /, '');
			var evalResult = eval(targetText);
			if ((typeof evalResult !== "undefined") && (evalResult !== null)) {
				if (typeof evalResult.toString === "undefined") {
					evalResult = '반환값에서 toString() 함수를 찾을 수 없습니다.';
				} else {
					evalResult = evalResult.toString();
				}
			} else {
				evalResult = '결과가 undefined 이거나 null 입니다.';
			}

			T.post(
				'statuses/update',
				{status: '@' + msg.user.screen_name + ' ' + evalResult, in_reply_to_status_id: msg.id_str},
				function (err, data, response) {
					if (err) die(err);
				}
			);
		}
	}
};
