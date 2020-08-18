const express = require('express');

// graphqlHTTP will allow express to create an express-server that runs the graphql API
const graphqlHTTP = require('express-graphql');

const schema = require('./schema/schema');

const cors = require('cors');

const API_PORT = process.env.PORT || 4001;

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


// ---------------
// Authentication!
// ---------------
// // 1.
// verifyDomain(request, 'https://distracted-hoover-5f4263.netlify.app/');

// // 2. Get the user identification data from the request
// var user;
// const email = getDataFromRequest(request, 'email'); // $json['email']
// var token = getDataFromRequest(request, 'token'); // $json['token']

// // 3. Get the user data by the token/tokenId and email. (or create the user if doesn't exist)
// if (token) {
//     try {
//         // verify email + token with local DB. If failed, throw
//         user = verifyUser(email, token);
//     } catch (error) {
//         throw "500, user not found or a cyber attack";
//     }
// } else {
//     // Token was not found, check for tokenId:

//     token = getDataFromRequest(request, 'tokenId'); // $json['tokenId']
//     const userData = getUserDetailsFromGoogle('https://oauth2.googleapis.com/tokeninfo?id_token=' + token); // $user_data = file_get_contents($url);

//     user = getUser(userData, token);
//     if (!user) {
//         user = createUserInDB(userData, token);
//     }
// }

// // 4. Generate a new token for the user
// const revivedToken = regenerateUserToken(user); // auth()->setTTL(3600 * 24 * 30)->tokenById($user->id);

// // 5.
// returnTokenWithResponse(revivedToken); // !!!
// ------------------
// Authentication End
// ------------------



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
// app.listen(4000, () => {
//     console.log('now listening for requests on port 4000');
// });

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
