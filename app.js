const express = require('express');

// graphqlHTTP will allow express to create an express-server that runs the graphql API
const graphqlHTTP = require('express-graphql');

const schema = require('./schema/schema');

const cors = require('cors');

// The express() function creates our app
const app = express();

// Allow cross-origin requests
app.use(cors());

const mongoose = require('mongoose');
// Connect to MongoDB
const connectionString = "mongodb+srv://sharp7:fh2s@df48pa@cluster0-uil32.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open', () => {
    console.log("Connected to mongoDB you cunt");
});



// The funciton: graphqlHTTP will be fired whenever a request to '/graphql' comes in:
// schema: schema is the same as: schema.
// This schema is for defining our graph (graphql),
// But The schemas that we'll create for MongoDB are for data that will be stored in our DB
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));


// Tell our app to listen to port 4000,
// When our app begins to listen on that port - the callback is going to fire
app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});