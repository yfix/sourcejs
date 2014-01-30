//var fs = require('fs');

//fs.readFile()

//var dir = fs.readdir(__dirname + '/../../public/data',
//    function (err, files) {
//        console.log(files);
//    });


//var file = fs.readFile(
//    './api1.json',
//    { encoding: 'UTF-8' },
//    function (err, data) {
//        if (err) console.log('!! File not readed\n', err);
//
//        console.log(data);
//});



//var file = fs.ReadStream('api.json');
//
//file.on('readable', function () {
//   var data = file.read();
//
////   console.log(data.toString());
//});
//
//
//
//fs.stat('api.json', function (err, data) {
//    if (err) console.log(err);
//    else {
//        if ((data.atime - data.mtime) / 60000 < 10) {
//            console.log('fresh.');
//        } else {
//            console.log('old shit.')
//        }
//    }
//});


var exec = require('child_process').exec;
var fs = require('');

exec('curl http://mail.ru', function (err, stdout, stderr) {
    if (err) console.log('=== ERR');
//    if (stderr) console.log(stderr);

    var out = fs.ReadStream(stdout);

    console.log(out);
//    out.on('readable', function (err) {
//        if (err) console.log(err);
//
//       var chunk = out.read();
//       console.log(chunk);
    });


//console.log(stdout);
//    stdout.on('readable', function (chunk) {
//        var data = chunk.read();
//        console.log(data);
//    });




//});


