# EduBoost RWA 技术实现指南

## 1. 项目初始化

### 1.1 环境配置
```bash
# 创建项目目录
mkdir eduboost-rwa
cd eduboost-rwa

# 初始化前端项目
npx create-next-app@latest frontend --typescript --tailwind --eslint
cd frontend
npm install @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-wallets
npm install zustand @tanstack/react-query axios
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react class-variance-authority clsx tailwind-merge

# 初始化后端项目
cd ..
mkdir backend
cd backend
npm init -y
npm install express typescript @types/node @types/express
npm install prisma @prisma/client bcryptjs jsonwebtoken
npm install cors helmet morgan dotenv
npm install @solana/web3.js @project-serum/anchor
npm install redis ioredis

# 初始化数据库
npx prisma init
```

### 1.2 项目结构
```
eduboost-rwa/
├── frontend/                 # Next.js前端
│   ├── src/
│   │   ├── components/      # React组件
│   │   ├── pages/          # 页面
│   │   ├── hooks/          # 自定义Hooks
│   │   ├── stores/         # 状态管理
│   │   ├── services/       # API服务
│   │   └── utils/          # 工具函数
│   ├── public/             # 静态资源
│   └── package.json
├── backend/                 # Express后端
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── services/       # 业务逻辑
│   │   ├── middleware/     # 中间件
│   │   ├── routes/         # 路由
│   │   └── utils/          # 工具函数
│   ├── prisma/             # 数据库schema
│   └── package.json
├── blockchain/              # Solana程序
│   ├── programs/           # Anchor程序
│   ├── tests/              # 测试
│   └── Anchor.toml
└── docker-compose.yml      # Docker配置
```

## 2. 后端实现

### 2.1 数据库配置 (Prisma)
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String?
  walletAddress String?
  role          UserRole @default(STUDENT)
  isVerified    Boolean  @default(false)
  mfaEnabled    Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  profile       UserProfile?
  progress      UserProgress[]
  applications  Application[]
  achievements  NFTAchievement[]
  transactions  TokenTransaction[]
}

model UserProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  firstName   String?
  lastName    String?
  dateOfBirth DateTime?
  gradeLevel  Int?
  interests   String[]
  createdAt   DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
}

model Course {
  id             String   @id @default(cuid())
  name           String
  subject        String
  difficultyLevel Int
  estimatedHours Int
  createdAt      DateTime @default(now())

  lessons Lesson[]
}

model Lesson {
  id            String   @id @default(cuid())
  courseId      String
  title         String
  content       String
  orderIndex    Int
  knowledgePoints String[]
  createdAt     DateTime @default(now())

  course  Course        @relation(fields: [courseId], references: [id])
  progress UserProgress[]
}

model UserProgress {
  id             String   @id @default(cuid())
  userId         String
  lessonId       String
  completionRate Float    @default(0)
  score          Int?
  timeSpent      Int?
  completedAt    DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id])
  lesson Lesson @relation(fields: [lessonId], references: [id])
}

enum UserRole {
  STUDENT
  PARENT
  TEACHER
  ADMIN
}
```

### 2.2 认证服务
```typescript
// src/services/authService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthService {
  async register(email: string, password: string, walletAddress?: string) {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        walletAddress
      }
    });

    return this.generateTokens(user.id);
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return this.generateTokens(user.id);
  }

  async connectWallet(userId: string, walletAddress: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { walletAddress }
    });
  }

  private generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }
}
```

### 2.3 学习路径服务
```typescript
// src/services/learningPathService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LearningPathService {
  async generatePath(userId: string, subject: string) {
    // 获取用户能力评估
    const userProfile = await this.getUserProfile(userId);
    
    // 获取用户学习进度
    const userProgress = await this.getUserProgress(userId, subject);
    
    // 计算推荐难度
    const difficulty = this.calculateOptimalDifficulty(userProfile, userProgress);
    
    // 获取推荐课程
    const courses = await prisma.course.findMany({
      where: {
        subject,
        difficultyLevel: {
          gte: difficulty - 1,
          lte: difficulty + 1
        }
      },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    return {
      userId,
      subject,
      courses,
      estimatedDuration: this.calculateDuration(courses),
      difficulty
    };
  }

  async updateProgress(userId: string, lessonId: string, score: number) {
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId }
      },
      update: {
        completionRate: 100,
        score,
        completedAt: new Date()
      },
      create: {
        userId,
        lessonId,
        completionRate: 100,
        score,
        completedAt: new Date()
      }
    });

    // 检查是否完成课程
    await this.checkCourseCompletion(userId, lessonId);

    return progress;
  }

  private async getUserProfile(userId: string) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId }
    });

    const progress = await prisma.userProgress.findMany({
      where: { userId },
      include: { lesson: { include: { course: true } } }
    });

    return {
      profile,
      averageScore: this.calculateAverageScore(progress),
      completedLessons: progress.length
    };
  }

  private calculateOptimalDifficulty(profile: any, progress: any) {
    const baseDifficulty = Math.floor(profile.averageScore / 20);
    const progressBonus = Math.floor(progress.length / 10);
    return Math.max(1, Math.min(5, baseDifficulty + progressBonus));
  }
}
```

### 2.4 申请管理服务
```typescript
// src/services/applicationService.ts
import { PrismaClient } from '@prisma/client';
import { uploadToStorage } from '../utils/storage';

