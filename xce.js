const mysql = require('mysql');
const con = mysql.createConnection({
    host     : '192.168.1.4',
    port       : '3306',
    user     : 'user',
    password : 'password',
    database : 'xce'
  });

module.exports = { 
    connect:function(role,queryString,callback){ 
        con.connect((err) => { 
            if (err) {
                console.error('unable to connect to mysql database\n');
                callback(err.stack);
                process.exit(1); //exit if error
            }
            else {
                console.log('connected mysql database')
                if(role === 'student'){
			        console.log('Student');
                    con.query(queryString, function (err, result, fields) {
                        if (err) {
                            console.log('unable to query xce database',err.stack)
			                callback(err.stack); 
                        }
                        else {
                            if(result !== undefined){
                                console.log('query xce dtatbase');
				                callback(null,result[0]);
                            }
                            else {
					            console.log('no student id');
					            callback(null,null);
				            }
                       }
                    });
                }
                else {
                    console.log('Not Student');
                    callback(null,null);
                }
            con.end();
            }
        })
    }
}
