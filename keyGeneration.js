const crypto = require('crypto');

function generateKeyPair() {
  // Generate RSA key pair
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // 2048-bit key length
    publicKeyEncoding: {
      type: 'pkcs1', // Public Key Cryptography Standards #1
      format: 'pem' // Privacy Enhanced Mail format
    },
    privateKeyEncoding: {
      type: 'pkcs8', // Private Key Cryptography Standards #8
      format: 'pem' // Privacy Enhanced Mail format
    }
  });

  // Generate Key ID (kid)
  const kid = crypto.randomBytes(16).toString('hex');

  // Generate expiry timestamp (e.g., one year from now)
  const expiryTimestamp = Date.now() + (365 * 24 * 60 * 60 * 1000); // 1 year

  return {
    kid,
    expiryTimestamp,
    publicKey,
    privateKey
  };
}

module.exports = generateKeyPair;
