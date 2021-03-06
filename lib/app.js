var express = require('express'),
    gzippo  = require('gzippo'),
    gzip    = require('connect-gzip'),
    assets  = require('./assets'),
    app     = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('public', __dirname.replace('lib', '') + '/public');
  app.use(express.favicon(app.set('public') + '/favicon.ico'));
  app.set('views', __dirname.replace('lib', '') + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(gzippo.staticGzip(app.set('public'), {
    contentTypeMatch: /text|javascript/
  }));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', gzip.gzip(), function(req, res) {
  res.render('index');
});

app.get('/intro', gzip.gzip(), function(req, res) {
  res.render('intro');
});

app.get('/frame_unfriendly_host', gzip.gzip(), function(req, res) {
  res.render('frame_unfriendly_host');
});

assets.setup(app);

if (!module.parent) {
  app.listen(8000);
  console.log("Express server listening on port %d", app.address().port);
}
else {
  module.exports = app;
}
