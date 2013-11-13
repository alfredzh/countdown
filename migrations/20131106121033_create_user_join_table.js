var create_user_join_table = new Migration({
	up: function() {
		this.create_table('user_join', function(t) {
			t.integer('id', {auto_increment: true, not_null: true});
			t.primary_key('id');
			t.string('account', {not_null: true});
			t.text('topic',  {not_null: true});
			t.text('topic_id', {not_null: true});
			t.string('create_user',  {not_null: true});
			t.timestamp('topic_created_time', {not_null: true});
			t.timestamp('created_at', {not_null: true});
		});
	},
	down: function() {
		this.drop_table('user_join');
	}
});