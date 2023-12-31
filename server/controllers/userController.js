const generateToken = require("../config/generateToken");
const userModel = require("../models/userModel");
const { omit, pick } = require("lodash");
// login callback
const login = async (req, res) => {
  try {
    console.log("Entering login function");
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("Invalid email or password");
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).send("User Not Found");
    }
    const result = await user.comparePassword(password);
    if (result) {
      console.log("Password matched. Sending response...");
      const token = await generateToken(
        pick(user.toObject(), ["name", "email"])
      );
      return res.json({
        token,
        user: pick(user.toObject(), ["name", "email", "_id"]),
      });
    }
    console.log("Incorrect password. Sending response...");
    return res.status(400).json({
      msg: "password or email incorrect",
    });
  } catch (error) {
    console.error("Error in login function:", error);
    return res.status(400).json({
      msg: "password or email incorrect",
    });
  }
};


//Register Callback
const register = async (req, res) => {
  try {
    console.log(req.body);
    let newUser = await userModel.create(req.body);

    newUser = omit(newUser.toObject(), "password");
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

module.exports = { login, register };
