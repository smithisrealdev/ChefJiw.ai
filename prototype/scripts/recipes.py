import sys; sys.path.insert(0,'.')
from bots import svg
ROOT='../screens/'
CSS=open('page.py',encoding='utf-8').read().split("css='''")[1].split("'''")[0]
CSS+='''button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid #3B2A22;outline-offset:2px}
a.btn{text-decoration:none;color:inherit}
.num{font-variant-numeric:tabular-nums}
input{font-family:inherit;color:inherit}
input::placeholder{color:#7A5C48;opacity:1}
.chips::-webkit-scrollbar{display:none}
'''
def ic(d,col='#3B2A22',s=24,w=2.2): return f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="{col}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{d}</svg>'
SEARCH=ic('<circle cx="11" cy="11" r="6.500"></circle><path d="M16 16l4.500 4.500"></path>','#7A5C48',22)
CHEV=ic('<path d="M9 5l7 7-7 7"></path>','#7A5C48',20)
BOWL='<svg width="44" height="44" viewBox="0 0 48 48" aria-hidden="true"><path d="M18 8c-3 3 3 5 0 9M26 6c-3 3 3 5 0 9M34 8c-3 3 3 5 0 9" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"></path><path d="M5 22h38c0 10-7 18-19 18S5 32 5 22z" fill="#FFFFFF"></path><rect x="16" y="39" width="16" height="4" rx="2" fill="#FFFFFF"></rect></svg>'
T={'home':'<path d="M3.500 10.600 12 3.600l8.500 7V19.500a1.500 1.500 0 0 1-1.500 1.500H5a1.500 1.500 0 0 1-1.500-1.500z"></path>',
 'book':'<path d="M12 6v14"></path><path d="M3.500 5h5A3.500 3.500 0 0 1 12 8.500 3.500 3.500 0 0 1 15.500 5h5v13h-5.500A2.500 2.500 0 0 0 12 20.500 2.500 2.500 0 0 0 9.500 18H3.500z"></path>',
 'pot':'<path d="M3 12h18"></path><path d="M19.500 12v6.500a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V12"></path><path d="M9.500 9V8.500a2.500 2.500 0 0 1 5 0V9"></path>',
 'heart':'<path d="M12 20.500s-7.500-4.600-7.500-10.200A4.300 4.300 0 0 1 12 7.600a4.300 4.300 0 0 1 7.500 2.700c0 5.600-7.500 10.200-7.500 10.200z"></path>',
 'me':'<circle cx="12" cy="8.500" r="4"></circle><path d="M4.500 20.500a7.500 7.500 0 0 1 15 0"></path>'}
SOONTAB='<button class="press" onClick="{{soonTap}}" aria-label="ชุมชน ยังไม่เปิด" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; width: 64px; height: 64px; padding: 0; border: 0; background: transparent; cursor: pointer"><span style="display: flex; align-items: center; justify-content: center; width: 46px; height: 32px; border-radius: 14px; opacity: 0.45">'+ic(T['heart'],'#7A5C48')+'</span><span style="font-size: 12px; font-weight: 600; color: #7A5C48">เร็วๆ นี้</span></button>'
def tab(label,icon,href=None,active=False):
    col='#3B2A22' if active else '#7A5C48'; bg='background: #FFE3A3;' if active else ''
    inner=f'<span style="display: flex; align-items: center; justify-content: center; width: 46px; height: 32px; border-radius: 14px; {bg}">{ic(T[icon],col)}</span><span style="font-size: 12px; font-weight: 600; color: {col}">{label}</span>'
    box='display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; width: 64px; height: 64px'
    if href: return f'<a class="press btn" href="{href}" style="{box}">{inner}</a>'
    cur=' aria-current="page"' if active else ''
    return f'<button class="press"{cur} style="{box}; padding: 0; border: 0; background: transparent; cursor: pointer">{inner}</button>'
