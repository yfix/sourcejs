var fs = require('fs');

//fs.readFile()

//var dir = fs.readdir(__dirname + '/../../public/data',
//    function (err, files) {
//        console.log(files);
//    });


var file = fs.readFile('./api.json',
    { encoding: 'UTF-8' },
    function (err, data) {
        console.log(data);
});



