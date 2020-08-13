import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

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
    }
];

const posts = [
    {
        id: 'post-id-1',
        title: 'post-title-1',
        body: 'post-body-1',
        published: false,
        authorId: 'user-id-2'
    },
    {
        id: 'post-id-2',
        title: 'post-title-2',
        body: 'post-body-2',
        published: true,
        authorId: 'user-id-1'
    },
    {
        id: 'post-id-3',
        title: 'post-title-3',
        body: 'post-body-3',
        published: false,
        authorId: 'user-id-2'
    }
];

const comments = [
    {
        id: 'comment-id-1',
        text: 'comment-text-1',
        authorId: 'user-id-3',
        postId: 'post-id-2'
    },
    {
        id: 'comment-id-2',
        text: 'comment-text-2',
        authorId: 'user-id-3',
        postId: 'post-id-2'
    },
    {
        id: 'comment-id-3',
        text: 'comment-text-3',
        authorId: 'user-id-1',
        postId: 'post-id-1'
    },
    {
        id: 'comment-id-4',
        text: 'comment-text-4',
        authorId: 'user-id-3',
        postId: 'post-id-1'
    }
];

const typeDefs = `
    type Query {
        users(search: String): [User!]!
        posts(search: String): [Post!]!
        comments: [Comment!]!
    }

    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        createPost(title: String!, body: String!, published: Boolean!, authorId: ID!): Post!
        createComment(text: String!, authorId: ID!, postId: ID!): Comment!
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
    Mutation: {
        createUser: (_, { name, email, age }, context, info) => {
            const isEmailTaken = users.some((user) => user.email === email);
            if (isEmailTaken) throw new Error('User cannot be created. Email is already used.');
            const user = { id: uuidv4(), name, email, age };
            users.push(user);
            return user;
        },
        createPost: (_, { title, body, published, authorId }, context, info) => {
            const isUserExist = users.some((user) => user.id === authorId);
            if (!isUserExist) throw new Error('Post cannot be created. No existing User.');
            const post = { id: uuidv4(), title, body, published, authorId };
            posts.push(post);
            return post;
        },
        createComment: (_, { text, authorId, postId }, context, info) => {
            const isUserExist = users.some((user) => user.id === authorId);
            const isPostExist = posts.some((post) => post.id === postId && post.published);
            console.log('isPostExist--', isPostExist)
            if (!isUserExist || !isPostExist) throw new Error('Comment cannot be created. No existing User or Post or Unpublished Post');
            const comment = { id: uuidv4(), text, authorId, postId };
            comments.push(comment);
            return comment;
        }
    },
    User: {
        posts: (_, args, context, info) => posts.filter((post) => post.authorId === _.id),
        comments: (_, args, context, info) => comments.filter((comment) => comment.authorId === _.id)
    },
    Post: {
        author: (_, args, context, info) => users.find((user) => user.id === _.authorId),
        comments: (_, args, context, info) => comments.filter((comment) => comment.postId === _.id)
    },
    Comment: {
        author: (_, args, context, info) => users.find((user) => user.id === _.authorId),
        post: (_, args, context, info) => posts.find((post) => post.id === _.postId)
    }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log(`Server is running on localhost:4000`));