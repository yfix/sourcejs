// modules
var fs = require('fs'),
    url = require('url'),
    exec = require('child_process').exec,
    qs = require('querystring');


// global vars
var body = '',
    _path = [],
    cats = {},
    apiState,
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
        'Access-Control-Allow-Credentials': true
    };


/* File Tree reader */
fs.stat(__dirname + '/api.json', function (err, data) {
    if (data == undefined || process.argv.indexOf('reload') !== -1) {
        console.log('Stat error: ', err);
        console.log('* API need to be updated.\n');
        apiState = false;
    } else {
        console.log( (new Date - data.mtime) / 60000 );

        if ((new Date - data.mtime) / 60000 < 2) {
            console.log('* API is fresh.\n');
            apiState = true;
        } else {
            console.log('* API is old shit.\nOhmy, I reload it again.\n')
            apiState = false;
        }
    }

    if (!apiState) {
        console.log('---> Reading pages_tree.json..');
        fs.readFile(__dirname + '/../../public/data/pages_tree.json', function (err, data) {
            if (err) console.log(err);

            body = data;

            fs.writeFile(__dirname +'/api.json', body, function () {
                console.log('---> File api.json has been written.');

                exec('node ' + __dirname + '/getHTMLParts/index.js '+ __dirname +' '+__dirname+'/../clarify ' + global.opts.common.port, function(err, stdout){
                    if (err) console.log(err);

                    console.log(stdout);
                    console.log(JSON.parse(stdout).written == true);

                    var waiting = setInterval(function() {
                        if(JSON.parse(stdout).written == true) {
                            setTimeout(function(){
                                fs.readFile(__dirname + '/api.json', { encoding: 'UTF-8' }, function (err, data) {
                                    if (err) console.log(err);

                                    console.log('--> New file readed.');
                                    body = data;

                                    _path = [];
                                    getPaths( JSON.parse(data) );

                                    cats = {};
                                    getCats( JSON.parse(data) );
                                });
                            }, 3000);

                            clearInterval(waiting);
                        }
                    }, 3000);
                });
            });
        });
    } else {
        fs.readFile(__dirname + '/api.json', function (err, data) {
            body = data;

            getPaths( JSON.parse(body) );
            getCats( JSON.parse(body) );
        });
    }
});



module.exports = function api(req, res, next) {

    if (req.url == '/api') {

        if (req.method == 'POST') {

            // tasks in POST
            var modules = {
                parseModifiers: require('./parseModifiers'),
                getCats: cats
            };

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
                sections: obj.specFile.sections,
                single: obj.specFile.single
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
        task: <your task*>
        specID: 'mob/base/buttons',
        sec: <num>
    },
    method: 'POST',
    success: function (data) {console.log(data)}
});

* Tasks:
* getCats
* parseModifiers
*/