const prisma = new PrismaClient();

export class ApplicationService {
  async createApplication(userId: string, universityId: string) {
    const application = await prisma.application.create({
      data: {
        userId,
        universityId,
        status: 'DRAFT'
      }
    });

    // 创建文档清单
    await this.createDocumentChecklist(application.id);

    return application;
  }

  async uploadDocument(applicationId: string, documentType: string, file: Express.Multer.File) {
    // 上传文件到云存储
    const fileUrl = await uploadToStorage(file);

    const document = await prisma.applicationDocument.create({
      data: {
        applicationId,
        documentType,
        fileUrl
      }
    });

    return document;
  }

  async submitApplication(applicationId: string) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        documents: true,
        university: true
      }
    });

    // 验证必需文档
    this.validateRequiredDocuments(application.documents);

    // 处理支付
    await this.processPayment(application);

    // 更新状态
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date()
      }
    });
  }

  private validateRequiredDocuments(documents: any[]) {
    const required = ['transcript', 'essay', 'recommendation'];
    const uploaded = documents.map(d => d.documentType);
    
    const missing = required.filter(doc => !uploaded.includes(doc));
    if (missing.length > 0) {
      throw new Error(`Missing required documents: ${missing.join(', ')}`);
    }
  }

  private async processPayment(application: any) {
    // 集成支付处理逻辑
    const payment = await this.paymentService.processPayment({
      amount: application.university.applicationFee,
      currency: 'USD',
      applicationId: application.id
    });

    return payment;
  }
}
```

## 3. 前端实现

### 3.1 状态管理 (Zustand)
```typescript
// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  connectWallet: (walletAddress: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          const data = await response.json();
          
          if (response.ok) {
            set({
              user: data.user,
              isAuthenticated: true
            });
          } else {
            throw new Error(data.error);
          }
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false
        });
      },

      connectWallet: async (walletAddress: string) => {
        try {
          const response = await fetch('/api/auth/wallet-connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress })
          });

          const data = await response.json();
          
          if (response.ok) {
            set(state => ({
              user: { ...state.user, walletAddress }
            }));
          }
        } catch (error) {
          throw error;
        }
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);
```

### 3.2 学习界面组件
```typescript
// src/components/LearningInterface.tsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';

interface LearningInterfaceProps {
  lessonId: string;
}

