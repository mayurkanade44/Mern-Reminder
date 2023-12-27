import Reminder from "../models/reminderModel.js";
import User from "../models/userModel.js";
import { capitalLetter, uploadFiles } from "../utils/helper.js";
import exceljs from "exceljs";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import axios from "axios";
import sgMail from "@sendgrid/mail";

export const addReminder = async (req, res) => {
  const { title, category, expirationDate, reminderDue, autoRenew, renew } =
    req.body;

  try {
    if (!title || !category || !expirationDate)
      return res.status(400).json({ msg: "Please provide all values" });

    let date = new Date(expirationDate);
    let reminderStart = Number(reminderDue);
    const expiryMonths = [];

    if (autoRenew && renew === "Yearly") reminderStart = 3;
    if (autoRenew && renew === "Quarterly") reminderStart = 1;

    if (autoRenew && renew === "Monthly") {
      req.body.expirationDate = new Date(
        date.getFullYear(),
        new Date().getMonth() + 1,
        date.getDate()
      );
    } else {
      for (let i = 1; i <= reminderStart; i++) {
        expiryMonths.push(
          new Date(date.getFullYear(), date.getMonth() - i, 1)
            .toISOString()
            .split("T")[0]
        );
      }
      req.body.expirationDate = expirationDate;
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
  const { search, category } = req.query;
  const query = { user: req.user._id };
  if (search) query.title = { $regex: search, $options: "i" };
  if (category && category !== "All Categories") query.category = category;
  try {
    const page = Number(req.query.page) || 1;
    const count = await Reminder.countDocuments({ ...query });
    const reminders = await Reminder.find(query)
      .sort("-createdAt")
      .skip(10 * (page - 1))
      .limit(10);

    return res.json({ reminders, pages: Math.ceil(count / 10) });
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
  const {
    expirationDate,
    reminderDue,
    category,
    title,
    notes,
    autoRenew,
    renew,
  } = req.body;
  try {
    const reminder = await Reminder.findOne({ _id: id, user: req.user._id });
    if (!reminder) return res.status(404).json({ msg: "Not found" });

    let date = new Date(expirationDate);
    let reminderStart = Number(reminderDue);
    const expiryMonths = [];

    if (autoRenew && renew === "Yearly") reminderStart = 3;
    if (autoRenew && renew === "Quarterly") reminderStart = 1;

    if (autoRenew && renew === "Monthly") {
      reminder.expirationDate = new Date(
        date.getFullYear(),
        new Date().getMonth() + 1,
        date.getDate()
      );
    } else {
      for (let i = 1; i <= reminderStart; i++) {
        expiryMonths.push(
          new Date(date.getFullYear(), date.getMonth() - i, 1)
            .toISOString()
            .split("T")[0]
        );
      }
      reminder.expirationDate = expirationDate;
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
    reminder.notes = notes;
    reminder.autoRenew = autoRenew;
    reminder.renew = renew;

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

        await workbook.xlsx.writeFile(`./tmp/${user.name}_UpcomingMonth.xlsx`);

        const result = await cloudinary.uploader.upload(
          `tmp/${user.name}_UpcomingMonth.xlsx`,
          {
            resource_type: "raw",
            use_filename: true,
            folder: "reminder",
          }
        );

        const userReminder = await User.findById(user._id);
        userReminder.reminderFiles.push(result.secure_url);
        await userReminder.save();

        fs.unlinkSync(`./tmp/${user.name}_UpcomingMonth.xlsx`);
      }
    }

    return res.json({ msg: "Reminder file generated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};

export const expiryFile = async (req, res) => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  try {
    const allUsers = await User.find()
      .populate({
        path: "reminders",
        match: { expirationDate: { $lte: lastDay, $gte: firstDay } },
      })
      .select("name reminders");

    for (let user of allUsers) {
      if (user.reminders.length) {
        const thisMonth = user.reminders;

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

        thisMonth.map((item) => {
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

        await workbook.xlsx.writeFile(`./tmp/${user.name}_ThisMonth.xlsx`);

        const result = await cloudinary.uploader.upload(
          `tmp/${user.name}_ThisMonth.xlsx`,
          {
            resource_type: "raw",
            use_filename: true,
            folder: "reminder",
          }
        );

        const userReminder = await User.findById(user._id);
        userReminder.reminderFiles.push(result.secure_url);
        await userReminder.save();

        fs.unlinkSync(`./tmp/${user.name}_ThisMonth.xlsx`);
      }
    }

    return res.json({ msg: "Expiry file generated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};

export const reminderAlert = async (req, res) => {
  try {
    const allUser = await User.find().select("name emailList reminderFiles");

    for (let user of allUser) {
      let attach = [];
      if (user.reminderFiles?.length) {
        for (let reminderFile of user.reminderFiles) {
          let file = reminderFile.split(".");
          const fileType = file.pop();
          const fileName = file[file.length - 1].split("/").pop();
          const result = await axios.get(reminderFile, {
            responseType: "arraybuffer",
          });
          const base64File = Buffer.from(result.data, "binary").toString(
            "base64"
          );

          const attachObj = {
            content: base64File,
            filename: `${fileName}.${fileType}`,
            type: `application/${fileType}`,
            disposition: "attachment",
          };
          attach.push(attachObj);
        }

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
          to: user.emailList,
          from: { email: "noreply.pestbytes@gmail.com", name: "Reminder" },
          dynamic_template_data: {
            name: user.name,
            description:
              "You have received these auto generated files for your action, its a updated reminder for the set reminders.",
          },
          template_id: "d-d7b8ca140f5b47828ff5711f2bdde959",
          attachments: attach,
        };
        await sgMail.send(msg);
        user.reminderFiles = [];
        await user.save();
        console.log(`Email sent to ${user.name}`);
      } else {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: user.emailList,
          from: { email: "noreply.pestbytes@gmail.com", name: "Reminder" },
          dynamic_template_data: {
            name: user.name,
            description: "There is no reminder this month.",
          },
          template_id: "d-d7b8ca140f5b47828ff5711f2bdde959",
        };
        await sgMail.send(msg);
      }
    }

    return res.json({ msg: "Email Sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};

export const autoRenew = async (req, res) => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  try {
    const reminders = await Reminder.find({
      autoRenew: true,
      expirationDate: { $gte: firstDay, $lte: lastDay },
    });

    for (let reminder of reminders) {
      const currentDate = new Date(reminder.expirationDate);
      if (reminder.renew === "Monthly") {
        let expirationDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          currentDate.getDate()
        );
        reminder.expirationDate = expirationDate;
        await reminder.save();
      } else if (reminder.renew === "Quarterly") {
        let expirationDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 3,
          currentDate.getDate()
        );
        const expiryMonths = [
          new Date(
            expirationDate.getFullYear(),
            expirationDate.getMonth() - 1,
            1
          )
            .toISOString()
            .split("T")[0],
        ];
        reminder.expirationDate = expirationDate;
        reminder.expiryMonths = expiryMonths;
        await reminder.save();
      } else if (reminder.renew === "Yearly") {
        let expirationDate = new Date(
          currentDate.getFullYear() + 1,
          currentDate.getMonth(),
          currentDate.getDate()
        );
        let expiryMonths = [];
        for (let i = 1; i <= 3; i++) {
          expiryMonths.push(
            new Date(
              expirationDate.getFullYear(),
              expirationDate.getMonth() - i,
              1
            )
              .toISOString()
              .split("T")[0]
          );
        }
        reminder.expirationDate = expirationDate;
        reminder.expiryMonths = expiryMonths;
        await reminder.save();
      }
    }
    return res.json({ msg: "Auto renewed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later." });
  }
};
