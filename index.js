'use strict';

const os = require('os')
	, fs = require('fs')
	, express = require('express')
  , app = express()
	, config = {}
  ;

var hostname, nics, ipAddress, port, is_secure;
hostname = os.hostname();
nics = os.networkInterfaces();
for (let i in nics) {
	if(!nics[i][0].internal && 'IPv4' == nics[i][0].family){
		ipAddress= nics[i][0].address;	
		break;
	}
}
config.unsecure_port = process.env.PORT_UNSECURE || 8000;
config.secure_port = process.env.PORT_SECURE || 0 
config.appName = process.env.APP_NAME || "My Generic App";
config.hostname = process.env.HOSTNAME || hostname;
config.ipAddress = process.env.IPADDRESS || ipAddress;
config.environment = process.env.ENV || 'development';
config.static_dir = process.env.STATIC_DIR || 'static';
config.public_dir = process.env.PUBLIC_DIR || 'public';


app.set('unsecure_port', config.unsecure_port);
app.set('secure_port', config.secure_port);
app.set('appName', config.appName);
app.set('hostname', config.hostname);
app.set('ipAddress', config.ipAddress);
app.set('environment', config.environment);
app.set('static_dir', config.static_dir);
app.set('public_dir', config.public_dir);

app.use(express.static(__dirname + "/" + app.get('static_dir')));
app.use(express.static(__dirname + "/" + app.get('public_dir')));

app.get('/', (req,res,next)=>{
	console.log(req.originalUrl);
	res.send("Hello world.");
});

// Make sure this stays below all other defined routes.
app.use((req,res,next)=>{
	console.error(`404 ${req.originalUrl}`);
	res.status(404).send("<h2>404</h2><h3>Page Not Found</h3>");
	next();
});


if(0 == app.get('secure_port')) {
	port = app.get('unsecure_port');
	is_secure = false;
} else {
	port = app.get('secure_port');
	is_secure = true
}
app.listen(port, (error)=>{
  if (error) {
    throw error;
  } else {
    console.info(`Starting up Express app: ${app.get('appName')}.`);
		console.info(`**********************************`);
		console.info(`*                                *`);
		console.info(`* %s HTTP SERVER!!         *`, ((is_secure)?"SECURE":"UNSECURE") );
		console.info(`*                                *`);
		console.info(`* PORT:      ${port}                *`);
		console.info(`* App ENV:	 ${app.get('environment').toUpperCase()}     *`);
		console.info(`* Hostname:  ${os.hostname()}              *`);
		console.info(`* Host type: ${os.platform()}, ${os.arch()}          *`);
		console.info(`* URL:       http://${app.get('ipAddress')}:${port}     *`);
		console.info(`*                                *`);
		console.info(`**********************************`);
		console.info("\n");
		//console.info(`Waiting for database connection to come up...`);
		console.info("\n");

  }
});
