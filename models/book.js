const mongoose = require('mongoose');

const Schema = mongoose.Schema;


// We don't need to add id to the book schema - because MongoDB automatically creates
// a new ID for each new entry
const bookSchema = new Schema({
    name: String,
    genre: String,
    authorId: String
});

module.exports = mongoose.model('Book', bookSchema);