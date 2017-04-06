var fs = require('fs');
var path = require('path');

var filePath = path.join(__dirname, 'PASSED.json');

var final_data = {};

var scraperjs = require('scraperjs');
fs.readFile(filePath, {
    encoding: 'utf-8'
}, function (err, data) {
    "use strict";
    data = JSON.parse(data);
    for (var prop in data) {
        var val = data[prop];
        val.URL = 'https://developer.mozilla.org' + val.URL;
        final_data[prop] = val;
    }
    fs.writeFile('MDNCSS.json', JSON.stringify(final_data), function (err) {
        if (err) {
            console.log("Unable to write File");
        }
    });
});