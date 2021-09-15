const mongoose = require('mongoose');

// Department - Comp ,  IT , ENTC, ANY
const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 50,
        unique: true
    },

}, 
    {timestamps: true}
);


module.exports = mongoose.model("Department", departmentSchema);