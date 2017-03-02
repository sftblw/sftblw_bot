var T = require('./tweetInstance');

module.exports = function (err) {
	console.log(err);
	T.t.post('statuses/update', {status: '씨에이치-봇은 주거씁니다.' }
	, function (err, data, response) {
		if (err) console.log(err);
		process.exit(1);
	});
};
