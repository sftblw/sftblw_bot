var filter = require('./common/filterTweet');
var T = require('./common/tweetInstance');
var die = require('./common/die');

module.exports = function (msg) {
	if ((!filter.isRetweet(msg)) && filter.isMention(msg, 'sftblw') && filter.fromUser(msg, 'sftblw')) {
		if (msg.text.search(/^@\S* eval /) !== -1) {

			var targetText = msg.text.replace(/^@\S* eval /, '');
			var evalResult = eval(targetText).toString();

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
