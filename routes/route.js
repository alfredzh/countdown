var index = require('./index')
   ,  user   = require('./user')
   ,  topic  = require('./topic')
   ,  admin = require('./admin');
exports.routes = [
	{
		path:'/yiqidaojishi',
		type:'get',
		method:index.index
	},{
		path:'/reg',
		type:'get',
		method:user.reg
	},{
		path:'/doReg',
		type:'get',
		method:user.doReg
	},{
		path:'/logout',
		type:'get',
		method:user.logout
	},{
		path:'/login',
		type:'get',
		method:user.login
	},{
		path:'/doLogin',
		type:'get',
		method:user.doLogin
	},{
		path:'/myspace',
		type:'get',
		method:user.myspace
	},{
		path:'/create_topic',
		type:'get',
		method:topic.create_topic
	},{
		path:'/doCreate_topic',
		type:'get',
		method:topic.doCreate_topic
	},{
		path:'/topic_info',
		type:'get',
		method:topic.topic_info
	},{
		path:'/reply',
		type:'get',
		method:topic.reply
	},{
		path:'/admin',
		type:'get',
		method:admin.admin
	}
];