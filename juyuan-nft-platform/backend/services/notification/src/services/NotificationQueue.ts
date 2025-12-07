import Queue from 'bull';
import { NotificationService } from './NotificationService';

export class NotificationQueue {
  private queue: Queue.Queue;
  private notificationService: NotificationService;

  constructor() {
    this.queue = new Queue('notifications', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379')
      }
    });

    this.notificationService = new NotificationService();
  }

  /**
   * 添加通知到队列
   */
  async add(notification: any, options?: Queue.JobOptions) {
    return await this.queue.add(notification, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000
      },
      ...options
    });
  }

  /**
   * 添加延迟通知
   */
  async addDelayed(notification: any, delay: number) {
    return await this.queue.add(notification, { delay });
  }

  /**
   * 添加定时通知
   */
  async addScheduled(notification: any, cron: string) {
    return await this.queue.add(notification, {
      repeat: { cron }
    });
  }

  /**
   * 开始处理队列
   */
  startProcessing() {
    this.queue.process(async (job) => {
      const { userId, type, title, content, data } = job.data;

      try {
        await this.notificationService.send({
          userId,
          type,
          title,
          content,
          data
        });
        return { success: true };
      } catch (error: any) {
        console.error('Notification job failed:', error);
        throw error;
      }
    });

    this.queue.on('completed', (job, result) => {
      console.log(`Notification job ${job.id} completed`);
    });

    this.queue.on('failed', (job, err) => {
      console.error(`Notification job ${job.id} failed:`, err);
    });
  }

  /**
   * 获取队列状态
   */
  async getStatus() {
    const [waiting, active, completed, failed] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount()
    ]);

    return { waiting, active, completed, failed };
  }
}

