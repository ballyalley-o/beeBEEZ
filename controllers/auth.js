const Member = require('../models/Member');
const bcrypt = require('bcryptjs');
const SweetAlert = require('sweetalert2');
//import alert from 'sweetalert2';

const LOGIN = 'auth/login'
const SIGNUP = 'auth/signup'

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  // const isLoggedIn = req.get("Cookie").split("=")[1];
      res.render(LOGIN, {
        path: "/login",
        pageTitle: "Login",
        errorMessage: message
      });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
    Member.findOne({ email: email })
    .then(member => {
      if (!member) {
        req.flash('error', 'INVALID CREDENTIALS')
        console.log("INVALID CREDENTIALS".red.inverse)
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, member.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.member = member;
            console.log(" MEMBER LOGGED IN ".green.inverse);
            return req.session.save(err => {
              // console.log(err);
              res.redirect("/");
            })
          }
            req.flash("error", "INVALID CREDENTIALS");
            res.redirect("/login");
        })
        .catch(err => {
        console.log(err)
        res.redirect("/login");
      });
    })
    .catch(err => console.log(err));
}

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render(SIGNUP, {
     path: "/signup",
     pageTitle: "Signup",
    errorMessage: message
  })
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    Member
    .findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash("error", "EMAIL ALREADY EXISTS");
        console.log("EMAIL ALREADY EXISTS".red.inverse)
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const member = new Member({
            name: name,
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return member.save();
        })
        .then((result) => {
          req.flash("error", "EMAIL ALREADY EXISTS");
          console.log(" MEMBER SIGNED-UP ".blue.inverse);
          res.redirect("/login");
        });
    })
    .catch(err => {
      console.log(err)
    })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);

    console.log(" MEMBER LOGGED OUT ".red.inverse)
    res.redirect("/");
  });
};