import sys; sys.path.insert(0,'.')
from bots import svg
ROOT='../screens/'
INK='#24212B'; MUTE='#6B6777'; SOFT='#F5F3FC'
CSS=open('page.py',encoding='utf-8').read().split("css='''")[1].split("'''")[0]
CSS=CSS.replace('rgba(60,35,20,.28)','rgba(60,45,70,.16)')+'''button:focus-visible,a:focus-visible{outline:3px solid #24212B;outline-offset:2px}
a.btn{text-decoration:none;color:inherit}
.num{font-variant-numeric:tabular-nums}
.chips::-webkit-scrollbar{display:none}
'''
def ic(d,col=INK,s=24,w=2.4,fill='none'): return f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="{fill}" stroke="{col}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{d}</svg>'
BACK=ic('<path d="M15 5l-7 7 7 7"></path>')
CHECK=ic('<path d="M5 12.500l4.500 4.500L19 7.500"></path>','#FFFFFF',16,3)
PLUS=ic('<path d="M12 6v12M6 12h12"></path>',INK,16,2.8)
UP=ic('<path d="M12 19V5M6 11l6-6 6 6"></path>','#C2362F',16,2.6)
DOWN=ic('<path d="M12 5v14M6 13l6 6 6-6"></path>','#1E7A45',16,2.6)
SAME=ic('<path d="M6 12h12"></path>',MUTE,16,2.6)
HEART='<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.500s-7.500-4.600-7.500-10.200A4.300 4.300 0 0 1 12 7.600a4.300 4.300 0 0 1 7.500 2.700c0 5.600-7.500 10.200-7.500 10.200z" fill="{{item.heartFill}}" stroke="{{item.heartStroke}}" stroke-width="2.2" stroke-linejoin="round"></path></svg>'
def mascot(k,left=276,top=4,scale=0.9): return f'<div class="bot mood-wave" style="position: absolute; left: {left}px; top: {top}px; width: 96px; height: 139px; transform: scale({scale}); transform-origin: 50% 100%"><span class="hopper" style="display: block">{svg(k)}</span></div>'
def page(title,bg,h1,sub,k,strip,body,bottom,script,back=True):
    backbtn=f'<a class="press btn" href="Restaurant.dc.html" aria-label="กลับหน้าร้าน" style="position: absolute; left: 12px; top: 50px; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 999px; background: #FFFFFF">{BACK}</a>' if back else ''
    tleft=68 if back else 20
    return f'''<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mali:wght@500;600;700&amp;family=IBM+Plex+Sans+Thai+Looped:wght@400;500;600;700&amp;display=swap">
<style>{CSS}</style>
</helmet>
<div style="position: relative; width: 390px; height: 844px; overflow: hidden; background: {bg}; font-family: 'IBM Plex Sans Thai Looped', sans-serif; color: {INK}">
{backbtn}
<div style="position: absolute; left: {tleft}px; top: 50px; width: 204px; display: flex; flex-direction: column; gap: 2px">
<h1 class="mali" style="margin: 0; font-size: 24px; font-weight: 700; line-height: 1.3">{h1}</h1>
<p style="margin: 0; font-size: 14px; line-height: 1.5; color: #3F3A4A">{sub}</p>
</div>
{mascot(k)}
{strip}
<div style="position: absolute; left: 0; right: 0; top: 214px; bottom: 0; box-sizing: border-box; padding: 14px 0 0; display: flex; flex-direction: column; gap: 10px; background: #FFFFFF; border-radius: 28px 28px 0 0">
{body}
</div>
{bottom}
</div>
</x-dc>
{script}
</body>
</html>
'''
ROW=f'display: flex; align-items: center; gap: 12px; width: 100%; min-height: 72px; box-sizing: border-box; padding: 8px 14px 8px 8px; border: 0; border-radius: 20px; background: {SOFT}; text-align: left'
CHIP='flex: 0 0 auto; height: 44px; padding: 0 16px; border: 0; border-radius: 999px; background: {{chip.bg}}; color: {{chip.fg}}; font-size: 15px; font-weight: 600; cursor: pointer'
# ---------------- Market ----------------
m_strip=f'''<div style="position: absolute; left: 16px; right: 16px; top: 150px; min-height: 48px; box-sizing: border-box; padding: 8px 16px; display: flex; align-items: center; background: #FFFFFF; border-radius: 18px 18px 18px 6px">
<p class="mali" style="margin: 0; font-size: 16px; font-weight: 600; line-height: 1.4">วันนี้ผักบุ้งถูกลง ทำผัดผักบุ้งคุ้มสุด</p>
</div>'''
m_body=f'''<div class="chips" style="flex: 0 0 auto; display: flex; gap: 8px; padding: 2px 16px; overflow-x: auto; scrollbar-width: none">
<sc-for list="{{{{chips}}}}" as="chip" hint-placeholder-count="4"><button class="press" onClick="{{{{chip.pick}}}}" aria-pressed="{{{{chip.on}}}}" style="{CHIP}">{{{{chip.label}}}}</button></sc-for>
</div>
<span style="padding: 0 20px; font-size: 14px; color: {MUTE}">แตะเพื่อใส่ในรายการซื้อ</span>
<div style="flex: 1 1 auto; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding: 2px 16px 112px">
<sc-for list="{{{{items}}}}" as="item" hint-placeholder-count="6">
<button class="press" onClick="{{{{item.toggle}}}}" aria-pressed="{{{{item.picked}}}}" style="{ROW}; cursor: pointer">
<span style="position: relative; flex: 0 0 auto; width: 56px; height: 56px; border-radius: 18px; background: #FFFFFF"><img src="{{{{item.img}}}}" alt="" width="52" height="52" style="position: absolute; left: 2px; top: 2px; display: block"><span style="position: absolute; right: -5px; bottom: -5px; display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 999px; background: {{{{item.boxBg}}}}; box-shadow: 0 0 0 2px #F5F3FC"><sc-if value="{{{{item.picked}}}}" hint-placeholder-val="{{{{false}}}}">{CHECK}</sc-if><sc-if value="{{{{item.unpicked}}}}" hint-placeholder-val="{{{{true}}}}">{PLUS}</sc-if></span></span>
<span style="flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column">
<span style="font-size: 16px; font-weight: 600; line-height: 1.4">{{{{item.name}}}}</span>
<span style="font-size: 14px; line-height: 1.4; color: {MUTE}">{{{{item.unit}}}}</span>
</span>
<span style="flex: 0 0 auto; display: flex; flex-direction: column; align-items: flex-end">
<span class="mali num" style="font-size: 18px; font-weight: 700; line-height: 1.3">{{{{item.price}}}}</span>
<span class="num" style="display: flex; align-items: center; gap: 2px; font-size: 14px; font-weight: 600; color: {{{{item.chColor}}}}"><sc-if value="{{{{item.up}}}}" hint-placeholder-val="{{{{false}}}}">{UP}</sc-if><sc-if value="{{{{item.down}}}}" hint-placeholder-val="{{{{false}}}}">{DOWN}</sc-if><sc-if value="{{{{item.same}}}}" hint-placeholder-val="{{{{true}}}}">{SAME}</sc-if>{{{{item.chText}}}}</span>
</span>
</button>
</sc-for>
</div>'''
m_bottom=f'''<div style="position: absolute; left: 12px; right: 12px; bottom: 16px; height: 72px; box-sizing: border-box; padding: 0 8px 0 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: #FFE66D; border-radius: 26px">
<div style="display: flex; flex-direction: column">
<span class="num" aria-live="polite" style="font-size: 14px; color: #4F4A5C">{{{{cartText}}}}</span>
<span class="mali num" style="font-size: 22px; font-weight: 700; line-height: 1.2">{{{{totalText}}}}</span>
</div>
<a class="press btn mali" href="Recipes.dc.html" style="flex: 0 0 auto; display: flex; align-items: center; height: 56px; padding: 0 22px; border-radius: 20px; background: {INK}; color: #FFFFFF; font-weight: 700; font-size: 17px">หาเมนูทำ</a>
</div>'''
m_script='''<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":390,"height":844}}'>
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { cat: 'all', cart: {} }; }
  renderVals() {
    const s = this.state;
    const all = [
      { id: 'pork', name: 'หมูสับ', unit: 'ต่อกิโลกรัม', p: 165, d: 5, c: 'meat' },
      { id: 'chicken', name: 'อกไก่', unit: 'ต่อกิโลกรัม', p: 85, d: -3, c: 'meat' },
      { id: 'egg', name: 'ไข่ไก่', unit: 'แผง 30 ฟอง', p: 135, d: 0, c: 'dry' },
      { id: 'morning', name: 'ผักบุ้ง', unit: 'ต่อกำ', p: 15, d: -2, c: 'veg' },
      { id: 'basil', name: 'ใบกะเพรา', unit: 'ต่อกำ', p: 10, d: 0, c: 'veg' },
      { id: 'chili', name: 'พริกขี้หนู', unit: 'ต่อขีด', p: 12, d: -1, c: 'veg' },
      { id: 'garlic', name: 'กระเทียม', unit: 'ต่อกิโลกรัม', p: 120, d: 10, c: 'dry' },
      { id: 'rice', name: 'ข้าวหอมมะลิ', unit: 'ต่อกิโลกรัม', p: 42, d: 0, c: 'dry' },
    ];
    const IMG = { pork: '/_blob/86fdb695be776bfd7914cdfa1c29ed25', egg: '/_blob/c6263c9b14efb6319b8350ce20511359', garlic: '/_blob/d6b929345fd698afe2cfc77cdb952825', chili: '/_blob/88051bbf2bf5bf095b12be008a28cda8', rice: '/_blob/5658e513ce137923d2aca173599a06ac', fish: '/_blob/05ce225d90694a189c0c4bbf2a952007', morning: '/_blob/78d54072a7ea0047ddab68f6e27714f4', chicken: '/_blob/767838a8b05cd8c28cb1ce6f3ecfaf85', basil: '/_blob/4083ec0fb9b6108174fd3446c825d9ae', oil: '/_blob/a10e54971cdb2b6586d6bb567274734e', oyster: '/_blob/1993ea62a5612c98d85cebbdb42ac759', soy: '/_blob/16b0afb00d2625eb9d959e40eb090198', sugar: '/_blob/42122d7213e3fd2b87ea71b26bad3f9f' };
    let total = 0, n = 0;
    all.forEach((r) => { if (s.cart[r.id]) { total += r.p; n += 1; } });
    const items = all.filter((r) => s.cat === 'all' || r.c === s.cat).map((r) => {
      const picked = !!s.cart[r.id];
      return {
        name: r.name, img: IMG[r.id], unit: r.unit, price: '฿' + r.p, picked, unpicked: !picked,
        boxBg: picked ? '#22A35A' : '#FFE66D',
        up: r.d > 0, down: r.d < 0, same: r.d === 0,
        chText: r.d > 0 ? 'ขึ้น ฿' + r.d : r.d < 0 ? 'ลง ฿' + (-r.d) : 'เท่าเดิม',
        chColor: r.d > 0 ? '#C2362F' : r.d < 0 ? '#1E7A45' : '#6B6777',
        toggle: () => this.setState({ cart: Object.assign({}, s.cart, { [r.id]: !picked }) }),
      };
    });
    const defs = [['all', 'ทั้งหมด'], ['meat', 'เนื้อสัตว์'], ['veg', 'ผัก'], ['dry', 'ไข่และของแห้ง']];
    return {
      items, totalText: '฿' + total,
      cartText: n ? 'ในรายการซื้อ ' + n + ' อย่าง' : 'ยังไม่ได้เลือกของ',
      chips: defs.map(([id, label]) => ({ label, on: s.cat === id, bg: s.cat === id ? '#24212B' : '#F5F3FC', fg: s.cat === id ? '#FFFFFF' : '#24212B', pick: () => this.setState({ cat: id }) })),
    };
  }
}
</script>'''
open(ROOT+'Market.dc.html','w',encoding='utf-8').write(page('ราคาตลาดวันนี้','#8FD8F2','ราคาตลาดวันนี้','ราคาตัวอย่าง ยังไม่ใช่ข้อมูลจริง','capybara',m_strip,m_body,m_bottom,m_script))
# ---------------- Ranking ----------------
SEG='flex: 1 1 0; height: 44px; padding: 0; border: 0; border-radius: 14px; background: {{seg.bg}}; color: {{seg.fg}}; font-size: 16px; font-weight: 700; cursor: pointer'
r_strip=f'''<div style="position: absolute; left: 16px; right: 16px; top: 150px; height: 52px; box-sizing: border-box; padding: 4px; display: flex; gap: 4px; background: #FFFFFF; border-radius: 18px">
<sc-for list="{{{{segs}}}}" as="seg" hint-placeholder-count="2"><button class="press mali" onClick="{{{{seg.pick}}}}" aria-pressed="{{{{seg.on}}}}" style="{SEG}">{{{{seg.label}}}}</button></sc-for>
</div>'''
BADGE='flex: 0 0 auto; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 999px; background: {{item.badge}}; font-size: 17px; font-weight: 700'
RROW=f'display: flex; align-items: center; gap: 10px; min-height: 68px; box-sizing: border-box; padding: 8px 8px 8px 12px; border-radius: 20px'
r_body=f'''<span style="padding: 0 20px; font-size: 14px; color: {MUTE}">{{{{hint}}}}</span>
<div style="flex: 1 1 auto; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding: 2px 16px 104px">
<sc-if value="{{{{isMenus}}}}" hint-placeholder-val="{{{{true}}}}">
<sc-for list="{{{{menus}}}}" as="item" hint-placeholder-count="5">
<div style="{RROW}; background: {SOFT}">
<span class="mali num" style="{BADGE}">{{{{item.rank}}}}</span>
<img src="{{{{item.img}}}}" alt="" width="52" height="52" style="flex: 0 0 auto; display: block">
<span style="flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column">
<span class="mali" style="font-size: 17px; font-weight: 700; line-height: 1.35">{{{{item.name}}}}</span>
<span class="num" style="font-size: 14px; line-height: 1.45; color: {MUTE}">{{{{item.meta}}}}</span>
</span>
<button class="press" onClick="{{{{item.like}}}}" aria-pressed="{{{{item.liked}}}}" aria-label="{{{{item.likeLabel}}}}" style="flex: 0 0 auto; display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; padding: 0; border: 0; border-radius: 16px; background: #FFFFFF; cursor: pointer">{HEART}</button>
</div>
</sc-for>
</sc-if>
<sc-if value="{{{{isChefs}}}}" hint-placeholder-val="{{{{false}}}}">
<sc-for list="{{{{chefs}}}}" as="item" hint-placeholder-count="5">
<div style="{RROW}; padding-right: 14px; background: {{{{item.bg}}}}">
<span class="mali num" style="{BADGE}">{{{{item.rank}}}}</span>
<span style="flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column">
<span class="mali" style="font-size: 17px; font-weight: 700; line-height: 1.35">{{{{item.name}}}}</span>
<span class="num" style="font-size: 14px; line-height: 1.45; color: #4F4A5C">{{{{item.meta}}}}</span>
</span>
<span class="mali num" style="flex: 0 0 auto; font-size: 16px; font-weight: 700">{{{{item.lv}}}}</span>
</div>
</sc-for>
</sc-if>
</div>'''
r_bottom=f'''<a class="press btn mali" href="Cook.dc.html" style="position: absolute; left: 12px; right: 12px; bottom: 16px; display: flex; align-items: center; justify-content: center; height: 56px; border-radius: 20px; background: {INK}; color: #FFFFFF; font-weight: 700; font-size: 18px">ทำเมนูอันดับ 1 เลย</a>'''
r_script='''<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":390,"height":844}}'>
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { tab: 'menus', liked: {} }; }
  renderVals() {
    const s = this.state;
    const PIC = { 'กะเพราหมูสับไข่ดาว': '/_blob/6c2552b0403b97e680de31c0a2deaa28', 'ไข่เจียวหมูสับ': '/_blob/57d72c67af1ee4e1b933a4afefac4e80', 'ข้าวผัดไข่': '/_blob/a64862a8c02a9f44b151cc9981fc09f1', 'ผัดผักบุ้งไฟแดง': '/_blob/0be76187f19ed08abc65a51059154705', 'ต้มยำกุ้ง': '/_blob/841f9e64f4da943f588bffe8f5e331c1', 'แกงเขียวหวานไก่': '/_blob/56a522461fd3bec4f8eb3b88ebaecd86' };
    const badge = (i) => ['#FFC93D', '#D5D2E0', '#FFB38A'][i] || '#FFFFFF';
    const menus = [
      ['กะเพราหมูสับไข่ดาว', '4.8', '1,240'], ['ไข่เจียวหมูสับ', '4.7', '980'], ['ต้มยำกุ้ง', '4.6', '720'],
      ['ข้าวผัดไข่', '4.5', '610'], ['แกงเขียวหวานไก่', '4.5', '430'], ['ผัดผักบุ้งไฟแดง', '4.3', '390'],
    ].map(([name, star, made], i) => {
      const liked = !!s.liked[name];
      return {
        rank: i + 1, name, img: PIC[name], badge: badge(i), meta: star + ' ดาว · ทำแล้ว ' + made + ' ครั้ง', liked,
        heartFill: liked ? '#FF5C7A' : '#FFFFFF', heartStroke: liked ? '#C8324F' : '#6B6777',
        likeLabel: (liked ? 'เลิกถูกใจ ' : 'ถูกใจ ') + name,
        like: () => this.setState({ liked: Object.assign({}, s.liked, { [name]: !liked }) }),
      };
    });
    const chefs = [
      ['ครัวบ้านส้ม', 14, 96], ['แม่ครัวมือใหม่', 12, 81], ['หนุ่มหอพัก', 11, 77], ['คุณ', 3, 7], ['ครัวเล็กริมคลอง', 2, 5],
    ].map(([name, lv, made], i) => ({
      rank: i + 1, name, badge: badge(i), meta: 'ทำแล้ว ' + made + ' เมนู', lv: 'เลเวล ' + lv,
      bg: name === 'คุณ' ? '#FFE66D' : '#F5F3FC',
    }));
    const defs = [['menus', 'เมนูฮิต'], ['chefs', 'เชฟเลเวลสูง']];
    return {
      isMenus: s.tab === 'menus', isChefs: s.tab === 'chefs', menus, chefs,
      hint: s.tab === 'menus' ? 'แตะหัวใจเพื่อโหวตเมนูที่ชอบ' : 'ทำอาหารครบเมนูเพื่อเก็บเลเวล',
      segs: defs.map(([id, label]) => ({ label, on: s.tab === id, bg: s.tab === id ? '#24212B' : '#FFFFFF', fg: s.tab === id ? '#FFFFFF' : '#24212B', pick: () => this.setState({ tab: id }) })),
    };
  }
}
</script>'''
open(ROOT+'Ranking.dc.html','w',encoding='utf-8').write(page('อันดับเมนูสัปดาห์นี้','#FFB199','อันดับสัปดาห์นี้','ข้อมูลตัวอย่าง ยังไม่ใช่ของจริง','cat',r_strip,r_body,r_bottom,r_script))

