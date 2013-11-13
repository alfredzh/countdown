var create_user_table = new Migration({
	up: function() {
		this.create_table('user', function(t) {
			t.integer('id', {auto_increment: true, not_null: true});
			t.primary_key('id');
			t.string('account', {not_null: true});
			t.string('password', {not_null: true});
			t.integer('point');
			t.string('level' ,{not_null: true});
			t.text('email' ,{not_null: true});
			t.timestamp('created_at', {not_null: true});
			t.timestamp('updated_at', {not_null: true});
		});
	},
	down: function() {
		this.drop_table('user');
	}
});