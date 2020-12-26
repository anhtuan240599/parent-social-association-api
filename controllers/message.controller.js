const Message = require('../model/Message')
const User = require('../model/User')
const cloudinary = require('../middlewares/cloudinary')
const sendMessage = async (req, res, next) => {
    const  mess = new Message();
    const {abc , message} = req.body
    
    mess.message = message
    mess.abc = abc
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path)
        review.image = result.secure_url
    }
    mess.from = req.decoded._id
    mess.to = req.params.userID
    console.log(mess.abc)
    

    const save = await mess.save()
    if (save) {
        console.log(mess)
        res.status(200).json({success: true})
    }
   
}

const getMessage = async (req,res,next) => {
    const messages = await Message.find({
        from: req.decoded._id , to: req.params.userID
    }) 
    const messages2 = await Message.find({
        from: req.params.userID , to: req.decoded._id
    }) 
    
    return res.status(200).json({success: true , messages1 : messages , messages2: messages2 })
   
}

module.exports = {
    sendMessage,
    getMessage
}