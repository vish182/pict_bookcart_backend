const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;
const crypto = require('crypto');
const {v1: uuidv1, v1} = require('uuid');
const { truncate } = require('fs');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 70,
        unique: true
    },

    description: {
        type: String,
        required: true,
        maxlength: 2000,

    },

    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32,
        
    },

    category: {
        type: ObjectId,
        ref: 'Category',
        required: true,
        
    },

    department: {
        type: ObjectId,
        ref: 'Department',
        required: true,
        
    },

    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    // quantity: {
    //     type: Number,
    // },

    // sold:{
    //     type: Number,
    //     default: 0
    // },

    photo1: {
        data: Buffer,
        contentType: String
    },

    photo2: {
        data: Buffer,
        contentType: String
    },

    photo3: {
        data: Buffer,
        contentType: String
    },

    photo3: {
        data: Buffer,
        contentType: String
    },

    // shipping: {
    //     type: Boolean,
    //     required: false,
    // },

    // details: {},

}, 
    {timestamps: true}
);


module.exports = mongoose.model("Product", productSchema);