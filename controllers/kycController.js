const kycModel=require('../model/Kyc');
const addkyc=async(req,res)=>{
    try {
        const result=await kycModel.create(req.body);
        if(result){
            res.status(201).json({
                message:'successful'
            });
        }else{
            console.log('listing creation failed');
        }
    } catch (error) {
        console.log(error);
    }
}

const getkyc=async(req,res)=>{
    try {
        const result=await kycModel.findOne({email:req.params.id});
        if(result){
            res.status(201).json({
                message:'successful',
                data:result
            });
        }else{
            console.log('kyc find failed');
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports={addkyc,getkyc}