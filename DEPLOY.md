# 部署 Next.js 到 Vercel

## 前提条件

- 项目已推送到 GitHub
- 有 Vercel 账号（用 GitHub 登录）
- 本地已安装 Vercel CLI（`npm i -g vercel`）

---

## 方式一：通过 GitHub 自动部署（推荐）

### 1. 推送代码到 GitHub

```bash
# 初始化 git（如果还没有）
git init
git add .
git commit -m "init"

# 在 GitHub 新建仓库，然后
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

### 2. 在 Vercel 导入项目

1. 打开 https://vercel.com/new
2. 点击 **Import Git Repository**
3. 选择你的 GitHub 仓库
4. **框架**会自动识别为 Next.js，不用改
5. **Root Directory**：如果整个仓库就是 Next.js 项目，留空；如果在子目录（如 `nextjs-app/`），填子目录名
6. 点击 **Deploy**

### 3. 配置环境变量（如果有）

- Deploy 完成后进入项目 → **Settings → Environment Variables**
- 添加 `.env.local` 里的所有变量
- 改完后点 **Redeploy**

### 4. 后续自动部署

每次 `git push origin main`，Vercel 自动触发重新部署，无需手动操作。

---

## 方式二：Vercel CLI 手动部署

### 1. 安装并登录

```bash
npm i -g vercel
vercel login   # 浏览器弹出，选 GitHub 授权
```

### 2. 部署

```bash
cd 你的项目目录

# 首次部署（会问几个问题，一路回车默认即可）
vercel

# 部署到生产环境
vercel --prod
```

### 3. 配置环境变量

```bash
# 添加环境变量到 Vercel
vercel env add DATABASE_URL production
vercel env add OPENROUTER_API_KEY production

# 查看已有变量
vercel env ls
```

### 4. 后续更新

```bash
vercel --prod
```

---

## 常见注意事项

| 问题 | 解决方法 |
|------|---------|
| 构建失败：Prisma | 在 `package.json` 的 `build` 脚本加 `prisma generate &&` |
| 图片跨域 | 在 `next.config.ts` 的 `images.remotePatterns` 里加域名 |
| 环境变量读不到 | Vercel 上加了变量后必须 Redeploy 才生效 |
| `next.config.ts` 不支持 | 旧版 Next.js 改用 `next.config.js` |
| 端口冲突 | Vercel 不需要指定端口，自动处理 |
| API 超时 | 在 Route Handler 里加 `export const maxDuration = 60` |

---

## 本项目特殊配置（tracing-art-clone）

`next.config.ts` 已配置 Wikimedia 图片域名白名单，部署前确认：

```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'upload.wikimedia.org' },
  ],
}
```

图片代理 API（`/api/proxy`）在 Vercel 上会作为 Serverless Function 运行，无需额外配置。

---

## 绑定自定义域名

### 方式一：Vercel 控制台（推荐）

1. 打开 Vercel 项目 → **Settings → Domains**
2. 输入你的域名（如 `art.yourdomain.com`）点 **Add**
3. Vercel 给你两条 DNS 记录，按提示选一种：

   **A 记录**（根域名 `yourdomain.com`）：
   ```
   类型: A
   名称: @
   值:   76.76.21.21
   ```

   **CNAME 记录**（子域名 `art.yourdomain.com`）：
   ```
   类型: CNAME
   名称: art
   值:   cname.vercel-dns.com
   ```

4. 去你的域名注册商（阿里云 / 腾讯云 / Cloudflare 等）DNS 设置里添加上面的记录
5. 等待 DNS 生效（通常 5 分钟到 1 小时），Vercel 自动签发 HTTPS 证书

### 方式二：Vercel CLI

```bash
vercel domains add yourdomain.com
```

### DNS 生效验证

```bash
dig art.yourdomain.com
# 或
nslookup art.yourdomain.com
```

### 注意

- 根域名（`@`）必须用 **A 记录**，不能用 CNAME
- 子域名（`www` / `art` 等）用 **CNAME** 更稳定
- 域名绑定后 HTTPS 自动配置，无需额外操作
