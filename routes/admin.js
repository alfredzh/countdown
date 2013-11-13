exports.admin = function(req, res){
	var account = req.query.account ;
	if(!account){
		res.json('用户名为空！');
	}else{
		req.models.user.find({'account':account},function(err,data){
			if(err) throw err;
			if(data.length!=0){
				data[0].created_at = new Date(data[0].created_at) ;
				data[0].updated_at = new Date();
				data[0].level = 'admin' ;
				data[0].save(function(err,list){
					res.json('成功将用户'+account+'提升为管理员！');
				});
			}else{
				res.json('不存在该用户！');
			}
		});
	}
};