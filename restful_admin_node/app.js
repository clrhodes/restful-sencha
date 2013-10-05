
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , user = require('./routes/users');

var app = express();



// CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    console.log('CORS Headers Sent');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function(){

  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compress()); // Gzip;deflate
  app.use(allowCrossDomain); // Enable CORS
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/users', user.findAll);
// app.get('/users', function(req, res) {
//   res.send({success: true, data: [{id: 1, index: 0, text: 'Sencha Touch 2 + Advanced Architect', leaf: false, expanded: true},{id: 2, index: 1, text: 'Parent', leaf: false, expanded: true}]});
// });
app.get('/users/:id', user.findUserById);
// app.get('/users/:id', function(req, res) {
//   if (req.params.id == 1) {
//     console.log(req.params.id);
//     res.send({success: true, data: [{id: 3, index: 2, text: 'Sub-topic 1', leaf: true}, {id: 4, index: 1, text: 'Sub-topic 2', leaf: true}]});
//   }
//   else {
//     res.send({success: true, data: [{id: 5, index: 1, text: 'Sub-topic 3', leaf: true}, {id: 6, index: 2, text: 'Sub-topic 4', leaf: true}]});
//   }
// });
app.delete('/users/:id', user.deleteUser);
// app.delete('/users/:id', function(req, res) {
//   res.send({success: true});
// });
app.put('/users/:id', user.updateUser);
// app.put('/users/:id', function(req, res) {
//   res.send({success: true});
// });
app.post('/users', user.createUser);
// app.post('/users/0', function(req, res) {
//   res.send({success: true});
// });

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
