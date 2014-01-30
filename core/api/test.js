var fs = require('fs'),
    execSync = require('exec-sync');


var params = "http://127.0.0.1:8080";
var arr = [
    '/base/amodal',
    '/mob/base/buttons'
//    '/project/photo',
//    '/project/posting-form/cross-posting',
];

var output = [];


arr.map(function(item) {
//    console.log(item);
    var out = execSync(__dirname + '/../clarify/phantomjs getHTMLParts/ph.js '+ params+item, true);


//    output.push(out.stdout);
    console.log(out.stdout);
//
//
});

//console.log(output[3]);
//console.log(output.length);



