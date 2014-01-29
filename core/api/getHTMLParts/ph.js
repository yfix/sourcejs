var
	page = require('webpage').create(),
	system = require('system');

// arguments from node exec task
var url = system.args[1],
	id = system.args[2],
    wrap = system.args[3];

page.open(url);

page.onLoadFinished = function (msg) {
	if (msg != 'success') {
		console.log( JSON.stringify({'error': url}) );
	} else {
        //TODO: create and check callback from templater
        setTimeout(function() {
            var code = page.evaluate(function () {

				var sections = document.querySelectorAll('.source_example'),
					result = [];

				for (var sectionCounter = 0; sectionCounter < sections.length; sectionCounter++) {
					result.push( sections[sectionCounter].innerHTML
							.replace('\n', '')
							.replace(/\n/g, "")
                            .replace(/[\t ]+\</g, "<")
                            .replace(/\>[\t ]+\</g, "><")
                            .replace(/\>[\t ]+$/g, ">") );
				}

                return {result: result};

            });

        	console.log(JSON.stringify(code, null, 1));
        }, 400);
	}

    setTimeout(function(){
		phantom.exit();
    }, 400)
};

// error handler & logger: helps to avoid error stream within a common log
page.onError = function(msg, trace) {};
