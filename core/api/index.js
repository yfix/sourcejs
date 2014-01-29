// modules
var fs = require('fs');
var url = require('url');
var qs = require('querystring')


// global vars
var body = '';



console.log('\n\n\n======== START =======');


/* File Tree reader */

// transform symbolic link
var symlink = fs.readlinkSync(__dirname + '/../../public');
var link = symlink + 'data/pages_tree.json';

// read data from file
var file = fs.ReadStream(link, { encoding: 'UTF-8' });

file.on('readable', function (err) {
    if (err) console.log('READABLE: ', err);

    var data = file.read();
    body += data;
});

file.on('end', function (err) {
    if (err) console.log('END: ', err);

});
/* /File Tree reader */



module.exports = function api(req, res, next) {

    if (req.url == '/api') {
        console.log('Api :: URL :: ', req.url, req.method);

        if (req.method == 'POST') {

            // tasks in POST
            var modules = {
                parseModifiers: require('./parseModifiers')
            }

            postParser(req, function (post) {
                var innerBody = body;

                console.log('----> postParser\n', post);

                if (post.task && modules[post.task]) {
                    innerBody = JSON.stringify(modules[post.task]);
                }

                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST',
                    'Access-Control-Allow-Headers': 'Content-Type'
                });
                res.end(innerBody);

            });

        } else {
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
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