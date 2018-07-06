
process.env.NODE_ENV = 'development';
global.__base = __dirname + '/';

let express = require('express'),
    bodyParser = require('body-parser')
    cors = require('cors'),
    cookieParser = require('cookie-parser'),
    app = express(),
    http = require('http'),
    mongoServer = require('./db/dbServer.js'),
    config = require('./config.json'),
    routes = require('./routes');
    normalizePort = val => {
    let port = parseInt(val, 10);
    if(isNaN(port)) return val;
    if(port >= 0) return port;
    return false;
},
onError = error => {
    if(error.syscall !== 'listen') throw error;
    let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
    }
},
onListening = () => {
    let addr = server.address();
    console.log('Express server listening on host %s and port %d, in dev mode', addr.address, addr.port);
    mongoServer.connectMongo( err => {
        err && console.log(err);
    });
};
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

let port = normalizePort(config.nodeServer.port);
app.set('port', port);
app.set('host', config.nodeServer.host);
app.use('/api', routes);

let server = http.createServer(app);
server.listen(port, config.nodeServer.host);
server.on('error', onError);
server.on('listening', onListening);

