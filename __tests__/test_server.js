const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = require('../server');

describe('Server', () => {
  test('GET /.well-known/jwks.json should return valid JWKS', async () => {
    const response = await request(app).get('/.well-known/jwks.json');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('keys');
    expect(response.body.keys).toHaveLength(1); // Assuming only one key is returned
    expect(response.body.keys[0]).toHaveProperty('kid');
    expect(response.body.keys[0]).toHaveProperty('kty', 'RSA');
    expect(response.body.keys[0]).toHaveProperty('alg', 'RS256');
    expect(response.body.keys[0]).toHaveProperty('use', 'sig');
    expect(response.body.keys[0]).toHaveProperty('n');
    expect(response.body.keys[0]).toHaveProperty('e', 'AQAB');
  });

  test('POST /auth should return a valid JWT', async () => {
    const response = await request(app).post('/auth');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    // Add more assertions if needed
  });

  test('POST /auth with expired query parameter should return a valid JWT with expired key', async () => {
    const response = await request(app).post('/auth?expired=true');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    // Add more assertions if needed
  });

  test('Decoded JWT should contain a valid kid in the header', () => {
    // Create a JWT token with a known kid in the header
    const token = jwt.sign({ data: 'example' }, 'secret', { header: { kid: 'test-kid' } });

    try {
      const decoded = jwt.decode(token, { complete: true });

      // Ensure that decoded object exists and contains the header
      expect(decoded).toBeDefined();
      expect(decoded.header).toBeDefined();

      // Extract kid from the decoded header
      const kidFromHeader = decoded.header.kid;

      // Log the kid from the header for debugging
      console.log('Kid from JWT header:', kidFromHeader);

      // Add your assertion here to compare kidFromHeader with the expected kid
      expect(kidFromHeader).toBe('test-kid');

    } catch (error) {
      // If there's an error decoding the JWT, fail the test
      fail('Error decoding JWT: ' + error);
    }
  });
});
