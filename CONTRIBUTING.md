# 贡献指南

感谢您对 EduBoost RWA 项目的关注！我们欢迎所有形式的贡献，包括但不限于：

- 🐛 Bug 报告
- 💡 功能建议
- 📝 文档改进
- 🔧 代码贡献
- 🎨 UI/UX 改进
- 🧪 测试用例

## 开发环境设置

### 前置要求

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose
- Solana CLI
- Anchor CLI

### 本地开发设置

1. **Fork 项目**
```bash
# 在 GitHub 上 Fork 项目
# 然后克隆你的 Fork
git clone https://github.com/YOUR_USERNAME/RWA.git
cd RWA
```

2. **设置上游仓库**
```bash
git remote add upstream https://github.com/zane0623/RWA.git
```

3. **安装依赖**
```bash
# 运行项目初始化脚本
chmod +x setup_project.sh
./setup_project.sh
```

4. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，填入相应的配置
```

5. **启动开发环境**
```bash
npm run dev
```

## 贡献流程

### 1. 创建 Issue

在开始任何工作之前，请先创建一个 Issue 来描述你想要解决的问题或添加的功能。

- **Bug 报告**: 请包含详细的错误信息、复现步骤和预期行为
- **功能建议**: 请描述功能需求、使用场景和预期效果
- **文档改进**: 请指出需要改进的具体部分

### 2. 创建分支

```bash
# 确保你的本地 main 分支是最新的
git checkout main
git pull upstream main

# 创建新的功能分支
git checkout -b feature/your-feature-name
# 或者
git checkout -b fix/your-bug-fix
```

### 3. 开发

- 遵循项目的代码规范
- 编写清晰的提交信息
- 添加必要的测试用例
- 更新相关文档

### 4. 提交代码

```bash
# 添加你的更改
git add .

# 提交更改（使用清晰的提交信息）
git commit -m "feat: add new feature description"
git commit -m "fix: resolve bug description"
git commit -m "docs: update documentation"
git commit -m "test: add test cases"
```

### 5. 推送分支

```bash
git push origin feature/your-feature-name
```

### 6. 创建 Pull Request

1. 在 GitHub 上创建 Pull Request
2. 选择正确的目标分支（通常是 `main`）
3. 填写详细的 PR 描述，包括：
   - 解决的问题
   - 实现的功能
   - 测试情况
   - 相关 Issue 链接

## 代码规范

### 提交信息格式

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**类型 (type):**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**示例:**
```
feat(auth): add OAuth login support
fix(api): resolve user registration validation issue
docs(readme): update installation instructions
test(learning): add unit tests for learning path algorithm
```

### 代码风格

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 和 Prettier 配置
- 使用有意义的变量和函数名
- 添加必要的注释
- 保持函数简洁，单一职责

### 测试要求

- 新功能必须包含单元测试
- Bug 修复必须包含回归测试
- 测试覆盖率不应低于 80%
- 所有测试必须通过

## 审查流程

1. **自动检查**: CI/CD 会自动运行测试和代码质量检查
2. **代码审查**: 至少需要一名维护者的批准
3. **测试验证**: 确保所有测试通过
4. **文档更新**: 确保相关文档已更新

## 问题报告

### Bug 报告模板

```markdown
## Bug 描述
简要描述这个 Bug

## 复现步骤
1. 进入 '...'
2. 点击 '...'
3. 滚动到 '...'
4. 看到错误

## 预期行为
描述你期望发生的事情

## 实际行为
描述实际发生的事情

## 环境信息
- 操作系统: [例如 Windows 10, macOS 11.0]
- 浏览器: [例如 Chrome 90, Safari 14]
- Node.js 版本: [例如 18.0.0]
- 项目版本: [例如 1.0.0]

## 附加信息
任何其他相关的截图、日志或信息
```

### 功能建议模板

```markdown
## 功能描述
简要描述你想要的功能

## 使用场景
描述这个功能的使用场景和用户价值

## 实现建议
如果有的话，提供实现建议

## 替代方案
如果有的话，描述替代方案

## 附加信息
任何其他相关信息
```

## 社区准则

### 行为准则

我们致力于为每个人提供友好、安全和欢迎的环境，无论其背景如何。请：

- 尊重他人
- 使用包容性语言
- 接受建设性批评
- 专注于对社区最有利的事情
- 对其他社区成员表现出同理心

### 沟通渠道

- **GitHub Issues**: Bug 报告和功能建议
- **GitHub Discussions**: 一般讨论和问题
- **Pull Requests**: 代码贡献和审查

## 发布流程

### 版本号规则

我们使用 [Semantic Versioning](https://semver.org/) (SemVer):

- **主版本号**: 不兼容的 API 修改
- **次版本号**: 向下兼容的功能性新增
- **修订号**: 向下兼容的问题修正

### 发布步骤

1. 更新版本号
2. 更新 CHANGELOG.md
3. 创建发布标签
4. 发布到 npm（如果适用）
5. 更新文档

## 致谢

感谢所有为这个项目做出贡献的开发者！你的贡献让 EduBoost RWA 变得更好。

---

如果你有任何问题或需要帮助，请随时创建 Issue 或联系项目维护者。 