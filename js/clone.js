const Git = require('nodegit')

Git.Clone('https://github.com/karimsa/web-app-dev', process.argv[2])
            .then(repo => {
                console.log('done')
            })