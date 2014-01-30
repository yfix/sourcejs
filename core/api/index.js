// modules
var fs = require('fs'),
    url = require('url'),
    qs = require('querystring');


// global vars
var body = '',
    _path = [],
    cats = {},
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
        'Access-Control-Allow-Credentials': true
    };


console.log('\n\n\n======== START =======');


/* File Tree reader */
var file = fs.ReadStream(__dirname + '/../../public/data/pages_tree.json', { encoding: 'UTF-8' });

file
    .on('readable', function (err) {
        if (err) console.log('READABLE: ', err);

        var data = file.read();
        body += data;
    })

    .on('end', function (err) {
        if (err) console.log('END: ', err);

        var api = fs.writeFile('./api.json', body, function () {
           console.log('---> api.json is written.');

            require('./getHTMLParts').process('api.json', function () {
               console.log('---> Api has been modified.')

                newFile = fs.readFile('./api.json', { encoding: 'UTF-8' }, function (err, data) {
                    if (err) console.log(err);

                    console.log(data)
                });

            });
        });

    getPaths( JSON.parse(body), ['base', 'mob'] );
    getCats( JSON.parse(body) );
//    console.log(_path);
//    console.log(cats);
});
/* /File Tree reader */



module.exports = function api(req, res, next) {

    if (req.url == '/api') {

        if (req.method == 'POST') {

            console.log('POSTED');

            // tasks in POST
            var modules = {
                parseModifiers: require('./parseModifiers'),
                getCats: cats
            }

            postParser(req, function (post) {
                var
                    innerBody = body,
                    task = post.task,
                    path = post.specID,
                    section = post.sec;

                console.log('----> postParser\n', post['specs[id]']);

                if (task && modules[task]) {
                    innerBody = JSON.stringify(modules[post.task]);
                } else if (path) {
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

//                    console.log('OBJ: ', obj);
                    innerBody = JSON.stringify(obj.specFile);
                }


                res.writeHead(200, headers);
                res.end(innerBody);

            });

        } else {
            res.writeHead(200, headers);
            res.end(body);
        }

    } else next();

}


// all done
console.log('---> API connected succesfully.');



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

function getPaths(obj) {

    for (var k in obj) {

        if (obj['specFile'] && obj['specFile']['keywords']) {
            _path.push(obj.specFile.url);
            return;
        }

        if (typeof obj[k] == 'object') getPaths(obj[k]);

    }
}

function getCats(obj) {

    for (var k in obj) {

        if (obj['specFile'] && obj['specFile']['category']) {
            if (!cats[obj['specFile']['category']]) {
                cats[obj['specFile']['category']] = {};
            }

            cats[obj['specFile']['category']][obj.specFile.title] = {
                url: obj.specFile.url,
                keywords: obj.specFile.keywords,
                info: obj.specFile.info,
                target: obj.specFile.target
            };

            return;
        }

        if (typeof obj[k] == 'object') getCats(obj[k]);
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
        task: parseModifiers || getCats
        specID: 'mob/base/buttons',
        sec: 2
    },
    method: 'POST',
    success: function (data) {console.log(data)}
});

*/
