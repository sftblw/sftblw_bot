var replier = require('../fn/replier');
var filter = require('../fn/common/filterTweet');
var T = require('../fn/common/tweetInstance');

module.exports = {
	'hello': function (msg) {
		replier(msg,
			// return true when it is needed to respond
			function (msg) {
				if (
					(msg.text.search(/(안녕|반[가갑]|하이|hi|hello)/) !== -1) &&
					(!filter.fromUser(msg, T.user))
				) return true;
			},
			// return string to respond
			function (msg) {
				var retText = [
					'안녕하세요!',
					'><',
					'☆',
					'★',
					'♡',
					'♥',
					'할룽~룽~',
					'슬라맛빠기!',
					'안녕녕이에요!',
					'안녕안녕하세요~',
					'하이요~',
					'[봇이 인사를 받아칩니다.] 안-녕-하-세-요',
					'hi!',
					'하이하이~'
				];
				var curDate = new Date();

				// morning (5 am ~ 9:59)
				if ((curDate.getHours() >= 5) && (curDate.getHours() < 10)) {
					var morningText = [
						'좋은 아침이에요!',
						'아침밥은 뭐 드셨나요?',
						'상쾌하고 힘찬 하루되세요!'
					];
					retText = retText.concat(morningText);
				}

				// evening (5 pm ~ 8:59)
				if ((curDate.getHours() >= 17) && (curDate.getHours() < 21)) {
					var eveningText = [
						'기분좋은 저녁이네요!',
						'노을색이 보고싶어요',
						'저녁식사 맛있게 하셨나요?'
					];
					retText = retText.concat(eveningText);
				}

				return retText[(Math.random() * retText.length) | 0];
			}
		);
	}
};
