exports.create_topic = function(req, res){
	if(!req.session.user){
		res.json('please login first');
	}else{
		res.render('create_topic',{login_user:req.session.user});
	}
};

exports.doCreate_topic = function(req, res){
	var topic = req.query.topic;
	var description = req.query.description;
	var account = req.query.account;
	if(!req.query.date || !topic || !description || !account){
		res.json('error');
	}else if(Date.parse(new Date())-Date.parse(req.query.date)>0){
		res.json('error');
	}else{
		req.models.user.find({'account':account},function(error,list){
			if(error) throw error;
			if(list.length!=0){
				var date = new Date(req.query.date);
				date.setHours(date.getHours()-8);
				req.models.topic.find(['id','Z'],function(e,data){
					if(e) throw e;
					var id = 1 ;
					if(data.length!=0){
						id = data[0].id*1+1;
					}
					var topic_id = 'topic' + id ;
					req.models.topic.create([{
						'topic':topic,
						'description':description,
						'account':account,
						'topic_id':topic_id,
						'created_at':new Date(),
						'updated_at':new Date(),
						'ended_at':date
					}],function(err,item){
						if(err) throw err;
						if(item.length!=0){
							list[0].created_at = new Date(list[0].created_at);
							list[0].point += 3 ;
							list[0].save(function(){
								res.json('success');
							});
						}else{
							res.json('error');
						}
					});
				});
			}else{
				res.json('error');
			}
		});
	}
};

exports.topic_info = function(req, res){
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
	var topic_id = req.query.topic_id ;
	req.models.topic.find({'topic_id':topic_id},function(err,data){
		if(err) throw err;
		if(data.length!=0){
			data[0] = time_format(data[0]);
			req.models.discuss.find({'topic_id':topic_id},['created_at','Z'],function(e,list){
				if(e) throw e;
				if(list.length!=0){
					for(var i=0;i<list.length;i++){
						list[i] = time_format(list[i]);
					}
					if(!req.session.user){
						res.render('topic_info',{login_user:req.session.user,data:data[0],account:'',list:list});
					}else{
						res.render('topic_info',{login_user:req.session.user,data:data[0],account:req.session.user.account,list:list});
					}
				}else{
					if(!req.session.user){
						res.render('topic_info',{login_user:req.session.user,data:data[0],account:'',list:[]});
					}else{
						res.render('topic_info',{login_user:req.session.user,data:data[0],account:req.session.user.account,list:[]});
					}	
				}
			});	
		}else{
			res.json('error');
		}
	});
};

exports.reply = function(req, res){
	var topic_id = req.query.topic_id ;
	var account = req.query.account ;
	var content = req.query.content ;
	if(!topic_id || !account || !content){
		res.json('error');
	}else{
		//判断是否存在对应话题
		req.models.topic.find({'topic_id':topic_id},function(err,data){
			if(err) throw err;
			if(data.length!=0){
				//判断是否存在对应用户
				req.models.user.find({'account':account},function(e,list){
					if(e) throw e;
					if(list.length!=0){
						req.models.discuss.find(['created_at','Z'],function(error,item){
							if(error) throw error;
							var id = 1;
							if(item.length!=0){
								id = item[0].id+1;
							}
							req.models.discuss.create([{
								'account':account,
								'content':content,
								'content_id':'content'+id,
								'topic_id':topic_id,
								'created_at':new Date(),
								'updated_at':new Date()
							}],function(error_code,discuss){
								if(error_code) throw error_code;
								if(discuss.length!=0){
									list[0].created_at = new Date(list[0].created_at);
									list[0].point += 1 ;
									list[0].save(function(){
										req.models.join.find({'account':account,'topic_id':topic_id},function(err_code,join){
											if(err_code) throw err_code;
											if(join.length == 0){
												req.models.join.create([{
													'account':account,
													'topic':data[0].topic,
													'topic_id':topic_id,
													'create_user':data[0].account,
													'topic_created_time':new Date(data[0].created_at),
													'created_at':new Date()
												}],function(e_code,joins){
													if(e_code) throw e_code;
													if(joins.length!=0){
														res.json('success');
													}else{
														res.json('error');
													}
												});
											}else{
												res.json('success');
											}
										});
									});
								}else{
									res.json('error');
								}
							});
						});
					}else{
						res.json('error');
					}
				});
			}else{
				res.json('error');
			}
		});
	}
};