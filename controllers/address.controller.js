const Address = require('../model/Address')
const User = require('../model/User')
const axios = require('axios')

const getAddress = async (req,res,next) => {
    let address = await Address.find({ user:req.decoded._id })
    
    return res.status(200).json({success:true, address:address })
}

const postAddress =  async (req,res,next) => {
    let address = new Address();
    address.user = req.decoded._id;
    address.country = req.body.country;
    address.fullName = req.body.fullName;
    address.city = req.body.city;

    await address.save();
    return res.status(200).json({success:true})
}

const getCountry = async (req,res,next) => {
    let response = await axios.get("https://restcountries.eu/rest/v2/all")

    return res.status(200).json(response.data)
}

const getOneAddress = async (req,res,next) => {
    let address = await Address.findOne({ _id: req.params.id })

    return res.status(200).json({success:true,address:address})
}

const putOneAddress = async (req,res,next) => {
    let foundAddress = await Address.findOne({ user: req.decoded._id, _id:req.params.id })
    if (foundAddress)
    {   
        if(req.body.country){
        foundAddress.country = req.body.country;
        }
        if(req.body.fullName) {
        foundAddress.fullName = req.body.fullName;
        }
        if(req.body.city) {
        foundAddress.city = req.body.city;
        }
        await foundAddress.save()
        return res.status(200).json({success:true})
    }
    
}

const deleteOneAddress = async (req,res,next) => {
    let deleteAddress = await Address.remove({ user: req.decoded._id , _id: req.params.id })
    if(deleteAddress)
    {
        return res.status(200).json({success:true})
    }
}

const setDefaultAddress = async (req,res,next) => {
    const setDefault = await User.findOneAndUpdate(
        {_id: req.decoded._id},
        {$set : {address:req.body.id}}
    )
    if(setDefault) {
        return res.status(200).json({success:true,message:"Set as default successfully !"})
    }
}



module.exports = {
    postAddress,
    getAddress,
    getCountry,
    putOneAddress,
    deleteOneAddress,
    setDefaultAddress,
    getOneAddress
}

