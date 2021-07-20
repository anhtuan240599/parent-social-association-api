const Message = require("../model/Message");
const User = require("../model/User");
const cloudinary = require("../middlewares/cloudinary");
const sendMessage = async (req, res, next) => {
  const mess = new Message();
  const { message, to } = req.body;
  const foundUser = await User.findOne({_id : req.decoded._id})
  const friend = await User.findOne({_id:req.params.userID})
  mess.message = message;
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    mess.image = result.secure_url;
  }
  mess.from = req.decoded._id;
  mess.to = req.params.userID;

  const save = await mess.save();
  if(foundUser.userChat.indexOf(friend._id) == -1){
    foundUser.userChat.push(friend._id)
    foundUser.save()
  }
  if(friend.userChat.indexOf(foundUser._id) == -1){
    friend.userChat.push(foundUser._id)
    friend.save()
  }
  if (save) {
    res.status(200).json({ success: true });
  }
};

const getUsers = async (req, res, next) => {
  const users = await Message.find(
    {
      $or: [
        {
          from: req.decoded._id,
        },
        {
          to: req.decoded._id,
        },
      ],
    },
    ["from", "to"]
  )
    .populate("from", ["userName","avatar"])
    .populate("to", ["userName","avatar"]);
  return res.status(200).json({ success: true, users: users });
};

const getMessage = async (req, res, next) => {
  const messages = await Message.find({
    $or: [
      {
        from: req.decoded._id,
        to: req.params.userID,
      },
      { to: req.decoded._id, from: req.params.userID },
    ],
  });

  return res.status(200).json({ success: true, messages: messages });
};

module.exports = {
  sendMessage,
  getMessage,
  getUsers,
};
