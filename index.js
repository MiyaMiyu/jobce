const express = require('express');
let Services = require('./services');
let BodyParser = require('body-parser');

var app = express();
// var hbs = exphbs.create({
//   defaultLayout: 'main.hbs',
//   extname: '.hbs',
// 	partialsDir: [
//         // 'shared/templates/',
//         'views/partials/'
//     ]
// });

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended:true}));


app.post('/api/:version/:service',(req,res)=>{
	let {version,service} = req.params;
	switch(version){
		case 'v1':
			if(Services[service]) {
			   Services[service](req,res);     
            }
			else res.status(503).send('service '+ service+' in version '+ version +' is invalid.');
			break;
		default:
			res.status(503).send('version ' +version +' is invalid.');
	}
});





app.listen(3000);




