// server.js

const express = require('express');
const generateKeyPair = require('./keyGeneration');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken module

const app = express();
const port = 8080;

// Generate initial key pair
let currentKeyPair = generateKeyPair();

// Middleware to serve JWKS
app.get('/.well-known/jwks.json', (req, res) => {
  // Check if current key pair has expired
  if (Date.now() > currentKeyPair.expiryTimestamp) {
    // Regenerate key pair if expired
    currentKeyPair = generateKeyPair();
  }

  const jwks = {
    keys: [{
      kid: currentKeyPair.kid,
      kty: 'RSA',
      alg: 'RS256',
      use: 'sig',
      n: currentKeyPair.publicKey.split('\n').slice(1, -2).join(''), // Remove header and footer
      e: 'AQAB' // Exponent (constant value for RSA)
    }]
  };

  res.json(jwks);
});

// Auth endpoint
app.post('/auth', (req, res) => {
  const expiredQueryParam = req.query.expired;

  // Check if expired query parameter is present
  const keyPairToUse = expiredQueryParam ? currentKeyPair : generateKeyPair();

  const payload = {
    // Add your payload data here
    userId: 'user123',
    role: 'admin'
  };

  const options = {
    algorithm: 'RS256',
    expiresIn: '1h', // Token expiry time
    keyid: keyPairToUse.kid
  };

  // Sign JWT
  const token = jwt.sign(payload, keyPairToUse.privateKey, options);

  res.json({ token });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
