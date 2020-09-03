module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.user) {
      return next();
    }
    req.flash("error", "Please Log In");
    res.redirect("/users/login");
  },
};
