module.exports = {
	'isRetweet': function (msg) {
		// console.dir(msg.retweeted_status, {depth:0, colors: true});
		if (msg.retweeted_status !== undefined) {
			return true;
		} else {
			return false;
		}
	},
	// toUser가 정의된 경우, string 인 경우만 지원, 해당 사용자에게 보낸 멘션만 걸러냄
	'isMention': function (msg, toUser) {
		if (msg.entities.user_mentions.length > 0) {
			// console.dir(msg.entities.user_mentions, {depth:2, colors: true});
			if (toUser === undefined) {
				return true;
			} else {
				for (var i = 0; i < msg.entities.user_mentions.length; i++) {
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
	},
	'fromUser': function (msg, fromUser) {
		if (msg.user.screen_name === fromUser) {
			return true;
		} else {
			return false;
		}
	},
	'hasCommand': function (msg, command) {
		if (command instanceof Array) {
			for (var i = 0; i < command.length; i++) {
				if (msg.text.search(command[i]) !== -1) return true;
			}
			return false;
		} else if (typeof command === 'string') {
			return (msg.text.search(command) !== -1);
		} else {
			return false;
		}
	}
};