# ---------------- Calories ----------------
MINUS=ic('<path d="M6 12h12"></path>',INK,18,2.8); PLUS2=ic('<path d="M12 6v12M6 12h12"></path>',INK,18,2.8)
SB='display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 999px; background: #FFFFFF; cursor: pointer'
c_strip=f"""<div style="position: absolute; left: 16px; right: 16px; top: 146px; height: 60px; box-sizing: border-box; padding: 8px 16px; display: flex; flex-direction: column; justify-content: center; gap: 6px; background: #FFFFFF; border-radius: 18px">
<div style="display: flex; align-items: baseline; justify-content: space-between; gap: 8px">
<span class="mali num" style="font-size: 17px; font-weight: 700">{{{{eatenText}}}}</span>
<span class="num" aria-live="polite" style="font-size: 14px; font-weight: 600; color: #4F4A5C">{{{{leftText}}}}</span>
</div>
<div aria-hidden="true" style="height: 10px; border-radius: 999px; background: #ECE8F6; overflow: hidden"><div style="width: {{{{pct}}}}%; height: 10px; border-radius: 999px; background: {{{{barColor}}}}; transition: width .25s ease-out"></div></div>
</div>"""
c_body=f"""<span class="mali" style="padding: 0 20px; font-size: 16px; font-weight: 600; line-height: 1.45">{{{{tip}}}}</span>
<span style="padding: 0 20px; font-size: 14px; color: {MUTE}">วันนี้กินอะไรไปบ้าง กดบวกเพื่อบันทึก</span>
<div style="flex: 1 1 auto; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding: 2px 16px 112px">
<sc-for list="{{{{items}}}}" as="item" hint-placeholder-count="6">
<div style="display: flex; align-items: center; gap: 10px; min-height: 72px; box-sizing: border-box; padding: 8px 10px 8px 8px; border-radius: 20px; background: {SOFT}">
<img src="{{{{item.img}}}}" alt="" width="56" height="56" style="flex: 0 0 auto; display: block">
<span style="flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column">
<span style="font-size: 16px; font-weight: 600; line-height: 1.4">{{{{item.name}}}}</span>
<span class="num" style="font-size: 14px; line-height: 1.4; color: {MUTE}">{{{{item.meta}}}}</span>
</span>
<span style="flex: 0 0 auto; display: flex; align-items: center; gap: 2px">
<button class="press" onClick="{{{{item.less}}}}" aria-label="{{{{item.lessLabel}}}}" style="{SB}">{MINUS}</button>
<span class="mali num" style="min-width: 22px; text-align: center; font-size: 17px; font-weight: 700">{{{{item.n}}}}</span>
<button class="press" onClick="{{{{item.more}}}}" aria-label="{{{{item.moreLabel}}}}" style="{SB.replace('#FFFFFF','#FFE66D')}">{PLUS2}</button>
</span>
</div>
</sc-for>
</div>"""
c_bottom=f"""<div style="position: absolute; left: 12px; right: 12px; bottom: 16px; height: 72px; box-sizing: border-box; padding: 0 10px 0 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: #FFE66D; border-radius: 26px">
<div style="display: flex; flex-direction: column">
<span style="font-size: 14px; color: #4F4A5C">เป้าหมายต่อวัน</span>
<span class="mali num" style="font-size: 22px; font-weight: 700; line-height: 1.2">{{{{goalText}}}}</span>
</div>
<div style="display: flex; align-items: center; gap: 6px">
<button class="press" onClick="{{{{goalLess}}}}" aria-label="ลดเป้าหมาย 100 แคล" style="{SB}; width: 48px; height: 48px">{MINUS}</button>
<button class="press" onClick="{{{{goalMore}}}}" aria-label="เพิ่มเป้าหมาย 100 แคล" style="{SB}; width: 48px; height: 48px">{PLUS2}</button>
</div>
</div>"""
c_script="""<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":390,"height":844}}'>
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { goal: 2000, n: { 'กะเพราหมูสับไข่ดาว': 1 } }; }
  renderVals() {
    const s = this.state;
    const PIC = __PIC__;
    const all = [['กะเพราหมูสับไข่ดาว', 650], ['ไข่เจียวหมูสับ', 520], ['ข้าวผัดไข่', 580], ['ผัดผักบุ้งไฟแดง', 210], ['ต้มยำกุ้ง', 320], ['แกงเขียวหวานไก่', 610]];
    const fmt = (v) => String(v).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
    let eaten = 0;
    const items = all.map(([name, kcal]) => {
      const n = s.n[name] || 0; eaten += n * kcal;
      const set = (v) => this.setState({ n: Object.assign({}, s.n, { [name]: Math.max(0, Math.min(9, v)) }) });
      return { name, img: PIC[name], n, meta: 'ราว ' + kcal + ' แคล ต่อจาน', less: () => set(n - 1), more: () => set(n + 1), lessLabel: 'ลด ' + name + ' หนึ่งจาน', moreLabel: 'เพิ่ม ' + name + ' หนึ่งจาน' };
    });
    const left = s.goal - eaten, over = left < 0;
    const ratio = eaten / s.goal;
    return {
      items, eatenText: 'กินไป ' + fmt(eaten) + ' แคล',
      leftText: over ? 'เกินเป้า ' + fmt(-left) + ' แคล' : 'เหลือ ' + fmt(left) + ' แคล',
      pct: Math.round(Math.min(1, ratio) * 100), barColor: over ? '#FF8A4C' : '#22A35A',
      tip: eaten === 0 ? 'ยังไม่ได้บันทึกเลย กินอะไรมาบอกโค้ชหน่อย' : over ? 'วันนี้เกินเป้าไปนิด ไม่เป็นไร พรุ่งนี้ค่อยว่ากัน' : ratio > 0.8 ? 'ใกล้ถึงเป้าแล้ว มื้อถัดไปเอาเบาๆ ก็พอ' : 'กำลังดีเลย ดื่มน้ำด้วยนะ',
      goalText: fmt(s.goal) + ' แคล',
      goalLess: () => this.setState({ goal: Math.max(1200, s.goal - 100) }),
      goalMore: () => this.setState({ goal: Math.min(3500, s.goal + 100) }),
    };
  }
}
</script>"""
import re as _re
_pic=_re.search(r"const PIC = (\{[^}]*\});",r_script).group(1)
open(ROOT+'Calories.dc.html','w',encoding='utf-8').write(page('แคลอรี่วันนี้','#B5EC7C','แคลอรี่วันนี้','ตัวเลขตัวอย่าง เป็นค่าประมาณ','frog',c_strip,c_body,c_bottom,c_script.replace('__PIC__',_pic)))

