const axios=require('axios');
const sendaadharotp=async(req,res)=>{
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUREPASS_TOKEN}`
        }
        const result=await axios.post('https://kyc-api.surepass.io/api/v1/aadhaar-v2/generate-otp',{
            id_number:  req.body.aadharno
        },{
            headers:headers
        });
        console.log('here---------------------');

        if(result){
            console.log(result.data.data);
             res.status(200).send({
                success: true,
                data: result.data,
            })
        }else{
            console.log('invalid data');
             res.status(200).send({
                success: false,
                data: result.data,
            })
        }

    } catch (error) {
        console.log('error')
        console.log(error.message)
		res.status(500).send({
			success: false,
			error: error,
		})
    }
}
const getpandetails=async(req,res)=>{
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUREPASS_TOKEN}`
        }
        const result=await axios.post('https://kyc-api.surepass.io/api/v1/pan/pan-comprehensive',{
            id_number:  req.body.panno
        },{
            headers:headers
        });
        console.log('here---------------------');

        if(result){
            console.log(result.data.data);
             res.status(200).send({
                success: true,
                data: result.data,
            })
        }else{
            console.log('invalid data');
             res.status(200).send({
                success: false,
                data: result.data,
            })
        }

    } catch (error) {
        console.log('error')
        console.log(error.message)
		res.status(500).send({
			success: false,
			error: error,
		})
    }
}

const checkaadharotp=async(req,res)=>{
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUREPASS_TOKEN}`
        }
        const dts={
            client_id:req.body.cid,
            otp: req.body.otp
        }
        console.log(dts);
        const result=await axios.post('https://kyc-api.surepass.io/api/v1/aadhaar-v2/submit-otp',dts,{
            headers:headers
        });
        console.log('here---------------------');

        if(result){
            console.log(result.data.data);
            return res.status(200).send({
                success: true,
                data: result.data,
            })
        }else{
            console.log('invalid data');
            return res.status(200).send({
                success: false,
                data: result.data,
            })
        }

    } catch (error) {
        console.log('error')
        console.log(error.message)
		res.status(500).send({
			success: false,
			error: error,
		})
    }
}

const initialiseesign=async(req,res)=>{
    try {
        const {name,phone,email}=req.body;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUREPASS_TOKEN}`
        }
        const result=await axios.post('https://kyc-api.surepass.io/api/v1/esign/initialize',{
            pdf_pre_uploaded: true,
            callback_url: "https://example.com?state=test",
            config: {
                accept_selfie: true,
                allow_selfie_upload: true,
                accept_virtual_sign: true,
                track_location: true,
                auth_mode: 1,
                reason: "Contract",
                positions: {
                    1: [
                        {
                            "x": 10,
                            "y": 20
                        }
                    ]
                    
                }
            },
            prefill_options: {
                full_name: name,
                mobile_number: phone,
                user_email: email
            }
        },{headers:headers});
        if(result){
            console.log(result.data);
            res.status(200).send({
                success: true,
                data: result.data,
            })

        }else{
            console.log('gadbad');
            console.log(result.data);
            res.status(200).send({
                success: false,
                data: result.data,
            })

        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
			success: false,
			error: error,
		})
    }
}

const getUploadlink=async(req,res)=>{
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUREPASS_TOKEN}`
        }
        const result=await axios.post('https://kyc-api.surepass.io/api/v1/esign/get-upload-link',{
            client_id:  req.body.clientid
        },{
            headers:headers
        });
        if(result){
            console.log(result.data);
            res.status(200).send({
                success: true,
                data: result.data,
            })
        }else{
            console.log('invalid data');
            res.status(200).send({
                success: false,
                data: result.data,
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
			success: false,
			error: error,
		})
    }
}

const getSignedDocument=async(req,res)=>{
    try {
        const {cid}=req.body;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUREPASS_TOKEN}`
        }
        const result=await axios.get(`https://kyc-api.surepass.io/api/v1/esign/get-signed-document/${cid}`,null,{
            headers:headers
        });
        console.log('here');

        if(result){
            console.log(result.data);
            res.status(200).send({
                success: true,
                data: result.data,
            })
        }else{
            console.log('invalid data');
            res.status(200).send({
                success: false,
                data: result.data,
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
			success: false,
			error: error,
		})
    }
}

const uploadDocument=async(req,res)=>{
    try {
        // const result=await axios.post(`${req.body.url}`,{req.body.fields});

    } catch (error) {
        console.log(error);
    }
}

module.exports={sendaadharotp,checkaadharotp,initialiseesign,getUploadlink,getpandetails}