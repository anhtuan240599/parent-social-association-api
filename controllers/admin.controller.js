const Deck = require("../model/Deck");
const User = require("../model/User");
const News = require("../model/News");
const Event = require("../model/Event");
const Report = require("../model/Report");
const Review = require("../model/Review");
const cloudinary = require("../middlewares/cloudinary");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Group = require("../model/Group");
const DeckGroup = require("../model/DeckGroup");
const fastcsv = require("fast-csv");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const addListTeacher = async (req, res, next) => {
  setTimeout(async function () {
    let stream = fs.createReadStream(`./upload/${req.file.filename}`);
    let csvData = [];
    let csvStream = fastcsv
      .parse()
      .on("data", async function (data) {
        csvData.push({
          id: data[0],
          userID: data[1],
          userName: data[2],
          email: data[3],
          password: data[4],
          phone: data[5],
          tag: data[6],
          dateOfBirth: data[7],
          formTeacher: data[8],
          dean: data[9],
          role: data[10],
        });
      })
      .on("end", async function () {
        // remove the first line: header
        await csvData.shift();
        const salt = await bcrypt.genSalt(10);
        const arrUsers = [];
        for (let user of csvData) {
          const [foundUser] = await User.find({ userID: user.userID }, [
            "userID",
          ]);
          if (foundUser) {
            arrUsers.push(foundUser.userID);
          } else {
            const hashPassword = await bcrypt.hash(user.password, salt);
            user.password = hashPassword;
          }
        }

        if (arrUsers.length) {
          return res.status(400).json({
            message: `userID : ${arrUsers} đã bị trùng vui lòng kiểm tra lại`,
          });
        }
        User.insertMany(csvData)
          .then(function () {
            return res.status(200).json({
              success: true,
              csvData,
            }); // Success
          })
          .catch(function (error) {
            console.log(error); // Failure
          });
      });
    stream.pipe(csvStream);
  }, 1000);
};

const addListUser = async (req, res, next) => {
  setTimeout(async function () {
    let stream = fs.createReadStream(`./upload/${req.file.filename}`);
    let csvData = [];
    let csvStream = fastcsv
      .parse()
      .on("data", async function (data) {
        await csvData.push({
          id: data[0],
          userID: data[1],
          userName: data[2],
          email: data[3],
          password: data[4],
          phone: data[5],
          class: data[6],
          nameChild: data[7],
          dateOfBirth: data[8],
          role: data[9],
        });
      })
      .on("end", async function () {
        // remove the first line: header
        csvData.shift();
        const salt = await bcrypt.genSalt(10);
        const arrUsers = [];
        for (let user of csvData) {
          const [foundUser] = await User.find({ userID: user.userID }, [
            "userID",
          ]);
          if (foundUser) {
            arrUsers.push(foundUser.userID);
          } else {
            const hashPassword = await bcrypt.hash(user.password, salt);
            user.password = hashPassword;
          }
        }

        if (arrUsers.length) {
          return res.status(400).json({
            message: `userID : ${arrUsers} đã bị trùng vui lòng kiểm tra lại`,
          });
        }

        User.insertMany(csvData)
          .then(function () {
            return res.status(200).json({
              success: true,
              csvData,
            }); // Success
          })
          .catch(function (error) {
            console.log(error); // Failure
          });
      });
    stream.pipe(csvStream);
  }, 1000);
};

const searchUser = async (req, res, next) => {
  if (req.query.userName) {
    const regex = new RegExp(fullTextSearchVi(req.query.userName), "gi");
    const users = await User.find({
      userID: regex,
    });
    return res.status(200).json({
      success: true,
      users: users,
    });
  } else {
    const users = await User.find();

    return res.status(200).json({
      success: true,
      users: users,
    });
  }
};
const adminLogin = async (req, res, next) => {
  const foundUser = await User.findOne({
    email: "admin",
  });
  if (!foundUser) {
    res.status(403).json({
      success: false,
    });
  } else {
    if (foundUser.comparePassword(req.body.password)) {
      let token = JWT.sign(foundUser.toJSON(), process.env.SECRET, {
        expiresIn: 6048000,
      });
      res.status(200).json({
        success: true,
        token: token,
      });
    } else {
      res.status(403).json({
        success: false,
      });
    }
  }
};

