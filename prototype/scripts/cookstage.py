# Splices the hands-on "kitchen stage" into the cook artboard that cook.py builds (old-palette terms; retone.py recolours).
import re
SPAT='<svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true"><rect x="21" y="20" width="6" height="24" rx="3" fill="#C98B5A"></rect><rect x="12" y="4" width="24" height="22" rx="8" fill="#8A8698"></rect><rect x="18" y="9" width="3" height="11" rx="1.5" fill="#FFFFFF"></rect><rect x="27" y="9" width="3" height="11" rx="1.5" fill="#FFFFFF"></rect></svg>'
def flames(n,h):
    xs=[150-(n-1)*17+i*34 for i in range(n)]
    return '<svg width="300" height="60" viewBox="0 0 300 60" aria-hidden="true" style="position: absolute; left: 0; top: 196px">'+''.join(f'<g class="flame" style="animation-delay: {i*0.11:.2f}s"><path d="M{x} 56 C{x-13} 46 {x-9} {56-h*0.6:.0f} {x} {56-h} C{x+9} {56-h*0.6:.0f} {x+13} 46 {x} 56 Z" fill="#FF8A4C"></path><path d="M{x} 56 C{x-6} 50 {x-4} {56-h*0.4:.0f} {x} {56-h*0.6:.0f} C{x+4} {56-h*0.4:.0f} {x+6} 50 {x} 56 Z" fill="#FFD84D"></path></g>' for i,x in enumerate(xs))+'</svg>'
def layer(inner,cls='pop'): return f'<svg class="{cls}" width="240" height="220" viewBox="0 0 240 220" aria-hidden="true" style="position: absolute; left: 0; top: 0; transform-origin: 50% 50%">{inner}</svg>'
import random; R=random.Random(7)
def scatter(n,rad,fn):
    o=''
    for i in range(n):
        import math
        a=R.random()*6.283; r=rad*math.sqrt(R.random()); o+=fn(120+r*math.cos(a),110+r*math.sin(a),R.randint(0,180))
    return o
