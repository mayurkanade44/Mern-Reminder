import Reminder from "../models/reminderModel.js";
import { capitalLetter } from "../utils/helper.js";

export const addReminder = async (req, res) => {
  const { title, category, expirationDate, reminderDue } = req.body;

  try {
    if (!title || !category || !expirationDate)
      return res.status(400).json({ msg: "Please provide all values" });

    let date = new Date(expirationDate);
    const expiryMonths = [];

    for (let i = reminderDue + 2; i >= 3; i--) {
      expiryMonths.push(new Date(date.getFullYear(), date.getMonth() - i, 3));
    }

    req.body.title = capitalLetter(title);
    req.body.expiryMonths = expiryMonths;
    req.body.user = "649a9de329b62357a28e6e54";

    const reminder = await Reminder.create(req.body);

    return res.status(201).json({ msg: "New Reminder Added", reminder });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};
