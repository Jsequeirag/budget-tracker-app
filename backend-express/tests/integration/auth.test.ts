import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../../src/app.js'
import { MemoryItemsRepository } from '../../src/modules/items/items.memory-repository.js'
import { MemoryUsersRepository } from '../../src/modules/auth/auth.memory-repository.js'

const createTestApp = () =>
  createApp({
    itemsRepository: new MemoryItemsRepository(),
    usersRepository: new MemoryUsersRepository(),
  })

describe('Auth API (integration)', () => {
  it('POST /api/auth/register creates a user and returns token', async () => {
    const app = createTestApp()
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@example.com', password: '123456', name: 'User' })

    expect(res.status).toBe(201)
    expect(res.body.data.user.email).toBe('user@example.com')
    expect(res.body.data.user.name).toBe('User')
    expect(res.body.data.token).toBeDefined()
    expect(res.body.data.user.password).toBeUndefined()
  })

  it('POST /api/auth/register returns 409 for duplicate email', async () => {
    const app = createTestApp()
    await request(app).post('/api/auth/register').send({ email: 'user@example.com', password: '123456' })

    const res = await request(app).post('/api/auth/register').send({ email: 'user@example.com', password: '123456' })

    expect(res.status).toBe(409)
    expect(res.body.code).toBe('EMAIL_EXISTS')
  })

  it('POST /api/auth/login returns token with valid credentials', async () => {
    const app = createTestApp()
    await request(app).post('/api/auth/register').send({ email: 'user@example.com', password: '123456' })

    const res = await request(app).post('/api/auth/login').send({ email: 'user@example.com', password: '123456' })

    expect(res.status).toBe(200)
    expect(res.body.data.token).toBeDefined()
  })

  it('POST /api/auth/login returns 401 with invalid credentials', async () => {
    const app = createTestApp()
    const res = await request(app).post('/api/auth/login').send({ email: 'nope@example.com', password: 'wrong' })

    expect(res.status).toBe(401)
    expect(res.body.code).toBe('INVALID_CREDENTIALS')
  })

  it('GET /api/auth/me returns user when authenticated', async () => {
    const app = createTestApp()
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@example.com', password: '123456' })

    const token = registerRes.body.data.token as string
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.data.email).toBe('user@example.com')
  })

  it('GET /api/auth/me returns 401 without token', async () => {
    const app = createTestApp()
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
    expect(res.body.code).toBe('UNAUTHORIZED')
  })
})
