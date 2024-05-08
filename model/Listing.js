const mongoose = require('mongoose');

const SpecsSchema = new mongoose.Schema({
    specsimage: {
        type: String,
        trim: true,
    },
    specstitle: {
        type: String,
        trim: true,
    },
    specssubtitle: {
        type: String,
        trim: true,
    }
});

const FundingSchema = new mongoose.Schema({
    fundingtitle: {
        type: String,
        trim: true,
    },
    fundingsubtitle: {
        type: String,
        trim: true,
    },
    fundingdescription: {
        type: String,
        trim: true,
    }
});

const DocumentSchema = new mongoose.Schema({
    dname: {
        type: String,
        trim: true,
        // required: true,
    },
    dlink: {
        type: String,
        trim: true,
        // required: true,
    },
});

const AmenitySchema = new mongoose.Schema({
    aname: {
        type: String,
        trim: true,
        // required: true,
    },
    alink: {
        type: String,
        trim: true,
        // required: true,
    },
});

const ListingSchema = new mongoose.Schema({
    images: {
        type: Array,
        // type:String
    },
    tourlink:{
        type:String
    },
    properyheading:{
        type:String
    },
    propertydescription:{
        type:String
    },
    specs: {
        type:Array
    },
    propertyprice: {
        type: String,
    },
    annualizedreturn: {
        type: String,
        trim: true,
    },
    annualappreciation: {
        type: String,
        trim: true,
    },
    grossyield: {
        type: String,
        trim: true,
    },
    netyield: {
        type: String,
        trim: true,
    },
    propertyoverview: {
        type: String,
        trim: true,
    },
    propertypricen: {
        type: String,
    },
    transactioncost: {
        type: String,
    },
    venqfee: {
        type: String,
    },
    projectedgrossrent: {
        type: String,
    },
    maintainencefee: {
        type: String,
    },
    servicecharges: {
        type: String,
    },
    annualnetincome: {
        type: String,
    },
    fundtimeline:{
        type:Array
    },

    locationlink: {
        type: String,
        trim: true,
    },
    locationdescription: {
        type: String,
        trim: true,
    },
    amenities:{
        type:Array
    },
    documents:{
        type:Array
    },
    fundingdate:{
        type:String
    },
    mininvestment:{
        type:String
    },
    islive:{
        type:Number,
        default:0
    }
    
});

module.exports = mongoose.model('Listing', ListingSchema);