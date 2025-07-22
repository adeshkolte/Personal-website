const { exec } = require('child_process');

exec('uname -a', (err, stdout) => {
    console.log('OS Info:\n', stdout);
});