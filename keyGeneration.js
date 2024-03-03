const crypto = require('crypto');

function generateKeyPair() {
  // Generate RSA key pair
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'pkcs1', // Public Key Cryptography Standards #1
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8', // Private Key Cryptography Standards #8
      format: 'pem'
    }
  });

  // Generate Key ID (kid)
  const kid = crypto.randomBytes(16).toString('hex');

  // Generate expiry timestamp
  const expiryTimestamp = Date.now() + (60 * 1000); // 1 minute from now

  return {
    kid,
    expiryTimestamp,
    publicKey,
    privateKey
  };
}

module.exports = generateKeyPair;
