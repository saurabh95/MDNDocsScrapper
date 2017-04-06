/*eslint-env node */
/*jslint node: true */

var fs = require('fs');
var path = require('path');

var filePath = path.join(__dirname, 'css.json');

var scraperjs = require('scraperjs');
fs.readFile(filePath, {
    encoding: 'utf-8'
}, function (err, data) {
    "use strict";
    data = JSON.parse(data);
    console.log(data.length);
    var i = 0, failed = [], prop;
    for (prop in data) {
        i += 1;
        (function (tagg) {
            setTimeout(function () {
                var lnk = 'https://developer.mozilla.org' + data[tagg].URL;
                

                scraperjs.StaticScraper.create(lnk).scrape(function ($) {
                    try {
                        console.log(tagg);
                        var x = $("dl").children(), isValue = $("#Values"), flag = false;
                        isValue = isValue.html();

                        data[tagg].VALUES = [];
                        if (Object.keys(x).length) {
                            
                            var cnt = 0, val = {}, key;
                            for (key in x) {
                                if (parseInt(key, 10) >= 0) {
                                    cnt += 1;
                                    if (cnt % 2 === 0) {
                                        val.description = $(x[key]).html();
                                        data[tagg].VALUES.push(val);
                                        val = {};
                                    } else {
                                        val.value = $(x[key]).html();
                                    }
                                    flag = true;
                                    //console.log($(x[key]).html());
                                }
                            }
                        } else {
                            console.log("123FAILED: " + lnk);
                        }
                        if (isValue === null) {
                            failed.push(lnk);
                            console.log("FAILED: " + lnk);
                            fs.writeFile("FAILED.json", JSON.stringify(failed), function (err) {
                                console.log("Failed to write to FAILED.json file");
                            });
                        } else if (!flag) {
                            var val = {
                                value: "",
                                description: $("#Values").next().html()
                            };
                            data[tagg].VALUES.push(val);
                            flag = true;
                            console.log("Passed with values in p tag");
                        }
                        if (flag === true) {
                            fs.writeFile("PASSED.json", JSON.stringify(data), function (err) {
                                if(err) {
                                    console.log("Failed to write to PASSED.json file " + err);
                                }
                            });
                        }
                    } catch(err) {
                        console.log("FAILED: " + lnk);
                    }
                    
                    });
            }, 1500 * i);
        })(prop);
    }

});