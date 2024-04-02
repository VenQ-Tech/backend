const axios=require('axios');

const getAllBlogs=async(req,res)=>{
    try {

      const headers = {
        'Authorization': `Bearer v02%3Auser_token_or_cookies%3AOwf6khWTFTNpNG6zYR8xK3r2NveaTbpZ9F1enCBGyb5LtLFmZt7gib_NZXc6wZoVRZhu-1jcUMAkUFvGGx4W2XfDdTPZ3csms_XofP9Ha3aRZRjmTH4-0w-suL3IS1xRgKJL`
    }
        const blogData = await axios.get(
            "https://notion-api.splitbee.io/v1/table/6d92e7dc95304d4ab2791683db7363a1"
          ,{
            headers:headers
          }
          );
          // console.log(blogData.data[0].Cover[0].url);
          if(blogData){
            // console.log(blogData.data);
            res.status(200).send({
                sucess:true,
                data:blogData.data
            })
          }else{
            res.status(200).send({
                sucess:false,
                data:undefined
            })
          }
    } catch (error) {
        console.log(error);
    }
}
const getSingleBlog=async(req,res)=>{
    try {
      const bid=req.params.id;
      console.log(bid);
      const headers = {
        'Authorization': `Bearer v02%3Auser_token_or_cookies%3AOwf6khWTFTNpNG6zYR8xK3r2NveaTbpZ9F1enCBGyb5LtLFmZt7gib_NZXc6wZoVRZhu-1jcUMAkUFvGGx4W2XfDdTPZ3csms_XofP9Ha3aRZRjmTH4-0w-suL3IS1xRgKJL`
    }
        const blogData = await axios.get(
            `https://notion-api.splitbee.io/v1/page/${bid}`
          // ,{
          //   headers:headers
          // }
          );
          // console.log(blogData.data);
          if(blogData){
            // console.log(blogData.data);
            return res.json(blogData.data);
            res.status(200).send({
                sucess:true,
                data:blogData
            })
          }else{
            res.status(200).send({
                sucess:false,
                data:undefined
            })
          }
    } catch (error) {
        console.log(error.message);
    }
}
module.exports={getAllBlogs,getSingleBlog}