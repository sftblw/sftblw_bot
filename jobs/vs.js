var replier = require('../fn/replier');

module.exports = {
	'vs': function (msg) {
		replier(msg,
			function (msg) {
				if (msg.text.search('eval') !== -1) return false;
				if (msg.text.search('예아니오') !== -1) return false;
				if (msg.text.search('움짤') !== -1) return false;
				if (msg.text.search('짤방') !== -1) return false;
				if (msg.text.search('캡처') !== -1) return false;
				if (msg.text.search('캡쳐') !== -1) return false;
				if (msg.text.search('스테미너') !== -1) return false;
				if (msg.text.search('그루브버스트') !== -1) return false;
				if (
					(msg.text.search(/^.*@\S* 선택 /) !== -1)
				) return true;
			},
			function (msg) {
				try {
					var txt = msg.text;
					txt = txt.replace(/^.*@\S* 선택 /, '');
					var vsList = txt.split('vs');
					for (var i = 0; i < vsList.length; i++) {
						vsList[i] = vsList[i].trim();
					}
					return vsList[Math.random() * vsList.length | 0];
				} catch (e) {
					return e.toString();
				}
			}
		);
	}
};