export const LearningInterface: React.FC<LearningInterfaceProps> = ({ lessonId }) => {
  const { user } = useAuthStore();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => fetchLesson(lessonId)
  });

  const submitProgressMutation = useMutation({
    mutationFn: (data: any) => submitProgress(data),
    onSuccess: () => {
      // 显示完成通知
      toast.success('课程完成！');
    }
  });

  const handleComplete = async () => {
    if (!user) return;

    const progressData = {
      userId: user.id,
      lessonId,
      completionRate: 100,
      score: calculateScore(answers),
      timeSpent: getTimeSpent()
    };

    await submitProgressMutation.mutateAsync(progressData);
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 课程头部 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <div className="flex items-center gap-4 text-gray-600">
          <span>预计时间: {lesson.estimatedTime}分钟</span>
          <span>难度: {lesson.difficulty}</span>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentSection / lesson.sections.length) * 100}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 mt-2">
          {currentSection + 1} / {lesson.sections.length}
        </div>
      </div>

      {/* 课程内容 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: lesson.sections[currentSection].content }}
        />
      </div>

      {/* 交互元素 */}
      {lesson.sections[currentSection].questions && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">练习题</h3>
          {lesson.sections[currentSection].questions.map((question: any, index: number) => (
            <div key={index} className="mb-4">
              <p className="mb-2">{question.text}</p>
              {question.type === 'multiple-choice' && (
                <div className="space-y-2">
                  {question.options.map((option: string, optionIndex: number) => (
                    <label key={optionIndex} className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={optionIndex}
                        onChange={(e) => setAnswers({
                          ...answers,
                          [index]: parseInt(e.target.value)
                        })}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 导航按钮 */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          上一节
        </button>

        {currentSection < lesson.sections.length - 1 ? (
          <button
            onClick={() => setCurrentSection(currentSection + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            下一节
          </button>
        ) : (
          <button
            onClick={handleComplete}
            disabled={submitProgressMutation.isPending}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {submitProgressMutation.isPending ? '提交中...' : '完成课程'}
          </button>
        )}
      </div>
    </div>
  );
};
```

### 3.3 Web3集成
```typescript
// src/hooks/useWeb3.ts
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PublicKey, Transaction } from '@solana/web3.js';

export const useWeb3 = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const mintAchievementMutation = useMutation({
    mutationFn: async (achievementData: any) => {
      if (!publicKey) throw new Error('Wallet not connected');

      const response = await fetch('/api/blockchain/mint-achievement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          achievementData
        })
      });

      const { transaction } = await response.json();
      
      const tx = Transaction.from(Buffer.from(transaction, 'base64'));
      const signature = await sendTransaction(tx, connection);
      
      await connection.confirmTransaction(signature);
      
      return signature;
    }
  });

  const stakeTokensMutation = useMutation({
    mutationFn: async ({ amount, duration }: { amount: number; duration: number }) => {
      if (!publicKey) throw new Error('Wallet not connected');

      const response = await fetch('/api/blockchain/stake-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          amount,
          duration
        })
      });

      const { transaction } = await response.json();
      
      const tx = Transaction.from(Buffer.from(transaction, 'base64'));
      const signature = await sendTransaction(tx, connection);
      
      await connection.confirmTransaction(signature);
      
      return signature;
    }
  });

  const { data: balance } = useQuery({
    queryKey: ['balance', publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey) return null;
      return await connection.getBalance(publicKey);
    },
    enabled: !!publicKey
  });

  return {
    publicKey,
    balance,
    mintAchievement: mintAchievementMutation.mutateAsync,
    stakeTokens: stakeTokensMutation.mutateAsync,
    isMinting: mintAchievementMutation.isPending,
    isStaking: stakeTokensMutation.isPending
  };
};
```

## 4. 区块链集成

### 4.1 Solana程序 (Anchor)
```rust
// programs/eduboost/src/lib.rs
use anchor_lang::prelude::*;

declare_id!("EduBoostProgram111111111111111111111111111");

