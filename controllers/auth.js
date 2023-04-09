const Member = require('../models/Member');

const LOGIN = 'auth/login'

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split("=")[1];
      res.render(LOGIN, {
        path: "/login",
        pageTitle: "Login",
        isAuthenticated: req.session.isLoggedIn
      });
};

exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn = true;
    Member.findById("643227a193e6d7e18ded12a9")
    .then(member => {
      req.session.isLoggedIn = true;
      req.session.member = member;
      console.log(" MEMBER LOGGED IN ".green.inverse);
      req.session.save(err => {
        console.log(err);
        res.redirect("/");
      })
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);

    console.log(" MEMBER LOGGED OUT ".red.inverse)
    res.redirect("/");
  });
};