const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
  `${process.env.DBName}`,
  `${process.env.user}`,
  `${process.env.userPasscode}`,
  {
    host: "localhost",
    dialect: "mysql",
  }
);
