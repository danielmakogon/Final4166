const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    title: {type: String},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    content: {type: String},
    catagory: {type: String},
    date: {type: Date},
    startTime: {type: String},
    endTime: {type: String},
    rsvps: [{type: String, default: ''}]
},
{timestamps: true}
);


module.exports = mongoose.model('Connection', connectionSchema);
