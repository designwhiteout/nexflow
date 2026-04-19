// api/canvas.js
// 画布数据读写 API
// GET  /api/canvas?room=xxx  → 读取画布
// POST /api/canvas?room=xxx  → 保存画布

const { kv } = require('@vercel/kv');

const MAX_ROOMS = 100;           // 最多房间数
const MAX_SIZE_BYTES = 500000;   // 单个画布最大 500KB

// 简单跨域头
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  setCors(res);

  // OPTIONS 预检
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const room = (req.query.room || '').trim().toLowerCase();

  // 房间码校验：只允许字母数字和连字符，3-32位
  if (!room || !/^[a-z0-9-]{3,32}$/.test(room)) {
    return res.status(400).json({ error: '房间码无效（3-32位字母数字或连字符）' });
  }

  const key = `canvas:${room}`;

  // ── GET：读取画布 ──
  if (req.method === 'GET') {
    try {
      const data = await kv.get(key);
      if (!data) {
        return res.status(200).json({ exists: false, canvas: null });
      }
      return res.status(200).json({ exists: true, canvas: data });
    } catch (err) {
      console.error('GET error:', err);
      return res.status(500).json({ error: '读取失败，请稍后重试' });
    }
  }

  // ── POST：保存画布 ──
  if (req.method === 'POST') {
    try {
      const body = req.body;

      // 大小检查
      const bodyStr = JSON.stringify(body);
      if (bodyStr.length > MAX_SIZE_BYTES) {
        return res.status(413).json({ error: '画布数据过大（超过500KB）' });
      }

      // 写入 KV，设置 TTL 90天
      await kv.set(key, body, { ex: 60 * 60 * 24 * 90 });

      return res.status(200).json({ ok: true, room, savedAt: new Date().toISOString() });
    } catch (err) {
      console.error('POST error:', err);
      return res.status(500).json({ error: '保存失败，请稍后重试' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
