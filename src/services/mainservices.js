const { sequelize, model } = require("../configs/database");

module.exports = {
  register: async (data) => {
    // registering user to database
    try {
      const date = new Date();
      const resp = await model.Users.create({
        email: data.email,
        password: data.password,
        created_at: date.getTime(),
        updated_at: date.getTime(),
      });
      return resp;
    } catch (error) {
      console.log(error);
    }
  },
  findUser: async (email) => {
    // find user at database
    try {
      const resp = await model.Users.findAll({
        where: { email: email },
        attributes: ["id", "email", "password", "fail_attempt", "last_attempt"],
      });

      return resp;
    } catch (error) {
      console.log(error);
    }
  },
  updateUser: async (userId, failAttempt) => {
    // updating user
    const timestamp = new Date();
    try {
      const resp = await model.Users.update(
        {
          fail_attempt: failAttempt,
          last_attempt: Number(timestamp),
        },
        {
          where: { id: userId },
        }
      );
      return resp;
    } catch (error) {
      console.log(error);
    }
  },
};
