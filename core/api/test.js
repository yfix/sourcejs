// stream testing

var exec = require('child_process').exec;



var output = [];
var child = exec('curl mail.ru', function (err, stdout, stderr) {
//    console.log(child);
//    output = stdout;
});

child.stdout.on('data', function (data) {
    output.push(data);
});

child.stdout.on('end', function () {
   console.log(output.length);
});F


