// .src files support

var fs = require('fs'),
    ejs = require('ejs');

function getHeaderAndFooter() {
    var defaultTemplatePath = global.app.get('specs path') + "/core/templates/";
    var userTemplatePath = global.app.get('specs path') + "/user/templates/";
    var headerFile = "header.inc.html";
    var footerFile = "footer.inc.html";

    var data = {};

    if(fs.existsSync(userTemplatePath + headerFile)) {
        data.header = ejs.render(fs.readFileSync(userTemplatePath + headerFile, "utf-8"));
    } else {
        data.header = ejs.render(fs.readFileSync(defaultTemplatePath + headerFile, "utf-8"));
    }

    if(fs.existsSync(userTemplatePath + footerFile)) {
        data.footer = ejs.render(fs.readFileSync(userTemplatePath + footerFile, "utf-8"));
    } else {
        data.footer = ejs.render(fs.readFileSync(defaultTemplatePath + footerFile, "utf-8"));
    }

    return data;
}

function serveContent(filePath, pathToSpec, res) {
    fs.exists(filePath, function(exists) {

        if(exists) {
            fs.readFile(filePath, 'utf8', function (err, data) {
                if (err) {
                    res.send(err);
                } else {

                    var info = {
                        title: "New spec",
                        author: "Anonymous"
                    };

                    if(fs.existsSync(pathToSpec + 'info.json')) {
                        info = require(pathToSpec + 'info.json');
                    }

                    var headerFooter = getHeaderAndFooter();

                    res.render("index", {
                        title: info.title,
                        author: info.author,
                        content: data,
                        header: headerFooter.header,
                        footer: headerFooter.footer
                    });
                }

            });
        } else {
            res.status(404).render('index', {
                title: "Spec not found",
                author: "Source",
                content: "Sorry, page not found"
            });
        }
    });
}

function doRedirect(pathToSpec, specURI, res) {
    fs.exists(pathToSpec + "index.src", function(exists) {
        if(exists) {
            res.redirect(specURI + "index.src")
        } else {
            res.redirect(specURI + "index.html")
        }
    });
}

global.app.set('view engine', 'ejs');
global.app.get('/:dir/:spec/:file.src', function(req, res){
    var dir = req.params.dir
            , spec = req.params.spec
            , file = req.params.file
            , pathToSpec = __dirname + "/../../" + global.opts.common.pathToSpecs + '/' + dir + "/" + spec + "/"
            , specFile = file + ".src";

    var filePath =  pathToSpec + specFile;

    serveContent(filePath, pathToSpec, res)

});

global.app.get('/:dir/:spec/:sub/:file.src', function(req, res){
    var dir = req.params.dir
            , spec = req.params.spec
            , sub = req.params.sub
            , file = req.params.file
            , pathToSpec = __dirname + "/../../" + global.opts.common.pathToSpecs + '/' + dir + "/"  + spec + "/" + sub + "/"
            , specFile = file + ".src";

    var filePath =  pathToSpec + specFile;

    serveContent(filePath, pathToSpec, res)

});

/*
* if *.src file exists - show templated content, else show static html
* */
global.app.get('/:dir/:spec/', function(req, res){
    var dir = req.params.dir
            , spec = req.params.spec
            , specURI = dir + "/" + spec + "/"
            , pathToSpec = __dirname + "/../../" + global.opts.common.pathToSpecs + '/' + dir + "/" + spec + "/";

    doRedirect(pathToSpec, specURI, res);
});

global.app.get('/:dir/:spec/:sub/', function(req, res){
    var dir = req.params.dir
            , sub = req.params.sub || ""
            , spec = req.params.spec
            , specURI = dir + "/" + spec + "/" + sub + "/"
            , pathToSpec = __dirname + "/../../" + global.opts.common.pathToSpecs + '/' + dir + "/" + spec + "/" + sub + "/";

    doRedirect(pathToSpec, specURI, res);
});