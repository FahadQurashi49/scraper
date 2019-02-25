const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const glob = require('glob');

// const links = require('./urls/manto.json');

var outputDir;

jsonFileList();

function jsonFileList() {
    const dir = './urls/*.json';
    glob(dir, function (err, files) {
        if(!err) {
            scrapeFiles(files);
        }
    });
}

function scrapeFiles(files) {
    if (files && files.length > 0) {
        var file = files.pop();
        outputDir = 'output/' + file.split('./urls/').pop().split('.')[0] + '/';
        if (!fs.existsSync(outputDir) ){
            fs.mkdirSync(outputDir);
        }
        var urls = require(file);
        scrapeUrl(urls, function (err) {
            scrapeFiles(files);
        })
    }
}

function scrapeUrl(urls, cb) {
    var startTime = Date.now();
    if (urls.length > 0) {
        var url = urls.pop();
        var fileName = url.split('stories/').pop().split('?')[0] + '.txt';
        var filePath = outputDir + fileName;
        scrape(url, filePath, function (err) {

            setTimeout(function () {
                console.log(Date.now() - startTime);
                scrapeUrl(urls, cb);
            }, err? 50000: 20000);

        });
    } else {
        cb();
    }
}

function scrape(link, filePath, cb) {
    console.log('scraping: ', link);
    console.log('filePath: ', filePath);

    if (!fs.existsSync(filePath)) {
        var oneTime = true;
        request(link, {timeout: 20000}, function (err, resp, html) {
            console.log('req recieve');
            if (!err) {
                $ = cheerio.load(html);

                $('.poemPageContentBody .pMC .w .c').filter(function () {
                    if (oneTime) {
                        var data = $(this);

                        // console.log(data.text());

                        fs.writeFile(filePath, data.text(), function (error) {
                            if (!error) {
                                console.log('done');
                            }
                            else {
                                console.log('error: ', error);
                            }
                            cb();
                        });
                    }

                })
            } else {
                console.log('err: ', err);
                cb(err);
            }
        });
    } else {
        console.log('already scraped: ', filePath);
        cb();
    }

}
