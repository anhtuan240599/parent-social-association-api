const Review = require("../model/Review");
const User = require("../model/User");
const Deck = require("../model/Deck");
const DeckGroup = require("../model/DeckGroup");
const Notification = require('../model/Notification')

const cloudinary = require("../middlewares/cloudinary");

const reviewDeck = async (req, res, next) => {
  const foundUser = await User.findOne({ _id: req.decoded._id });
  const deck = await Deck.findById(req.params.deckID);
  const owner = await User.findOne({_id: deck.owner})
  const review = new Review();
  const { headline, body } = req.body;
  review.headline = headline;
  review.body = body;

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    review.image = result.secure_url;
  }
  review.user = req.decoded._id;
  review.deckID = req.params.deckID;

  await deck.reviews.push(review._id);
  await deck.save();

  const saveReview = await review.save();
  const newNotification = new Notification({
    creator: foundUser.userName,
    type: "comment",
    title: `${foundUser.userName} đã bình luận trong bài viết của bạn`,
    postId: deck._id
  });
  await newNotification.save()
  await owner.userNotification.push(newNotification._id)
  await owner.save()

  if (saveReview) {
    res.status(200).json({ success: true });
  }
};

const reviewDeckGroup = async (req, res, next) => {
  const review = new Review();
  const foundUser = await User.findOne({ _id: req.decoded._id });
  const deckGroup = await DeckGroup.findById(req.params.deckID);
  const owner = await User.findOne({_id: deckGroup.owner})
  const { headline, body } = req.body;
  review.headline = headline;
  review.body = body;

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    review.image = result.secure_url;
  }
  review.user = req.decoded._id;
  review.deckGroupID = req.params.deckID;

  await deckGroup.reviews.push(review._id);
  await deckGroup.save();
  const newNotification = new Notification({
    creator: foundUser.userName,
    type: "comment",
    title: `${foundUser.userName} đã bình luận trong bài viết của bạn`,
    groupId:req.body.groupId,
    postId: deckGroup._id
  });
  await newNotification.save()
  await owner.userNotification.push(newNotification._id)
  await owner.save()

  const saveReview = await review.save();

  if (saveReview) {
    res.status(200).json({ success: true });
  }
};

const putReviewDeck = async (req, res, next) => {
  const review = await Review.findById(req.params.reviewID);
  if (req.body.body) {
    review.body = req.body.body;
  }
  await review.save();
  return res.status(200).json({ success: true });
};

const deleteReviewDeck = async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.reviewID);
  return res.status(200).json({ success: true });
};

const getReviewDeck = async (req, res, next) => {
  const deckReviews = await Review.find({
    deckID: req.params.deckID,
  })
    .populate("user")
    .exec();
  res.status(200).json({ success: true, reviews: deckReviews });
};

const getReviewDeckGroup = async (req, res, next) => {
  const deckReviews = await Review.find({
    deckGroupID: req.params.deckID,
  })
    .populate("user")
    .exec();
  res.status(200).json({ success: true, reviews: deckReviews });
};

module.exports = {
  reviewDeck,
  reviewDeckGroup,
  getReviewDeck,
  getReviewDeckGroup,
  putReviewDeck,
  deleteReviewDeck,
};
