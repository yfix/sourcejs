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
    },
    apiState;


console.log('\n\n\n======== START =======');


/* File Tree reader */
fs.stat(__dirname + '/api.json', function (err, data) {
    if (data == undefined) {
        console.log('Stat error: ',err);
        apiState = 'not found';
    } else {
        console.log('stats:\n', data);
        if ((data.atime - data.mtime) / 60000 < 10) {
            console.log('Api is fresh');
            apiState = 'fresh';
        } else {
            console.log('Api is old shit')
            apiState = 'old';
        }
    }


    if (apiState == 'old' || apiState == 'not found') {
        fs.readFile(__dirname + '/../../public/data/pages_tree.json', function (err, data) {
            if (err) console.log(err);

            body = data;

            fs.writeFile(__dirname +'/api.json', body, function () {
                console.log('---> api.json is written.');

                require('./getHTMLParts').process(__dirname + '/api.json', function () {
                    console.log('---> Api has been modified.');

                    fs.readFile(__dirname + '/api.json', { encoding: 'UTF-8' }, function (err, data) {
                        if (err) console.log(err);

                        console.log('--> New file readed.');
                        body = data;

                        _path = [];
                        getPaths( JSON.parse(body), ['base', 'mob'] );

                        cats = {};
                        getCats( JSON.parse(body) );

                    });

                });
            });


        });
    } else {
        fs.readFile(__dirname + '/api.json', function (err, data) {
            body = data;

            getPaths( JSON.parse(body), ['base', 'mob'] );
            getCats( JSON.parse(body) );
        });
    }
});

//console.log('apiSTAT', apiState);
//




module.exports = function api(req, res, next) {

    if (req.url == '/api') {

        if (req.method == 'POST') {


//            console.log('POSTED');

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

//                console.log('----> postParser\n');

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
                target: obj.specFile.target,
                sections: obj.specFile.sections
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