const getNews = async (req, res, next) => {
  const news = await News.find();
  return res.status(200).json({
    success: true,
    news: news,
  });
};
const postNews = async (req, res, next) => {
  const news = req.body;
  const newsPost = new News(news);
  if (req.files) {
    const urls = [];
    const ids = [];
    for (const File of req.files) {
      const { path } = File;
      const result = await cloudinary.uploader.upload(path);
      urls.push(result.secure_url);
      ids.push(result.public_id);
    }

    newsPost.image = urls;
    newsPost.cloudinaryID = ids;
  }
  await newsPost.save();
  return res.status(200).json({
    success: true,
    news: newsPost,
  });
};
const getEvents = async (req, res, next) => {
  const events = await Event.find();

  return res.status(200).json({
    success: true,
    events: events,
  });
};
const postEvent = async (req, res, next) => {
  const event = req.body;
  const newEvent = new Event(event);
  if (req.files) {
    const urls = [];
    const ids = [];
    for (const File of req.files) {
      const { path } = File;
      const result = await cloudinary.uploader.upload(path);
      urls.push(result.secure_url);
      ids.push(result.public_id);
    }

    newEvent.image = urls;
    newEvent.cloudinaryID = ids;
  }
  await newEvent.save();
  return res.status(200).json({
    success: true,
    event: newEvent,
  });
};
const getAll = async (req, res, next) => {
  const users = await User.find();
  const decks = await Deck.find().populate("owner").populate("reviews").exec();
  return res.status(200).json({
    success: true,
    users: users,
    decks: decks,
  });
};
const deleteUser = async (req, res, next) => {
  // const foundUser = await User.findById(req.params.userID)
  // const deck = await Deck.find()
  // if (deck.like.indexOf(foundUser._id) > -1) {
  //     deck.like.pull(foundUser._id)
  // }
  let deleteUser = await User.remove({
    _id: req.params.userID,
  });
  await Deck.remove({
    owner: req.params.userID,
  });
  await DeckGroup.remove({
    owner: req.params.userID,
  });
  await Review.remove({
    user: req.params.userID,
  });
  if (deleteUser) {
    return res.status(200).json({
      success: true,
      message: "Da xoa user",
    });
  }
};

const reportUser = async (req, res, next) => {
  const report = await new Report(req.body);
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    report.image = result.secure_url;
  }
  await report.save();
  return res.status(200).json({
    success: true,
    report: report,
  });
};

const getReport = async (req, res, next) => {
  const reports = await Report.find();
  return res.status(200).json({
    reports: reports,
  });
};

const reply = async (req, res, next) => {
  const email = req.body.email;
  const transporter = nodemailer.createTransport(
    "smtps://alumni.hutech%40@gmail.com:tuan12101991@smtp.gmail.com"
  );
  const info = transporter.sendMail({
    from: '"Alumni Hutech" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: "Báo cáo thành công", // Subject line
    text: "Tài khoản giả mạo bạn đã bị xóa, bây giờ bạn có thể trở lại để tạo tài khoản", // plain text body
    html: "<b>Tài khoản giả mạo bạn đã bị xóa, bây giờ bạn có thể trở lại để tạo tài khoản</b>", // html body
  });

  transporter.sendMail(info, function (error, info) {});
  return res.status(200).json({
    success: true,
    message: `Da gui thu den dia chi ${email}`,
  });
};

module.exports = {
  addListTeacher,
  addListUser,
  deleteUser,
  adminLogin,
  getAll,
  getNews,
  getEvents,
  postNews,
  postEvent,
  searchUser,
  reportUser,
  getReport,
  reply,
};
