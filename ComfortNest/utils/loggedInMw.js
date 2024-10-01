module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash("error", "You must be Logged! ");
		return res.redirect("/login");
	}
	next();
};