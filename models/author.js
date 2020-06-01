const mongoose = require('mongoose');

const Schema = mongoose.Schema;


// We don't need to add id to the book schema - because MongoDB automatically creates
// a new ID for each new entry
const authorSchema = new Schema({
    name: String,
    age: Number
});

module.exports = mongoose.model('Author', authorSchema);