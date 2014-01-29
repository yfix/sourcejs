var page = require('webpage').create();


page.open('http://me:8080/mob/base/buttons', function() {
    setTimeout(function () {
        page.render('github.png');
        }, 300);

    setTimeout(function () {
        phantom.exit();
    }, 300);
});