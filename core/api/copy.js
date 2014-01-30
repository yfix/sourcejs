var fs = require('fs');

//fs.readFile()

var dir = fs.readdir(__dirname + '/../../public/data',
    function (err, files) {
        console.log(files);
    });


var file = fs.readFile(__dirname + '/../../public/data/pages_tree.json',
    function (err, data) {
        console.log(data);
});


file.on('data', function () {
    data.read();
    console.log()
})

