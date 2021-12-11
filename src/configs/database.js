const { Sequelize } = require("sequelize");
require("dotenv").config();
const UserModel = require("../models/users");
const model = {};

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  useUTC: false,
  timezone: "+07:00",
});

// test connection
sequelize
  .authenticate()
  .then((res) => {
    console.log("CONNECTION_SUCCESS");
  })
  .catch((err) => console.log("FAILED_TO_CONNECT ", err));

model.Users = UserModel(sequelize, Sequelize);

module.exports = {
  sequelize,
  model,
};
