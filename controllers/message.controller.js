const Message = require('../model/Message')
const User = require('../model/User')
const cloudinary = require('../middlewares/cloudinary')
const sendMessage = async (req, res, next) => {
    const  mess = new Message();
    const {abc , message} = req.body
    
    mess.message = message
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path)
        review.image = result.secure_url
    }
    mess.from = req.decoded._id
    mess.to = req.params.userID

    const save = await mess.save()
    if (save) {
        res.status(200).json({success: true})
    }
   
}

const getMessage = async (req,res,next) => {
    const messages = await Message.find({ $or: [{
        from: req.decoded._id , to: req.params.userID },{ to : req.decoded._id , from : req.params.userID }]
    }) 
    
    return res.status(200).json({success: true , messages : messages  })
}

module.exports = {
    sendMessage,
    getMessage
}