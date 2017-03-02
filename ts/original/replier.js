var filter = require('./common/filterTweet');
var T = require('./common/tweetInstance');
var die = require('./common/die');
var poster = require('./common/postAvoidDuplicate');

/// twit, function, function or string or Array
module.exports = function (msg, condition, reply) {
	if ((!filter.isRetweet(msg)) && filter.isMention(msg, T.user)) {
		var rep = 'undefined reply.';
		if (condition(msg)) {
			switch(typeof reply) {
				case 'function': {
					rep = reply(msg);
				} break;
				case 'object': {
					if (reply instanceof Array) {
						if (reply.length == 0) {
							console.error('replier.js : reply.length is 0');
							return;
						}
						rep = reply[(Math.random() * reply.length) | 0];
					} else {
						console.error('replier.js : reply should one of "function(msg) -> string", "Array", "string"');
					}
				} break;
				case 'string': rep = reply; break;
				default: {
					console.error('replier.js : reply should one of "function(msg) -> string", "Array", "string"');
					return;
				}
			}

			T.t.post('statuses/update', {status: '@' + msg.user.screen_name + ' ' + rep, in_reply_to_status_id: msg.id_str}
			, function (err, data, response) {
				if (err) die(err);
			});
			return true;
		}
	}
};
