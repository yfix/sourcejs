var fs = require('fs');

//console.log(__dirname);

var fileStream = fs.ReadStream('/Users/dmitrylapynov/odkl/OKP-odkl/data/pages_tree.json');

var body = '';
fileStream.on('readable', function (err) {
    if (err) console.log(err);

    var data = fileStream.read();

    body += data;
    console.log( data.length );
    console.log( data );
    console.log( '---> data end' );
});

fileStream.on('end', function (err) {
    if (err) console.log(err);
//    console.log('body:\n\n', body);
    console.log('---> all data readed');

})