#[program]
pub mod eduboost {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let global_state = &mut ctx.accounts.global_state;
        global_state.authority = ctx.accounts.authority.key();
        global_state.total_staked = 0;
        global_state.total_achievements = 0;
        Ok(())
    }

    pub fn mint_achievement(
        ctx: Context<MintAchievement>,
        achievement_data: AchievementData,
    ) -> Result<()> {
        let achievement = &mut ctx.accounts.achievement;
        let global_state = &mut ctx.accounts.global_state;

        achievement.owner = ctx.accounts.owner.key();
        achievement.achievement_type = achievement_data.achievement_type;
        achievement.score = achievement_data.score;
        achievement.minted_at = Clock::get()?.unix_timestamp;
        achievement.uri = achievement_data.uri;

        global_state.total_achievements += 1;

        Ok(())
    }

    pub fn stake_tokens(
        ctx: Context<StakeTokens>,
        amount: u64,
        duration: u64,
    ) -> Result<()> {
        let stake_position = &mut ctx.accounts.stake_position;
        let global_state = &mut ctx.accounts.global_state;

        stake_position.owner = ctx.accounts.owner.key();
        stake_position.amount = amount;
        stake_position.start_time = Clock::get()?.unix_timestamp;
        stake_position.duration = duration;
        stake_position.is_active = true;

        global_state.total_staked += amount;

        Ok(())
    }

    pub fn unstake_tokens(ctx: Context<UnstakeTokens>) -> Result<()> {
        let stake_position = &mut ctx.accounts.stake_position;
        let global_state = &mut ctx.accounts.global_state;

        require!(stake_position.is_active, ErrorCode::StakeNotActive);

        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time >= stake_position.start_time + stake_position.duration,
            ErrorCode::StakeNotMatured
        );

        stake_position.is_active = false;
        global_state.total_staked -= stake_position.amount;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + GlobalState::LEN)]
    pub global_state: Account<'info, GlobalState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintAchievement<'info> {
    #[account(init, payer = owner, space = 8 + Achievement::LEN)]
    pub achievement: Account<'info, Achievement>,
    #[account(mut)]
    pub global_state: Account<'info, GlobalState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StakeTokens<'info> {
    #[account(init, payer = owner, space = 8 + StakePosition::LEN)]
    pub stake_position: Account<'info, StakePosition>,
    #[account(mut)]
    pub global_state: Account<'info, GlobalState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UnstakeTokens<'info> {
    #[account(mut)]
    pub stake_position: Account<'info, StakePosition>,
    #[account(mut)]
    pub global_state: Account<'info, GlobalState>,
    pub owner: Signer<'info>,
}

#[account]
pub struct GlobalState {
    pub authority: Pubkey,
    pub total_staked: u64,
    pub total_achievements: u64,
}

#[account]
pub struct Achievement {
    pub owner: Pubkey,
    pub achievement_type: String,
    pub score: u64,
    pub minted_at: i64,
    pub uri: String,
}

#[account]
pub struct StakePosition {
    pub owner: Pubkey,
    pub amount: u64,
    pub start_time: i64,
    pub duration: u64,
    pub is_active: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct AchievementData {
    pub achievement_type: String,
    pub score: u64,
    pub uri: String,
}

impl GlobalState {
    pub const LEN: usize = 32 + 8 + 8;
}

impl Achievement {
    pub const LEN: usize = 32 + 4 + 50 + 8 + 8 + 4 + 200;
}

impl StakePosition {
    pub const LEN: usize = 32 + 8 + 8 + 8 + 1;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Stake position is not active")]
    StakeNotActive,
    #[msg("Stake has not matured yet")]
    StakeNotMatured,
}
```

### 4.2 后端区块链服务
```typescript
// src/services/blockchainService.ts
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { IDL } from '../idl/eduboost';

export class BlockchainService {
  private connection: Connection;
  private program: Program;

  constructor() {
    this.connection = new Connection(process.env.SOLANA_RPC_URL!);
    
    const provider = new AnchorProvider(
      this.connection,
      {} as any, // 这里需要实际的钱包
      { commitment: 'confirmed' }
    );

    this.program = new Program(IDL, process.env.PROGRAM_ID!, provider);
  }

  async mintAchievementNFT(walletAddress: string, achievementData: any) {
    const achievement = web3.Keypair.generate();
    const globalState = new PublicKey(process.env.GLOBAL_STATE_ADDRESS!);

    const instruction = await this.program.methods
      .mintAchievement({
        achievementType: achievementData.type,
        score: new BN(achievementData.score),
        uri: achievementData.uri
      })
      .accounts({
        achievement: achievement.publicKey,
        globalState,
        owner: new PublicKey(walletAddress),
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction();

    const transaction = new Transaction().add(instruction);
    
    return {
      transaction: transaction.serialize().toString('base64'),
      achievementAddress: achievement.publicKey.toString()
    };
  }

  async stakeTokens(walletAddress: string, amount: number, duration: number) {
    const stakePosition = web3.Keypair.generate();
    const globalState = new PublicKey(process.env.GLOBAL_STATE_ADDRESS!);

    const instruction = await this.program.methods
      .stakeTokens(new BN(amount), new BN(duration))
      .accounts({
        stakePosition: stakePosition.publicKey,
        globalState,
        owner: new PublicKey(walletAddress),
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction();

    const transaction = new Transaction().add(instruction);
    
    return {
      transaction: transaction.serialize().toString('base64'),
      stakeAddress: stakePosition.publicKey.toString()
    };
  }

  async getBalance(walletAddress: string): Promise<number> {
    const publicKey = new PublicKey(walletAddress);
    const balance = await this.connection.getBalance(publicKey);
    return balance / web3.LAMPORTS_PER_SOL;
  }
}
```

## 5. 部署配置

### 5.1 Docker配置
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 4000
CMD ["npm", "start"]
```

### 5.2 Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:4000
      - NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    depends_on:
      - postgres
      - redis
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/eduboost
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-jwt-secret
      - SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
      - PROGRAM_ID=your-program-id

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=eduboost
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

volumes:
  postgres_data:
  redis_data:
```

## 6. 测试策略

### 6.1 单元测试
```typescript
// backend/src/services/__tests__/authService.test.ts
import { AuthService } from '../authService';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client');

describe('AuthService', () => {
  let authService: AuthService;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
    authService = new AuthService();
  });

  describe('register', () => {
    it('should create a new user successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user123',
        email,
        passwordHash: 'hashed-password',
        role: 'STUDENT',
        isVerified: false,
        mfaEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const result = await authService.register(email, password);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email,
          passwordHash: expect.any(String),
          walletAddress: undefined
        }
      });
    });

    it('should throw error if user already exists', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        email,
        passwordHash: 'existing-hash',
        role: 'STUDENT',
        isVerified: false,
        mfaEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await expect(authService.register(email, password))
        .rejects
        .toThrow('User already exists');
    });
  });
});
```

### 6.2 集成测试
```typescript
// backend/src/__tests__/auth.test.ts
import request from 'supertest';
import { app } from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth API', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe'
        })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 400 for invalid email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
    });

    it('should login successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
    });

    it('should return 401 for wrong password', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);
    });
  });
});
```

## 7. 性能优化

### 7.1 数据库优化
```sql
-- 创建索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);

