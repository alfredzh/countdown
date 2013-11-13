
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/route')
  , orm = require('orm')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , partials = require('express-partials')
  , db_model = require('./models/config')
  , db_config = require('./config');

var app = express();

// all environments
app.set('port', process.env.PORT || 19901);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(partials());
app.use(express.session({
  secret:'123456'
}));
app.use(orm.express(db_config.orm_connect, {
	define:function(db,models){
		db.settings.set('instance.cache', false);

            models.user = db.define('user', db_model.user.field, db_model.user.method);
		models.topic = db.define('topic', db_model.topic.field, db_model.topic.method);
            models.discuss = db.define('discuss', db_model.discuss.field, db_model.discuss.method);
            models.join = db.define('user_join', db_model.user_join.field, db_model.user_join.method);
            models.blacklist = db.define('blacklist', db_model.blacklist.field, db_model.blacklist.method);
            models.admin = db.define('admin', db_model.admin.field, db_model.admin.method);
	}
}));
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.use(express.query());
routes.routes.forEach(function(route){
  app[route.type](route.path,route.method);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