# ---------------- Me ----------------
T={'home':'<path d="M3.500 10.600 12 3.600l8.500 7V19.500a1.500 1.500 0 0 1-1.500 1.500H5a1.500 1.500 0 0 1-1.500-1.500z"></path>',
 'book':'<path d="M12 6v14"></path><path d="M3.500 5h5A3.500 3.500 0 0 1 12 8.500 3.500 3.500 0 0 1 15.500 5h5v13h-5.500A2.500 2.500 0 0 0 12 20.500 2.500 2.500 0 0 0 9.500 18H3.500z"></path>',
 'pot':'<path d="M3 12h18"></path><path d="M19.500 12v6.500a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V12"></path><path d="M9.500 9V8.500a2.500 2.500 0 0 1 5 0V9"></path>',
 'heart':'<path d="M12 20.500s-7.500-4.600-7.500-10.200A4.300 4.300 0 0 1 12 7.600a4.300 4.300 0 0 1 7.500 2.700c0 5.600-7.500 10.200-7.500 10.200z"></path>',
 'me':'<circle cx="12" cy="8.500" r="4"></circle><path d="M4.500 20.500a7.500 7.500 0 0 1 15 0"></path>'}
def tab(label,icon,href=None,active=False):
    col=INK if active else MUTE; bg='background: #FFE66D;' if active else ''
    inner=f'<span style="display: flex; align-items: center; justify-content: center; width: 46px; height: 32px; border-radius: 14px; {bg}">{ic(T[icon],col,24,2.2)}</span><span style="font-size: 12px; font-weight: 600; color: {col}">{label}</span>'
    box='display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; width: 64px; height: 64px'
    if href: return f'<a class="press btn" href="{href}" style="{box}">{inner}</a>'
    cur=' aria-current="page"' if active else ''
    return f'<button class="press"{cur} style="{box}; padding: 0; border: 0; background: transparent; cursor: pointer">{inner}</button>'
