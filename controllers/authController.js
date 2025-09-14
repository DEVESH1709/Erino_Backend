const User  = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async(req,res)=>{
    const {email,password} = req.body;

    try{
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: 'User already exists'});
        }

        const hashed = await bcrypt.hash(password,10);
        user = new User({email,password: hashed});
        await user.save();
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn:'1d'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none'
        });
        res.status(201).json({email: user.email, id: user._id});
    } catch(error){
        res.status(500).json({message: 'Server error'});
    }
}

exports.login = async(req,res)=>{
    const {email,password}= req.body;
try{
    const user = await User.findOne({email});
    if(!user){
        return res.status(401).json({message:'Invalid Credentials'});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(401).json({message:'Invalid Credentials'});
    }

    const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{expiresIn :'1d'});
    res.cookie('token',token,{
        httpOnly:true,
        secure:process.NODE_ENV === 'production',
        sameSite:'none'
    });
    res.status(200).json({ email: user.email, id: user._id });
}catch(error){
    res.status(500).json({message:'Server error'})
}
};

exports.logout = (req,res)=>{
    res.clearCookie('token');
    res.status(200).json({message :'Log Out'});
}

exports.getCurrentUser = async(req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        if(!user){
return res.status (404).json({message:"No user found"});
        }
        res.status(200).json({email: user.email, id: user._id});
    } catch(error) {
        res.status(500).json({message: "Server error"});
    }
};