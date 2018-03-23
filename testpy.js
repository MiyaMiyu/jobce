var spawn = require('child_process').spawn,
    ls    = spawn('python',['testpy.py']);

ls.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
});

ls.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});