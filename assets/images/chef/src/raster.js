// แปลง SVG ทุกไฟล์ในโฟลเดอร์นี้เป็น PNG พื้นใส 720px
const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 720, height: 720 } });
  for (const n of fs.readdirSync('.').filter((f) => f.endsWith('.svg')).map((f) => f.slice(0, -4))) {
    // ตัวละคร 480 ขยาย 1.5 เท่า ฉากขยาย 2 เท่า
    const svg = fs.readFileSync(n + '.svg', 'utf8'); const [, w, h] = svg.match(/width="(\d+)" height="(\d+)"/).map(Number); const k = w === 480 ? 1.5 : 2;
    await p.setViewportSize({ width: w * k, height: h * k });
    await p.setContent(`<body style="margin:0">${svg.replace(`width="${w}" height="${h}"`, `width="${w * k}" height="${h * k}"`)}</body>`);
    await p.screenshot({ path: process.argv[2] + '/' + n + '.png', omitBackground: true });
  }
  await b.close(); console.log('ok'); })();
