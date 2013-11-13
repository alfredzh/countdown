//计算每个话题的剩余时间
function left_time(data){
	for(var i=0;i<data.length;i++){
		var time_str = '';
		var left = Date.parse(data[i].ended_at)-Date.parse(new Date());
		if(left>=0){
			var day = parseInt(left/(24*60*60*1000));
			var hour = parseInt(left/(60*60*1000)-day*24);
			var minute = parseInt(left/(60*1000)-hour*60-day*24*60);
			var second = parseInt(left/(1000)-minute*60-hour*60*60-day*24*60*60);
			if(day!=0){
				time_str+=day + '天' ;
			}
			if(hour!=0){
				time_str+=hour + '时' ;
			}
			if(minute!=0){
				time_str+=minute + '分' ;
			}
			if(second!=0){
				time_str+=second+ '秒' ;
			}
		}else{
			time_str = '已结束' ;
		}

		data[i].left = time_str ;
	}
	return data;
}
exports.index = function(req, res){
	var page = req.query.current_page*1 ;
	var des = req.query.des ;
	var jump = req.query.jump*1 ;
	//进入首页
	if(!page && !jump){
		req.models.topic.find(40,['ended_at','Z'],function(err,data){
			if(err) throw err;
			if(data.length!=0){
				req.models.topic.count(function(e,count){
					var page_count = parseInt(count/40) +1;
					data = left_time(data);
					res.render('index',{login_user:req.session.user,data:data,current_page:1,page_count:page_count});
				});
			}else{
				res.render('index',{login_user:req.session.user,data:[],current_page:1,page_count:1});
			}
		});
	//跳转至相应界面
	}else if(!page && jump){
		//验证jump是否为正整数
		if(/^[0-9]*[1-9][0-9]*$/.test(jump)){
			req.models.topic.count(function(err,count){
				var page_count = parseInt(count/40) +1;
				//jump在1与最大页数之间
				if(jump>=1 && jump<=page_count){
					req.models.topic.find({},{offset : (jump-1)*40},40,['ended_at','Z'],function(e,data){
						if(e) throw e;
						if(data.length!=0){
							data = left_time(data);
							res.render('index',{login_user:req.session.user,data:data,current_page:jump,page_count:page_count});
						}else{
							res.json('jump_error');
						}
					}); 
				//jump超出范围
				}else{
					res.json('jump_error');
				}
			});
		}else{
			res.json('jump_error');
		}
	//上一页或下一页
	}else{
		//验证page是否为正整数
		if(/^[0-9]*[1-9][0-9]*$/.test(page)){
			//上一页
			if(des == 'pre'){
				req.models.topic.count(function(e,count){
					var page_count = parseInt(count/40) +1;
					//page合法,且当前页不为首页
					if(page>1 && page<=page_count){
						req.models.topic.find({},{ offset: (page-2)*40 },40,['ended_at','Z'],function(err,data){
							if(err) throw err;
							if(data.length!=0){
								data = left_time(data);
								res.render('index',{login_user:req.session.user,data:data,current_page:page-1,page_count:page_count});
							}else{
								res.json('error');
							}
						});
					//当前页为首页
					}else{
						res.json('error');
					}
				});
			//下一页
			}else if(des == 'next'){
				req.models.topic.count(function(err,count){
					var page_count = parseInt(count/40) +1;
					//page合法，且当前页不为最后一页
					if(page>=1 && page<=page_count-1){
						req.models.topic.find({},{ offset: page*40 },40,['ended_at','Z'],function(err,data){
							if(err) throw err;
							if(data.length!=0){
								data = left_time(data);
								res.render('index',{login_user:req.session.user,data:data,current_page:page+1,page_count:page_count});
							}else{
								res.json('error');
							}
						});
					}else{
						res.json('error');
					}
				});
			//防止手动调接口错误
			}else{
				res.json('error');
			}
		//page不为正整数
		}else{
			res.json('error');
		}
	}
};