e_strip=f"""<div style="position: absolute; left: 16px; right: 16px; top: 146px; height: 60px; box-sizing: border-box; padding: 8px 16px; display: flex; flex-direction: column; justify-content: center; gap: 6px; background: #FFFFFF; border-radius: 18px">
<div style="display: flex; align-items: baseline; justify-content: space-between; gap: 8px">
<span class="mali num" style="font-size: 17px; font-weight: 700">เลเวล 3 · เชฟฝึกหัด</span>
<span class="num" style="font-size: 14px; font-weight: 600; color: #4F4A5C">อีก 80 แต้มถึงเลเวล 4</span>
</div>
<div role="img" aria-label="แต้มประสบการณ์ 120 จาก 200" style="height: 10px; border-radius: 999px; background: #ECE8F6; overflow: hidden"><div style="width: 60%; height: 10px; border-radius: 999px; background: #7B6CF6"></div></div>
</div>"""
def stat(v,l): return f'<div style="display: flex; flex-direction: column; gap: 2px; padding: 12px; background: {SOFT}; border-radius: 20px"><span class="mali num" style="font-size: 22px; font-weight: 700; line-height: 1.2">{v}</span><span style="font-size: 14px; color: {MUTE}">{l}</span></div>'
e_body=f"""<div style="flex: 1 1 auto; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; padding: 2px 16px 112px">
<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px">
{stat('7','เมนูที่ทำแล้ว')}{stat('7','วันต่อเนื่อง')}{stat('3','เหรียญที่ได้')}
</div>
<h2 class="mali" style="margin: 0; padding: 0 4px; font-size: 18px; font-weight: 700">เหรียญรางวัล</h2>
<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px">
<sc-for list="{{{{badges}}}}" as="b" hint-placeholder-count="6">
<button class="press" onClick="{{{{b.pick}}}}" aria-pressed="{{{{b.on}}}}" style="display: flex; flex-direction: column; align-items: center; gap: 2px; min-height: 112px; box-sizing: border-box; padding: 10px 6px; border: 0; border-radius: 20px; background: {{{{b.bg}}}}; box-shadow: {{{{b.ring}}}}; cursor: pointer">
<img src="{{{{b.img}}}}" alt="" width="52" height="52" style="display: block; opacity: {{{{b.fade}}}}">
<span style="font-size: 14px; font-weight: 700; line-height: 1.35; text-align: center">{{{{b.name}}}}</span>
<span class="num" style="font-size: 13px; font-weight: 600; color: #4F4A5C">{{{{b.state}}}}</span>
</button>
</sc-for>
</div>
<p aria-live="polite" style="margin: 0; padding: 12px 14px; background: #FFE66D; border-radius: 18px; font-size: 16px; line-height: 1.5">{{{{detail}}}}</p>
<h2 class="mali" style="margin: 0; padding: 0 4px; font-size: 18px; font-weight: 700">ตั้งค่า</h2>
<div style="display: flex; flex-direction: column; gap: 8px">
<sc-for list="{{{{settings}}}}" as="st" hint-placeholder-count="3">
<div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 60px; box-sizing: border-box; padding: 8px 10px 8px 16px; background: {SOFT}; border-radius: 20px">
<span style="font-size: 16px; font-weight: 600; line-height: 1.4">{{{{st.label}}}}</span>
<button class="press" role="switch" aria-checked="{{{{st.on}}}}" aria-label="{{{{st.label}}}}" onClick="{{{{st.toggle}}}}" style="flex: 0 0 auto; position: relative; width: 60px; height: 44px; padding: 0; border: 0; background: transparent; cursor: pointer"><span style="position: absolute; left: 4px; top: 7px; width: 52px; height: 30px; border-radius: 999px; background: {{{{st.track}}}}; transition: background .2s ease-out"></span><span style="position: absolute; left: 7px; top: 10px; width: 24px; height: 24px; border-radius: 999px; background: #FFFFFF; transform: translateX({{{{st.x}}}}px); transition: transform .2s ease-out"></span></button>
</div>
</sc-for>
</div>
</div>"""
SOONTAB='<button class="press" onClick="{{soonTap}}" aria-label="ชุมชน ยังไม่เปิด" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; width: 64px; height: 64px; padding: 0; border: 0; background: transparent; cursor: pointer"><span style="display: flex; align-items: center; justify-content: center; width: 46px; height: 32px; border-radius: 14px; opacity: 0.45">'+ic(T['heart'],'#4F4A5C',24,2.2)+'</span><span style="font-size: 12px; font-weight: 600; color: #4F4A5C">เร็วๆ นี้</span></button>'
e_bottom=f"""<nav aria-label="เมนูหลัก" style="position: absolute; left: 12px; right: 12px; bottom: 14px; height: 72px; box-sizing: border-box; padding: 0 8px; display: flex; align-items: center; justify-content: space-between; background: #FFFFFF; box-shadow: 0 0 0 2px #E4E0F2; border-radius: 28px; z-index: 900">
{tab('ร้าน','home','Restaurant.dc.html')}{tab('สูตรอาหาร','book','Recipes.dc.html')}{tab('ทำอาหาร','pot','Cook.dc.html')}{SOONTAB}{tab('ฉัน','me',None,True)}
</nav>
<sc-if value="{{{{toast}}}}" hint-placeholder-val="{{{{false}}}}"><div class="card0" role="status" aria-live="polite" style="position: absolute; left: 24px; right: 24px; bottom: 98px; padding: 12px 16px; border-radius: 18px; background: #24212B; color: #FFFFFF; font-size: 15px; font-weight: 600; line-height: 1.45; text-align: center; z-index: 950">หน้าชุมชนยังไม่เปิด เร็วๆ นี้จะได้แชร์เมนูกัน</div></sc-if>"""
e_script="""<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":390,"height":844}}'>
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { pick: 0, set: { timer: true, daily: false, calm: false } }; }
  renderVals() {
    const s = this.state;
    const B = [
      ['จานแรก', 'egg', true, 'ได้จากการทำอาหารจานแรกจนเสร็จ', '#FFF0B8'],
      ['7 วันติด', 'chili', true, 'ได้จากการทำอาหารต่อเนื่องครบ 7 วัน', '#FFD6DF'],
      ['สายประหยัด', 'morning', true, 'ได้จากการทำเมนูไม่เกิน 40 บาท ครบ 3 เมนู', '#D6F5D9'],
      ['เชฟ 10 เมนู', 'rice', false, 'ทำไปแล้ว 7 จาก 10 เมนู อีก 3 เมนูก็ได้แล้ว', '#DCEBFF'],
      ['มือผัด', 'basil', false, 'ทำเมนูผัดให้ครบ 5 เมนู ตอนนี้ได้ 2 เมนู', '#D6F5D9'],
      ['สายหวาน', 'sugar', false, 'ยังไม่มีเมนูของหวานในแอป เร็วๆ นี้', '#FFD6E6'],
    ];
    const IMG = __IMG__;
    const badges = B.map(([name, k, got, , tint], i) => ({
      name, img: IMG[k], on: s.pick === i, state: got ? 'ได้แล้ว' : 'ยังไม่ได้',
      bg: got ? tint : '#ECE8F6', fade: got ? 1 : 0.4,
      ring: s.pick === i ? '0 0 0 3px #24212B' : 'none',
      pick: () => this.setState({ pick: i }),
    }));
    const S = [['timer', 'แจ้งเตือนเมื่อจับเวลาครบ'], ['daily', 'เตือนให้ทำอาหารทุกวัน'], ['calm', 'ให้มาสคอตขยับน้อยลง']];
    return {
      badges, detail: B[s.pick][0] + ': ' + B[s.pick][3], soonTap: () => { this.setState({ toast: true }); clearTimeout(this.tt); this.tt = setTimeout(() => this.setState({ toast: false }), 3000); }, toast: !!s.toast,
      settings: S.map(([id, label]) => {
        const on = !!s.set[id];
        return { label, on, track: on ? '#22A35A' : '#8A8698', x: on ? 22 : 0, toggle: () => this.setState({ set: Object.assign({}, s.set, { [id]: !on }) }) };
      }),
    };
  }
}
</script>"""
open(ROOT+'Me.dc.html','w',encoding='utf-8').write(page('ฉัน โปรไฟล์เชฟ','#8FE3CF','ครัวของฉัน','ข้อมูลตัวอย่าง ยังไม่ใช่ของจริง','elephant',e_strip,e_body,e_bottom,back=False,script=e_script.replace('__IMG__',"{ pork: '/_blob/86fdb695be776bfd7914cdfa1c29ed25', egg: '/_blob/c6263c9b14efb6319b8350ce20511359', garlic: '/_blob/d6b929345fd698afe2cfc77cdb952825', chili: '/_blob/88051bbf2bf5bf095b12be008a28cda8', rice: '/_blob/5658e513ce137923d2aca173599a06ac', morning: '/_blob/78d54072a7ea0047ddab68f6e27714f4', basil: '/_blob/4083ec0fb9b6108174fd3446c825d9ae', sugar: '/_blob/42122d7213e3fd2b87ea71b26bad3f9f' }")))
print('ok')
