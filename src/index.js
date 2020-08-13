import { GraphQLServer } from 'graphql-yoga';

const users = [
    {
        id: 'user-id-1',
        name: 'user-name-1',
        email: 'user-email-1@example.com',
        age: 30
    },
    {
        id: 'user-id-2',
        name: 'user-name-2',
        email: 'user-email-2@example.com',
        age: 31
    },
    {
        id: 'user-id-3',
        name: 'user-name-3',
        email: 'user-email-3@example.com',
        age: 32
    },

];

const posts = [
    {
        id: 'post-id-1',
        title: 'post-title-1',
        body: 'post-body-1',
        published: false,
        author: 'user-id-2'
    },
    {
        id: 'post-id-2',
        title: 'post-title-2',
        body: 'post-body-2',
        published: true,
        author: 'user-id-1'
    },
    {
        id: 'post-id-3',
        title: 'post-title-3',
        body: 'post-body-3',
        published: false,
        author: 'user-id-2'
    }
];

const comments = [
    {
        id: 'comment-id-1',
        text: 'comment-text-1',
        author: 'user-id-3',
        post: 'post-id-2'
    },
    {
        id: 'comment-id-2',
        text: 'comment-text-2',
        author: 'user-id-3',
        post: 'post-id-2'
    },
    {
        id: 'comment-id-3',
        text: 'comment-text-3',
        author: 'user-id-1',
        post: 'post-id-1'
    },
    {
        id: 'comment-id-4',
        text: 'comment-text-4',
        author: 'user-id-3',
        post: 'post-id-1'
    }
];

const typeDefs = `
    type Query {
        users(search: String): [User!]!
        posts(search: String): [Post!]!
        comments: [Comment!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`;

const resolvers = {
    Query: {
        users: (_, { search }, context, info) => !search ? users :
            users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase())),
        posts: (_, { search }, context, info) => !search ? posts :
            posts.filter((post) => post.title.toLowerCase().includes(search.toLowerCase()) ||
                post.body.toLowerCase().includes(search.toLowerCase())),
        comments: (_, { search }, context, info) => comments
    },
    User: {
        posts: (_, args, context, info) => posts.filter((post) => post.author === _.id),
        comments: (_, args, context, info) => comments.filter((comment) => comment.author === _.id)
    },
    Post: {
        author: (_, args, context, info) => users.find((user) => user.id === _.author),
        comments: (_, args, context, info) => comments.filter((comment) => comment.post === _.id)
    },
    Comment: {
        author: (_, args, context, info) => users.find((user) => user.id === _.author),
        post: (_, args, context, info) => posts.find((post) => post.id === _.post)
    }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log(`Server is running on localhost:4000`));