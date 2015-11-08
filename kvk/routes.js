Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.onBeforeAction(function(){
	if(!Session.get("kvkData")){
		this.render('login');
	}else{
		this.next();
	}
});

Router.route("/", function () {
  this.render('Home');
}, { name: "Home" });

Router.route("/login", function(){
	this.render('login');
}, { name: "login"});

Router.route("/initiative/:id", function () {
  this.render('Initiative', {
	data: function () {
	  return Initiatives.findOne({_id: this.params.id});
	}});
}, { name: "Initiative" });
