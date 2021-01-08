const User = require('../model/User')
const DeckGroup = require('../model/DeckGroup')
const cloudinary = require('../middlewares/cloudinary')
const fullTextSearch = require('fulltextsearch');
const { findById } = require('../model/User');
const Group = require('../model/Group')
const fullTextSearchVi = fullTextSearch.vi;


const getGroup = async (req,res,next) => {
    const groups = await Group.find()
    .populate('admin')
    .exec()
    return res.status(200).json({success:true,groups:groups})
}

const getOneGroup = async (req,res,next) => {
    const groups = await Group.findById(req.params.groupID)
    .populate('users')
    .populate('decks')
    .populate('admin')
    return res.status(200).json({success:true,groups:groups})
}
const getDeckGroup = async (req,res,next) => {
    const group = await Group.findById(req.params.groupID) 
        .populate("decks")
        .populate('users')
        .populate("admin")
        .exec()
    return res.status(200).json({success:true,group : group})
}
const newDeckGroup = async (req, res, next) => {

    const owner = await User.findOne({ _id: req.decoded._id })

    const group = await Group.findById( req.params.groupID )
    const deck = req.body

    delete deck.owner

    deck.owner = owner._id
    deck.avatar = owner.avatar
    deck.name = owner.name
    const newDeck = new DeckGroup(deck)

    if (req.files) {
        const urls = []
        const ids = []
        for (const File of req.files) {
            const { path } = File
            const result = await cloudinary.uploader.upload(path);
            urls.push(result.secure_url)
            ids.push(result.public_id)

        }

        newDeck.image = urls
        newDeck.cloudinaryID = ids
    }

    await newDeck.save()
    group.decks.push(newDeck._id)
    owner.decksGroup.push(newDeck._id)
    await owner.save()
    await group.save()

    return res.status(201).json({ success:true, deck: newDeck })

}
const joinGroup = async (req,res,next) => {
    const foundUser = await User.findOne({_id : req.decoded._id})
    const group = await Group.findById(req.params.groupID)
    if (group.users.indexOf(foundUser._id) > -1){
        group.users.pull(foundUser._id)
        foundUser.groups.pull(group._id)
        var message = "Da roi khoi group"
    } else {
        group.users.push(foundUser._id)
        foundUser.groups.push(group._id)
        var message = "Da tham  gia group"
    }
    await group.save() 
    await foundUser.save()
    return res.status(200).json({success: true,message : message})

}
const newGroup = async (req,res,next) => {
    const admin = await User.findOne({_id: req.decoded._id})
    const group = req.body
    group.admin = admin._id
    const newGroup = new Group(group)
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path)
        newGroup.image = result.secure_url
        
    }
    await newGroup.save()
    return res.status(201).json({ success:true, group: group })
}

const updateGroup = async(req,res,next)  => {
    const group = await Group.findById(req.params.groupID)
    if (group) {
        const {name , description } = req.body
        group.name = name
        group.description = description
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path)
            group.image = result.secure_url
        }
        await group.save()
        
    }
    return res.status(200).json({ success: true })
    
}


module.exports = {
    newDeckGroup,
    getDeckGroup,
    getOneGroup,
    newGroup,
    joinGroup,
    getGroup,
    updateGroup
}