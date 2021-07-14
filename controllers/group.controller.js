const User = require("../model/User");
const DeckGroup = require("../model/DeckGroup");
const cloudinary = require("../middlewares/cloudinary");
const Group = require("../model/Group");
const fullTextSearch = require("fulltextsearch");
const fullTextSearchVi = fullTextSearch.vi;

const deleteDeckGroup = async (req, res, next) => {
  const deck = await DeckGroup.remove({ _id: req.params.deckID });
  const group = await Group.findById(req.params.groupID);
  const foundUser = await User.findOne({ decksGroup: req.params.deckID });
  if (deck) {
    foundUser.decksGroup.pull(req.params.deckID);
    group.decks.pull(req.params.deckID);
  }
  await group.save();
  await foundUser.save();
  return res
    .status(200)
    .json({ success: true, message: "xoa bai viet thanh cong" });
};
const deleteGroup = async (req, res, next) => {
  const group = await Group.remove({ _id: req.params.groupID });
  const foundUser = await User.findOne({ groups: req.params.groupID });
  if (group) {
    foundUser.groups.pull(req.params.groupID);
  }
  await foundUser.save();
  return res
    .status(200)
    .json({ success: true, message: "xoa group thanh cong" });
};
const getGroup = async (req, res, next) => {
  const groups = await Group.find().populate("admin").exec();
  return res.status(200).json({ success: true, groups: groups });
};

const getOneGroup = async (req, res, next) => {
  const groups = await Group.findById(req.params.groupID)
    .populate("users")
    .populate("decks")
    .populate("admin");
  return res.status(200).json({ success: true, groups: groups });
};

const getAllUsersOfAllGroup = async (req, res, next) => {
  const foundUser = await User.findById(req.decoded._id).populate({
    path: "groups",
    populate: { path: "users" },
  });
  return res.status(200).json({ success: true, user: foundUser });
};

const getUsersOfGroup = async (req, res, next) => {
  if (req.query.userName) {
    const regex = new RegExp(fullTextSearchVi(req.query.userName), "i");
    const userName = await User.find(
      {
        userName: regex,
        groups: req.params.groupID,
      },
      ["userName", "avatar"]
    );
    return res.status(200).json({ success: true, userName: userName });
  } else {
    const userName = await User.find({ groups: req.params.groupID }, [
      "userName",
      "avatar",
    ]);
    return res.status(200).json({ success: true, userName: userName });
  }
};

const getOneDeckGroup = async (req, res, next) => {
  const deck = await DeckGroup.findById(req.params.deckID)
    .populate("owner")
    .populate("reviews")
    .exec();

  return res.status(200).json({ success: true, deck: deck });
};
const getDeckGroup = async (req, res, next) => {
  const group = await Group.findById(req.params.groupID)
    .populate({
      path: "decks",
      populate: { path: "owner" },
      populate: { path: "reviews", populate: { path: "user" } },
    })
    .populate({
      path: "decks",
      populate: { path: "owner" },
    })
    .populate("users")
    .populate("admin")
    .populate({ path: "reviews", populate: { path: "user" } })
    .exec();
  return res.status(200).json({ success: true, group: group });
};
const newDeckGroup = async (req, res, next) => {
  const owner = await User.findOne({ _id: req.decoded._id });

  const group = await Group.findById(req.params.groupID);
  const deck = req.body;

  delete deck.owner;

  deck.owner = owner._id;
  const newDeck = new DeckGroup(deck);

  if (req.files) {
    const urls = [];
    const ids = [];
    for (const File of req.files) {
      const { path } = File;
      const result = await cloudinary.uploader.upload(path);
      urls.push(result.secure_url);
      ids.push(result.public_id);
    }

    newDeck.image = urls;
    newDeck.cloudinaryID = ids;
  }

  await newDeck.save();
  group.decks.push(newDeck._id);
  owner.decksGroup.push(newDeck._id);
  await owner.save();
  await group.save();

  return res.status(201).json({ success: true, deck: newDeck });
};
const joinGroup = async (req, res, next) => {
  const foundUser = await User.findOne({ _id: req.decoded._id });
  const group = await Group.findById(req.params.groupID);
  if (group.users.indexOf(foundUser._id) > -1) {
    group.users.pull(foundUser._id);
    foundUser.groups.pull(group._id);
    var message = "Da roi khoi group";
  } else {
    group.users.push(foundUser._id);
    foundUser.groups.push(group._id);
    var message = "Da tham  gia group";
  }
  await group.save();
  await foundUser.save();
  return res.status(200).json({ success: true, message: message });
};
const newGroup = async (req, res, next) => {
  const admin = await User.findOne({ _id: req.decoded._id });
  const users = await User.find({ class: req.body.class });
  const teacher = await User.find({ formTeacher: req.body.class });
  const allUsers = [...users, ...teacher];
  const group = req.body;
  group.admin = admin._id;
  const newGroup = new Group(group);
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    newGroup.image = result.secure_url;
  }
  for (let user of allUsers) {
    await newGroup.users.push(user._id);
    await user.groups.push(newGroup._id);
    user.save();
  }
  await newGroup.save();
  return res.status(201).json({ success: true, group: group });
};

const newTeacherGroup = async (req, res, next) => {
  const admin = await User.findOne({ _id: req.decoded._id });
  const teachers = await User.find({ role: "teacher" });
  const group = req.body;
  group.admin = admin._id;
  const newGroup = new Group(group);
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    newGroup.image = result.secure_url;
  }
  for (let teacher of teachers) {
    await newGroup.users.push(teacher._id);
    await teacher.groups.push(newGroup._id);
    teacher.save();
  }
  await newGroup.save();
  return res.status(201).json({ success: true, group: newGroup });
};

const updateGroup = async (req, res, next) => {
  const group = await Group.findById(req.params.groupID);
  if (group) {
    const { name, description } = req.body;
    if (name) {
      group.name = name;
    }
    if (description) {
      group.description = description;
    }
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      group.image = result.secure_url;
    }
    await group.save();
  }
  return res.status(200).json({ success: true, group: group });
};

module.exports = {
  newDeckGroup,
  getDeckGroup,
  getOneGroup,
  getOneDeckGroup,
  getUsersOfGroup,
  getAllUsersOfAllGroup,
  newGroup,
  newTeacherGroup,
  joinGroup,
  getGroup,
  updateGroup,
  deleteDeckGroup,
  deleteGroup,
};
