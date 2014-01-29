var fs = require('fs'),
	exec = require('child_process').exec;

module.exports = function getHTMLParts() {

	var OUTPUT_FILE = 'htmlparts.json',
		hasCategoryCount = 0;
		currentCategoryCount = 0,
		totalStruct = fs.readFileSync(__dirname + '/../../public/data/pages_tree.json', { encoding: 'UTF-8' });

	function checkParseEnd = function() {
		var interval = setInterval(function() {

			if (currentCategoryCount == hasCategoryCount) {
				writeToFile( totalStruct );
				clearInterval(interval);
				currentCategoryCount = 0;
				hasCategoryCount = 0;
			}
		}, 1000)
	}

	function writeToFile( object ) {
		fs.writeFile(global.app.get("specs path") + "/" + OUTPUT_FILE, JSON.stringify(object, null, 4), function (err) {
			if (err) {
				console.log(err);
			}
		});
	}

	function parseFileTree( object ) {

		for (var temp in object) {
			if (typeof object[temp] === "object") {
				parseFileTree( object[temp] );
			}
		}

		if ( object.url && object.fileName && object.category ) {
			hasCategoryCount++;

			var fileName = '/' + object.url + '/' + object.fileName;

			var params = "core/clarify/phantomjs core/api/getHTMLParts/ph.js "+ fileName;
			object.sections = [];

			exec(params, function (err, stdout, stderr) {
				if (err) {
					//console.log('err', err);
					currentCategoryCount++;
				} else {

					try {
						currentCategoryCount++;
						var html = JSON.parse(stdout);

						if (!html.error) {
							for (var htmlCount = 0; htmlCount < html.result.length; htmlCount++) {
								object.sections.push( html.result[htmlCount] );
							}
						} else {
							console.log(html);
						}

					} catch(e) {
						//jsDomDegradation(fileName);
						console.log(e);
						currentCategoryCount++;
					}
				}
			});
		}
	}

	parseFileTree( totalStruct );
	checkParseEnd();

}();