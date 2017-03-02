module.exports = function makeExpectedTimeString (date) {
	var time = date.getHours();
	var dayString = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
	return date.getFullYear() + '년 ' + (date.getMonth() + 1) + '월 ' +
		(date.getDate()) + '일 ' + dayString + '요일 ' + (time < 12 ? '오전 ' +
		time.toString() : '오후 ' + ((time === 12) ? 12 : (time % 12)).toString()) +
		'시 ' + date.getMinutes() + '분';
};
