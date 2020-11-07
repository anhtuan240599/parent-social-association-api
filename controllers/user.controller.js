const User = require('../model/User')

const index = async (req,res,next) => {
   try {
    const users = await User.find({})
    return res.status(200).json({users})
   } catch (error) {
       next(error)
   }

}

const newUser = async (req,res,next) => {
   
    const newUser = new User(req.body)
  
    await newUser.save()

    return res.status(201).json({user : newUser})
  
}

module.exports = {
    index,
    newUser
}