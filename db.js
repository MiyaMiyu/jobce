//require postgresql
const pg = require('pg');

//const conString = "postgres://YourUserName:YourPassword@localhost:5432/YourDatabase";
const conString = "postgres://postgres:57010014@localhost:5432/postgres";

const client = new pg.Client(conString);

//query object insert pg to database 
const insert = {
    //text: 'INSERT INTO public."number"(num,name) VALUES($1, $2) RETURNING *',
    //values: ['26','2']
    text: 'INSERT INTO public."login"(no, pass) VALUES($1,$2) RETURNING *',
    values: ['12345','password'],
  }

const select = {
     text: 'SELECT * FROM public.user'
}

const update = {
    text: 'UPDATE public.login SET pass = 6789 RETURNING *'

}

const del = {
    text: 'DELETE FROM public.login WHERE no = "12345" '
}


module.exports =  {
    client : client.connect((err,result) => {  //export client
        if (err) {
            console.error('unable to connect to postgres database\n', err.stack)
            process.exit(1); //exit if error
        } 
        else {
            console.log("connect database")
        }
    }),

    select : client.query(select, (err, result) => {
        //let {username}
        if (err) {
          console.log('unable to query postgres database\n',err.stack)
        } 
        else {
            let data = result.rows[0];
          console.log('query postgres database\n',JSON.stringify(data))
          client.end();
        }
    })
}


//exports.client = client