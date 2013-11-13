var create_topic_table = new Migration({
	up: function() {
		this.create_table('topic', function(t) {
			t.integer('id', {auto_increment: true, not_null: true});
			t.primary_key('id');
			t.text('topic', {not_null: true});
			t.text('description', {not_null: true});
			t.string('account', {not_null: true});
			t.text('topic_id', {not_null: true});
			t.timestamp('created_at', {not_null: true});
			t.timestamp('updated_at', {not_null: true});
		      t.timestamp('ended_at', {not_null: true});
		});
	},
	down: function() {
		this.drop_table('topic');
	}
});