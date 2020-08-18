const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');
const User = require('../models/user');


const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

// dummy data
// var books = [
//     { name: "suka1", genre: 'blat1', id: '1', authorId: "1" },
//     { name: "suka2", genre: 'blat2', id: '2', authorId: "2" },
//     { name: "suka3", genre: 'blat3', id: '3', authorId: "3" },
//     { name: "suka4", genre: 'blat4', id: '4', authorId: "2" },
//     { name: "suka5", genre: 'blat5', id: '5', authorId: "3" },
//     { name: "suka6", genre: 'blat6', id: '6', authorId: "3" }
// ];

// var authors = [
//     { name: "nahui author1", age: 50, id: '1' },
//     { name: "nahui author2", age: 70, id: '2' },
//     { name: "nahui author3", age: 55, id: '3' }
// ];

// *fields is a function that return an object
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                console.log(args);
                console.log(parent);
                // return _.find(authors, { id: parent.authorId });
                return Author.findById(parent.authorId);
            }
        }
    })
});

// *fields is a function that return an object
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return _.filter(books, { authorId: parent.id });
                return Book.find({ authorId: parent.id });
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find().where('_id').in(parent.boughtBooks).exec((err, boughtBooks) => {});
                // return await Book.find().where('_id').in(parent.boughtBooks).exec();
            }
        }
    })
});

// book means: that when the client sends a request to get book -
// we'll get him an object of type: BookType, and it needs arguments (to determine which book it is).
// And the request from the client will look like this:
// book(id: '123') {
//   name
//   genre   
// }
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // resolve is called once the data returns from the query
                // code to get data from db / other source 

                // * parent will come into play when we define relationshipts between data
                //   args is the args the we got in the line above it. - and we can access it like: args.id
                //   We'll use args to find the book

                // console.log(typeof(args.id));
                console.log(args);
                console.log(parent);
                // return _.find(books, { id: args.id });

                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // resolve is called once the data returns from the query
                // code to get data from db / other source 

                // * parent will come into play when we define relationshipts between data
                //   args is the args the we got in the line above it. - and we can access it like: args.id
                //   We'll use args to find the book

                console.log(typeof (args.id));
                // return _.find(authors, { id: args.id });
                return Author.findById(args.id);
            }
        },
        user: { 
            type: UserType,
            args: { email: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parent, args) {
                console.log(args.email);
                return User.findOne({ email: args.email });
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books;
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors;
                return Author.find({});
            }
        }
    }
});


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });

                // Saves the new author schema object to the database!
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });

                return book.save();
            }
        },
        addUser: {
            type: UserType,
            args: { 
                name: {type : new GraphQLNonNull(GraphQLString)},
                email: {type : new GraphQLNonNull(GraphQLString)},
                // boughtBooks: { type : new GraphQLList(GraphQLID)},
            },
            resolve(parent, args)  {
                let user = new User({
                    name: args.name,
                    email: args.email,
                    boughtBooks: []
                });

                return user.save();
            }
        },
        buyBook: {
            type: UserType,
            args: { 
                email: {type : new GraphQLNonNull(GraphQLString)},
                book_id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args)  {
                console.log("the suka email is: " + args.email);
                console.log("the suka book_id is: " + args.book_id);
                return User.findOneAndUpdate({email: args.email}, {$push: {boughtBooks: args.book_id}});
                // const user = User.findOne({email: args.email}, function(err,obj) { console.log(obj); });
                // user.boughtBooks.push(book_id);
                // console.log("the suka boughtBooks are: " + user.boughtBooks);
                // return user.save(function(err, result) { console.log(result); });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});