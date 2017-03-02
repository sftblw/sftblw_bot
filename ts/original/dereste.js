var replier = require('../fn/replier');
var makeExpectedTimeString = require('../jobs/common/makeExpectedTimeString');

module.exports = {
	'groove': function (msg) {
		replier(msg,
			function (msg) {
				if (
					(msg.text.search(/^.*@\S* 그루브(버스트)? /) !== -1)
				) return true;
			},
			function (msg) {
				try {
					var txt = msg.text;
					txt = txt.replace(/^.*@\S* 그루브(버스트)? /, '');
					var time = Number.parseInt(txt);
					var d = new Date();
					d.setMinutes(d.getMinutes() + (50 - time) * 5);

					if (isNaN(time)) {
						throw {time: time, txt: txt};
					}

					return makeExpectedTimeString(d) + ' 쯤에 스테미너가 50이 될 것으로 보입니다.';
				} catch (e) {
					return '"그루브버스트" 명령어의 사용법은 @ sftblw_bot 그루브버스트 현재스테미너 입니다.';
				}
			}
		);
	},
	'stamina': function (msg) {
		replier(msg, function (msg) {
			if (
				(msg.text.search(/^.*@\S* 스[테태]미[너나] /) !== -1)
			) return true;
		}, function (msg) {
			try {
				var txt = msg.text;
				txt = txt.replace(/^.*@\S* 스[테태]미[너나] /, '');
				var txts = txt.split('/');
				var time = Number.parseInt(txts[0]);
				var maxTime = Number.parseInt(txts[1]);

				if (isNaN(time) || isNaN(maxTime)) {
					throw {time: time, maxTime: maxTime, txts: txts};
				}

				var d = new Date();
				d.setMinutes(d.getMinutes() + (maxTime - time) * 5);
				return makeExpectedTimeString(d) + ' 쯤에 스테미너가 꽉 차있을 것으로 보입니다.';
			} catch (e) {
				return '"스테미너" 명령어의 사용법은 @ sftblw_bot 스테미너 현재스테미너/목표스테미너 입니다.';
			}
		});
	}
};
