//require postgresql
const pg = require('pg')

//const conString = "postgres://YourUserName:YourPassword@localhost:5432/YourDatabase";
const conString = "postgres://postgres:57010014@localhost:5432/postgres";

const client = new pg.Client(conString);

//require child_process
const spawn = require('child_process').spawn  //Another Way--> { spawn } = require('child_process');

//import python file name 'test.py'
const ls    = spawn('python',['test.py'])

//declare query command
const select = {
    text: 'SELECT * FROM public.user'
}

//init datastring
var dataString = '';

//start function
module.exports =  {
    client : client.connect((err) => {  //export client
        if (err) {
            console.error('unable to connect to postgres database\n', err.stack)
            process.exit(1); //exit if error
        } 
        else {
            console.log('connected postgres database')
        }
    }),

    select : client.query(select, (err, result) => {
        //let {username}
        if (err) {
          console.log('unable to query postgres database\n',err.stack)
        } 
        else {
            let data = result.rows[0];
            //var data = result.rows[0];
            console.log('query postgres database\n',data)

             ls.stdout.on('data', function (data) {
                 dataString += data.toString();
                 //console.log('datastring is \n',dataString)
             });
            ls.stdout.on('end', function(){
                console.log('receive data is -> ',dataString);
              });
              ls.stdin.write(JSON.stringify(data));
              ls.stdin.end();
          //console.log('query postgres database\n',data)
        }
    })
}


// ls.stdout.on('data', function (data) {
//     console.log('stdout: ' + data);
// });

// ls.stderr.on('data', function (data) {
//     console.log('stderr: ' + data);
// });