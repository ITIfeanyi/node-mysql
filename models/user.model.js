const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../dbConfig/db");

const User = sequelize.define(
  "Users",

  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "What is your first name?" },
        notEmpty: { msg: "What is your first name?" },
        len: {
          args: 2,
          msg: "first name lenght too short",
        },
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "What is your last name?" },
        notEmpty: { msg: "What is your last name?" },
        len: {
          args: 2,
          msg: "last name lenght too short",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "What is your email?" },
        isEmail: { msg: "Invalid email, input a valid one." },
        notEmpty: { msg: "What is your email?" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "What is your password?" },
        len: {
          args: 6,
          msg: "Password must be at least 6 characters",
        },
        hash() {
          bcrypt.hashSync(this.password, 10);
        },
      },
    },
    location: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

User.beforeCreate(async (user, options) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

module.exports = User;
