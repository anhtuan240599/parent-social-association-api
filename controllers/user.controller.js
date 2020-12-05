const User = require('../model/User')
const Deck = require('../model/Deck')
const Year = require('../model/Year')
const Joi = require('@hapi/joi')
const { JWT_SECRET } = require('../config/index')
const JWT = require('jsonwebtoken')
const cloudinary = require('../middlewares/cloudinary')

const authFacebook = async(req,res,next) => {
    const token = encodedToken(req.user._id)

    res.setHeader('Authorization',token)

    return res.status(200).json({ success:true})
}

const authGoogle = async (req,res,next) => {
    
    const token = encodedToken(req.user._id)

    res.setHeader('Authorization',token)

    return res.status(200).json({ success:true})
}

const encodedToken = (userID) => {
    return JWT.sign({ 
        iss:'Tuan Huynh',
        sub: userID,
        iat : new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)

    },JWT_SECRET)
}

const foundUser = async (req,res,next) => {
   
        let foundUser = await User.findOne({ _id: req.decoded._id })
        .populate("yearID")
        .exec();
        if (foundUser) {
            res.json({
                success: true,
                user: foundUser
            })
        }
   
}

const idSchema = Joi.object().keys({
    userID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
})

const getUser = async (req,res,next) => {
    
    const {userID} = req.params
    const user = await User.findById(userID)
        .populate('decks')
        .populate('yearID')
        .exec()
    return res.status(200).json({user})

}

const getUserDeck = async (req,res,next) => {

    const {userID} = req.value.params
    const user = await User.findById(userID).populate('decks')
    return res.status(200).json({decks : user.decks})

}

const index = async (req,res,next) => {
    
    const users = await User.find({})
    return res.status(200).json({users})
}

const newUser = async (req,res,next) => {
   
    const newUser = new User(req.value.body)
    await newUser.save()
    return res.status(201).json({user : newUser})
  
}

const newUserDeck = async (req,res,next) => {

    const {userID} = req.value.params 

    const newDeck = new Deck(req.value.body)

    const user = await User.findById(userID)

    newDeck.owner = user

    newDeck.save()

    user.decks.push(newDeck._id)

    await user.save()

    res.status(201).json({deck:newDeck})
}

const postYear = async (req,res,next) => {
    const newYear = new Year();
    newYear.schoolYear = req.body.schoolYear

    await newYear.save()

    return res.status(200).json({success:true})
}
const getYear = async (req,res,next) => {
    const foundYear = await Year.find({})
    return res.status(200).json({success:true,foundYear})
}

const replaceUser = async (req,res,next) => {
    const foundUser = await User.findOne({_id: req.decoded._id })
    if(foundUser)
    {
        const {name,email,password} = req.body
        if(name) foundUser.name = name
        if(email)     foundUser.email = email
        if(password)  foundUser.password = password
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path)
            foundUser.avatar =  result.secure_url
        }
        await foundUser.save();
    }
    return res.status(200).json({success : true})
}

const secret = async (req,res,next) => {
    return res.status(200).json({ success: true })
}

// const login = async (req,res,next) => {
//     const token = encodedToken(req.user._id)

//     res.setHeader('Authorization',token)

//     return res.status(200).json({ success:true })
// }

const login = async (req,res,next) => {
    
    const foundUser = await User.findOne({ name: req.body.name })
    if(!foundUser) {
        res.status(403).json({success: false})
    } else {
        if(foundUser.comparePassword(req.body.password)) {
            let token = JWT.sign(foundUser.toJSON(),process.env.SECRET, {
                expiresIn : 6048000
            })
            res.status(200).json({success:true,token:token})
        } else {
            res.status(403).json({success: false})
        }
    }
}

const register = async (req,res,next) => {
    const {name,email,password,yearID} = req.body
    
    const foundUser = await User.findOne({email})
    if (foundUser) return res.status(403).json({error : {message : 'Email is already in use'}})

    const newUser = new User({name,email,password,yearID})

    await newUser.save()

    //Encode token
    const token = JWT.sign(newUser.toJSON(), process.env.SECRET,{
        expiresIn: 6048000
    });

    

    return res.status(200).json({success : true,token: token})
}

const updateUser = async (req,res,next) => {

    const {userID} = req.value.params
    const newUser = req.value.body
    const result = await User.findByIdAndUpdate(userID, newUser)
    return res.status(200).json({success : true})

}

module.exports = {
    index,
    newUser,
    getUser,
    replaceUser,
    updateUser,
    getUserDeck,
    newUserDeck,
    login,
    register,
    secret,
    authGoogle,
    authFacebook,
    foundUser,
    postYear,
    getYear
}