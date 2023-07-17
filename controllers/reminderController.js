import Reminder from "../models/reminderModel.js";
import User from "../models/userModel.js";
import { capitalLetter, uploadFiles } from "../utils/helper.js";
import exceljs from "exceljs";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import axios from "axios";
import sgMail from "@sendgrid/mail";

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

export const reminderStats = async (req, res) => {
  try {
    const stats = { total: 0, expired: 0, month: 0 };
    stats.total = await Reminder.countDocuments({ user: req.user._id });
    const date = new Date();
    stats.expired = await Reminder.countDocuments({
      user: req.user._id,
      expirationDate: { $lte: date },
    });
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    stats.month = await Reminder.countDocuments({
      user: req.user._id,
      expirationDate: { $lte: lastDay, $gte: firstDay },
    });
    return res.json(stats);
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
    const reminder = await Reminder.findOne({ _id: id, user: req.user._id });
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

export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!reminder) return res.status(404).json({ msg: "Not found" });

    await Reminder.deleteOne({ _id: reminder._id });
    return res.json({ msg: "Reminder removed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};

export const reminderFile = async (req, res) => {
  try {
    const date = new Date().toISOString().split("T")[0];

    const allUsers = await User.find()
      .populate({
        path: "reminders",
        match: { expiryMonths: { $in: [date] } },
      })
      .select("name reminders");

    for (let user of allUsers) {
      if (user.reminders.length) {
        const reminders = user.reminders;

        const workbook = new exceljs.Workbook();
        let worksheet = workbook.addWorksheet("Sheet1");

        worksheet.columns = [
          { header: "Title", key: "title" },
          { header: "Category", key: "category" },
          { header: "Expiration Date", key: "expirationDate" },
          { header: "Notes", key: "notes" },
          { header: "Attached Documents", key: "documents" },
          { header: "Auto Renew", key: "autoRenew" },
        ];

        reminders.map((item) => {
          worksheet.addRow({
            title: item.title,
            category: item.category,
            expirationDate: item.expirationDate,
            notes: item.notes,
            autoRenew: item.autoRenew,
            documents: item.documents.length && {
              text: "Document",
              hyperlink: item.documents[0],
            },
          });
        });

        await workbook.xlsx.writeFile(`./tmp/${user.name}.xlsx`);

        const result = await cloudinary.uploader.upload(
          `tmp/${user.name}.xlsx`,
          {
            resource_type: "raw",
            use_filename: true,
            folder: "reminder",
          }
        );

        await User.findByIdAndUpdate(
          user._id,
          { reminderFile: result.secure_url },
          { new: true, runValidators: true }
        );

        fs.unlinkSync(`./tmp/${user.name}.xlsx`);
      }
    }

    return res.json({ msg: "ok" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};

export const reminderAlert = async (req, res) => {
  try {
    const allUser = await User.find().select("name emailList reminderFile");

    for (let user of allUser) {
      if (user.reminderFile) {
        const fileType = user.reminderFile.split(".").pop();
        const result = await axios.get(user.reminderFile, {
          responseType: "arraybuffer",
        });
        const base64File = Buffer.from(result.data, "binary").toString(
          "base64"
        );

        const attachObj = {
          content: base64File,
          filename: `${user.name}.${fileType}`,
          type: `application/${fileType}`,
          disposition: "attachment",
        };
        const attach = [attachObj];

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
          to: user.emailList,
          from: { email: "noreply.pestbytes@gmail.com", name: "Reminder" },
          template_id: "d-458b69d16c73496f92254407bc4c50c7",
          attachments: attach,
        };
        await sgMail.send(msg);
      }
      user.reminderFile = "";
      await user.save();
    }

    return res.json({ msg: "Email Sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};