OIL=layer('<ellipse cx="120" cy="112" rx="72" ry="66" fill="#FFE58A" opacity="0.6"></ellipse><ellipse cx="92" cy="86" rx="12" ry="7" fill="#FFF6CF" opacity="0.9"></ellipse><ellipse cx="150" cy="140" rx="8" ry="5" fill="#FFF6CF" opacity="0.8"></ellipse>')
EGG=layer('<path d="M66 108 C62 76 96 60 120 68 C146 56 184 78 176 110 C184 142 150 166 122 156 C92 168 62 142 66 108 Z" fill="#FFFFFF"></path><circle cx="120" cy="108" r="26" fill="#FFC93D"></circle><circle cx="111" cy="106" r="3.4" fill="#24212B"></circle><circle cx="129" cy="106" r="3.4" fill="#24212B"></circle><ellipse cx="104" cy="114" rx="5" ry="3" fill="#FF9E6B"></ellipse><ellipse cx="136" cy="114" rx="5" ry="3" fill="#FF9E6B"></ellipse>')
AROMA=layer(scatter(16,62,lambda x,y,r:f'<rect x="{x:.0f}" y="{y:.0f}" width="9" height="6" rx="3" fill="#FFF3D6" transform="rotate({r} {x:.0f} {y:.0f})"></rect>')+scatter(10,60,lambda x,y,r:f'<rect x="{x:.0f}" y="{y:.0f}" width="10" height="4.500" rx="2.200" fill="#F0584A" transform="rotate({r} {x:.0f} {y:.0f})"></rect>'))
PORK=layer(scatter(15,50,lambda x,y,r:f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="15" ry="11" fill="{{{{porkColor}}}}" transform="rotate({r} {x:.0f} {y:.0f})"></ellipse>')+scatter(8,46,lambda x,y,r:f'<circle cx="{x:.0f}" cy="{y:.0f}" r="3" fill="#24212B" opacity="0.14"></circle>'))
BASIL=layer(scatter(9,56,lambda x,y,r:f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="14" ry="7.500" fill="#4CA35C" transform="rotate({r} {x:.0f} {y:.0f})"></ellipse>')+scatter(4,50,lambda x,y,r:f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="11" ry="6" fill="#62BD6E" transform="rotate({r} {x:.0f} {y:.0f})"></ellipse>'))
PAN='<svg width="300" height="220" viewBox="0 0 300 220" aria-hidden="true" style="position: absolute; left: 0; top: 0"><rect x="204" y="97" width="92" height="26" rx="13" fill="#6B6777"></rect><circle cx="120" cy="110" r="106" fill="#3A3642"></circle><circle cx="120" cy="110" r="90" fill="#575270"></circle></svg>'
KNIFE='<svg width="90" height="90" viewBox="0 0 90 90" aria-hidden="true"><rect x="58" y="6" width="26" height="14" rx="7" fill="#6B6777" transform="rotate(35 71 13)"></rect><path d="M14 62 C10 40 30 18 60 12 L68 24 C50 44 34 58 14 62 Z" fill="#D9D4EA"></path><path d="M14 62 C28 56 46 42 62 22 L68 24 C50 44 34 58 14 62 Z" fill="#FFFFFF"></path></svg>'
CSS2='''@keyframes shakeA{0%,100%{transform:translate(0,0) rotate(0)}30%{transform:translate(-7px,2px) rotate(-3deg)}65%{transform:translate(7px,-2px) rotate(3deg)}}
@keyframes shakeB{0%,100%{transform:translate(0,0) rotate(0)}30%{transform:translate(-7px,2px) rotate(-3deg)}65%{transform:translate(7px,-2px) rotate(3deg)}}
.shake0{animation:shakeA .32s ease-out}.shake1{animation:shakeB .32s ease-out}
@keyframes chopA{0%,100%{transform:rotate(0) translateY(0)}45%{transform:rotate(-22deg) translateY(14px)}}
@keyframes chopB{0%,100%{transform:rotate(0) translateY(0)}45%{transform:rotate(-22deg) translateY(14px)}}
.chop0{animation:chopA .26s ease-out}.chop1{animation:chopB .26s ease-out}
@keyframes flick{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.2)}}
.flame{transform-box:fill-box;transform-origin:50% 100%;animation:flick .5s ease-in-out infinite}
@keyframes popIn{from{opacity:0;transform:scale(.55)}}
.pop{animation:popIn .32s cubic-bezier(.2,.9,.3,1.3) both}
.fume{position:absolute;display:block;width:12px;height:18px;border-radius:50%;background:#CFC9E6;animation:steam 1.8s ease-out infinite;pointer-events:none}
button:disabled{cursor:default}
'''
BLOCK='''<sc-if value="{{isCook}}" hint-placeholder-val="{{false}}">
<div class="screen" style="position: absolute; inset: 0; background: #FFE3A3">
<div style="position: absolute; top: 50px; left: 12px; right: 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px">
<button class="press" onClick="{{toRecipe}}" aria-label="ออกจากการทำอาหาร กลับไปดูวัตถุดิบ" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 999px; background: #FFF8EC; cursor: pointer">@@CLOSE@@</button>
<span class="mali num" style="font-weight: 700; font-size: 16px">ขั้นที่ {{stepNo}} จาก {{stepCount}}</span>
<span style="width: 44px; height: 44px"></span>
</div>
<div aria-hidden="true" style="position: absolute; top: 102px; left: 16px; right: 16px; display: flex; gap: 6px">
<sc-for list="{{bars}}" as="bar" hint-placeholder-count="6"><span style="flex: 1 1 0; height: 8px; border-radius: 999px; background: {{bar.bg}}"></span></sc-for>
</div>
@@MASCOT@@
<div style="position: absolute; left: 90px; right: 12px; top: 120px; min-height: 78px; box-sizing: border-box; padding: 10px 14px; display: flex; flex-direction: column; justify-content: center; gap: 2px; background: #FFF8EC; border-radius: 20px 20px 20px 6px">
<h2 class="mali" style="margin: 0; font-size: 18px; font-weight: 700; line-height: 1.3">{{stepTitle}}</h2>
<p class="mali" aria-live="polite" style="margin: 0; font-size: 16px; font-weight: 600; line-height: 1.4">{{hint}}</p>
</div>
<div style="position: absolute; left: 12px; right: 12px; top: 210px; height: 342px; overflow: hidden; background: #FFF8EC; border-radius: 28px">
<sc-if value="{{isPan}}" hint-placeholder-val="{{true}}">
<div style="position: absolute; left: 10px; top: 10px; display: flex; align-items: center; gap: 4px; padding: 3px 3px 3px 12px; background: #FFFFFF; border-radius: 999px">
<span class="mali" style="font-size: 15px; font-weight: 700; padding-right: 4px">ไฟ</span>
<sc-for list="{{heats}}" as="h" hint-placeholder-count="3"><button class="press mali" onClick="{{h.pick}}" aria-pressed="{{h.on}}" style="min-width: 52px; height: 44px; padding: 0 10px; border: 0; border-radius: 999px; background: {{h.bg}}; color: {{h.fg}}; box-shadow: {{h.ring}}; font-size: 15px; font-weight: 700; cursor: pointer">{{h.label}}</button></sc-for>
</div>
<sc-if value="{{showTimer}}" hint-placeholder-val="{{false}}">
<div style="position: absolute; right: 10px; top: 10px; display: flex; flex-direction: column; align-items: flex-end; justify-content: center; height: 50px; padding: 0 14px; background: #FFFFFF; border-radius: 18px"><span style="font-size: 13px; font-weight: 600; color: #4F4A5C">ทอดมาแล้ว</span><span class="mali num" style="font-size: 18px; font-weight: 700; line-height: 1.1">{{timeText}}</span></div>
</sc-if>
<div class="{{shakeCls}}" style="position: absolute; left: 43px; top: 76px; width: 300px; height: 260px">
<sc-if value="{{heatLow}}" hint-placeholder-val="{{false}}">@@FLOW@@</sc-if>
<sc-if value="{{heatHigh}}" hint-placeholder-val="{{false}}">@@FHIGH@@</sc-if>
@@PAN@@
<sc-if value="{{pan.oil}}" hint-placeholder-val="{{false}}">@@OIL@@</sc-if>
<sc-if value="{{pan.aroma}}" hint-placeholder-val="{{false}}">@@AROMA@@</sc-if>
<sc-if value="{{pan.pork}}" hint-placeholder-val="{{false}}">@@PORK@@</sc-if>
<sc-if value="{{pan.basil}}" hint-placeholder-val="{{false}}">@@BASIL@@</sc-if>
<sc-if value="{{pan.egg}}" hint-placeholder-val="{{false}}">@@EGG@@</sc-if>
<sc-if value="{{sizzle}}" hint-placeholder-val="{{false}}"><span class="fume" style="left: 80px; top: 40px"></span><span class="fume" style="left: 124px; top: 28px; animation-delay: .6s"></span><span class="fume" style="left: 160px; top: 44px; animation-delay: 1.1s"></span></sc-if>
</div>
</sc-if>
<sc-if value="{{isBoard}}" hint-placeholder-val="{{false}}">
<div style="position: absolute; left: 23px; top: 34px; width: 320px; height: 274px; background: #F6CF9C; border-radius: 30px">
<div style="position: absolute; left: 14px; top: 14px; right: 14px; bottom: 14px; background: #FBDDB4; border-radius: 22px"></div>
<img src="{{pic.garlic}}" alt="" width="60" height="60" style="position: absolute; left: 24px; top: 20px; display: block">
<img src="{{pic.chili}}" alt="" width="60" height="60" style="position: absolute; left: 124px; top: 20px; display: block">
<img src="{{pic.basil}}" alt="" width="60" height="60" style="position: absolute; left: 224px; top: 20px; display: block">
<sc-for list="{{bits}}" as="b" hint-placeholder-count="0"><span class="pop" style="position: absolute; left: {{b.x}}px; top: {{b.y}}px; width: {{b.w}}px; height: {{b.h}}px; border-radius: 999px; background: {{b.c}}; transform: rotate({{b.r}}deg)"></span></sc-for>
<div class="{{chopCls}}" style="position: absolute; right: -4px; bottom: -6px; width: 90px; height: 90px; transform-origin: 85% 15%">@@KNIFE@@</div>
</div>
</sc-if>
<sc-if value="{{plated}}" hint-placeholder-val="{{false}}">
<img class="pop" src="/_blob/6c2552b0403b97e680de31c0a2deaa28" alt="กะเพราหมูสับไข่ดาวจัดจานแล้ว" width="250" height="250" style="position: absolute; left: 58px; top: 50px; display: block">
</sc-if>
</div>
<span style="position: absolute; left: 20px; right: 20px; top: 560px; font-size: 14px; font-weight: 600; color: #4F4A5C">ทำที่เตาจริง แล้วแตะตามทีละอย่าง</span>
<div style="position: absolute; left: 12px; right: 12px; top: 586px; display: flex; gap: 6px">
<sc-for list="{{acts}}" as="a" hint-placeholder-count="3">
<button class="press" onClick="{{a.tap}}" disabled="{{a.disabled}}" style="flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 2px; height: 118px; box-sizing: border-box; padding: 8px 2px; border: 0; border-radius: 20px; background: {{a.bg}}; box-shadow: {{a.ring}}; opacity: {{a.op}}; color: #3B2A22; cursor: pointer">
<sc-if value="{{a.isImg}}" hint-placeholder-val="{{true}}"><img src="{{a.img}}" alt="" width="48" height="48" style="display: block"></sc-if>
<sc-if value="{{a.isStir}}" hint-placeholder-val="{{false}}">@@SPAT@@</sc-if>
<span style="font-size: 14px; font-weight: 700; line-height: 1.25; text-align: center">{{a.label}}</span>
<span class="num" style="font-size: 13px; font-weight: 700; color: #4F4A5C">{{a.count}}</span>
</button>
</sc-for>
</div>
<div style="position: absolute; left: 12px; right: 12px; bottom: 16px; display: flex; gap: 10px">
<button class="press mali" onClick="{{prev}}" style="flex: 0 0 118px; height: 56px; padding: 0; border: 0; border-radius: 20px; background: #FFF8EC; color: #3B2A22; font-weight: 700; font-size: 17px; cursor: pointer">ย้อนกลับ</button>
<button class="press mali" onClick="{{next}}" style="flex: 1 1 auto; height: 56px; padding: 0; border: 0; border-radius: 20px; background: {{nextBg}}; color: {{nextFg}}; font-weight: 700; font-size: 18px; cursor: pointer">{{nextLabel}}</button>
</div>
</div>
</sc-if>

'''
JS='''class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { screen: 'recipe', serv: 1, have: {}, step: 0, done: {}, heat: 0, sec: 0, k: 0, stars: 0 };
  }
  componentWillUnmount() { clearInterval(this.tick); }
  flow() {
    return [
      { t: 'เตรียมของ', heat: null, board: true, fin: 'พร้อมแล้ว ไปตั้งกระทะกัน', acts: [
        { id: 'garlic', label: 'สับกระเทียม', img: 'garlic', need: 4, hint: 'สับกระเทียมหยาบๆ แตะตามจังหวะมีด' },
        { id: 'chili', label: 'สับพริก', img: 'chili', need: 4, hint: 'สับพริกขี้หนู อย่าเอามือขยี้ตานะ' },
        { id: 'basil', label: 'เด็ดกะเพรา', img: 'basil', need: 3, hint: 'เด็ดใบกะเพรา ล้างแล้วสะบัดน้ำ' } ] },
      { t: 'ทอดไข่ดาว', heat: 1, fin: 'ไข่ดาวสวยมาก พักไว้ก่อน', acts: [
        { id: 'oil', label: 'เทน้ำมัน', img: 'oil', need: 1, hint: 'เทน้ำมันลงกระทะ รอให้ร้อน' },
        { id: 'egg', label: 'ตอกไข่', img: 'egg', need: 1, hint: 'ตอกไข่ลงกลางกระทะ' },
        { id: 'scoop', label: 'ตักไข่ขึ้น', img: 'egg', need: 1, hint: 'ราว 2 นาที ขอบกรอบเหลืองแล้วตักขึ้น' } ] },
      { t: 'ผัดกระเทียมพริก', heat: 1, fin: 'หอมแล้ว ไปต่อเลย', acts: [
        { id: 'mix', label: 'ใส่กระเทียมพริก', img: 'garlic', need: 1, hint: 'ใส่กระเทียมกับพริกที่สับไว้' },
        { id: 'stir', label: 'ผัด', stir: true, need: 5, hint: 'ผัดเร็วๆ จนหอม อย่าให้ไหม้' } ] },
      { t: 'ใส่หมูสับ', heat: 2, fin: 'หมูสุกทั่วแล้ว เก่งมาก', acts: [
        { id: 'pork', label: 'ใส่หมูสับ', img: 'pork', need: 1, hint: 'ใส่หมูสับลงไปเลย' },
        { id: 'stir', label: 'ยีและผัด', stir: true, need: 8, hint: 'กดยีให้หมูแตก ผัดจนไม่เหลือสีชมพู' } ] },
      { t: 'ปรุงรส', heat: 2, fin: 'ชิมดู เค็มไปเติมน้ำ จืดไปเติมน้ำปลา', acts: [
        { id: 'oyster', label: 'ซอสหอย', img: 'oyster', need: 1, hint: 'ใส่ซอสหอยนางรม 1 ช้อนโต๊ะ' },
        { id: 'soy', label: 'ซีอิ๊วขาว', img: 'soy', need: 1, hint: 'ใส่ซีอิ๊วขาว 1 ช้อนชา' },
        { id: 'fish', label: 'น้ำปลา', img: 'fish', need: 1, hint: 'ใส่น้ำปลา 1 ช้อนชา' },
        { id: 'sugar', label: 'น้ำตาล', img: 'sugar', need: 1, hint: 'ใส่น้ำตาลครึ่งช้อนชา' },
        { id: 'stir', label: 'ผัด', stir: true, need: 4, hint: 'เติมน้ำนิดหน่อย ผัดให้เข้ากัน' } ] },
      { t: 'ใส่กะเพราแล้วจัดจาน', heat: 0, fin: 'เสร็จแล้ว หอมมาก!', acts: [
        { id: 'basil', label: 'ใส่กะเพรา', img: 'basil', need: 1, hint: 'ปิดไฟแล้ว ใส่ใบกะเพราลงไป' },
        { id: 'stir', label: 'ผัด', stir: true, need: 3, hint: 'ผัดเร็วๆ พอใบสลด' },
        { id: 'plate', label: 'ตักใส่จาน', img: 'rice', need: 1, hint: 'ตักราดข้าว วางไข่ดาวไว้ข้างบน' } ] },
    ];
  }
  goStep(i) {
    clearInterval(this.tick);
    this.setState({ screen: 'cook', step: i, done: {}, sec: 0 });
  }
  act(a) {
    const s = this.state;
    const n = s.done[a.id] || 0;
    if (n >= a.need) return;
    this.setState({ done: Object.assign({}, s.done, { [a.id]: n + 1 }), k: s.k + 1 });
    if (a.id === 'egg') { clearInterval(this.tick); this.tick = setInterval(() => this.setState({ sec: this.state.sec + 1 }), 1000); }
    if (a.id === 'scoop') clearInterval(this.tick);
  }
  renderVals() {
    const s = this.state;
    const IMG = __IMG__;
    const base = [
      { id: 'pork', name: 'หมูสับ', q: 120, u: 'กรัม', p: 22 },
      { id: 'basil', name: 'ใบกะเพรา', q: 1, u: 'กำมือ', p: 5 },
      { id: 'garlic', name: 'กระเทียม', q: 4, u: 'กลีบ', p: 2 },
      { id: 'chili', name: 'พริกขี้หนู', q: 4, u: 'เม็ด', p: 2 },
      { id: 'egg', name: 'ไข่ไก่', q: 1, u: 'ฟอง', p: 5 },
      { id: 'rice', name: 'ข้าวสวย', q: 1, u: 'จาน', p: 7 },
      { id: 'oil', name: 'น้ำมันพืช', q: 2, u: 'ช้อนโต๊ะ', p: 2 },
      { id: 'oyster', name: 'ซอสหอยนางรม', q: 1, u: 'ช้อนโต๊ะ', p: 2 },
      { id: 'soy', name: 'ซีอิ๊วขาว', q: 1, u: 'ช้อนชา', p: 1 },
      { id: 'fish', name: 'น้ำปลา', q: 1, u: 'ช้อนชา', p: 1 },
      { id: 'sugar', name: 'น้ำตาลทราย', q: 0.5, u: 'ช้อนชา', p: 1 },
    ];
    const num = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
    let total = 0;
    const items = base.map((it) => {
      const have = !!s.have[it.id];
      const price = it.p * s.serv;
      if (!have) total += price;
      return {
        name: it.name, img: IMG[it.id], have, qtyText: num(it.q * s.serv) + ' ' + it.u,
        priceText: have ? 'มีแล้ว' : '฿' + price, priceColor: have ? '#4A7443' : '#3B2A22',
        boxBg: have ? '#5E8F57' : '#F6E6CF',
        toggle: () => this.setState({ have: Object.assign({}, s.have, { [it.id]: !have }) }),
      };
    });
    const F = this.flow(), si = s.step, st = F[si], d = s.done;
    const c = (id) => d[id] || 0;
    const last = si === F.length - 1;
    const HN = ['ปิด', 'กลาง', 'แรง'];
    const heatOk = st.heat == null || s.heat === st.heat;
    let first = -1;
    st.acts.forEach((a, i) => { if (first < 0 && c(a.id) < a.need) first = i; });
    const complete = heatOk && first < 0;
    const acts = st.acts.map((a, i) => {
      const n = c(a.id), fin = n >= a.need, cur = heatOk && i === first;
      return {
        label: a.label, img: a.stir ? '' : IMG[a.img], isStir: !!a.stir, isImg: !a.stir, disabled: !cur,
        count: fin ? 'เรียบร้อย' : a.need > 1 ? n + ' / ' + a.need : 'แตะ',
        bg: fin ? '#C9F2CF' : '#FFF8EC', op: fin || cur ? 1 : 0.55, ring: cur ? '0 0 0 3px #24212B' : 'none',
        tap: () => this.act(a),
      };
    });
    const hex = (a, b, t) => '#' + [1, 3, 5].map((i) => { const x = parseInt(a.substr(i, 2), 16), y = parseInt(b.substr(i, 2), 16); return ('0' + Math.round(x + (y - x) * Math.min(1, t)).toString(16)).slice(-2); }).join('');
    const plated = si === 5 && c('plate') > 0;
    const seasoned = c('oyster') + c('soy') + c('fish') + c('sugar');
    const pan = {
      oil: !plated && ((si === 1 && c('oil') > 0) || si >= 2),
      egg: si === 1 && c('egg') > 0 && c('scoop') === 0,
      aroma: !plated && ((si === 2 && c('mix') > 0) || si >= 3),
      pork: !plated && ((si === 3 && c('pork') > 0) || si >= 4),
      basil: !plated && si === 5 && c('basil') > 0,
    };
    const P = [[30, 96], [52, 110], [38, 128], [66, 96], [58, 136], [24, 116], [74, 120], [44, 150], [28, 142], [70, 144], [50, 92], [80, 104]];
    const bits = [];
    P.slice(0, c('garlic') * 3).forEach(([x, y], i) => bits.push({ x, y: y + 8, w: 12, h: 8, c: '#FFFDF4', r: i * 37 }));
    P.slice(0, c('chili') * 3).forEach(([x, y], i) => bits.push({ x: x + 100, y: y + 8, w: 14, h: 6, c: '#F0584A', r: i * 53 }));
    P.slice(0, c('basil') * 3).forEach(([x, y], i) => bits.push({ x: x + 196, y: y + 6, w: 22, h: 12, c: i % 2 ? '#62BD6E' : '#4CA35C', r: i * 41 }));
    const mm = Math.floor(s.sec / 60), ss = s.sec % 60;
    const notes = ['', 'ต้องฝึกอีกนิด ครั้งหน้าดีขึ้นแน่', 'พอกินได้ ลองปรับรสดูนะ', 'ใช้ได้เลย', 'อร่อยมาก', 'ระดับเชฟแล้ว! ได้ 40 แต้มประสบการณ์'];
    return {
      isRecipe: s.screen === 'recipe', isCook: s.screen === 'cook', isDone: s.screen === 'done',
      serv: s.serv, items, totalText: '฿' + total, pic: IMG,
      less: () => this.setState({ serv: Math.max(1, s.serv - 1) }),
      more: () => this.setState({ serv: Math.min(4, s.serv + 1) }),
      start: () => { this.setState({ heat: 0 }); this.goStep(0); },
      toRecipe: () => { clearInterval(this.tick); this.setState({ screen: 'recipe' }); },
      stepNo: si + 1, stepCount: F.length,
      bars: F.map((_, i) => ({ bg: i <= si ? '#C2512E' : '#FFFFFF' })),
      chefCls: 'bot mood-' + (complete ? 'happy' : s.k % 5 === 4 ? 'sing' : 'calm'),
      stepTitle: st.t,
      hint: !heatOk ? 'ปรับไฟเป็น "' + HN[st.heat] + '" ก่อนนะ' : first >= 0 ? st.acts[first].hint : st.fin,
      isPan: !st.board && !plated, isBoard: !!st.board, plated, pan, bits, acts,
      porkColor: si === 3 ? hex('#F4A7A0', '#B5714A', c('stir') / 8) : si === 4 ? hex('#B5714A', '#96583A', seasoned / 4) : '#96583A',
      heats: HN.map((label, i) => ({
        label, on: s.heat === i, bg: s.heat === i ? (i === 0 ? '#24212B' : i === 1 ? '#FF8A4C' : '#E8303A') : 'transparent',
        fg: s.heat === i ? '#FFFFFF' : '#24212B', ring: st.heat === i && s.heat !== i ? 'inset 0 0 0 3px #24212B' : 'none',
        pick: () => this.setState({ heat: i }),
      })),
      heatLow: s.heat === 1, heatHigh: s.heat === 2,
      sizzle: s.heat > 0 && (pan.oil || pan.pork),
      showTimer: si === 1 && c('egg') > 0,
      timeText: mm + ':' + (ss < 10 ? '0' : '') + ss,
      shakeCls: s.k % 2 ? 'shake1' : 'shake0', chopCls: s.k % 2 ? 'chop1' : 'chop0',
      prev: () => (si === 0 ? this.setState({ screen: 'recipe' }) : this.goStep(si - 1)),
      next: () => { if (last) { clearInterval(this.tick); this.setState({ screen: 'done' }); } else this.goStep(si + 1); },
      nextLabel: complete ? (last ? 'เสร็จแล้ว!' : 'ถัดไป') : 'ข้ามขั้นนี้',
      nextBg: complete ? '#24212B' : 'transparent', nextFg: complete ? '#FFFFFF' : '#24212B',
      stars: [1, 2, 3, 4, 5].map((n) => ({ on: n <= s.stars, fill: n <= s.stars ? '#F2C14E' : '#FFFFFF', label: 'ให้ ' + n + ' ดาว', pick: () => this.setState({ stars: n }) })),
      rateNote: s.stars ? notes[s.stars] : 'แตะดาวเพื่อให้คะแนนเมนูนี้',
      again: () => this.setState({ screen: 'recipe', step: 0, done: {}, stars: 0, heat: 0 }),
    };
  }
}
'''
def splice(html,mascot,CLOSE):
    img=re.search(r"const IMG = (\{[^}]*\});",html).group(1)
    a=html.index('<sc-if value="{{isCook}}"'); b=html.index('<sc-if value="{{isDone}}"')
    blk=BLOCK
    for k,v in {'@@CLOSE@@':CLOSE,'@@MASCOT@@':mascot('elephant','{{chefCls}}',6,61,0.62),'@@FLOW@@':flames(3,30),'@@FHIGH@@':flames(5,48),'@@PAN@@':PAN,'@@OIL@@':OIL,'@@AROMA@@':AROMA,'@@PORK@@':PORK.replace('{{{{','{{').replace('}}}}','}}'),'@@BASIL@@':BASIL,'@@EGG@@':EGG,'@@KNIFE@@':KNIFE,'@@SPAT@@':SPAT}.items(): blk=blk.replace(k,v)
    html=html[:a]+blk+html[b:]
    a=html.index('class Component extends DCLogic'); b=html.index('</script>',a)
    html=html[:a]+JS.replace('__IMG__',img)+html[b:]
    assert '.screen{animation' in html
    return html.replace('.screen{animation',CSS2+'.screen{animation',1)
