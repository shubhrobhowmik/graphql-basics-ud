const Post = {
    author: (_, args, { db }, info) => db.users.find((user) => user.id === _.authorId),
    comments: (_, args, { db }, info) => db.comments.filter((comment) => comment.postId === _.id)
};

export { Post as default};