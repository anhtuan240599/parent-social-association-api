const User = require("../model/User");
const Deck = require("../model/Deck");
const DeckGroup = require("../model/DeckGroup");
const cloudinary = require("../middlewares/cloudinary");
const fullTextSearch = require("fulltextsearch");
const Year = require("../model/Year");
const fullTextSearchVi = fullTextSearch.vi;

const getUserDeck = async (req, res, next) => {
  const deck = await Deck.find({ owner: req.decoded._id })
    .populate("owner")
    .populate("reviews")
    .exec();

  return res.status(200).json({ success: true, deck: deck });
};
const getDeck = async (req, res, next) => {
  const deck = await Deck.findById(req.params.deckID)
    .populate("owner")
    .populate("reviews")
    .exec();

  return res.status(200).json({ success: true, deck: deck });
};

const index = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 5;
  const start = (page - 1) * perPage;
  const end = page * perPage;
  if (req.query.content) {
    const regex = new RegExp(fullTextSearchVi(req.query.content), "gi");
    const decks = await Deck.find({ name: regex })
      .populate("owner")
      .populate("reviews")
      .exec();

    return res
      .status(200)
      .json({ success: true, decks: decks.slice(start, end) });
  } else {
    const decks = await Deck.find()
      .populate("owner")
      .populate("reviews")
      .exec();

    return res
      .status(200)
      .json({ success: true, decks: decks.slice(start, end) });
  }
};

const likeDeck = async (req, res, next) => {
  const deck = await Deck.findById(req.params.deckID);

  const foundUser = await User.findById({ _id: req.decoded._id });

  if (deck.like.indexOf(foundUser._id) > -1) {
    deck.like.pull(foundUser._id);
    var message = "unlike";
  } else {
    deck.like.push(foundUser._id);
    var message = "like";
  }
  deck.save();

  return res.status(200).json({ success: true, message: message });
};

const likeDeckGroup = async (req, res, next) => {
  const deck = await DeckGroup.findById(req.params.deckID);

  const foundUser = await User.findById({ _id: req.decoded._id });

  if (deck.like.indexOf(foundUser._id) > -1) {
    deck.like.pull(foundUser._id);
    var message = "unlike";
  } else {
    deck.like.push(foundUser._id);
    var message = "like";
  }
  deck.save();

  return res.status(200).json({ success: true, message: message });
};

const newDeck = async (req, res, next) => {
  const owner = await User.findOne({ _id: req.decoded._id });

  const deck = req.body;

  delete deck.owner;

  deck.owner = owner._id;

  const newDeck = new Deck(deck);

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

  owner.decks.push(newDeck._id);
  await owner.save();

  return res.status(201).json({ success: true, deck: newDeck });
};

const replaceDeck = async (req, res, next) => {
  const { deckID } = req.params;
  const newDeck = req.body;

  const result = await Deck.findByIdAndUpdate(deckID, newDeck);
  return res.status(200).json({ success: true });
};
const updateDeck = async (req, res, next) => {
  const { deckID } = req.params;
  const newDeck = req.body;
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
  const result = await Deck.findByIdAndUpdate(deckID, newDeck);
  return res.status(200).json({ success: true });
};
const deleteDeck = async (req, res, next) => {
  const { deckID } = req.params;

  const deck = await Deck.findById(deckID);
  const ownerID = deck.owner;

  const owner = await User.findById(ownerID);

  await deck.remove();

  owner.decks.pull(deck);
  await owner.save();

  return res.status(200).json({ success: true, message: "xoa thanh cong" });
};

module.exports = {
  index,
  newDeck,
  getDeck,
  replaceDeck,
  updateDeck,
  deleteDeck,
  likeDeck,
  likeDeckGroup,
  getUserDeck,
};
