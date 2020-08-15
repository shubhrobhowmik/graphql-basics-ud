const Subscription = {
    // count: {
    //     subscribe: (_, args, { pubsub }, info) => {
    //         let count = 0;
    //         setInterval(() => {
    //             count++;
    //             pubsub.publish('count', { count });
    //         }, 1000)
    //         return pubsub.asyncIterator('count');
    //     }
    // },
    comment: {
        subscribe: (_, { postId }, { db, pubsub }, info) => {
            const post = db.posts.find((post) => post.id === postId && post.published);
            if (!post) throw new Error(`Post with id: ${postId} is not found.`);
            return pubsub.asyncIterator(`COMMENT_${postId}`);
        }
    },
    post : {
        subscribe: (_, args, { pubsub }, info) => {
            return pubsub.asyncIterator('POST_CHANNEL');
        }
    }
};

export { Subscription as default };