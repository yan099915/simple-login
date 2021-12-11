module.exports = (sequelize, type) => {
  return sequelize.define(
    "users",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: type.STRING(255),
      },
      password: {
        type: type.STRING(255),
      },
      fail_attempt: {
        type: type.INTEGER,
      },
      last_attempt: {
        type: type.DATE,
      },
      created_at: type.DATE,
      updated_at: type.DATE,
    },
    {
      freezeTableName: true,
      underscored: true,
    }
  );
};
