const mongoose = require('mongoose');

const Schema = mongoose.Schema;


// We don't need to add id to the book schema - because MongoDB automatically creates
// a new ID for each new entry
const userSchema = new Schema({
    name: String,
    email: String,
    boughtBooks: [String]
});

module.exports = mongoose.model('User', userSchema);