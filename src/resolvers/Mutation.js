import { v4 as uuidv4 } from 'uuid';
import { PubSub } from 'graphql-yoga';

const Mutation = {
    createUser: (_, { data }, { db }, info) => {
        const isEmailTaken = db.users.some((user) => user.email === data.email);
        if (isEmailTaken) throw new Error('User cannot be created. Email is already used.');
        const user = { id: uuidv4(), ...data };
        db.users.push(user);
        return user;
    },
    deleteUser: (_, { userId }, { db }, info) => {
        const userIndex = db.users.findIndex((user) => user.id === userId);
        if (userIndex === -1) throw new Error('User does not exist');
        db.posts = db.posts.filter((post) => {
            const isPostMatch = post.authorId === userId; // so the post belongs to the deleted user
            if (isPostMatch) { // delete comments of the about to be deleted post
                db.comments = db.comments.filter((comment) => comment.postId !== post.id)
            }
            return post.authorId !== userId; // returning posts from rest of the users
        });
        db.comments = db.comments.filter((comment) => comment.authorId !== userId); // delete comments for the deleted user
        // const deletedUsers = db.users.splice(userIndex, 1);
        const [deletedUser] = db.users.splice(userIndex, 1);
        return deletedUser;
        //return deletedUsers[0];
    },
    updateUser: (_, { userId, data }, { db }, info) => {
        const user = db.users.find((user) => user.id === userId);
        if (!user) throw new Error(`User with id: ${userId} is not found.`);
        if (typeof data.email === 'string') {
            const isEmailTaken = db.users.find((user) => user.email === data.email);
            if (isEmailTaken) throw new Error(`Email - ${data.email} is already taken.`);
            user.email = data.email;
        }
        if (typeof data.name === 'string') user.name = data.name;
        if (typeof data.age !== 'undefined') user.age = data.age;
        return user;
    },
    createPost: (_, { data }, { db, pubsub }, info) => {
        const isUserExist = db.users.some((user) => user.id === data.authorId);
        if (!isUserExist) throw new Error('Post cannot be created. No existing User.');
        const post = { id: uuidv4(), ...data };
        db.posts.push(post);
        if (post.published) pubsub.publish('POST_CHANNEL', { post: { mutation: 'CREATED', data: post } });
        return post;
    },
    deletePost: (_, { postId }, { db, pubsub }, info) => {
        const deletedPost = db.posts.find((post) => post.id === postId);
        if (!deletedPost) throw new Error(`Post with id: ${postId} is not found. No post is deleted.`);
        db.posts = db.posts.filter((post) => post.id !== postId);
        db.comments = db.comments.filter((comment) => comment.postId !== postId);
        if (deletedPost.published) pubsub.publish('POST_CHANNEL', { post: { mutation: 'DELETED', data: deletedPost } });
        return deletedPost;
    },
    updatePost: (_, { postId, data }, { db, pubsub }, info) => {
        const post = db.posts.find((post) => post.id === postId);
        const originalPost = { ...post };
        if (!post) throw new Error(`Post with id: ${postId} is not found.`);
        if (typeof data.title === 'string') post.title = data.title;
        if (typeof data.body === 'string') post.body = data.body;
        if (typeof data.published === 'boolean') {
            post.published = data.published;
            if (originalPost.published && !post.published) {
                // deleted
                pubsub.publish('POST_CHANNEL', { post: { mutation: 'DELETED', data: originalPost } });
            } else if (!originalPost.published && post.published) {
                // created
                pubsub.publish('POST_CHANNEL', { post: { mutation: 'CREATED', data: post } });
            }
        } else if (post.published) {
            // updated
            pubsub.publish('POST_CHANNEL', { post: { mutation: 'UPDATED', data: post } });
        }
        return post;
    },
    createComment: (_, { data }, { db, pubsub }, info) => {
        const isUserExist = db.users.some((user) => user.id === data.authorId);
        const isPostExist = db.posts.some((post) => post.id === data.postId && post.published);
        if (!isUserExist || !isPostExist) throw new Error('Comment cannot be created. No existing User or Post or Unpublished Post');
        const comment = { id: uuidv4(), ...data };
        db.comments.push(comment);
        pubsub.publish(`COMMENT_${comment.postId}`, { comment: { mutation: 'CREATED', data: comment } });
        return comment;
    },
    deleteComment: (_, { commentId }, { db, pubsub }, info) => {
        const deletedComment = db.comments.find((comment) => comment.id === commentId);
        if (!deletedComment) throw new Error(`Comment with id: ${commentId} is not found. No comment is deleted.`);
        db.comments = db.comments.filter((comment) => comment.id !== commentId);
        pubsub.publish(`COMMENT_${deletedComment.postId}`, { comment: { mutation: 'DELETED', data: deletedComment } });
        return deletedComment;
    },
    updateComment: (_, { commentId, data }, { db, pubsub }, info) => {
        const comment = db.comments.find((comment) => comment.id === commentId);
        if (!comment) throw new Error(`Comment with id: ${commentId} is not found.`);
        if (typeof data.text === 'string') comment.text = data.text;
        pubsub.publish(`COMMENT_${comment.postId}`, { comment: { mutation: 'UPDATED', data: comment } });
        return comment;
    }
};

export { Mutation as default };