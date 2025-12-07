import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateTemplateParams {
  name: string;
  type: string;
  subject: string;
  content: string;
  variables?: string[];
}

export class TemplateService {
  /**
   * 创建模板
   */
  async create(params: CreateTemplateParams) {
    return await prisma.notificationTemplate.create({
      data: params
    });
  }

  /**
   * 获取所有模板
   */
  async getAll() {
    return await prisma.notificationTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * 获取模板详情
   */
  async getById(templateId: string) {
    return await prisma.notificationTemplate.findUnique({
      where: { id: templateId }
    });
  }

  /**
   * 根据名称获取模板
   */
  async getByName(name: string) {
    return await prisma.notificationTemplate.findFirst({
      where: { name }
    });
  }

  /**
   * 更新模板
   */
  async update(templateId: string, data: Partial<CreateTemplateParams>) {
    return await prisma.notificationTemplate.update({
      where: { id: templateId },
      data
    });
  }

  /**
   * 删除模板
   */
  async delete(templateId: string) {
    return await prisma.notificationTemplate.delete({
      where: { id: templateId }
    });
  }

  /**
   * 渲染模板
   */
  async render(templateName: string, variables: Record<string, string>) {
    const template = await this.getByName(templateName);
    
    if (!template) {
      throw new Error('Template not found');
    }

    let content = template.content;
    let subject = template.subject;

    // 替换变量
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, value);
      subject = subject.replace(regex, value);
    }

    return { subject, content };
  }
}

