const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, preferredCurrency } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      preferredCurrency: preferredCurrency || "USD",
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          preferredCurrency: newUser.preferredCurrency,
        },
      },
    });
  } catch (error) {
    console.error("Auth Controller Error:", error);
    res.status(400).json({ status: "fail", message: "Authentication failed. Please try again later." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferredCurrency: user.preferredCurrency,
        },
      },
    });
  } catch (error) {
    console.error("Auth Controller Error:", error);
    res.status(400).json({ status: "fail", message: "Authentication failed. Please try again later." });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    console.error("Auth Controller Error:", error);
    res.status(400).json({ status: "fail", message: "Authentication failed. Please try again later." });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1) Get user from collection
    const user = await User.findById(req.user.id).select("+password");

    // 2) Check if posted current password is correct
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ message: "Your current password is wrong" });
    }

    // 3) If correct, update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // 4) Log user in, send JWT
    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferredCurrency: user.preferredCurrency,
        },
      },
    });
  } catch (error) {
    console.error("Auth Controller Error:", error);
    res.status(400).json({ status: "fail", message: "Authentication failed. Please try again later." });
  }
};
