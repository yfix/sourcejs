define(["core/options"], function(options) {
    //Header and Footer injection
    var source_container = $('.source_container');

    //add header / footer TODO: перенести ручками в html во всех спеках
    source_container
            .prepend($('<div class="source_header"></div>'))
            .append($('<div class="source_footer"></div>'));

    if (source_container.length) {
        //some empty page
        if (!source_container.contents().length) {
            source_container.append($('<div class="source_main source_col-main" role="main">Welcome to Source!</div>'));
        }

        //
        // insert link to okp.me
        var
                loc = document.location,
                host = loc.host,
                href = loc.href;
        if(host.indexOf('.')==-1){
            href = href.replace(host, 'okp.me');
            var head = source_container.find('h1');
            if(head.length){
                $('<a id="goToRemote" ' +
                        'style="margin-left: 15px; font-size: 14px; color: #666; border-bottom: 1px dotted; text-decoration: none;"' +
                        ' href="" target="_blank">open on OKP.ME' +
                        '</a>')
                        .appendTo(head);
                setTimeout(function(){
                    $('#goToRemote').attr('href', href);
                },1);
            }
        }

        var insertHeader = function(data) { $('.source_header').replaceWith(data.responseText);}

        var headerFile = 'header.inc.html',
            footerFile = 'footer.inc.html';

        $.ajax({
            url:"/user/templates/"+headerFile,
            async:false,
            complete:function (data, status) {
                if (status === 'success') {
                    insertHeader(data);
                } else {
                    $.ajax({
                        url:"/core/templates/"+headerFile,
                        async:false,
                        complete:function (data) {
                            insertHeader(data);
                        }
                    });
                }
            }
        });

        var insertFooter = function(data) { $('.source_footer').replaceWith(data.responseText); }

        $.ajax({
            url:"/user/templates/"+footerFile,
            async:false,
            complete:function (data, status) {
                if (status === 'success') {
                    insertFooter(data);
                } else {
                    $.ajax({
                        url:"/core/templates/"+footerFile,
                        async:false,
                        complete:function (data) {
                            insertFooter(data);
                        }
                    });
                }
            }
        });

        //click on header - go up
        $('.source_header').on({
            'mouseover' : function(e){
                if(e.target === this){
                    $('.source_header').css('cursor', 'pointer');
                }else {
                    $('.source_header').css('cursor', 'inherit');
                }
            },
            'click' : function(e){
                if(e.target === this){
                    window.scrollTo(0, 0);
                }
            },
            'mouseout' : function(e){
                $('.source_header').css('cursor', 'inherit');
            }
        });

    }

});