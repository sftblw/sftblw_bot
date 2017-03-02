var Twit = require('twit');

module.exports = {
	t: null,
	user: '',
	admin: '',
	/**
	* @param {string} key key file name
	* @param {object} key key object, which contains 'consumer_key', 'consumer_secret', 'access_token', 'access_token_secret'
	* @return {boolean} If keys fit condition, return true.
	*/
	setKey: function (key) {
		if (typeof key === 'string') {
			this.t = new Twit(require('../../config/' + key));
			return true;
		} else if (typeof key === 'object') {
			if (key.consumer_key && key.consumer_secret && key.access_token && key.access_token_secret) {
				this.t = new Twit(key);
				return true;
			}
		}
		return false;
	}
};
