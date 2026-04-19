# MindFlow Canvas — Vercel 部署指南

## 项目结构

```
vercel-app/
├── api/
│   └── canvas.js        # Serverless API（读写画布数据）
├── public/
│   └── index.html       # 前端页面
├── package.json
└── vercel.json
```

---

## 部署步骤

### 第一步：上传到 GitHub

1. 在 GitHub 新建一个**私有仓库**（推荐私有，防止他人查看代码）
2. 将 `vercel-app/` 文件夹内容上传（不是上传文件夹本身，是里面的内容）
3. 确保仓库根目录有 `vercel.json`、`package.json`、`api/`、`public/`

### 第二步：在 Vercel 创建 KV 数据库

1. 登录 [vercel.com](https://vercel.com) → 进入 Dashboard
2. 点击顶部 **Storage** → **Create Database** → 选择 **KV**
3. 名称随意（如 `mindflow-kv`），区域选 **Washington DC**（延迟较低）
4. 创建后点击 **`.env.local`** 标签，可以看到：
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### 第三步：导入项目到 Vercel

1. Vercel Dashboard → **Add New Project** → 选择第一步的 GitHub 仓库
2. 点击 **Deploy**（先部署一次）
3. 部署完成后，进入项目 → **Settings** → **Storage**
4. 点击 **Connect Database** → 选择刚才创建的 KV 数据库 → **Connect**
5. 这会自动把 KV 环境变量注入到项目中

### 第四步：重新部署

1. 进入项目 → **Deployments** → 点击最新部署旁的 `···` → **Redeploy**
2. 等待部署完成，获得网址（如 `https://mindflow-canvas.vercel.app`）

---

## 使用方式

1. 打开网址，输入**房间码**（如 `nexpanel-strategy`）
2. 进入画布，开始创作
3. 任何修改会在 **3秒后自动同步**到云端
4. 在另一台设备打开同一链接，输入相同房间码，即可看到同步内容
5. 点击 **⚙️** → **☁️ 立即同步** 可手动强制保存

## 注意事项

- 房间码：3-32位，字母/数字/连字符，不区分大小写
- 画布数据保存 **90天**，90天无活动自动过期
- 单个画布最大 **500KB**（约500个节点）
- Vercel KV 免费套餐：500MB 存储，每月 10万次请求

---

## 本地开发测试

如需本地测试 API（需要 Vercel CLI）：

```bash
npm install -g vercel
cd vercel-app
npm install
vercel dev
```

然后访问 `http://localhost:3000`
