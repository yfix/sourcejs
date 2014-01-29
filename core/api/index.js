// modules
var fs = require('fs');

// global vars
var
    bd = 'pages_tree.json',
    body = '',
    specs;

module.exports = function api(req, res, next) {

	if (req.url == '/api/get-css-mod') {
		var cssParser = require('./parseModifiers');

		res.send( cssParser );
	} else if (req.url == '/api') {
    console.log('Api:: URL:: ', req.url);

// before work
        console.log('\n\n\n======== START =======');


        // transform symbolic link
        //var symlink = fs.readlinkSync(__dirname + '/../../public');
        //var link = symlink + 'data/pages_tree.json';
        //console.log('link', link);

        // read directory
        //fs.readdir(symlink, function (err, data) {
        //    if (err) console.log('READDIR: ', err);
        //
        //    console.log('--> FS:\n\n', data)
        //});


        var file = fs.ReadStream(__dirname + '/../../public/data/pages_tree.json', { encoding: 'UTF-8' });
        //console.log('FILE:', file);
        //var stats = fs.stat(path).isFile();

        //console.log('STATS:\n', stats);


        //console.log('SYMLINK: ' , fs.readlinkSync(__dirname + '/../../public'));


        //var stat = fs.lstat(__dirname + '/../../public/data', function (err, path) {
        //   console.log('LSTAT', path);
        //});

        file.on('readable', function (err) {
            if (err) console.log('READABLE: ', err);

            var data = file.read();
            body += data;
        });

        file.on('end', function (err) {
            if (err) console.log(err);

            console.log('Reading over.\n');

            specs = JSON.parse(body);
//    console.log( specs.mob.base );

        });

        res.end(body);

    } else next();

}


// all done
console.log('----> API connected. All done.');
