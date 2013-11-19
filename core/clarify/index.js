var
	fs = require('fs'),
	url = require('url'),
	path = require('path'),
	exec = require('child_process').exec,
	jsdom = require('jsdom'),
	dom = require('./dom'),
	jady = require('./jady');

var
	opts = require('../options'),
	publicPath = opts.common.pathToSpecs;


module.exports = function reply(req, res, next) {
	var
		parsedUrl = url.parse(req.url, true),
		urlPath = parsedUrl.pathname,
		urlHost = req.headers.host,
		urlAdress = (parsedUrl.protocol || "") + urlHost + urlPath,
		tpl = parsedUrl.query.get,
		id = parsedUrl.query.id,
		wrap = parsedUrl.query.wrap;
//debugger


//// if we have query on index.html
	if (path.basename(parsedUrl.path).indexOf('index.html') != -1 && parsedUrl.query.get) {
		fs.readFile(publicPath + '/' + urlPath, function (err, data) {

			if (err) res.end('Huston, we have 404.\n'+ err);

			jsdom.env(data.toString(), function (err, win) {
////url mode
//			jsdom.env(publicPath + '/' + urlPath, function (err, win) {

				var
					doc = win.document,
					html = {};

				try {
					html.title = doc.title;
					html.meta = dom.getMeta(doc);
					html.styles = dom.getHeadData(doc)[0];
					html.scripts = dom.getHeadData(doc)[1];
					html.source = dom.getSource(doc, id, wrap);
				} catch (e) {
					html.err = {
						text: e,
						type: e.name
					};
				}

//				console.log(html);

				if (html.source) {
//// переменные для Jade
					var locals = {
						head: {
							title: html.title,
							mAuthor: html.meta.author,
							mKeywords: html.meta.keywords,
							mDescription: html.meta.description,
							scripts: html.scripts,
							stylesheets: html.styles
						},
						body: {
							spec: html.source.content,
							specLength: html.source.length,
							specId: html.source.id,
							specIdSum: html.source.idSum,
							homeLink: 'http://'+ urlAdress
						},
						pretty: true
					};
					res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
						res.end(jady(locals, tpl));

				} else res.end('STDOUT: can\'t recieve content.');

			});

		});
	} else next();
};



// TODO: check list below
// [done] beatify html output
// [done] create json with <head> data
// [done] parse several blocks in same page
// [done] switchers to another specs from cleares one;
// [done] fast links from spec page
// [done] phantomjs -> jsdom
// [...!] support for template engines
// * [] Лёха: универсальный шаблонизатор для страниц контекста
// * [] убрать захардкоженные пути
// * [] сделать вывод полностью чистой спеки без любых элементов ОКП
// * [] подключать css/js опционально по запросу в URI
// * [] GET -> POST
// * [] Ajax
// * [] Кнопки подключения библиотек (jQuery, require);
// * [] ссылка с блока в clarify на оригинальный блок в спеке
// * [] "чистые" шаблоны для других контекстов (все стилевые контексты моба, веб, ...)
// * [] ошибка phantomjs при попытке загрузить недоступный script
// * [] скриншоты спек со страницы
// * [] phantomjs: не закрывать сессию (?);
