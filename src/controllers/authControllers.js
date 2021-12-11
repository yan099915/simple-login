const application = require("../services/mainservices");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  register: async (req, res) => {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const checkUsernameExist = await application.findUser(email);

    if (checkUsernameExist.length === 0) {
      const data = {
        email: email,
        password: hashedPassword,
      };
      // register
      try {
        const resp = await application.register(data);
        const userData = resp.dataValues;
        const token = jwt.sign(userData, process.env.SECRETKEY);
        res.status(201).json({
          message: "Register Success",
          accessToken: token,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      res.status(500).json({
        message: "Email Has Already Registered",
        data: email,
      });
    }
  },
  login: async (req, res) => {
    //   login
    const { email, password } = req.headers;
    const resp = await application.findUser(email);
    if (resp.length === 0) {
      // if user was not  exist
      res.status(404).json({
        message: "User not exist",
        data: email,
      });
    } else {
      const hashedPassword = resp[0].dataValues.password;
      const compare = await bcrypt.compare(password, hashedPassword);
      const userData = resp[0].dataValues;
      const userId = resp[0].dataValues.id;
      const lastAttempt = new Date(resp[0].dataValues.last_attempt);
      const dateNow = new Date();
      let failAttempt = resp[0].dataValues.fail_attempt;
      let timeLeft = lastAttempt.getMinutes() + 5 - dateNow.getMinutes();

      if (
        dateNow.getDate() === lastAttempt.getDate() &&
        lastAttempt.getHours() === dateNow.getHours()
      ) {
        if (dateNow.getMinutes() > lastAttempt.getMinutes() + 5) {
          await application.updateUser(userId, 0);
          failAttempt = 0;
        }
      } else {
        await application.updateUser(userId, 0);
      }

      if (failAttempt > 2) {
        // user already entered wrong password more than 2 times
        res.status(403).json({
          message: `Account has locked please wait ${timeLeft} minute before you try again`,
          data: email,
        });
      } else {
        if (compare === true) {
          //  if password was correct
          await application.updateUser(userId, 0);
          const token = jwt.sign(userData, process.env.SECRETKEY);
          res.status(200).json({
            message: "Login Success",
            accessToken: token,
          });
        } else {
          // if password was wrong
          failAttempt += 1;
          await application.updateUser(userId, failAttempt);
          res.status(403).json({
            message: `You Enter Wrong Password ${failAttempt} Times`,
            data: email,
          });
        }
      }
    }
  },
  home: async (req, res) => {
    // home page
    res.send({
      message: "home page",
    });
  },
};
