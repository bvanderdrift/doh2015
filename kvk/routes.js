Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route("/", function () {
  this.render('Home');
});

Router.route("/initiative/:id", function () {
  this.render('Initiative', {
	data: function () {
	  return Initiatives.findOne({_id: this.params.id});
	}});
});
