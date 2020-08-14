const User = {
    posts: (_, args, { db }, info) => db.posts.filter((post) => post.authorId === _.id),
    comments: (_, args, { db }, info) => db.comments.filter((comment) => comment.authorId === _.id)
};

export { User as default };