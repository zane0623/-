import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from './auth';

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRoutes);

const prisma = new PrismaClient();

describe('认证API测试', () => {
  beforeAll(async () => {
    // 清理测试数据
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/auth/register', () => {
    it('应该成功注册新用户', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('重复邮箱应该失败', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser2',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'User already exists');
    });

    it('无效邮箱应该失败', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          username: 'testuser3',
        });

      expect(response.status).toBe(400);
    });

    it('密码过短应该失败', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test2@example.com',
          password: 'short',
          username: 'testuser4',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('应该成功登录', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
    });

    it('错误密码应该失败', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });

    it('不存在的用户应该失败', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/wallet-login', () => {
    it('应该创建新用户并登录', async () => {
      const response = await request(app)
        .post('/api/v1/auth/wallet-login')
        .send({
          walletAddress: '0x1234567890123456789012345678901234567890',
          signature: '0xsignature',
          message: 'Sign in',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Wallet login successful');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.walletAddress).toBe('0x1234567890123456789012345678901234567890');
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    let validToken: string;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });
      
      validToken = response.body.token;
    });

    it('应该成功刷新token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({
          token: validToken,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('无效token应该失败', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({
          token: 'invalid.token.here',
        });

      expect(response.status).toBe(401);
    });
  });
}); 