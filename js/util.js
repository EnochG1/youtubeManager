var XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';

var x2js = new X2JS({
    arrayAccessFormPaths: ['playerInfo.distribute.download.fileName',
        'playerInfo.scheduleInfo.itemList',
        'playerInfo.scheduleInfo.itemList.items',
        'playerInfo.scheduleInfo.itemList.items.item'
    ]
});

var xml2json = function(xml) {
    if (typeof xml === "string") {
        return x2js.xml_str2json(xml);
    } else {
        return x2js.xml2json(xml);
    }
};

var json2xml = function(json) {
    return XML_DECLARATION + x2js.json2xml_str(json);
};

var toJson = function(data) {
    //console.debug('toJson : ' + jQuery.type(data));
    if (jQuery.type(data) === 'string') {
        return $.parseJSON(data);
    } else {
        return data;
    }
};

var toDate = function(yyyyMMddHHmmss) {
    return moment(yyyyMMddHHmmss, 'YYYYMMDDHHmmss').toDate();
};

var toTime = function(yyyyMMddHHmmss) {
    return moment(yyyyMMddHHmmss, 'YYYYMMDDHHmmss').valueOf();
};

var toTimeMilli = function(yyyyMMddHHmmssSSS) {
    return moment(yyyyMMddHHmmssSSS, 'YYYYMMDDHHmmssSSS').valueOf();
};

var toTimestamp = function(time) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss,SSS');
};

var toDateTimeFormat = function(time) {
    return moment(time).format('YYYYMMDDHHmmss');
};

var timestamp = function() {
    return moment().format('YYYY-MM-DD HH:mm:ss,SSS');
};

var logging = function() {
    return timestamp() + ' - ';
};

var getURLParameter = function(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
};