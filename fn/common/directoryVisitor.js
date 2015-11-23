var fs = require('fs');
var path = require('path');

function ListVisitor (onVisit) {
	onVisit = onVisit || {};
	this.onVisitFile = onVisit.onVisitFile || function (file) {};
  // console.log("onVisitFile default implementation : " + file.name)};
	this.onVisitDirectory = onVisit.onVisitDirectory || function (directory) {};
  // console.log("onVisitDirectory default implementation : " + directory.name)};
}

ListVisitor.prototype.visit = function (elem) {
	elem.accept(this);
};

ListVisitor.prototype.visitFile = function (file) {
	// don't accept here!
	this.onVisitFile(file);
};

ListVisitor.prototype.visitDirectory = function (directory) {
	// job to do
	this.onVisitDirectory(directory);

	// sub accept
	var self = this;
	directory.list.forEach(function (elem) {
		elem.accept(self);
	});
};

function Directory (dir) {
	this.name = path.basename(dir);
	this.dir = dir;
	this.list = [];

	var listString = fs.readdirSync(dir);

	var self = this;
	listString.forEach(function (elem) {
		elem = path.join(dir, elem);

		if (path.extname(elem) === '') {
			self.list.push(new Directory(elem));
		} else {
			self.list.push(new File(elem));
		}
	});
}

Directory.prototype.accept = function (visitor) {
	visitor.visitDirectory(this);
};

function File (dir) {
	this.name = path.basename(dir);
	this.dir = dir;
	this.format = path.extname(dir);
}

File.prototype.accept = function (visitor) {
	visitor.visitFile(this);
};

// var listVisitor = new ListVisitor();
// var directory = new Directory("D:/Clouds/DaumCloud/사진/desktop/짤방");
// listVisitor.visit(directory);

module.exports = {
	'ListVisitor': ListVisitor,
	'Directory': Directory,
	'File': File
};
