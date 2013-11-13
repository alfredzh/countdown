var crypto = require('crypto');

exports.reg = function(req, res){
	res.render('reg',{login_user:req.session.user});
};

exports.doReg = function(req ,res){
	var account = req.query.account ;
	var password = req.query.password ; 
	var email = req.query.email ;
	if(!account || !password || !email || !/^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){4,19}$/.exec(account) || !/^(\w){6,20}$/.exec(password) || !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(email)){
		res.json('注册失败！');
	}else{
		req.models.user.find({'account':account},function(err,data){
			if(err) throw err;
			if(data.length != 0){
				res.json('error');
			}else{
				var md5 = crypto.createHash('md5');
				password = md5.update(password).digest('base64');
				req.models.user.create([{
					'account': account,
					'password': password,
					'point': 0,
					'level': 'membership',
					'email': email,
					'created_at': new Date(),
					'updated_at': new Date()
				}],function(e,user){
					if(e) throw e;
					if(user.length!=0){
						req.session.user = user[0] ;
						res.json('success');
					}else{
						res.json('注册失败！');
					}
				});
			}
		});
	}
};

exports.logout = function(req, res){
	req.session.user = null ;
	res.redirect('/yiqidaojishi');
};

exports.login = function(req, res){
	res.render('login',{login_user:req.session.user});
};

exports.doLogin = function(req, res){
	var account = req.query.account ; 
	var password = req.query.password ;

	req.models.user.find({'account': account},function(err,data){
		if(err) throw err;
		if(data.length!=0){
			var md5 = crypto.createHash('md5');
			password = md5.update(password).digest('base64');
			if(password == data[0].password){
				req.session.user = data[0] ;
				res.json('success');
			}else{
				res.json('error_password');
			}
		}else{
			res.json('error_account');
		}
	});
};

exports.myspace = function(req,res){
	function change_time(time){
		if(time*1<10){
			time = '0' + time ;
		}
		return time;
	}
	function time_format(data){
		var date = new Date(data.created_at) ;
		var month = change_time(date.getMonth()+1);
		var day = change_time(date.getDate());
		var hour = change_time(date.getHours());
		var minute = change_time(date.getMinutes());
		data.time = month + '-' + day + ' ' + hour + ':' + minute ;
		return data;
	}
	function join_time_format(data){
		var date = new Date(data.topic_created_time) ;
		var month = change_time(date.getMonth()+1);
		var day = change_time(date.getDate());
		var hour = change_time(date.getHours());
		var minute = change_time(date.getMinutes());
		data.time = month + '-' + day + ' ' + hour + ':' + minute ;
		return data;
	}
	function user_join_time(time){
		var date = new Date(time) ;
		var year = date.getFullYear();
		var month = change_time(date.getMonth()+1);
		var day = change_time(date.getDate());
		var time_str = year + '-' + month + '-' + day ;
		return time_str;
	}
	var user = req.session.user ;
	if(!user){
		res.json('please login first');
	}else{
		var account = req.session.user.account ;
		if(user.level == 'membership'){
			user.identity = '会员' ; 
		}else if(user.level == 'admin'){
			user.identity = '管理员' ;
		}
		user.join_at = user_join_time(user.created_at);
		req.models.user.find({'account':account},function(error,item){	
			if(error) throw error;
			if(item.length!=0){
				user.point = item[0].point ;
				req.models.topic.find({'account':account},['created_at','Z'],function(err,data){
					if(err) throw err;
					if(data.length!=0){
						for(var i=0;i<data.length;i++){
							data[i] = time_format(data[i]);
						}
						req.models.join.find({'account':account},['created_at','Z'],function(e,list){
							if(e) throw e;
							if(list.length!=0){
								for(var j=0;j<list.length;j++){
									list[j] = join_time_format(list[j]);
								}
								res.render('myspace',{login_user:req.session.user,user_topic:data,user_join:list});
							}else{
								res.render('myspace',{login_user:req.session.user,user_topic:data,user_join:[]});
							}
						});
					}else{
						req.models.join.find({'account':account},['created_at','Z'],function(e,list){
							if(e) throw e;
							if(list.length!=0){
								res.render('myspace',{login_user:req.session.user,user_topic:[],user_join:list});
							}else{
								res.render('myspace',{login_user:req.session.user,user_topic:[],user_join:[]});
							}
						});
					}
				});
			}else{
				res.json('error');
			}
		});
	}
};