def card_inner(right):
    return f'''<span style="flex: 0 0 auto; display: flex; align-items: center; justify-content: center; width: 72px; height: 72px; border-radius: 20px; background: {{{{item.tint}}}}"><img src="{{{{item.img}}}}" alt="" width="68" height="68" style="display: block"></span>
<span style="flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px">
<span class="mali" style="font-size: 17px; font-weight: 700; line-height: 1.35">{{{{item.name}}}}</span>
<span class="num" style="font-size: 14px; line-height: 1.45; color: #7A5C48">{{{{item.meta}}}}</span>
<span class="num" style="font-size: 14px; line-height: 1.45; font-weight: {{{{item.m2w}}}}; color: {{{{item.m2c}}}}">{{{{item.meta2}}}}</span>
</span>
{right}'''
CARD='display: flex; align-items: center; gap: 12px; min-height: 92px; box-sizing: border-box; padding: 10px 12px 10px 10px; border-radius: 24px; background: #FFFFFF'
html=f'''<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<title>สูตรอาหาร เลือกเมนู</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mali:wght@500;600;700&amp;family=IBM+Plex+Sans+Thai+Looped:wght@400;500;600;700&amp;display=swap">
<style>{CSS}</style>
</helmet>
<div style="position: relative; width: 390px; height: 844px; overflow: hidden; background: #F6E0A6; font-family: 'IBM Plex Sans Thai Looped', sans-serif; color: #3B2A22">
<div style="position: absolute; left: 20px; top: 62px; width: 244px; display: flex; flex-direction: column; gap: 4px">
<h1 class="mali" style="margin: 0; font-size: 28px; font-weight: 700; line-height: 1.25">วันนี้ทำอะไรดี?</h1>
<p style="margin: 0; font-size: 14px; line-height: 1.5; color: #6B4E3A">ราคาและแคลอรี่เป็นตัวเลขตัวอย่าง</p>
</div>
<div class="bot mood-wave" style="position: absolute; left: 276px; top: 4px; width: 96px; height: 139px; transform: scale(0.9); transform-origin: 50% 100%"><span class="hopper" style="display: block">{svg('elephant')}</span></div>
<label style="position: absolute; left: 16px; right: 16px; top: 150px; height: 48px; box-sizing: border-box; padding: 0 14px; display: flex; align-items: center; gap: 10px; background: #FFF8EC; border-radius: 18px">
{SEARCH}
<input type="search" aria-label="ค้นหาเมนู" placeholder="ค้นหาเมนู เช่น กะเพรา" value="{{{{q}}}}" onChange="{{{{onSearch}}}}" style="flex: 1 1 auto; min-width: 0; height: 44px; padding: 0; border: 0; background: transparent; font-size: 16px; outline-offset: 6px">
</label>
<div style="position: absolute; left: 0; right: 0; top: 214px; bottom: 0; box-sizing: border-box; padding: 14px 0 0; display: flex; flex-direction: column; gap: 10px; background: #FFF8EC; border-radius: 28px 28px 0 0">
<div class="chips" style="flex: 0 0 auto; display: flex; gap: 8px; padding: 2px 16px; overflow-x: auto; scrollbar-width: none">
<sc-for list="{{{{chips}}}}" as="chip" hint-placeholder-count="4"><button class="press" onClick="{{{{chip.pick}}}}" aria-pressed="{{{{chip.on}}}}" style="flex: 0 0 auto; height: 44px; padding: 0 16px; border: 0; border-radius: 999px; background: {{{{chip.bg}}}}; color: {{{{chip.fg}}}}; font-size: 15px; font-weight: 600; cursor: pointer">{{{{chip.label}}}}</button></sc-for>
</div>
<span class="num" aria-live="polite" style="padding: 0 20px; font-size: 14px; color: #7A5C48">{{{{countText}}}}</span>
<div style="flex: 1 1 auto; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding: 2px 16px 104px">
<div style="flex: 0 0 auto; display: flex; flex-direction: column; gap: 10px; padding: 12px; border-radius: 22px; background: #E9E6FF">
<div style="display: flex; align-items: center; gap: 10px">
<span style="flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column">
<span class="mali" style="font-size: 17px; font-weight: 700; line-height: 1.35">มีอะไรในตู้เย็น?</span>
<span style="font-size: 14px; line-height: 1.45; color: #4F4A5C">ให้เชฟ AI ช่วยคิดเมนูจากของที่มี</span>
</span>
<button class="press mali" onClick="{{{{aiToggle}}}}" aria-expanded="{{{{aiOpen}}}}" style="flex: 0 0 auto; height: 44px; padding: 0 18px; border: 0; border-radius: 999px; background: #24212B; color: #FFFFFF; font-size: 15px; font-weight: 700; cursor: pointer">{{{{aiBtn}}}}</button>
</div>
<sc-if value="{{{{aiOpen}}}}" hint-placeholder-val="{{{{false}}}}">
<div role="group" aria-label="ของที่มีในตู้เย็น" style="display: flex; flex-wrap: wrap; gap: 8px">
<sc-for list="{{{{pantry}}}}" as="p" hint-placeholder-count="12"><button class="press" onClick="{{{{p.pick}}}}" aria-pressed="{{{{p.on}}}}" style="height: 44px; padding: 0 14px; border: 0; border-radius: 999px; background: {{{{p.bg}}}}; color: {{{{p.fg}}}}; font-size: 15px; font-weight: 600; cursor: pointer">{{{{p.label}}}}</button></sc-for>
</div>
<div aria-live="polite" style="display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border-radius: 16px; background: #FFF3B0">
<span class="mali" style="font-size: 14px; font-weight: 700">เชฟช้างแนะนำ</span>
<p style="margin: 0; font-size: 16px; line-height: 1.5">{{{{aiSay}}}}</p>
</div>
<span style="font-size: 13px; line-height: 1.45; color: #4F4A5C">นับเฉพาะวัตถุดิบหลัก ไม่นับเครื่องปรุง ต้นแบบนี้จับคู่จากรายการที่เตรียมไว้ แอปจริงจะพิมพ์หรือถ่ายรูปตู้เย็นให้เชฟดูได้</span>
</sc-if>
</div>
<sc-for list="{{{{ready}}}}" as="item" hint-placeholder-count="2">
<a class="press btn" data-go="item.go" href="Cook.dc.html" style="{CARD}">
{card_inner('<span style="flex: 0 0 auto; display: flex; align-items: center; gap: 2px"><span class="mali num" style="font-size: 17px; font-weight: 700">{{item.price}}</span>'+CHEV+'</span>')}
</a>
</sc-for>
<sc-if value="{{{{hasSoon}}}}" hint-placeholder-val="{{{{true}}}}">
<h2 class="mali" style="margin: 8px 4px 0; font-size: 16px; font-weight: 700; color: #7A5C48">กำลังจะมา เร็วๆ นี้</h2>
<sc-for list="{{{{soon}}}}" as="item" hint-placeholder-count="2">
<div style="display: flex; align-items: center; gap: 12px; min-height: 68px; box-sizing: border-box; padding: 8px 14px 8px 8px; border-radius: 20px; background: #FFFFFF; opacity: 0.8">
<span style="flex: 0 0 auto; display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; border-radius: 16px; background: {{{{item.tint}}}}"><img src="{{{{item.img}}}}" alt="" width="48" height="48" style="display: block"></span>
<span style="flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column">
<span class="mali" style="font-size: 16px; font-weight: 700; line-height: 1.35">{{{{item.name}}}}</span>
<span class="num" style="font-size: 14px; line-height: 1.4; color: #7A5C48">{{{{item.soonMeta}}}}</span>
</span>
<span class="mali num" style="flex: 0 0 auto; font-size: 16px; font-weight: 700">{{{{item.price}}}}</span>
</div>
</sc-for>
</sc-if>
<sc-if value="{{{{empty}}}}" hint-placeholder-val="{{{{false}}}}">
<div style="display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 28px 16px; text-align: center">
<span class="mali" style="font-size: 18px; font-weight: 700">ยังไม่มีเมนูที่ตรงเลย</span>
<span style="font-size: 16px; line-height: 1.5; color: #7A5C48">ลองคำค้นอื่น หรือล้างตัวกรองดูนะ</span>
<button class="press mali" onClick="{{{{reset}}}}" style="height: 48px; padding: 0 22px; border: 0; border-radius: 18px; background: #C2512E; color: #FFFFFF; font-size: 16px; font-weight: 700; cursor: pointer">ล้างตัวกรอง</button>
</div>
</sc-if>
</div>
</div>
<nav aria-label="เมนูหลัก" style="position: absolute; left: 12px; right: 12px; bottom: 14px; height: 72px; box-sizing: border-box; padding: 0 8px; display: flex; align-items: center; justify-content: space-between; background: #FFE3A3; border-radius: 28px; z-index: 900">
{tab('ร้าน','home','Restaurant.dc.html')}
{tab('สูตรอาหาร','book',None,True)}
{tab('ทำอาหาร','pot','Cook.dc.html')}
{SOONTAB}
{tab('ฉัน','me','Me.dc.html')}
</nav>
<sc-if value="{{{{toast}}}}" hint-placeholder-val="{{{{false}}}}"><div class="card0" role="status" aria-live="polite" style="position: absolute; left: 24px; right: 24px; bottom: 98px; padding: 12px 16px; border-radius: 18px; background: #24212B; color: #FFFFFF; font-size: 15px; font-weight: 600; line-height: 1.45; text-align: center; z-index: 950">หน้าชุมชนยังไม่เปิด เร็วๆ นี้จะได้แชร์เมนูกัน</div></sc-if>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":390,"height":844}}}}'>
class Component extends DCLogic {{
  constructor(props) {{
    super(props);
    this.state = {{ q: '', filter: 'all', ai: false, have: {{}} }};
  }}
  renderVals() {{
    const s = this.state;
    const all = [
      {{ id: 'kaprao', name: 'กะเพราหมูสับไข่ดาว', min: 15, lv: 'ง่าย', baht: 50, kcal: 650, tint: '#F2876B', ready: true }},
      {{ id: 'omelet', name: 'ไข่เจียวหมูสับ', min: 10, lv: 'ง่าย', baht: 30, kcal: 550, tint: '#F2C14E', ready: true }},
      {{ name: 'ข้าวผัดไข่', min: 12, lv: 'ง่าย', baht: 35, kcal: 580, tint: '#E3A04F' }},
      {{ name: 'ผัดผักบุ้งไฟแดง', min: 8, lv: 'ง่าย', baht: 25, kcal: 210, tint: '#86B37F' }},
      {{ name: 'ต้มยำกุ้ง', min: 25, lv: 'ปานกลาง', baht: 120, kcal: 320, tint: '#E8697A' }},
      {{ name: 'แกงเขียวหวานไก่', min: 35, lv: 'ปานกลาง', baht: 95, kcal: 610, tint: '#8E9BE3' }},
    ];
    const PIC = {{ 'กะเพราหมูสับไข่ดาว': '/_blob/6c2552b0403b97e680de31c0a2deaa28', 'ไข่เจียวหมูสับ': '/_blob/57d72c67af1ee4e1b933a4afefac4e80', 'ข้าวผัดไข่': '/_blob/a64862a8c02a9f44b151cc9981fc09f1', 'ผัดผักบุ้งไฟแดง': '/_blob/0be76187f19ed08abc65a51059154705', 'ต้มยำกุ้ง': '/_blob/841f9e64f4da943f588bffe8f5e331c1', 'แกงเขียวหวานไก่': '/_blob/56a522461fd3bec4f8eb3b88ebaecd86' }};
    const tests = {{ all: () => true, fast: (r) => r.min <= 15, cheap: (r) => r.baht <= 40, light: (r) => r.kcal < 400 }};
    const q = s.q.trim(), P = this.prof();
    const NEED = {{ 'กะเพราหมูสับไข่ดาว': ['หมูสับ', 'ไข่', 'ใบกะเพรา', 'กระเทียม', 'พริก', 'ข้าวสวย'], 'ไข่เจียวหมูสับ': ['ไข่', 'หมูสับ'], 'ข้าวผัดไข่': ['ข้าวสวย', 'ไข่', 'กระเทียม'], 'ผัดผักบุ้งไฟแดง': ['ผักบุ้ง', 'กระเทียม', 'พริก'], 'ต้มยำกุ้ง': ['กุ้ง', 'เห็ด', 'เครื่องต้มยำ'], 'แกงเขียวหวานไก่': ['ไก่', 'กะทิ', 'พริกแกงเขียวหวาน'] }};
    const SUB = {{ 'ใบกะเพรา': 'ใบโหระพา', 'หมูสับ': 'ไก่' }};
    const PANTRY = ['ไข่', 'หมูสับ', 'ไก่', 'กุ้ง', 'ข้าวสวย', 'กระเทียม', 'พริก', 'ใบกะเพรา', 'ใบโหระพา', 'ผักบุ้ง', 'เห็ด', 'กะทิ'];
    const have = s.have, picked = PANTRY.filter((n) => have[n]), fridge = s.ai && picked.length > 0;
    const fit = (r) => {{
      const miss = NEED[r.name].filter((n) => !have[n]);
      const swaps = r.ready ? miss.filter((n) => SUB[n] && have[SUB[n]]) : [];
      const hard = miss.filter((n) => swaps.indexOf(n) < 0);
      return {{ swaps, hard, rank: hard.length * 10 + swaps.length + (r.ready ? 0 : 0.5) }};
    }};
    const lack = (a) => 'ขาด ' + a.slice(0, 2).join(' ') + (a.length > 2 ? ' และอีก ' + (a.length - 2) + ' อย่าง' : '');
    const swapText = (a) => a.map((n) => 'ใช้' + SUB[n] + 'แทน' + n).join(' ');
    const fitLine = (f) => (f.hard.length ? lack(f.hard) : f.swaps.length ? swapText(f.swaps) : 'ของครบ ทำได้เลย');
    const pool = all.filter((r) => tests[s.filter](r) && (!q || r.name.indexOf(q) >= 0)).map((r) => ({{ r, f: fit(r) }}));
    if (fridge) pool.sort((a, b) => a.f.rank - b.f.rank);
    const top = fridge ? all.filter((r) => r.ready).map((r) => ({{ r, f: fit(r) }})).sort((a, b) => a.f.rank - b.f.rank)[0] : null;
    const aiSay = !fridge ? 'แตะของที่มีอยู่ เชฟจะเรียงเมนูที่ทำได้ให้'
      : top.f.hard.length === 0 && top.f.swaps.length === 0 ? 'ทำ' + top.r.name + 'ได้เลย ของครบแล้ว'
      : top.f.hard.length === 0 ? top.r.name + 'ทำได้ ' + swapText(top.f.swaps) + ' เปิดสูตรแล้วกดให้เชฟ AI ปรับสูตรได้เลย'
      : 'ใกล้สุดคือ' + top.r.name + ' ' + lack(top.f.hard) + (top.f.swaps.length ? ' ส่วน' + top.f.swaps.join(' ') + 'เชฟปรับสูตรแทนให้ได้' : '');
    const items = pool.map(({{ r, f }}) => ({{
      m2c: fridge ? (f.hard.length ? '#8A3B12' : '#1E7A45') : '#6B6777', m2w: fridge ? 600 : 400,
      soonMeta: fridge ? (f.hard.length ? lack(f.hard) : 'ของหลักครบ รอสูตรเปิด') : r.min + ' นาที · ' + r.lv,
      name: r.name, img: PIC[r.name], tint: r.tint, ready: !!r.ready, soon: !r.ready,
      meta: r.min + ' นาที · ' + r.lv, meta2: fridge ? fitLine(f) : P.count(r.name) ? 'ทำแล้ว ' + P.count(r.name) + ' ครั้ง · ดีสุด ' + P.best(r.name).toFixed(1) + ' ดาว' : 'ราว ' + r.kcal + ' แคล', price: '฿' + r.baht,
      go: () => (this.props.app ? this.props.app.cook(r.id) : null),
    }}));
    const defs = [['all', 'ทั้งหมด'], ['fast', 'ไม่เกิน 15 นาที'], ['cheap', 'ไม่เกิน ฿40'], ['light', 'แคลน้อย']];
    return {{
      q: s.q, empty: items.length === 0, ready: items.filter((i) => i.ready), soon: items.filter((i) => i.soon), hasSoon: items.some((i) => i.soon),
      aiOpen: s.ai, aiBtn: s.ai ? 'ปิด' : 'เลือกของ', aiSay,
      aiToggle: () => this.setState({{ ai: !s.ai }}),
      pantry: PANTRY.map((n) => ({{ label: n, on: !!have[n], bg: have[n] ? '#24212B' : 'white', fg: have[n] ? 'white' : '#24212B', pick: () => this.setState({{ have: Object.assign({{}}, have, {{ [n]: !have[n] }}) }}) }})),
      countText: fridge ? 'เรียงตามของที่คุณมี ' + picked.length + ' อย่าง' : items.length ? 'ทำได้เลย ' + items.filter((i) => i.ready).length + ' เมนู · กำลังจะมา ' + items.filter((i) => i.soon).length + ' เมนู' : '',
      soonTap: () => {{ this.setState({{ toast: true }}); clearTimeout(this.tt); this.tt = setTimeout(() => this.setState({{ toast: false }}), 3000); }}, toast: !!s.toast,
      onSearch: (e) => this.setState({{ q: e.target.value }}),
      reset: () => this.setState({{ q: '', filter: 'all' }}),
      chips: defs.map(([id, label]) => ({{
        label, on: s.filter === id, bg: s.filter === id ? '#3B2A22' : '#FFFFFF', fg: s.filter === id ? '#FFFFFF' : '#3B2A22',
        pick: () => this.setState({{ filter: id }}),
      }})),
    }};
  }}
}}
</script>
</body>
</html>
'''
open(ROOT+'Recipes.dc.html','w',encoding='utf-8').write(html)
print(len(html), '{item.price}' in html.replace('{{item.price}}',''))
