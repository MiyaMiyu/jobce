const pg = require('pg');

module.exports =  {
    connect : function(conString){
        const client = new pg.Client(conString);
        client.connect((err) => {
            if (err) {
                console.error('unable to connect to postgres database', err.stack)
                process.exit(1); //exit if error
            } 
            else {
                console.log("connect database")
            }
        });
        return client;
    },
    select : function(client,queryString,values, callback){
        let select = {
            text:queryString,
            values:values
        };
        let data;

        client.query(select, (err, result) => {
            if (err) {
              console.log('unable to query postgres database',err.stack)
              callback(err.stack);
            } 
            else {
                if(result.rows[0] !== undefined){
                data = result.rows[0];
                console.log('query postgres database');
                callback(null,data);
                }
                else {
                    callback(null,null);
                }
            }
        });
    },
    insert : function(client,queryString,values, callback){
        let select = {
            text:queryString,
            values:values
        };
        let data;

        client.query(select, (err, result) => {
            // console.log(select)
            if (err) {
              console.log('unable to query postgres database',err.stack)
              callback(err.stack);
            } 
            else {
                if(result.rows[0] !== undefined){
                data = result.rows[0];
                console.log('query postgres database');
                callback(null,data);
                }
                else {
                    callback(null,null);
                }
            }
        });
    },
    multiSel : function(client,queryString,values, callback){
        let select = {
            text:queryString,
            values:values
        };
        let data;

        client.query(select, (err, result) => {
            if (err) {
              console.log('unable to query postgres database',err.stack)
              callback(err.stack);
            } 
            else {
                if(result.rows !== undefined){
                data = result.rows;
                console.log('query postgres database');
                callback(null,data);
                }
                else {
                    callback(null,null);
                }
            }
        });
    },
    del:function(client,queryString, callback){
        let select = {
            text:queryString,
        };
        let data;

        client.query(select, (err, result) => {
            if (err) {
              console.log('unable to query postgres database',err.stack)
              callback(err.stack);
            } 
            else {
                if(result.rows !== undefined){
                data = result.rows;
                console.log('query postgres database');
                callback(null,data);
                }
                else {
                    callback(null,null);
                }
            }
        });
    }
};