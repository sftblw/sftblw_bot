'use strict';
var filter = require('./common/filterTweet');
var T = require('./common/tweetInstance');
var die = require('./common/die');
var poster = require('./common/postAvoidDuplicate');

var FeedParser = require('feedparser')
  , request = require('request');
const schedule = require('node-schedule'); 
const JsonDB = require('node-json-db');


let postQueue = [];

/**
 * @param name {string} name for history db
 * @param feed {string} feed address. ex)
 * @param cronfreq {string} checking frequency as cron settings. ex) '0 * * * *'
 * @param resetdb {boolean} reset already posted things db
 **/
module.exports = function feedposter(name, feed, cronfreq, resetdb) {
    postfeed(name, feed, cronfreq, resetdb);
    schedule.scheduleJob(cronfreq, function () {
        console.log('feedposter:: cron job activated : ' + new Date());
        postfeed(name, feed, cronfreq, resetdb);
    });
}

function postfeed(name, feed, cronfreq, resetdb) {
    let dbname = 'feedposter-' + name;
    let db = new JsonDB(dbname, true, false);
    
    if (resetdb) { db.delete('/'); } 

    let feedparser = new FeedParser();

    let req = request(feed);

    req.on('error', function (error) {
        console.log(error);
    // handle any request errors
    });
    req.on('response', function (res) {
    var stream = this;

    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
        stream.pipe(feedparser);
    });

    feedparser.on('error', function(error) {
        // always handle errors
        console.error(error);
    });
    feedparser.on('readable', function() {
        // This is where the action is!
        var stream = this
            , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
            , item;
        let queue = [];
        while (item = stream.read()) {
            queue.push(item);        
        }
        // console.log(queue);
        for(var i = 0; i < queue.length; i++) {
            postByInterval(queue[i], db);
        }
    });
}


let isOnPost = false;
/**
 * @param item {feedparser.item} item to post
 */
function postByInterval(item, db) {
    // item.title
    // item.author
    // item.summary
    const interval = 1000 * 60 * 5;

    if (isOnPost === false) {

        isOnPost = true;

        let id = item.link.replace(/\//g, '_').replace(/\:/g, '__').replace(/\./g, '_');
        try {
            db.getData('/' + id);
            console.log('feedposter:: already posted: ' + item.title);
            isOnPost = false;
        } catch(error) {
            db.push('/' + id, item.date);
            console.log('feedposter:: posting ' + item.title);
        } finally {
            db.save();
            db.reload();
            console.log('finally');
        }
        if (isOnPost === false) return;

        let str = '';
        str += item.author + ' :: ';
        str += '「' + item.title + '」';
        str += '\n' + item.link;
        str += '\n' + item.summary.replace(/(\r|\n)/gi, '');
        if (str.length >= 139) {
            str = str.substr(0, 139);
            str += ' ...';
        }

        poster(str);
        // console.log(str);
        console.log('feedposter:: post action done: ' + item.title);

        setTimeout(() => {
            isOnPost = false;
            console.log('feedposter:: ready for next post');
        }, interval);
        
    }
    else {
        setTimeout(() => {
            // console.log('retrying');
            postByInterval(item, db);
        }, 0);   
    }
}  