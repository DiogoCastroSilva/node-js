// Test
const { expect } = require('chai');
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
});
