import User from "../models/userModel.js";
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
      password: password,
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

export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (req.body.activate) {
      const dynamicData = { name: user.name, email: user.email };
      const mail = await sendEmail({
        dynamicData,
        template: "d-458b69d16c73496f92254407bc4c50c7",
      });
      if (!mail)
        return res
          .status(500)
          .json({ msg: "Mail server error, try again later." });

      user.isVerified = true;
      await user.save();
      return res.json({ msg: "User activated" });
    } else {
      user.isVerified = false;
      await user.save();
      return res.json({ msg: "User deactivated" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};

// export const verifyUser = async (req, res) => {
//   const { verificationToken, email, password, emailList } = req.body;
//   try {
//     if (!verificationToken && !email && !password && !emailList)
//       return res.status(400).json({ msg: "Please provide all values" });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ msg: "Verification Failed" });

//     if (!user.password) {
//       if (password) {
//         if (verificationToken !== user.verificationToken)
//           return res.status(401).json({ msg: "Verification Failed" });
//         user.isVerified = true;
//         user.verificationToken = null;
//         user.password = password;
//       } else return res.status(400).json({ msg: "Please provide all values" });
//     }

//     emailList.split(",").map((email) => user.emailList.push(email));

//     await user.save();

//     return res
//       .status(200)
//       .json({ msg: "Password has been set, please login." });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ msg: "Server error, try again later." });
//   }
// };

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
        admin: user.isAdmin,
      },
      msg: `Welcome ${user.name}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};

export const updateUser = async (req, res) => {
  const { password, email1, email2 } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (password) user.password = password;
    const emailList = [user.email, email1, email2];
    user.emailList = emailList;

    await user.save();
    return res.json({ msg: "Profile updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ msg: "Logged out successfully" });
};

export const addCategory = async (req, res) => {
  const { id } = req.params;
  try {
    if (id !== req.user._id.toString())
      return res.status(401).json({ msg: "You don't have permission" });

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

export const allUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email isVerified createdAt isAdmin")
      .sort("isVerified");

    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};
