var fs = require('fs'),
	exec = require('child_process').exec;

function process ( filename, callback ) {

	var currentCategoryCount = 0;
		totalCategoryCount = 0,
		totalStruct = JSON.parse(fs.readFileSync(filename, { encoding: 'UTF-8' }));

	function checkParseEnd() {
		var interval = setInterval(function() {

			//console.log(currentCategoryCount, totalCategoryCount);

			if (currentCategoryCount >= totalCategoryCount) {
				writeToFile();
				clearInterval(interval);
				currentCategoryCount = 0;
			}
		}, 1000)
	}

	function writeToFile() {
		fs.writeFile(__dirname+ '/../api.json', JSON.stringify(totalStruct, null, 4), function (err) {
			if (err) {
				console.log(err);
			}
		});

		callback();
	}

	function parseFileTree( object ) {
		for (var spec in object) {
			if (typeof object[spec] === "object") {
				parseFileTree( object[spec] );
			}

			if ( object.url && object.fileName && object.category ) {
				var fileName = 'http://127.0.0.1:8080' + object.url + '/' + object.fileName; //http://okp.me
				totalCategoryCount++;

				(function(fileName, object) {
					var params = "core/clarify/phantomjs core/api/getHTMLParts/ph.js "+ fileName;

					exec(params, function (err, stdout, stderr) {
						if (err) {
							//console.log('err', err);
							currentCategoryCount++;
						} else {

							try {
								object.sections = [];
								currentCategoryCount++;

								var html = JSON.parse(stdout);

								if (!html.error) {
									for (var htmlCount = 0; htmlCount < html.result.length; htmlCount++) {
										object.sections.push(html.result[htmlCount])														;
									}

									if (html.result.length == 0) {
										console.log(fileName);
									}

								} else {
									console.log(html);
								}

							} catch(e) {
								//console.log(e);
								currentCategoryCount++;
							}
						}
					});

				})(fileName, object);

				return;
			}
		}
	}

	parseFileTree( totalStruct );
	checkParseEnd();

};

module.exports = {
	process: function( filename, callback ) {
		process( filename, callback );
	}
}
