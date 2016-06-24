const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const Nightmare = require('nightmare');

console.log('* Starting server ...');
const child = exec(`npm start intro`, {
    cwd: __dirname
}, function (err) {
    if (err) console.log(err.stack || err);
}).stdout.on('data', chunk => {
    if ( chunk.indexOf('LISTEN') !== -1 ) {
        const todo = [];

        fs.readdirSync(path.resolve(__dirname, 'classes')).forEach(file => {
            if ( file.substr(-3) === '.md' ) {
                file = file.substr(0, file.length - 3);
                todo.push(new Promise(resolve => {
                    console.log(`* Printing page to ${path.resolve(__dirname, 'classes', 'pdfs', file + '.pdf')} ...`);
                    Nightmare()
                        .goto(`http://localhost:8080/${file}.md?print-pdf`)
                        .pdf(path.resolve(__dirname, 'classes', 'pdfs', file + '.pdf'))
                        .end()
                        .then(resolve)
                        .catch((err) => {
                            console.log(`Error while printing ${file}: ${err}`)

                            // to avoid stopping
                            resolve();
                        });
                }));
            }
        });

        Promise.all(todo).then(() => child.kill());
    } else console.log(chunk)
});