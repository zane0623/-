import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import axios from 'axios';

const prisma = new PrismaClient();

interface SendNotificationParams {
  userId: string;
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  title: string;
  content: string;
  data?: any;
}

export class NotificationService {
  private emailTransporter: nodemailer.Transporter;

  constructor() {
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  /**
   * 发送通知
   */
  async send(params: SendNotificationParams) {
    const { userId, type, title, content, data } = params;

    // 保存到数据库
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        content,
        data: data || {},
        status: 'PENDING'
      }
    });

    // 根据类型发送
    try {
      switch (type) {
        case 'EMAIL':
          await this.sendEmail(userId, title, content);
          break;
        case 'SMS':
          await this.sendSMS(userId, content);
          break;
        case 'PUSH':
          await this.sendPush(userId, title, content, data);
          break;
        case 'IN_APP':
          // IN_APP通知只保存到数据库
          break;
      }

      await prisma.notification.update({
        where: { id: notification.id },
        data: { status: 'SENT', sentAt: new Date() }
      });
    } catch (error) {
      await prisma.notification.update({
        where: { id: notification.id },
        data: { status: 'FAILED' }
      });
      throw error;
    }

    return notification;
  }

  /**
   * 批量发送通知
   */
  async sendBatch(userIds: string[], params: Omit<SendNotificationParams, 'userId'>) {
    const results = await Promise.allSettled(
      userIds.map(userId => this.send({ ...params, userId }))
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return { sent, failed, total: userIds.length };
  }

  /**
   * 获取用户通知列表
   */
  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ) {
    const skip = (page - 1) * limit;
    const where: any = { userId };

    if (unreadOnly) {
      where.read = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, read: false } })
    ]);

    return { notifications, total, unreadCount };
  }

  /**
   * 标记为已读
   */
  async markAsRead(notificationId: string) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true, readAt: new Date() }
    });
  }

  /**
   * 标记所有为已读
   */
  async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true, readAt: new Date() }
    });
  }

  /**
   * 删除通知
   */
  async delete(notificationId: string) {
    return await prisma.notification.delete({
      where: { id: notificationId }
    });
  }

  /**
   * 广播通知
   */
  async broadcast(params: Omit<SendNotificationParams, 'userId'>) {
    const users = await prisma.user.findMany({
      select: { id: true }
    });

    const userIds = users.map(u => u.id);
    return await this.sendBatch(userIds, params);
  }

  /**
   * 发送邮件
   */
  private async sendEmail(userId: string, subject: string, content: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });

    if (!user?.email) {
      throw new Error('User email not found');
    }

    await this.emailTransporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@juyuan-nft.com',
      to: user.email,
      subject,
      html: content
    });
  }

  /**
   * 发送短信
   */
  private async sendSMS(userId: string, content: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true }
    });

    if (!user?.phone) {
      throw new Error('User phone not found');
    }

    // 调用短信服务API（如阿里云、腾讯云）
    // 这里是示例实现
    console.log(`Sending SMS to ${user.phone}: ${content}`);
  }

  /**
   * 发送推送通知
   */
  private async sendPush(userId: string, title: string, body: string, data?: any) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { pushToken: true }
    });

    if (!user?.pushToken) {
      throw new Error('User push token not found');
    }

    // 使用Firebase Cloud Messaging发送推送
    // 这里是示例实现
    console.log(`Sending push to ${userId}: ${title}`);
  }
}

