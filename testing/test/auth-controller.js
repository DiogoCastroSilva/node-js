// Tests
const { expect } = require('chai');
const sinon = require('sinon');
// Packages
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Controller
const AuthController = require('../controllers/auth');
// Models
const User = require('../models/user');

describe('Auth Controller', () => {
    describe('Login', () => {
        it('should throw an error if databse access fails', (done) => {
            try {
                sinon.stub(User, 'findOne');
                User.findOne.throws();

                const req = {
                    body: {
                        email: 'email',
                        password: 'password'
                    }
                };

                AuthController.login(req, {}, (e) => {
                    expect(e).to.be.an('error');
                    expect(e).to.have.property('statusCode', 500);
                    done();
                });

            } catch(e) {

            } finally {
                User.findOne.restore();
            }
        });

        it('should throw an error if user not found', (done) => {
            try {
                sinon.stub(User, 'findOne');
                User.findOne.returns(null);

                const req = {
                    body: {
                        email: 'email',
                        password: 'password'
                    }
                };

                AuthController.login(req, {}, (e) => {
                    expect(e).to.be.an('error');
                    expect(e).to.have.property('statusCode', 401);
                    done();
                });
                
            } catch(e) {

            } finally {
                User.findOne.restore();
            }
        });

        it('should get the right user status', async () => {
            let user;
            try {
                await mongoose
                .connect(
                    'mongodb+srv://Diogo:asdzxc@cluster0-fnsz5.mongodb.net/test-message?retryWrites=true&w=majority'
                );
                user = new User({
                    email: 'user@user.com',
                    name: 'user',
                    password: 'pass',
                    posts: [],
                    _id: '5ee69b7c54874a05e76ab01a'
                });
                await user.save();
                const req = { userID: user._id };
                const res = {
                    statusCode: 500,
                    userStatus: null,
                    status: function(code) {
                        this.statusCode = code;
                        return this;
                    },
                    json: function(data) {
                        this.userStatus = data.status;
                    }
                };
                await AuthController.getStatus(req, res, () => {});
                expect(res.statusCode).to.be.equal(200);
                expect(res.userStatus).to.be.equal('I am new!');
            } catch(e) {
                console.log('error login', e);
            } finally {
                if (user) {
                    await User.findByIdAndDelete(user._id);
                }
                mongoose.disconnect();
            }
        });
    });
});