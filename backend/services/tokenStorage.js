import crypto from 'crypto';

class TokenStorage {
  constructor() {
    this.stateTokens = new Map();
    this.refreshTokens = new Map();
  }

  generateStateToken() {
    const state = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    this.stateTokens.set(state, expiry);
    return state;
  }

  validateStateToken(state) {
    const expiry = this.stateTokens.get(state);
    if (!expiry) return false;
    
    const isValid = expiry > Date.now();
    this.stateTokens.delete(state); // One-time use
    return isValid;
  }

  storeRefreshToken(userId, token, expiresIn) {
    this.refreshTokens.set(userId, {
      token,
      expiresAt: Date.now() + (expiresIn * 1000)
    });
  }

  getRefreshToken(userId) {
    return this.refreshTokens.get(userId);
  }
}

export default new TokenStorage(); 