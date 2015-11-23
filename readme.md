twitter bot for [@sftblw](https://twitter.com/sftblw)
=====================================================

-	work in progress
-	**API will be changed When it is re-coded from start.**

Setup
=====

-	`config/???.json` must contain key settings of [ttezel/twit](https://github.com/ttezel/twit) as JSON format.
-	load it from you app.

```javascript
// settings
var T = require('./fn/common/tweetInstance');
T.setKey('sftalw.json');
T.user = 'sftalw';
T.admin = 'sftblw';
```

-	load what you needed.
-	stream.

```javascript
var stream = T.t.stream('user', {});

stream.on('tweet', function (msg) {
    // do what you want
}
```

-	say start.

Usage
=====

help.js
-------

```javascript
help.helpMsg = 'Your help response, when mentioned to you, "도움말".';

stream.on('tweet', function (msg) {
  if (!help.do(msg)) {
    // do what you want
  }
});
```

randomImage.js
--------------

```javascript
// takes a long time, based on your file count
randomImage.newRandomImagePoster(
  baseDir + 'anicap', // directory to find, absolute directory (string)
  ['.png', '.jpg', '.gif'], // format to find (string)
  ['캡처', '캡쳐'] // command to respond when mentioned (array or string)
);

stream.on('tweet', function (msg) {
	randomImage.processAll(msg); // entry point
});
```

replier.js
----------

```javascript
stream.on('tweet', function (msg) {
  // dummyMention(msg);
	if (!help.do(msg)) {
		replier(msg, function (msg) { // msg is twitter tweet
      // return true if you want to response.
			if (
				(msg.text.search(/^@\S* hey, bot!/) !== -1)
			) return true;
		}, function (msg) {
			// return response text (string). will be mentioned.
      return 'I have noticed you!'
		});
	}
});
```
