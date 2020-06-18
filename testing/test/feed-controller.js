// Tests
const { expect, assert } = require('chai');
const sinon = require('sinon');
// Packages
const mongoose = require('mongoose');
const io = require('../socket');

// Controller
const FeedController = require('../controllers/feed');
// Models
const User = require('../models/user');

const userId = '5ee69b7c54874a05e76ab01a';

describe('Feed Controller', () => {
    before(async () => {
        await mongoose
            .connect(
                'mongodb+srv://Diogo:asdzxc@cluster0-fnsz5.mongodb.net/test-message?retryWrites=true&w=majority'
            );
        user = new User({
            email: 'user@user.com',
            name: 'user',
            password: 'pass',
            posts: [],
            _id: userId
        });
        await user.save();
    });

    describe('CreatePost', () => {
        it('should add a post to the post of the user', async () => {
            const req = {
                body: {
                    title: 'The test post',
                    content: 'The test post content'
                },
                file: {
                    path: 'image-path'
                },
                userId: userId
            };

            try {
                const res = {
                    status: function() {
                        return this;
                    },
                    json: function() {}
                };

                sinon.stub(io, 'getIo').callsFake(() => {
                    return this;
                });

                await FeedController.createPost(req, res, () => {});
                const user = await User.findById(userId);
                expect(user).to.have.property('posts');
                assert.equal(user.posts.length, 1, "User should have one post");
            } catch(e) {
                assert.fail(e);
            } finally {
                io.getIo.restore();
            }
        });
    });

    after(async () => {
        await User.deleteMany({});
        mongoose.disconnect();
    });
});