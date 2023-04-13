const Member = require('../models/Member');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const SweetAlert = require('sweetalert2');
const nodemailer = require('nodemailer');
const mailtrap = require('mailtrap');
const { validationResult } = require('express-validator/check');
require('dotenv').config();

const LOGIN = 'auth/login'
const SIGNUP = 'auth/signup'
const RESET = 'auth/forgot-password'
const NEWPASSWORD = "auth/new-password";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PW,
  },
});

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
    errorMessage: message,
    currentState: { name: '', email: '' },
  });
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render(SIGNUP, {
        path: "/signup",
        pageTitle: "Signup",
        errorMessage: errors.array()[0].msg,
        currentState: { name: name, email: email }
      });
    }
    Member
    .findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash("error", "EMAIL ALREADY EXISTS");
        console.log("EMAIL ALREADY EXISTS".red.inverse)
        return res.redirect("/signup");
      }
      if (password !== confirmPassword) {
        req.flash("error", "PASSWORDS DO NOT MATCH");
        console.log("PASSWORDS DO NOT MATCH".red.inverse)
        //return with current state and just empty password field and confirm password field
        return res.render(SIGNUP, {
          path: "/signup",
          pageTitle: "Signup",
          errorMessage: "PASSWORDS DO NOT MATCH",
          currentState: { name: name, email: email }

        })
        }
          const member = new Member({
            name: name,
            email: email,
            password: password,
            cart: { items: [] },
          });
          return member.save()
        .then((result) => {
          res.redirect("/login");
          console.log(" MEMBER SIGNED-UP ".blue.inverse);
          return transporter
            .sendMail({
              to: email,
              from: "mailtrap@beebeez.com",
              subject: "Thanks for signing up!",
              message: `Welcome to beeBEEZ, ${name}!`,
              html: (
                `<link
                      rel="stylesheet"
                      href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css"
                      integrity="sha512-EZLkOqwILORob+p0BXZc+Vm3RgJBOe1Iq/0fiI7r/wJgzOFZMlsqTa29UEl6v6U6gsV4uIpsNZoV32YZqrCRCQ=="
                      crossorigin="anonymous" referrerpolicy="no-referrer"
                      />
                  <div class="container" style="padding-top: 20rem; font-family: sans-serif">
                    <div style="border: 1px solid black;border-radius: 3rem; text-align: center; padding: 5rem">
                      <h2 class="realm eight columns alpha" style="font-size: 3rem; font-weight: light">
                      WELCOME to
                      </h2>
                      <h1 class="" style="font-size: 10rem; font-weight: bold">
                      beeBEEZ
                      </h1>
                    <a href="http://localhost:3001/login" style="font-size: 3rem;">SHOP HERE</a>
                  </div>
                </div>
                `),
            })
            .then((result) => {
              console.log("EMAIL SENT".green.inverse);
            })
            .catch((err) => console.log(err));
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

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0 ) {
    message = message[0];
  } else {
    message = null;
  }
  res.render(RESET, {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    } else {
      const token = buffer.toString("hex");
      Member.findOne({ email: req.body.email })
        .then((member) => {
          if (!member) {
            req.flash("error", "NO SUCH ACCOUNT EXISTS");
            return res.redirect("/reset");
          }
          member.resetToken = token;
          member.resetTokenExpiration = Date.now() + 3600000;
          return member.save();
        })
        .then((result) => {
          req.flash("error", "CHECK YOUR EMAIL");
          res.redirect("/");
          transporter.sendMail({
            to: req.body.email,
            from: "mailtrap@beebeez.com",
            subject: "Password Reset Request",
            html: `<link
                      rel="stylesheet"
                      href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css"
                      integrity="sha512-EZLkOqwILORob+p0BXZc+Vm3RgJBOe1Iq/0fiI7r/wJgzOFZMlsqTa29UEl6v6U6gsV4uIpsNZoV32YZqrCRCQ=="
                      crossorigin="anonymous" referrerpolicy="no-referrer"
                      />
                  <div class="container" style="padding-top: 20rem; font-family: sans-serif">
                    <div style="border: 1px solid black;border-radius: 3rem; text-align: center; padding: 5rem">
                      <h4 class="realm eight columns alpha" style="font-size: 3rem; font-weight: light">
                      Password Reset Request
                      </h4>
                    <a href="http://localhost:3001/reset/${token}" style="font-size: 3rem;">Click here to reset</a>
                  </div>
                </div>
                `,
          });
        })
        .then((result) => {
          console.log("EMAIL SENT".green.inverse);
        })
        .catch((err) => {
          console.log(err);
        });
      }
    })
}

exports.getNewPassword =(req, res, next) => {
  const token = req.params.token;
  Member
    .findOne({
              resetToken: token,
              resetTokenExpiration: {$gt: Date.now()}
            })
    .then(member => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render(NEWPASSWORD, {
        path: "/new-password",
        pageTitle: "Update Password",
        errorMessage: message,
        memberId: member._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err)
    })

}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const memberId = req.body.memberId;
  const passwordToken = req.body.passwordToken;
  let resetMember;

  Member
    .findOne({
              resetToken: passwordToken,
              resetTokenExpiration: {$gt: Date.now()},
              _id: memberId
            })
    .then(member => {
      resetMember = member;
      return bcrypt.hash(newPassword, 12)
    })
    .then(hashedPassword => {
      resetMember.password = hashedPassword;
      resetMember.resetToken = undefined;
      resetMember.resetTokenExpiration = undefined;
      return resetMember.save();
    })
    .then(result => {
      res.redirect("/login");
    })
    .catch(err => {
              console.log(err)
            })

}