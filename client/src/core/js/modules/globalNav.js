/*
*
* @author Robert Haritonov (http://rhr.me)
*
* */

define([
    'jquery',
    'modules/module',
    'modules/utils',
    'modules/parseFileTree'
    ], function($, module, utils, parseFileTree) {

    function GlobalNav() {
        var _this = this;

        this.options.modulesOptions.globalNav = $.extend(true, {
            CATALOG : 'source_catalog',
            CATALOG_LIST : 'source_catalog_list',
            CATALOG_LIST_I : 'source_catalog_list_i',

            CATALOG_LIST_ALL : 'source_catalog_all',
                CATALOG_LIST_ALL_A : 'source_a_bl',

            CATALOG_LIST_A : 'source_catalog_a source_a_g',
            CATALOG_LIST_A_TX : 'source_catalog_title',
            CATALOG_LIST_DATE : 'source_catalog_footer',
            CATALOG_LIST_BUBBLES : 'source_bubble',

            RES_LINK_TO_ALL : 'All',
            RES_AUTHOR : 'Author',
            RES_NO_DATA_ATTR : 'Data-nav attr not set',
            RES_NO_CATALOG : 'Specified catalog is empty or does not exist',

            pageLimit : 999
        }, this.options.modulesOptions.globalNav);

        $(function(){
            _this.init();
        });
    }

    GlobalNav.prototype = module.createInstance();
    GlobalNav.prototype.constructor = GlobalNav;

    GlobalNav.prototype.init = function () {
        this.drawNavigation();
    };

    //Drawing navigation and page info in each catalog defined on page
    GlobalNav.prototype.drawNavigation = function () {
        var _this = this,
            L_CATALOG = $('.' + this.options.modulesOptions.globalNav.CATALOG),
            CATALOG_LIST = this.options.modulesOptions.globalNav.CATALOG_LIST,
            CATALOG_LIST_I = this.options.modulesOptions.globalNav.CATALOG_LIST_I,

            CATALOG_LIST_ALL = this.options.modulesOptions.globalNav.CATALOG_LIST_ALL,
                CATALOG_LIST_ALL_A = this.options.modulesOptions.globalNav.CATALOG_LIST_ALL_A,

            CATALOG_LIST_A = this.options.modulesOptions.globalNav.CATALOG_LIST_A,
                CATALOG_LIST_A_TX = this.options.modulesOptions.globalNav.CATALOG_LIST_A_TX,

            CATALOG_LIST_DATE = this.options.modulesOptions.globalNav.CATALOG_LIST_DATE,
            CATALOG_LIST_BUBBLES = this.options.modulesOptions.globalNav.CATALOG_LIST_BUBBLES,
            RES_LINK_TO_ALL = this.options.modulesOptions.globalNav.RES_LINK_TO_ALL,
            RES_AUTHOR = this.options.modulesOptions.globalNav.RES_AUTHOR,
            RES_NO_DATA_ATTR = this.options.modulesOptions.globalNav.RES_NO_DATA_ATTR,
            RES_NO_CATALOG = this.options.modulesOptions.globalNav.RES_NO_CATALOG,

            pageLimit = this.options.modulesOptions.globalNav.pageLimit;
            sortType = this.options.modulesOptions.globalNav.sortType || 'sortByDate';
            ignorePages = this.options.modulesOptions.globalNav.ignorePages || [];

        L_CATALOG.each(function () {
            var t = $(this),
                navListCat = t.attr('data-nav'),

                L_CATALOG_LIST = t.find('.' + CATALOG_LIST);

            if (navListCat != '') { //Catalog has data about category

                var targetCat = parseFileTree.getCatAll(navListCat);

                // cast Object to Array of objects
                if (typeof targetCat === 'object'){
                    var targetCatArray = $.map(targetCat, function(k, v) {
                        if(typeof k['index.html'] === 'object') {
                            return [k];
                        }
                    });

                    // sort
                    targetCatArray.sort(function(a, b){
                    	if (sortType == 'sortByDate') {
                    		return _this.sortByDate(a, b)
                    	} else if (sortType == 'sortByAlpha') {
                    		return _this.sortByAlpha(a, b);  
                    	} else {
							return _this.sortByDate(a, b)
									|| _this.sortByAlpha(a, b);                    	
                    	}                    
                    });
                } 

                //Collecting nav tree
                if (L_CATALOG_LIST.length === 1 && targetCatArray != undefined) {
                                
                    var navTreeHTML = '',
                        authorName = '',
                        targetCatUrl =  (targetCat['index.html'] !== undefined) ? targetCat['index.html']['url'] : targetCatArray['0']['index.html']['url'] ;

                    //Building navigation HTML
                    var addNavPosition = function (target) {

                        if (typeof target.author === 'undefined') {
                            authorName = '';
                        } else {
                            authorName = ' | ' + RES_AUTHOR + ': ' + target.author + '';
                        }

                        //fixing relative path due to server settings
                        var targetUrl = target.url;
                        if(targetUrl.charAt(0) !== '/')
                            targetUrl = '/' + targetUrl;

                        navTreeHTML += '' +
                                '<li class="' + CATALOG_LIST_I + '">' +
                                '<a class="' + CATALOG_LIST_A + '" href="' + targetUrl + '">' +
                                '<span class="' + CATALOG_LIST_A_TX + '">' + target.title + '</span>' +
                                '<div class="' + CATALOG_LIST_DATE + '">' + target.lastmod + authorName + '</div>';

                        if(parseInt(target.bubbles)) {
                            navTreeHTML +=
                            '<div class="' + CATALOG_LIST_BUBBLES + '">' + target.bubbles + '</div>';
                        }

                        navTreeHTML +=
                                '</a>' +
                                '</li>';
                    };

                    var navListItems = (pageLimit > targetCatArray.length)
                            ? targetCatArray.length
                            : pageLimit;

                    for (var j = 0; j < navListItems; j++) {
                        var targetPage = targetCatArray[j]['index.html'];

                        //Ignore page list
                        if ( $.inArray(targetPage.title, ignorePages) !== -1 ) {
                        	continue;
                        }
                        
                        //Undefined title
                        if (targetPage === undefined || targetPage.title === undefined) {
                        	continue;
                        }
                        
                        addNavPosition(targetPage);
                    }

                    //Injecting nav tree
                    L_CATALOG_LIST.html(navTreeHTML);

                    //Go to cat page link
                    if (targetCatArray.length > navListItems) {
                        L_CATALOG_LIST.append(
                            '<li class="' + CATALOG_LIST_I + ' ' + CATALOG_LIST_ALL + '">' +
                                '<a class="' + CATALOG_LIST_ALL_A + '" href="' + targetCatUrl + '">'+ RES_LINK_TO_ALL + ' ' + targetCatArray.length + '</a>' +
                            '</li>');
                    }

                }

                if (targetCat === undefined) {
                    L_CATALOG_LIST.html(RES_NO_CATALOG);
                }

            } else {
                //Display error
                L_CATALOG_LIST.html(RES_NO_DATA_ATTR);
            }
        });
    };

    GlobalNav.prototype.sortByDate = function (a, b) {
        a = parseInt(a['index.html'].lastmodSec);
        b = parseInt(b['index.html'].lastmodSec);

        if(a == b) return 0;
        else {
            return (a > b) ? -1 : 1;
        }
    };

    GlobalNav.prototype.sortByAlpha = function (a, b) {
        a = a['index.html'].title;
        b = b['index.html'].title;

        if(a == b) return 0;
        else {
            return (a > b) ? 1 : -1;
        }
    };

    return new GlobalNav();

});