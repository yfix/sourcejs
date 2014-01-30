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

				function closestTitle(elem) {
					if (elem.tagName == 'HTML') return false;

					if ( (elem.tagName !== 'H2') && (elem.tagName !== 'H3') ) {
						return closestTitle(elem.previousSibling);
					} else {
						return elem.textContent;
					}

					return false;
				}

				var sections = document.querySelectorAll('.source_example'),
					result = [],
					titles = [];

				for (var sectionCounter = 0; sectionCounter < sections.length; sectionCounter++) {

					var markupTitle = closestTitle( sections[sectionCounter] ) || sectionCounter;
					var markup = sections[sectionCounter].innerHTML
							.replace('\n', '')
							.replace(/\n/g, "")
                            .replace(/[\t ]+\</g, "<")
                            .replace(/\>[\t ]+\</g, "><")
                            .replace(/\>[\t ]+$/g, ">");

                	if (titles.indexOf(markupTitle) === -1) {
                		titles.push(markupTitle);

                		var tmp = {};

                		tmp[markupTitle] = markup;
						result.push( tmp );
                	}


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
