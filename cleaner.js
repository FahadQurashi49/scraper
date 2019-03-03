const glob = require('glob');
const fs = require('fs');
const path = require('path');

initClean();

function initClean() {
    const dir = './output/**/*.txt';
    glob(dir, function (err, files) {
        if(!err) {
            for (var i = 0; i < files.length; i++) {
                var cleanFilePath = files[i].replace('output', 'clean');
                var cleanDir = path.dirname(cleanFilePath);
                if (!fs.existsSync(cleanDir)) {
                    fs.mkdirSync(cleanDir)
                }
                console.log(cleanFilePath);
                data = fs.readFileSync(files[i], 'utf8');
                var text = cleanText(data);
                fs.writeFile(cleanFilePath, text, 'utf8', function(err) {
                    if (!err) {
                        console.log('done');
                    } else {
                        console.log(err);
                    }
                });
            }
        }
    });
}



function cleanText(text) {
    return text.replace(/[\‘\:\’\۔\؟\!\ٗ\،\.]/g, '');
}