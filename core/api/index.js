// modules
var fs = require('fs');
var url = require('url');
var qs = require('querystring');


// global vars
var body = '';



console.log('\n\n\n======== START =======');


/* File Tree reader */

// transform symbolic link
//var symlink = fs.readlinkSync(__dirname + '/../../public');
//var link = symlink + 'data/pages_tree.json';

// read data from file
var file = fs.ReadStream(__dirname + '/../../public/data/pages_tree.json', { encoding: 'UTF-8' });

file.on('readable', function (err) {
    if (err) console.log('READABLE: ', err);

    var data = file.read();
    body += data;
});

file.on('end', function (err) {
    if (err) console.log('END: ', err);

    var api = fs.writeFile('./api.json', body, function () {
       console.log('file written');
    });

    console.log(JSON.parse(body));
   getPaths(JSON.parse(body), ['base', 'mob']);
//    console.log(_path);
});
/* /File Tree reader */



module.exports = function api(req, res, next) {

    var headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
        'Access-Control-Allow-Credentials': true
    };

    if (req.url == '/api') {

        if (req.method == 'POST') {

            console.log('POSTED');

            // tasks in POST
            var modules = {
                parseModifiers: require('./parseModifiers')
            }

            postParser(req, function (post) {
                var
                    innerBody = body,
                    path = post.specID,
                    section = post.sec;

                console.log('----> postParser\n', post['specs[id]']);

//                if (post.task && modules[post.task]) {
//                    innerBody = JSON.stringify(modules[post.task]);
//                }

                if (path) {
                    var
                        pathArr = path.split('/'),
                        length = pathArr.length,
                        obj = JSON.parse(innerBody);

                    for (var i = 0; i < length; i++) {
                        if (obj[pathArr[i]]) {
                            obj = obj[pathArr[i]];
                        } else {
                            obj = {
                                specFile: {
                                    error: 'false path'
                                }
                            }
                        }
                    }

                    console.log('OBJ: ', obj);
                    innerBody = JSON.stringify(obj.specFile);
                }

                res.writeHead(200, headers);
                res.end(innerBody);

            });

        } else {
            res.writeHead(200, headers);
            res.end(body);
        }



//	if (req.url == '/api/get-css-mod') {
//		var cssParser = require('./parseModifiers');
//
//		res.send( cssParser );
//	} else if (req.url == '/api') {
//    console.log('Api:: URL:: ', req.url);


        // read directory
        //fs.readdir(symlink, function (err, data) {
        //    if (err) console.log('READDIR: ', err);
        //
        //    console.log('--> FS:\n\n', data)
        //});


        //var stats = fs.stat(path).isFile();
        //console.log('STATS:\n', stats);

        //var stat = fs.lstat(__dirname + '/../../public/data', function (err, path) {
        //   console.log('LSTAT', path);
        //});

    } else next();

}


// all done
console.log('----> API connected. All done.');



// Helpers

function postParser(req, callback) {

    var post ='';

    req.on('data', function (chunk) {
        post += chunk;
    });

    req.on('end', function () {

        post = qs.parse(post);

        callback(post);

    });

}

var _path = [];
function getPaths(obj) {

    for (var k in obj) {

        if (obj['specFile'] && obj['specFile']['keywords']) {
            _path.push(obj.specFile.url);
            return;
        }

        if (typeof obj[k] == 'object') getPaths(obj[k]);

    }
}




/**
 * Ajax
 *
 * method: POST
 * url: /api
 * data: {task: 'CSSModifiers', spec: { id: <path>, sec: <num>}}
 */

/*
$.ajax('/api', {
    data: {
        task: 'parseModifiers',
        specID: 'mob/base/buttons',
        sec: 2
    },
    method: 'POST',
    success: function (data) {console.log(data)}
});

*/