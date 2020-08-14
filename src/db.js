const users = [
    {
        id: 'alexa-user',
        name: 'Alexa Amazon',
        email: 'alexa@example.com',
        age: 30
    },
    {
        id: 'bimal-user',
        name: 'Bimal PanParag',
        email: 'bimal@example.com',
        age: 31
    },
    {
        id: 'chota-user',
        name: 'Chota Chetan',
        email: 'chota@example.com',
        age: 32
    }
];

const posts = [
    {
        id: 'post-1',
        title: 'post 1 from chota',
        body: 'post body 1 from chota',
        published: true,
        authorId: 'chota-user'
    },
    {
        id: 'post-2',
        title: 'post 2 from bimal',
        body: 'post body 2 from bimal',
        published: true,
        authorId: 'bimal-user'
    },
    {
        id: 'post-3',
        title: 'post 3 from alexa',
        body: 'post body 3 from alexa',
        published: true,
        authorId: 'alexa-user'
    },
    {
        id: 'post-4',
        title: 'post 4 from chota',
        body: 'post body 4 from chota',
        published: false,
        authorId: 'chota-user'
    }
];

const comments = [
    {
        id: 'comment-1',
        text: 'comment text from alexa on post 1',
        authorId: 'alexa-user',
        postId: 'post-1'
    },
    {
        id: 'comment-2',
        text: 'comment text from alexa on post 1',
        authorId: 'alexa-user',
        postId: 'post-1'
    },
    {
        id: 'comment-3',
        text: 'comment text from bimal on post 1',
        authorId: 'bimal-user',
        postId: 'post-1'
    },
    {
        id: 'comment-4',
        text: 'comment text from chota on post 2',
        authorId: 'chota-user',
        postId: 'post-2'
    }
];

const db = { users, posts, comments };
export { db as default };