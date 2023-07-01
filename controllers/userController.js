import User from "../models/userModel.js";
import crypto from "crypto";
import { capitalLetter, generateToken, sendEmail } from "../utils/helper.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!email || !name || !password)
      return res.status(400).json({ msg: "Please provide all values" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    await User.create({
      name: capitalLetter(name),
      email,
      emailList: [email],
    });

    return res.status(201).json({
      msg: `Successfully registered, contact admin`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};

export const verifyUser = async (req, res) => {
  const { verificationToken, email, password, emailList } = req.body;
  try {
    if (!verificationToken && !email && !password && !emailList)
      return res.status(400).json({ msg: "Please provide all values" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Verification Failed" });

    if (!user.password) {
      if (password) {
        if (verificationToken !== user.verificationToken)
          return res.status(401).json({ msg: "Verification Failed" });
        user.isVerified = true;
        user.verificationToken = null;
        user.password = password;
      } else return res.status(400).json({ msg: "Please provide all values" });
    }

    emailList.split(",").map((email) => user.emailList.push(email));

    await user.save();

    return res
      .status(200)
      .json({ msg: "Password has been set, please login." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!password || !email)
      return res.status(400).json({ msg: "Please provide all values" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(401).json({ msg: "Verification still pending" });

    const passwordCheck = await user.comparePassword(password);

    if (!passwordCheck)
      return res.status(400).json({ msg: "Invalid credentials" });

    generateToken(res, user._id);

    return res.status(200).json({
      user: {
        userId: user._id,
        name: user.name,
      },
      msg: `Welcome ${user.name}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};

export const addCategory = async (req, res) => {
  const { id } = req.params;
  try {
    if (id !== req.user._id.toString())
      return res.status(401).json({ msg: "You dont have permission" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const category = capitalLetter(req.body.category);
    user.categories.push(category);
    await user.save();

    return res.json({ msg: "Category added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};

export const allCategories = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "categories name emailList"
    );

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};
