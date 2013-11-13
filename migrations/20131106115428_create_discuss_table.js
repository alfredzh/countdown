var create_discuss_table = new Migration({
	up: function() {
		this.create_table('discuss', function(t) {
			t.integer('id', {auto_increment: true, not_null: true});
			t.primary_key('id');
			t.string('account', {not_null: true});
			t.text('content');
			t.text('content_id', {not_null: true});
			t.text('topic_id', {not_null: true});
			t.timestamp('created_at', {not_null: true});
			t.timestamp('updated_at', {not_null: true});
		});
	},
	down: function() {
		this.drop_table('discuss');
	}
});