const Query = {
    users: (_, { search }, { db }, info) => !search ? db.users :
        db.users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase())),
    posts: (_, { search }, { db }, info) => !search ? db.posts :
        db.posts.filter((post) => post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.body.toLowerCase().includes(search.toLowerCase())),
    comments: (_, args, { db }, info) => db.comments
}

export { Query as default };