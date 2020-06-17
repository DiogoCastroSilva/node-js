// Tests
const { expect } = require('chai');
const sinon = require('sinon');
// Packages
const jwt = require('jsonwebtoken');

// Middleware Component
const authMiddleware = require('../middleware/is-auth');

describe('Auth Middleware', () => {
    it('should throw an error if no authorization header is present', () => {
        const req = {
            get: () => {
                return null
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated.');
    });
    
    it('should throw an error if the authorization is only one string', () => {
        const req = {
            get: () => {
                return 'Berear'
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });

    it('should throw an error if the token is invalid', () => {
        const req = {
            get: () => {
                return 'Berear xws'
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });

    it('should have an userId if the user is authenticated', () => {
        const req = {
            get: () => {
                return 'Berear xws'
            }
        };

        // Mock Verify function
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ id: 'abc' });

        authMiddleware(req, {}, () => {});

        expect(jwt.verify.called).to.be.true;
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');

        jwt.verify.restore();
    });
});
