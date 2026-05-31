/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import db from '../db/init.js';

describe('Candidate Controller API', () => {
  beforeEach(() => {
    db.exec('DELETE FROM Candidates');
  });

  afterAll(() => {
    db.exec('DELETE FROM Candidates');
  });

  const sampleCandidate = {
    full_name: 'John Doe',
    dob: '1990-01-01',
    personal_id_number: '1234567890123',
    address: '123 Main St',
    phone_number: '555-1234',
    email: 'john@example.com',
    license_category: 'B',
    total_course_fee: 1500
  };

  it('should get all candidates (empty initially)', async () => {
    const res = await request(app).get('/api/candidates');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it('should create a new candidate', async () => {
    const res = await request(app).post('/api/candidates').send(sampleCandidate);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.full_name).toBe('John Doe');
  });

  it('should not create a candidate missing required fields', async () => {
    const res = await request(app).post('/api/candidates').send({ full_name: 'Jane' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should get a candidate by ID', async () => {
    const createRes = await request(app).post('/api/candidates').send(sampleCandidate);
    const id = createRes.body.data.id;

    const res = await request(app).get(`/api/candidates/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(id);
  });

  it('should return 404 for non-existent candidate', async () => {
    const res = await request(app).get('/api/candidates/999');
    expect(res.statusCode).toBe(404);
  });

  it('should update a candidate', async () => {
    const createRes = await request(app).post('/api/candidates').send(sampleCandidate);
    const id = createRes.body.data.id;

    const res = await request(app).put(`/api/candidates/${id}`).send({
      ...sampleCandidate,
      full_name: 'John Updated'
    });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.data.full_name).toBe('John Updated');
  });

  it('should delete a candidate', async () => {
    const createRes = await request(app).post('/api/candidates').send(sampleCandidate);
    const id = createRes.body.data.id;

    const res = await request(app).delete(`/api/candidates/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const getRes = await request(app).get(`/api/candidates/${id}`);
    expect(getRes.statusCode).toBe(404);
  });
});
