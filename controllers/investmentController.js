const investmentModel=require('../model/Investment');
const addinvestment=async(req,res)=>{
    try {
        const result=await investmentModel.create(req.body);
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

const getAllInvestments=async (req, res) => {
    try {
      const invetments = await investmentModel.find();
      // console.log('Fetched invetments:', invetments); // Add this line to log the fetched invetments
      res.json(invetments);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  const getCartItems=async (req, res) => {
    try {
      const user = req.params.id;
      const investments = await investmentModel.find({
        email:user,
        isCompleted:false
      });
      if (!investments) {
        return res.status(200).json({ message: "No investment" });
      }
      let tot=0;
      investments.map((elem)=>{
        tot+=elem.amount;
      })
      res.send({all:investments,allv:tot});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error"});
  }
  }

  const removeCartItem=async(req,res)=>{
    try {
      const user=req.params.id;
      const itemid=req.body.iid;
      const td=await investmentModel.findOne({
        property:itemid,
        email:user
      });
      console.log(td);
      const ack=await investmentModel.findOneAndDelete({
        property:itemid,
        email:user
      });
      if(ack){
        console.log(ack);
        console.log('item removed');
        res.status(200).send({
          success:true,
          message:'removed'
        })
      }else{
        console.log('failed');
        res.status(400).send({
          success:false,
          message:'removed'
        })
      }

    } catch (error) {
      console.log(error);
    }
  }

module.exports={addinvestment,getAllInvestments,getCartItems,removeCartItem}