-- 分区表（大数据量时）
CREATE TABLE user_progress_partitioned (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL,
  completion_rate DECIMAL(5,2) DEFAULT 0,
  score INTEGER,
  time_spent INTEGER,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- 创建分区
CREATE TABLE user_progress_2024_01 PARTITION OF user_progress_partitioned
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### 7.2 缓存策略
```typescript
// src/services/cacheService.ts
import Redis from 'ioredis';

export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL!);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  // 缓存用户学习路径
  async cacheLearningPath(userId: string, subject: string, path: any): Promise<void> {
    const key = `learning_path:${userId}:${subject}`;
    await this.set(key, path, 1800); // 30分钟缓存
  }

  // 缓存课程数据
  async cacheCourse(courseId: string, course: any): Promise<void> {
    const key = `course:${courseId}`;
    await this.set(key, course, 3600); // 1小时缓存
  }
}
```

### 7.3 前端性能优化
```typescript
// src/hooks/useOptimizedQuery.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useOptimizedQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: any = {}
) => {
  const queryClient = useQueryClient();

  const prefetch = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: options.staleTime || 5 * 60 * 1000, // 5分钟
      cacheTime: options.cacheTime || 10 * 60 * 1000, // 10分钟
    });
  }, [queryClient, queryKey, queryFn, options]);

  return useQuery({
    queryKey,
    queryFn,
    staleTime: options.staleTime || 5 * 60 * 1000,
    cacheTime: options.cacheTime || 10 * 60 * 1000,
    ...options
  });
};

// 使用示例
export const useCourse = (courseId: string) => {
  return useOptimizedQuery(
    ['course', courseId],
    () => fetchCourse(courseId),
    {
      staleTime: 10 * 60 * 1000, // 10分钟
      cacheTime: 30 * 60 * 1000, // 30分钟
    }
  );
};
```

## 8. 监控与日志

### 8.1 应用监控
```typescript
// src/middleware/monitoring.ts
import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';

export const monitoringMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = performance.now();
  
  res.on('finish', () => {
    const duration = performance.now() - start;
    
    console.log({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
      timestamp: new Date().toISOString()
    });
  });
  
  next();
};
```

### 8.2 错误处理
```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: error.message
    });
  }

  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
};
```

---

**技术实现指南版本**: v1.0  
**最后更新**: 2024年12月  
**适用项目**: EduBoost RWA 全栈式学业支持平台 