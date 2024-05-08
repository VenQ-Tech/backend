const crypto =  require('crypto');
const axios = require('axios');
const salt_key='34c60661-def9-40a8-a2a0-6283eb261070';
const newPayment = async (req, res) => {
    try {
        const merchantTransactionId = 'T'+Date.now();
        const data = {
            merchantId: 'VENQONLINE',
            merchantTransactionId: 'T'+Date.now(),
            merchantUserId: "MUID" + Date.now(),
            amount: 1,
            redirectUrl: `https://venq-server.onrender.com/phonepe/status/${merchantTransactionId}`,
            redirectMode: 'POST',
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + salt_key;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        const prod_URL = "  https://api.phonepe.com/apis/hermes/pg/v1/pay"
        console.log(checksum);
        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        await axios.request(options).then(function (response) {
            console.log('in payment method');
            console.log(response.data);
            console.log('----');
            return res.json({url:response.data.data.instrumentResponse.redirectInfo.url});
        })
        .catch(function (error) {
            console.error(error);
        });

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        })
    }
}

const checkStatus = async(req, res) => {
    console.log('---------------------');
    console.log('in check status');
    console.log(res.req.body);
    console.log('below is res');
    console.log(res);
    console.log('my name is aryan');
    const merchantTransactionId = res.req.body.transactionId
    const merchantId = res.req.body.merchantId

    console.log('ids niche hai');
    console.log(merchantTransactionId);
    console.log(merchantId);

    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;

    const options = {
    method: 'GET',
    url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
    headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': `${merchantId}`
    }
    };

    // CHECK PAYMENT TATUS
    axios.request(options).then(async(response) => {
        console.log(response.data);
        if (response.data.success === true) {
            console.log('payment sucessful');
            const url = `https://www.venq.in/dashboard/portfolio`
            return res.redirect(url)
        } else {
            console.log('payment failed');
            const url = `https://www.venq.in/`
            return res.redirect(url)
        }
    })
    .catch((error) => {
        console.error(error);
    });
};

module.exports = {
    newPayment,
    checkStatus
}
