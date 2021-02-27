const Message = require('../model/Message')
const User = require('../model/User')
const cloudinary = require('../middlewares/cloudinary')
const Room = require('../model/Room')

const createRoom = async (req,res, next) => {
    const room = req.body
    room.admin = req.decoded._id
    const name = req.body.name
    const foundName = await Room.findOne({ name })
    if (foundName) {
        return res.status(403).json({ error : {message : "ten phong da co nguoi su dung"}})
    }
    const newRoom = new Room(room)
    const foundUser = await User.findOne({_id : req.decoded._id})
    
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path)
        review.image = result.secure_url
    }
    await newRoom.save()

    foundUser.rooms.push(newRoom._id)
    await foundUser.save()

    return res.status(200).json({ success : true , room : room})
    
}

const addUser = async (req,res,next) => {
    const phone = req.body.phone
    const room = await Room.findOne({ _id: req.params.roomID })
    const foundUser = await User.findOne({ phone : phone  })
    if (foundUser)
    {
        if (foundUser.rooms.indexOf(room._id) > -1){
            return res.status(200).json({message: " nguoi dung da o trong room "})
        } else {
        room.users.push(foundUser._id)
        await room.save()
        foundUser.rooms.push(room._id)
        await foundUser.save()
        return res.status(200).json({success:true, room : foundUser})
        }
    } else {
        return res.status(200).json({message: " khong tim thay so dien thoai nay"})
    }


}

module.exports = {
    createRoom,
    addUser
}