const Lead = require('../models/Lead');
const buildFilters = require('../utils/filter');


exports.createLead = async (req,res)=>{
    try{
        const lead  = new Lead(req.body);
        await lead.save();
        res.status(201).json(lead);
    }
    catch(error){
        res.status(500).json({message:"Error creating lead"});
    }
};


exports.getLeads = async(req,res)=>{
    try{
        const page = parseInt(req.query.page)||1;
        const limit  = Math.min(parseInt(req.query.limit)||20,100);
        const filters = buildFilters(req.query);
        const total = await Lead.countDocuments(filters);
        const totalPages = Math.ceil(total/limit);
        const leads = await Lead.find(filters)
        .sort({created_at :-1})
        .skip((page-1)*limit)
         .limit(limit);
        res.status(200).json({data:leads, page,limit, total,totalPages});
    }catch(error){
         console.error(error);
        res.status(500).json({message:'Error fetching leads'});
    };
}


exports.getLeadById = async(req,res)=>{
    try{
        const lead = await Lead.findById(req.params.id);
        if(!lead){
            return res.status(400).json({message:'Lead not found'});
        }
        res.status(200).json(lead);
    }catch(error){
        res.status(500).json({message:'Error fetching lead'});
    }
};

exports.updateLead = async (req,res)=>{
    try{
        const lead = await Lead.finallyIdAndUpdate(req.params.id,req.body,{new:true});
        if(!lead){
            return res.status(401).json({message:'Lead not found'});
        }
        res.status(200).json(lead);
    }
    catch (error){
                res.status(500).json({message:'Error updating lead'})
    }
       
};

exports.deleteLead = async (req,res)=>{
    try{
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if(!lead){
            return res.status(404).json({message:'Lead not found'});
        }
        res.status(204).send();
    }catch(error){
        res.status(500).json({message:"Error deleting lead"});
    }
}