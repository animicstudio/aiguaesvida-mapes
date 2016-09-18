var AeV = {};

/**
 * Sends a pageView GA track
 */
AeV.gaPageView = function(){
    ga('create', 'UA-60011287-1', 'auto');
    ga('send', 'pageview');
};

/**
 * Sends a mapView GA track
 */
AeV.gaMapView = function(map,preu,isFirst){
    if( AeV.read_cookie("viewed_cookie_policy") ){
        ga('send', 'event', 'map', map, preu, (isFirst) ? {'nonInteraction': 1} : undefined );
    }
};

/**
 * Tracks infoWindow view in a map
 * @param map
 * @param extraInfo
 */
AeV.gaMapInfoWindowView = function(map,extraInfo){
    if( AeV.read_cookie("viewed_cookie_policy") ){
        ga('send', 'event', 'map_infoWindow', map, extraInfo );
    }
};

/**
 * Function to read a cookie
 * @param key
 * @returns {*}
 */
AeV.read_cookie = function(key){
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
};

/**
 * Sets the format to the numbers
 * @param str
 * @param nDecimals
 * @returns {string}
 */
AeV.formatNumber = function(str,nDecimals) {
    if( nDecimals != undefined ){
        str = parseFloat( str ).toFixed( nDecimals )
    }
    str += '';
    var x = str.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? ',' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
};