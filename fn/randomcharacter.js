var filter = require('./common/filterTweet');
var T = require('./common/tweetInstance');
var dirVisit = require('./common/directoryVisitor');
var fs = require('fs');
var poster = require('./common/postAvoidDuplicate');
var die = require('./common/die');

// var baseDir = "/media/networkshare/ccwpc/DaumCloud/사진/desktop/짤방";
// var baseDir = "D:/Clouds/DaumCloud/사진/desktop/짤방";


module.exports = function () {
	return {
		name : '',
		charactersJSONPath: '',
		imageDir: '',
		imageList : [],
		characters : null,
		initializedJSON : false,
		initializedImage : false,
		command: '',
		initialize: function (name, charactersJSONPath, imageDir, command) {
			this.name = name;
			this.charactersJSONPath = charactersJSONPath;
			this.imageDir = imageDir;
			this.command = command;
			var self = this;

			fs.readFile(charactersJSONPath, function (err, data) {
				if (err) { die(err); }
				self.characters = JSON.parse(data);
				console.log(self.name + ' : 전체 캐릭터를 읽었습니다. 갯수 : ' + self.characters.length);

				var character = null;
				var characterIndex = 0;

				// 초기 recentQueue 제작
				while (self.recentQueue.length < 5) {
					characterIndex = (Math.random() * self.characters.length) | 0;
					character = self.characters[ characterIndex ];

					for (var i = 0; i < self.recentQueue.length; i++) {
						if (self.recentQueue[i] === self.characters[characterIndex].key) {
							character = null;
						}
					}
					if (character != null)  {
						self.recentQueue.splice(0, 0, character.key);
					}
				}
				// console.log('초기 recentQueue를 만들었습니다. : ' + self.recentQueue.length);
				self.initializedJSON = true;
			});

			fs.readdir(this.imageDir, function (err, data) {
				if (err) { die(err); }
				self.imageList = data;
				console.log(self.name + ' : 전체 이미지를 읽었습니다. 갯수 : ' + self.imageList.length);
				self.initializedImage = true;
			});
		},

		reload: function () {
			this.initialize(this.dataDir, this.imageDir);
		},

		process: function (msg) {
			if (!this.initializedJSON || !this.initializedImage) return false;
			if (
				filter.isMention(msg, T.user) &&
				(!filter.isRetweet(msg)))
			{
				if (filter.hasCommand(msg, '목록갱신')) {
					this.reload();
				}
				else if (filter.hasCommand(msg, this.command)) {
					this.postRandom(msg);
				}
			}
		},

		recentQueue: [],

		postRandom: function (msg) {
			var character = null;
			var characterIndex = 0;

			// 겹치지 않게 캐릭터 선정
			while (character === null) {
				characterIndex = (Math.random() * this.characters.length) | 0;
				character = this.characters[ characterIndex ];

				for (var i = 0; i < this.recentQueue.length; i++) {
					if (this.recentQueue[i] === this.characters[characterIndex].key) {
						character = null;
					}
				}
			}

			// recentQueue 처리
			this.recentQueue.pop();
			this.recentQueue.splice(0, 0, character.key);

			this.postOne(character, msg);
		},
		postOne: function (character, msg) {
			var postStatus =
				'@' + msg.user.screen_name + ' ' +
				(character.name_kr !== undefined ? character.name_kr : '') +
				(character.name_jp !== undefined ? ' (' + character.name_jp + ')' : '')
				;

			// 가능한 이미지들
			var candidateCharacterImages = [];
			var postCharacterImagePath = null;
			for (var i = 0; i < this.imageList.length; i++) {
				if (this.imageList[i].search(character.key) !== -1) {
					candidateCharacterImages.push(this.imageList[i]);
				}
			}
			if (candidateCharacterImages.length !== 0) {
				postCharacterImagePath = candidateCharacterImages[(Math.random() * candidateCharacterImages.length) | 0];
			}

			// 포스트 파트
			// 이미지가 있는 경우
			if (postCharacterImagePath !== null) {

				var b64img = fs.readFileSync(this.imageDir + postCharacterImagePath, {encoding: 'base64'});
				T.t.post('media/upload', { media_data: b64img }, function (err, data, response) {
					if (err) { die(err);	}

					var mediaIdStr = data.media_id_string;

					var params = { status: postStatus, media_ids: [mediaIdStr], in_reply_to_status_id: msg.id_str};

					// 메시지 전송 (에러인 경우 실패)
					T.t.post('statuses/update', params, function (err, data, response) {
						// console.log(data)
						if (err) {
							var params = {status: '전송에 실패했습니다.'};
							if (typeof msg.id_str !== 'undefined') {
								params.in_reply_to_status_id = msg.id_str;
								params.status = '@' + msg.user.screen_name + ' ' + params.status;
							}
							T.t.post('statuses/update', params, function (err, data, response) {
								if (err) die(err);
							});
						}
					});

				});
				// 이미지가 없는 경우
			} else {
				var params = { status: postStatus, in_reply_to_status_id: msg.id_str };
				// 메시지 전송 (에러인 경우 실패)
				T.t.post('statuses/update', params, function (err, data, response) {
					// console.log(data)
					if (err) { die(err); }
				});
			}

		}
	};
};
