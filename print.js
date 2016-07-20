const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const Nightmare = require('nightmare');

console.log('* Starting server ...');
const child = exec(`node serve`, {
    cwd: __dirname
}, function (err) {
    if (err && !err.killed) console.log(err.stack || err);
});

child.stdout.on('data', chunk => {
    chunk = chunk.toString('utf8')
    if ( chunk.indexOf('LISTEN') !== -1 ) {
        const todo = [];

        fs.readdirSync(path.resolve(__dirname, 'classes')).forEach(file => {
            if ( file.substr(-3) === '.md' ) {
                file = file.substr(0, file.length - 3);
                console.log(`* Printing page to ${path.resolve(__dirname, 'classes', 'pdfs', file + '.pdf')} ...`);
                todo.push(
                    Nightmare()
                        .goto(`http://localhost:8080/${file}.md?print-pdf`)
                        .pdf(path.resolve(__dirname, 'classes', 'pdfs', file + '.pdf'))
                        .end()
                );
            }
        });

        Promise.all(todo).then(() => child.kill());
    } else console.log(chunk)
});
