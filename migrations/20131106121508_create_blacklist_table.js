var create_blacklist_table = new Migration({
	up: function() {
		this.create_table('blacklist', function(t) {
			t.integer('id', {auto_increment: true, not_null: true});
			t.primary_key('id');
			t.string('account', {not_null: true});
			t.string('state', {not_null: true});
			t.integer('times', {not_null: true});
			t.timestamp('created_at', {not_null: true});
			t.timestamp('updated_at', {not_null: true});
		});
	},
	down: function() {
		this.drop_table('blacklist');
	}
});