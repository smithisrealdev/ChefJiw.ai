// แปลง SVG ของเชฟจิ๋วเป็น PNG พื้นใส 720px
const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 720, height: 720 } });
  for (const n of ['hi', 'cook', 'cheer', 'think', 'oops', 'taste']) {
    await p.setContent(`<body style="margin:0">${fs.readFileSync(n + '.svg', 'utf8').replace('width="480" height="480"', 'width="720" height="720"')}</body>`);
    await p.screenshot({ path: process.argv[2] + '/' + n + '.png', omitBackground: true });
  }
  await b.close(); console.log('ok'); })();
