const express = require("express");

const User = require("../models/user.model");

const router = express.Router();

const handleError = (err) => {
  const errors = { path: "", message: "" };
  if (err.errors) {
    const [ValidationErrorItem] = err.errors;
    errors.path = ValidationErrorItem.path;
    errors.message = ValidationErrorItem.message;
  }

  if (err.message === "Email already exist") {
    errors.path = "email";
    errors.message = "Email already exist";
  }

  return errors;
};

router.get("/", async (req, res) => {
  try {
    const result = await User.findAll();
    res.status(200).json({
      Users: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const checkIfEmailExist = await User.findOne({
      where: { email: email },
    });
    if (checkIfEmailExist) {
      throw new Error("Email already exist");
    }

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password,
    });

    const result = await newUser.save();
    if (!result) {
      throw new Error("An error occured");
    }
    result.password = null;
    res.status(201).json({
      status: "success",
      new_user: result,
    });
  } catch (err) {
    const error = handleError(err);
    res.status(500).json({
      status: "error",
      error: error,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singleUser = await User.findOne({ where: { id: id } });
    if (!singleUser) {
      res.status(404).json({
        message: "No user with this id exist",
      });
    } else {
      singleUser.password = null;
      res.status(200).json({
        user: singleUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error,
    });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleUser = await User.findOne({ where: { id: id } });
    if (!singleUser) {
      res.status(404).json({
        message: "No user with this id exist",
      });
    } else {
      singleUser.update(
        { password: req.body.password },
        {
          where: {
            id: id,
          },
        }
      );
      const result = await singleUser.save();

      if (result) {
        res.status(200).json({
          user: "Password updated successfully",
        });
      } else {
        res.status(404).json({ message: "An error occured" });
      }
    }
  } catch (err) {
    const error = handleError(err);
    res.status(500).json({
      status: "error",
      error: error,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singleUser = await User.destroy({ where: { id: id } });
    if (!singleUser) {
      res.status(404).json({
        message: "No user with this id exist",
      });
    } else {
      singleUser.password = null;
      res.status(200).json({
        user: "User deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error,
    });
  }
});

module.exports = router;
