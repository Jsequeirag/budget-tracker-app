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

const registerAndLogin = async (app: ReturnType<typeof createTestApp>) => {
  await request(app).post('/api/auth/register').send({ email: 'test@example.com', password: '123456' })

  const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: '123456' })

  return res.body.data.token as string
}

describe('Items API (integration)', () => {
  it('GET /api/items returns empty list initially', async () => {
    const app = createTestApp()
    const res = await request(app).get('/api/items')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toEqual([])
  })

  it('POST /api/items creates a new item when authenticated', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)

    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test', description: 'Desc' })

    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({
      id: expect.any(Number),
      name: 'Test',
      description: 'Desc',
    })
  })

  it('POST /api/items returns 401 without token', async () => {
    const app = createTestApp()
    const res = await request(app).post('/api/items').send({ name: 'Test' })

    expect(res.status).toBe(401)
    expect(res.body.code).toBe('UNAUTHORIZED')
  })

  it('GET /api/items/:id returns an item', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)

    const createRes = await request(app).post('/api/items').set('Authorization', `Bearer ${token}`).send({ name: 'Test' })

    const res = await request(app).get(`/api/items/${createRes.body.data.id}`)
    expect(res.status).toBe(200)
    expect(res.body.data.name).toBe('Test')
  })

  it('PATCH /api/items/:id updates an item partially when authenticated', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)

    const createRes = await request(app).post('/api/items').set('Authorization', `Bearer ${token}`).send({ name: 'Test' })

    const res = await request(app)
      .patch(`/api/items/${createRes.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated' })

    expect(res.status).toBe(200)
    expect(res.body.data.name).toBe('Updated')
  })

  it('DELETE /api/items/:id removes an item when authenticated', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)

    const createRes = await request(app).post('/api/items').set('Authorization', `Bearer ${token}`).send({ name: 'To delete' })

    const res = await request(app).delete(`/api/items/${createRes.body.data.id}`).set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204)

    const getRes = await request(app).get('/api/items')
    expect(getRes.body.data).toHaveLength(0)
  })

  it('returns 404 when item not found', async () => {
    const app = createTestApp()
    const res = await request(app).get('/api/items/999')
    expect(res.status).toBe(404)
    expect(res.body.code).toBe('NOT_FOUND')
  })

  it('returns 400 when validation fails', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)

    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Missing name' })

    expect(res.status).toBe(400)
    expect(res.body.code).toBe('VALIDATION_ERROR')
  })
})
