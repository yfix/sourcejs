var jsdom = require('jsdom'),
	fs = require('fs'),
	css = require('css');

module.exports = function startCSSParse() {

	var importCss = fs.readFileSync('./core/api/parseModifiers/input/nmain.css', 'utf8') +
					fs.readFileSync('./core/api/parseModifiers/input/ncore.css', 'utf8') +
					fs.readFileSync('./core/api/parseModifiers/input/nmain_postponed.css', 'utf8') +
					fs.readFileSync('./core/api/parseModifiers/input/ncore_postponed.css', 'utf8'),
		parsedCss = css.parse( importCss ).stylesheet.rules;

	var modifierRegExpDetect = /__/,
		modifierClean = /\..*/;

	var outputTree = {};

	function addToList(block, modifier, selector) {

		if ( outputTree[block] === undefined ) {
			outputTree[block] = [];
		}

		if (outputTree[block].indexOf(modifier) === -1) {
			outputTree[block].push(modifier);
		}
	}

	function dropException(selector, cause) {
		//console.log('Ignored: ' + selector + '; caused ' + cause);
	}

	for (var rule = 0; rule < parsedCss.length; rule++) {
		var selectors = parsedCss[rule].selectors;

		if (selectors !== undefined) {
			for (var selector = 0; selector < selectors.length; selectors++) {

				if (modifierRegExpDetect.test( selectors[selector] )) {

					var words = selectors[selector]
						.replace('::before', '')
						.replace('::after', '')
						.replace(':before', '')
						.replace(':after', '')
						.replace(':hover', '')
						.replace(':focus', '')
						.replace(':target', '')
						.replace(':active', '')
						.replace('+', '')
						.replace('~', '')
						.replace('*', '')
						.split(' ');

					for (var word = 0; word < words.length; word++) {
						if ( (modifierRegExpDetect.test( words[word] )) && (words[word].indexOf(':not(') === -1) ) {

							var delimPos = words[word].indexOf('__');
							if (words[word].charAt( delimPos - 1 ) == '.') {
								var block = words[word].substring(0, delimPos-1),
									modifier = words[word].substring(delimPos).replace(modifierClean, '');

								if (block && modifier && (block.indexOf('.', 1) === -1)) {
									addToList(block.substring(1), modifier, words[word]);
								} else {
									dropException(words[word], 'not full, dirty block');
								}

							} else {
								var stringList = words[word].split('.');

								for (var sel = 0; sel < stringList.length; sel++) {
									var block = stringList[sel].substring(0, stringList[sel].indexOf('__') );

									if (block) {
										addToList(block, stringList[sel], stringList[sel]);
									} else {
										dropException(stringList[sel], 'not full');
									}
								}
							}
						} else {
							dropException(words[word], '__, :not');
						}
					}
				}
			}
		}

	}

	return outputTree;
}()