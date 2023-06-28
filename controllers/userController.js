import User from "../models/userModel.js";
import crypto from "crypto";
import { capitalLetter, generateToken, sendEmail } from "../utils/helper.js";

export const registerUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    if (!email || !name)
      return res.status(400).json({ msg: "Please provide all values" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const verificationToken = crypto.randomBytes(40).toString("hex");

    const newName = capitalLetter(name);
    const link = `http://localhost:3000/verify-account?token=${verificationToken}&email=${email}`;

    const dynamicData = { name: name, email: email, link: link };
    const mail = await sendEmail({
      dynamicData,
      template: "d-458b69d16c73496f92254407bc4c50c7",
    });
    if (!mail)
      return res.status(500).json({ msg: "Server error, try again later." });

    const categories = ["Driving License", "Rent Agreement"];

    await User.create({
      name: newName,
      email,
      verificationToken,
      categories,
    });

    return res.status(201).json({
      msg: `Verification email has been sent to your registered email id`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};

export const verifyUser = async (req, res) => {
  const { verificationToken, email, password, emailList } = req.body;
  try {
    if (!password)
      return res.status(400).json({ msg: "Please provide all values" });

    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ msg: "Verification Failed" });

    if (verificationToken !== user.verificationToken)
      return res.status(401).json({ msg: "Verification Failed" });

    user.isVerified = true;
    user.verificationToken = null;
    user.password = password;
    user.emailList = emailList.push(email);

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
      return res.status(401).json({ msg: "Email verification still pending" });

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
