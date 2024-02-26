const generateKeyPair = require('../keyGeneration');

describe('Key Generation', () => {
  test('Generated key pair should have the expected properties', () => {
    const keyPair = generateKeyPair();
    expect(keyPair).toHaveProperty('kid');
    expect(keyPair).toHaveProperty('expiryTimestamp');
    expect(keyPair).toHaveProperty('publicKey');
    expect(keyPair).toHaveProperty('privateKey');
  });

  test('Generated key pair should have a valid expiry timestamp', () => {
    const keyPair = generateKeyPair();
    expect(keyPair.expiryTimestamp).toBeGreaterThan(Date.now());
  });
});
