const Comment = {
    author: (_, args, { db }, info) => db.users.find((user) => user.id === _.authorId),
    post: (_, args, { db }, info) => db.posts.find((post) => post.id === _.postId)
};

export { Comment as default };