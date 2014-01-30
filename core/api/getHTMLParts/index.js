var fs = require('fs'),
	exec = require('exec-sync');


function go (filename) {

	var currentCategoryCount = 0;
		totalCategoryCount = 0,
		totalStruct = JSON.parse(fs.readFileSync(filename, { encoding: 'UTF-8' }));

	function writeToFile() {
        console.log('{"response":true}');

		fs.writeFile(process.argv[2]+'/api.json', JSON.stringify(totalStruct, null, 4), function (err) {
			if (err) {
				console.log(err);
			}
		});
	}

	function parseFileTree( object ) {
		for (var spec in object) {
			if (typeof object[spec] === "object") {
				parseFileTree( object[spec] );
			}

			if ( object.url && object.fileName && object.category ) {
				var fileName = 'http://127.0.0.1:80' + object.url + '/' + object.fileName;
				totalCategoryCount++;

				(function(fileName, object) {

                        var params = process.argv[3]+"/phantomjs "+ process.argv[2] + "/getHTMLParts/ph.js "+ fileName;

					    var data = exec(params, true).stdout;

                        try {
                            object.sections = [];
                            currentCategoryCount++;

                            var html = JSON.parse(data);

                            if (!html.error) {
                                for (var htmlCount = 0; htmlCount < html.result.length; htmlCount++) {
                                    object.sections.push(html.result[htmlCount]);
                                }

                                if (html.result.length == 0) {
//                                    console.log(fileName);
                                }

                            } else {
//                                console.log(html);
                            }

                        } catch(e) {
                            //console.log(e);
                            currentCategoryCount++;
                        }


				})(fileName, object);

				return;
			}
		}
	}

	parseFileTree( totalStruct );
	writeToFile();

}

go(process.argv[2]+'/api.json');