const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const glob = require('glob');

// const links = require('./urls/manto.json');

var link;

/* if (links) {
    console.log('link: ', links[0]);
    link = links[0];
    scrape(link);
} else {
    console.log('could not read file');
} */
jsonFileList();

function jsonFileList() {
    const dir = './urls/*.json';
    var outputDir = 'output/';
    glob(dir, function (err, files) {
        if(!err) {
            for(var i = 0; i < files.length; i++) {
                urls = require(files[i]);
                console.log('urls', urls);
                console.log();
            }
        }
    });
}

function scrape(link) {
    request(link, function(err, resp, html) {
        console.log('req recieve');
        if (!err) {
            $ = cheerio.load(html);

            $('.poemPageContentBody .pMC .w .c').filter(function () {
                var data = $(this);
                
                // console.log(data.text());

                fs.writeFile('output/manto.txt', data.text(), function(error) {
                    if(!error) 
                        console.log('done');
                    else
                    console.log(error);
                });
            })
        } else {
            console.log('err', err);
        }
    });
}
