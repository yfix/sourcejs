//var page = require('webpage').create();
//
//
//page.open('http://me:8080/mob/base/buttons', function() {
//    setTimeout(function () {
//        page.render('github.png');
//        }, 300);
//
//    setTimeout(function () {
//        phantom.exit();
//    }, 300);
//});



// Render Multiple URLs to file

var RenderUrlsToFile, arrayOfUrls, system;

system = require("system");

/*
 Render given urls
 @param array of URLs to render
 @param callbackPerUrl Function called after finishing each URL, including the last URL
 @param callbackFinal Function called after finishing everything
 */
RenderUrlsToFile = function(urls, callbackPerUrl, callbackFinal) {
    var getFilename, next, page, retrieve, urlIndex, webpage;

    urlIndex = 0;
    webpage = require("webpage");
    page = null;
    getFilename = function() {
        return "thumb-" + urlIndex + ".png";
    };

    next = function(status, url, file) {
        page.close();
        callbackPerUrl(status, url, file);
        return retrieve();
    };

    retrieve = function() {
        var url;
        if (urls.length > 0) {
            url = urls.shift();
            urlIndex++;
            page = webpage.create();
            page.viewportSize = {
                width: 800,
                height: 600
            };
            page.settings.userAgent = "Phantom.js bot";
            return page.open("http://" + url, function(status) {
                var file;
                file = getFilename();
                if (status === "success") {
                    return window.setTimeout((function() {
// save path
                        page.render('img/'+ file);
                        return next(status, url, file);
                    }), 300);
                } else {
                    return next(status, url, file);
                }
            });
        } else {
            return callbackFinal();
        }
    };
    return retrieve();
};

arrayOfUrls = null;

if (system.args.length > 1) {
    arrayOfUrls = Array.prototype.slice.call(system.args, 1);
} else {
    console.log("Usage: phantomjs render_multi_url.js [domain.name1, domain.name2, ...]");
    arrayOfUrls = ["www.google.com", "www.bbc.co.uk", "www.phantomjs.org", "www.mail.ru"];
}

RenderUrlsToFile(arrayOfUrls, (function(status, url, file) {
    if (status !== "success") {
        return console.log("Unable to render '" + url + "'");
    } else {
        return console.log("Rendered '" + url + "' at '" + file + "'");
    }
}), function() {
    return phantom.exit();
});