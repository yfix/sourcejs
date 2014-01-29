// modules
var fs = require('fs');

// global vars
var
    bd = 'pages_tree.json',
    body = '',
    specs;

// transform symbolic link
var symlink = fs.readlinkSync(__dirname + '/../../public');
var link = symlink + 'data/pages_tree.json';
console.log('link', link);


console.log('\n\n\n======== START =======');
console.log(link);

var file = fs.ReadStream(link, { encoding: 'UTF-8' });

file.on('readable', function (err) {
    if (err) console.log('READABLE: ', err);

    var data = file.read();
    body += data;
});

file.on('end', function (err) {
    if (err) console.log('END: ', err);

//    console.log('Reading over.\n');

    specs = JSON.parse(body);
    //    console.log( specs.mob.base );
//            res.writeHead(200, {'Content-Type': 'text/plain'});

});