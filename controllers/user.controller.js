const User = require("../model/User");
const Deck = require("../model/Deck");
const Year = require("../model/Year");
const Joi = require("@hapi/joi");
const mail = require("../config/mail");
const { JWT_SECRET } = require("../config/index");
const JWT = require("jsonwebtoken");
const cloudinary = require("../middlewares/cloudinary");
const { compare, compareSync } = require("bcryptjs");

const authFacebook = async (req, res, next) => {
  const token = encodedToken(req.user._id);

  res.setHeader("Authorization", token);

  return res.status(200).json({ success: true });
};

const followUser = async (req, res, next) => {
  const foundUser = await User.findOne({ _id: req.decoded._id });

  const friend = await User.findById(req.params.userID);

  if (foundUser.following.indexOf(friend._id) > -1) {
    foundUser.following.pull(friend._id);
    friend.followers.pull(foundUser._id);
    var message = "unfollow";
  } else {
    foundUser.following.push(friend._id);
    friend.followers.push(foundUser._id);
    var message = "follow";
  }

  await foundUser.save();
  await friend.save();

  return res.status(200).json({ success: true, message: message });
};

const authGoogle = async (req, res, next) => {
  const token = encodedToken(req.user._id);

  res.setHeader("Authorization", token);

  return res.status(200).json({ success: true });
};

const encodedToken = (userID) => {
  return JWT.sign(
    {
      iss: "Tuan Huynh",
      sub: userID,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3),
    },
    JWT_SECRET
  );
};

const foundUser = async (req, res, next) => {
  let foundUser = await User.findOne({ _id: req.decoded._id })
    .populate("following")
    .populate("followers")
    .populate("decks")
    .populate("deckShare")
    .populate("yearID")
    .populate("groups")
    .populate("decksGroup")
    .populate("notification")
    .exec();
  if (foundUser) {
    return res.status(200).json({
      success: true,
      user: foundUser,
    });
  }
};

const idSchema = Joi.object().keys({
  userID: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.userID)
    .populate("following")
    .populate("followers")
    .populate("decks")
    .populate("deckShare")
    .populate("yearID")
    .populate("groups")
    .populate("decksGroup")
    .exec();
  return res.status(200).json({ success: true, user: user });
};

const getUserFollow = async (req, res, next) => {
  const foundUser = await User.findOne({ _id: req.decoded._id });
  const users = await foundUser.following;
  return res.status(200).json({ success: true, users: users });
};

const getUserYear = async (req, res, next) => {
  const year = await Year.findOne({ schoolYear: req.body.schoolYear }).populate(
    "users"
  );
  return res.status(200).json({ users: year.users });
};

const getUserDeck = async (req, res, next) => {
  const user = await User.findOne({ _id: req.decoded._id }).populate("decks");
  return res.status(200).json({ success: true, decks: user.decks });
};


const index = async (req, res, next) => {
  const users = await User.find({});
  return res.status(200).json({ users });
};

const lostPassword = async (req, res, next) => {
  const email = req.body.email;
  const header = req.body.uri;
  const foundUser = await User.findOne({ email: email });
  if (!foundUser) {
    return res.status(404).json({ message: " email này không tồn tại " });
  }
  const token = JWT.sign({ email }, process.env.SECRET, {
    expiresIn: 6048000,
  });
  mail.forgotPassword(email, header, token);
  foundUser.emailToken = token;
  await foundUser.save();
  return res.status(200).json({
    success: true,
    message:
      "mail đã được gửi đến tài khoản của bạn hãy kiểm tra để đổi mật khẩu",
  });
};

const resetPassword = async (req, res, next) => {
  const foundUser = await User.findOne({ emailToken: req.params.resetToken });
  const { password, confirmPassword } = req.body;
  if (!foundUser) {
    return res.status(400).json({ message: "token không hợp lệ!" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "mật khẩu không trùng khớp" });
  }
  foundUser.password = password;
  foundUser.emailToken = null;
  await foundUser.save().catch(err => next(err))
  return res
    .status(200)
    .json({ success: true, message: "cập nhật mật khẩu thành công" });
};

const newUser = async (req, res, next) => {
  const newUser = new User(req.value.body);
  await newUser.save();
  return res.status(201).json({ user: newUser });
};

const newUserDeck = async (req, res, next) => {
  const { userID } = req.value.params;

  const newDeck = new Deck(req.value.body);

  const user = await User.findById(userID);

  newDeck.owner = user;

  newDeck.save();

  user.decks.push(newDeck._id);

  await user.save();

  res.status(201).json({ deck: newDeck });
};

const postYear = async (req, res, next) => {
  const newYear = new Year();
  newYear.schoolYear = req.body.schoolYear;

  await newYear.save();

  return res.status(200).json({ success: true });
};
const getYear = async (req, res, next) => {
  const foundYear = await Year.find({});
  return res.status(200).json({ success: true, foundYear });
};

const shareDeck = async (req, res, next) => {
  const foundUser = await User.findOne({ _id: req.decoded._id });
  const deck = await Deck.findById(req.params.deckID);
  foundUser.deckShare.push(deck._id);
  foundUser.save();
  return res.status(200).json({ success: true });
};
const secret = async (req, res, next) => {
  return res.status(200).json({ success: true });
};

// const login = async (req,res,next) => {
//     const token = encodedToken(req.user._id)

//     res.setHeader('Authorization',token)

//     return res.status(200).json({ success:true })
// }

const login = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ userID: req.body.userID });
    if (!foundUser) {
      res.status(403).json({ success: false });
    } else {
      if (foundUser.comparePassword(req.body.password)) {
        let token = JWT.sign(foundUser.toJSON(), process.env.SECRET, {
          expiresIn: 6048000,
        });
        res.status(200).json({ success: true, token: token });
      } else {
        res.status(403).json({ success: false });
      }
    }
  } catch (err) {
    return next(err);
  }
};

const register = async (req, res, next) => {
  const { name, email, password, yearID } = req.body;

  const foundUser = await User.findOne({ email });
  if (foundUser)
    return res
      .status(403)
      .json({ error: { message: "Email is already in use" } });

  const newUser = new User({ name, email, password, yearID });

  await newUser.save();

  //Encode token
  const token = JWT.sign(newUser.toJSON(), process.env.SECRET, {
    expiresIn: 6048000,
  });

  return res.status(200).json({ success: true, token: token });
};

const updateUser = async (req, res, next) => {
  const foundUser = await User.findOne({ _id: req.decoded._id });
  if (foundUser) {
    const { userName, phone, email, password, newPassword } = req.body;
    if (email) foundUser.email = email;
    if (userName) foundUser.userName = userName;
    if (password) {
      if (!foundUser.comparePassword(password)) {
        return res.status(400).json({ message: "sai mat khau cu" });
      } else {
        foundUser.password = newPassword;
      }
    }
    if (phone) foundUser.phone = phone;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      foundUser.avatar = result.secure_url;
    }
    await foundUser.save();
  }
  return res.status(200).json({ success: true });
};

function getUnique(arr, comp) {
  const unique = arr
    .map((e) => e[comp])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter((e) => arr[e])
    .map((e) => arr[e]);

  return unique;
}

module.exports = {
  followUser,
  index,
  newUser,
  getUser,
  updateUser,
  getUserFollow,
  getUserDeck,
  newUserDeck,
  login,
  register,
  secret,
  shareDeck,
  authGoogle,
  authFacebook,
  foundUser,
  postYear,
  getYear,
  lostPassword,
  getUserYear,
  resetPassword,
};
