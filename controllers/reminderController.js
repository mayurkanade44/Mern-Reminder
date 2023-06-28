import Reminder from "../models/reminderModel.js";
import { capitalLetter, uploadFiles } from "../utils/helper.js";

export const addReminder = async (req, res) => {
  const { title, category, expirationDate, reminderDue } = req.body;

  try {
    if (!title || !category || !expirationDate)
      return res.status(400).json({ msg: "Please provide all values" });

    let date = new Date(expirationDate);
    const expiryMonths = [];

    for (let i = 1; i <= Number(reminderDue); i++) {
      expiryMonths.push(
        new Date(date.getFullYear(), date.getMonth() - i, 3)
          .toISOString()
          .split("T")[0]
      );
    }

    const docsLinks = [];
    if (req.files) {
      let docs = [];
      if (req.files.documents.length > 0) docs = req.files.documents;
      else docs.push(req.files.documents);

      for (let i = 0; i < docs.length; i++) {
        const link = await uploadFiles(docs[i]);
        if (!link)
          return res
            .status(400)
            .json({ msg: "Upload Server error, please try again later" });

        docsLinks.push(link);
      }
    }

    req.body.title = capitalLetter(title);
    req.body.expiryMonths = expiryMonths;
    req.body.user = req.user._id;
    req.body.documents = docsLinks;

    await Reminder.create(req.body);

    return res.status(201).json({ msg: "New Reminder Added" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};

export const allReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id });

    return res.json(reminders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};

export const singleReminder = async (req, res) => {
  const { id } = req.params;
  try {
    const reminder = await Reminder.findById(id);
    if (!reminder) return res.status(404).json({ msg: "Not found" });

    return res.json(reminder);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};

export const editReminder = async (req, res) => {
  const { id } = req.params;
  const { expirationDate, reminderDue, category, title, notes } = req.body;
  try {
    const reminder = await Reminder.findById(id);
    if (!reminder) return res.status(404).json({ msg: "Not found" });

    let date = new Date(expirationDate);
    const expiryMonths = [];

    for (let i = 1; i <= Number(reminderDue); i++) {
      expiryMonths.push(
        new Date(date.getFullYear(), date.getMonth() - i, 3)
          .toISOString()
          .split("T")[0]
      );
    }

    const docsLinks = [];
    if (req.files) {
      let docs = [];
      if (req.files.documents.length > 0) docs = req.files.documents;
      else docs.push(req.files.documents);

      for (let i = 0; i < docs.length; i++) {
        const link = await uploadFiles(docs[i]);
        if (!link)
          return res
            .status(400)
            .json({ msg: "Upload Server error, please try again later" });

        docsLinks.push(link);
      }
      reminder.documents = docsLinks;
    }

    reminder.title = capitalLetter(title);
    reminder.expiryMonths = expiryMonths;
    reminder.category = category;
    reminder.expirationDate = expirationDate;
    reminder.notes = notes;

    await reminder.save();

    return res.json({ msg: "Reminder updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};
