var filter = require('./common/filterTweet');
var T = require('./common/tweetInstance');
var dirVisit = require('./common/directoryVisitor');
var fs = require('fs');
var poster = require('./common/postAvoidDuplicate');
var die = require('./common/die');

// var baseDir = "/media/networkshare/ccwpc/DaumCloud/사진/desktop/짤방";
// var baseDir = "D:/Clouds/DaumCloud/사진/desktop/짤방";

// console.dir(imgList);
function RandomImagePoster (dir, format, command, callback) {
	this.baseDir = dir;
	this.format = format;
	this.imgList = makeImageFileList(format, dir);

	fs.watch(this.baseDir, {persistent: true, recursive: true}, function (event, filename) {
		console.log('파일 변경 : ' + event);
		this.imgList = makeImageFileList(format, dir);
		poster(command + '의 파일 목록이 변경되었습니다.\n이미지 전체 목록을 갱신했습니다. 아마도요.');
	});

	this.post = function (msg) {
		if (
			filter.isMention(msg, 'sftblw') &&
			filter.hasCommand(msg, command) &&
			(!filter.isRetweet(msg))) {

			var imgFile = this.imgList[Math.floor(Math.random() * this.imgList.length)];
			var b64img = fs.readFileSync(imgFile.dir, {encoding: 'base64'});

			// first we must post the media to Twitter
			T.post('media/upload', { media_data: b64img }, function (err, data, response) {
				if (err) {
					die(err);
				}
				// now we can reference the media and post a tweet (media will attach to the tweet)
				var mediaIdStr = data.media_id_string;
				var params = { status: '@' + msg.user.screen_name + ' ' + imgFile.name, media_ids: [mediaIdStr], in_reply_to_status_id: msg.id_str };

				T.post('statuses/update', params, function (err, data, response) {
					// console.log(data)
					if (err) {
						die(err);
					}
				});
			});
		}
		// if end
		if (callback !== undefined) {
			callback(msg);
		}
	};
	// post function end

}

var posterManager = {
	newRandomImagePoster: function (dir, format, command, callback) {
		this.posters.push(new RandomImagePoster(dir, format, command, callback));
	},
	posters: [],
	postAll: function (msg) {
		for (var i = 0; i < this.posters.length; i++) {
			this.posters[i].post(msg);
		}
	},
	updateAll: function () {
		for (var i = 0; i < this.posters.length; i++) {
			this.posters[i].imgList = makeImageFileList(this.posters[i].format, this.posters[i].baseDir);
		}
		poster("씨에이치-봇이 이미지 목록을 모두 갱신해씁니다. @sftblw");
	},
	processAll: function (msg) {
		// 목록 갱신 요청시.
		if (filter.isMention(msg, 'sftblw') &&
			(msg.text.search('목록갱신') !== -1) &&
			(!filter.isRetweet(msg))) {
			this.updateAll();
			return;
		} else {
			this.postAll(msg);
		}
	}
};

module.exports = posterManager;

function makeImageFileList(format, baseDir) {
	var list = [];
	var onImgVisitor = {
		onVisitFile: function (file) {
			// console.log(file.format);
			var condition = false;
			for(var i = 0; i < format.length; i++) {
				if (file.format === format[i]) {
					condition = true;
				}
			}
			if (condition) {
				list.push(file);
			}
		}
	};
	var ImgVisitor = new dirVisit.ListVisitor(onImgVisitor);
	var rootDir = new dirVisit.Directory(baseDir);
	ImgVisitor.visit(rootDir);
	//console.dir(list);
	return list;
}
