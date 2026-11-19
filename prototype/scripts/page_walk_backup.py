import sys; sys.path.insert(0,'.')
from bots import svg
BG=sys.argv[1]
def bot(k,label):
    return f'''<div class="{{{{{k}.cls}}}}" style="position: absolute; left: 0; top: 0; width: 96px; height: 139px; transform: translate({{{{{k}.x}}}}px, {{{{{k}.y}}}}px); transition: transform {{{{{k}.dur}}}}s linear; z-index: {{{{{k}.z}}}}">
<div style="position: absolute; inset: 0; transform: scale({{{{{k}.s}}}}); transform-origin: 50% 100%">
<div class="emote" aria-hidden="true"><svg class="em em-heart" width="22" height="22" viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" fill="#F2687E"></path></svg><svg class="em em-note" width="22" height="22" viewBox="0 0 24 24"><path d="M9 17V5l10-2v12" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="6.5" cy="17" r="3" fill="#FFFFFF"></circle><circle cx="16.5" cy="15" r="3" fill="#FFFFFF"></circle></svg><svg class="em em-wow" width="22" height="22" viewBox="0 0 24 24"><rect x="10" y="3" width="4" height="12" rx="2" fill="#F2C14E"></rect><circle cx="12" cy="19.5" r="2.4" fill="#F2C14E"></circle></svg><svg class="em em-zzz" width="24" height="22" viewBox="0 0 26 24"><path d="M3 12h7l-7 8h7M14 4h8l-8 9h8" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg></div>
<span class="shadow"></span>
<button class="tap" aria-label="{label}" onClick="{{{{{k}.tap}}}}"><span class="rig" style="display: block; transform: scaleX({{{{{k}.face}}}})"><span class="hopper" style="display: block">{svg(k)}</span></span></button>
</div>
</div>
'''
css='''
body{margin:0}
a{color:#C2512E}a:hover{color:#8F3A20}
button{font-family:inherit;color:inherit;-webkit-tap-highlight-color:transparent}
.mali{font-family:'Mali','IBM Plex Sans Thai Looped',sans-serif}
.bot .tap{position:absolute;inset:0;padding:0;margin:0;border:0;background:transparent;cursor:pointer}
.bot .shadow{position:absolute;left:16%;right:16%;bottom:-5px;height:11px;border-radius:50%;background:rgba(60,35,20,.28);display:block}
.bot .emote{position:absolute;left:50%;top:-22px;width:26px;height:24px;margin-left:-13px;z-index:2}
.bot .em{display:none;position:absolute;left:0;top:0}
.bot .eh,.bot .es,.bot .mo{display:none}
.bot .legL,.bot .legR,.bot .armL,.bot .armR,.bot .head,.bot .tail,.bot .earL,.bot .earR,.bot .eo,.bot .bodyg,.bot .trunk{transform-box:fill-box}
.bot .legL,.bot .legR{transform-origin:50% 0}
.bot .armL,.bot .armR{transform-origin:50% 6%}
.bot .head{transform-origin:50% 92%;animation:nod 3.6s ease-in-out infinite}
.bot .bodyg{transform-origin:50% 100%;animation:breathe 2.6s ease-in-out infinite}
.bot .tail{transform-origin:0 100%;animation:tail 1.8s ease-in-out infinite}
.bot .earL{transform-origin:100% 50%;animation:earL 3s ease-in-out infinite}
.bot .earR{transform-origin:0 50%;animation:earR 3s ease-in-out infinite}
.bot .trunk{transform-origin:50% 0;animation:trunk 2.8s ease-in-out infinite}
.bot .eo{transform-origin:50% 50%;animation:blink 4.2s linear infinite}
.bot .armL{animation:idleArmL 2.6s ease-in-out infinite}
.bot .armR{animation:idleArmR 2.6s ease-in-out infinite}
@keyframes nod{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}
@keyframes breathe{0%,100%{transform:scale(1,1)}50%{transform:scale(1.03,.97)}}
@keyframes tail{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(14deg)}}
@keyframes earL{0%,80%,100%{transform:rotate(0)}88%{transform:rotate(-14deg)}94%{transform:rotate(6deg)}}
@keyframes earR{0%,80%,100%{transform:rotate(0)}88%{transform:rotate(14deg)}94%{transform:rotate(-6deg)}}
@keyframes trunk{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(7deg)}}
@keyframes blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
@keyframes idleArmL{0%,100%{transform:rotate(0)}50%{transform:rotate(4deg)}}
@keyframes idleArmR{0%,100%{transform:rotate(0)}50%{transform:rotate(-4deg)}}
@keyframes stepA{0%,100%{transform:rotate(24deg)}50%{transform:rotate(-24deg)}}
@keyframes stepB{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(24deg)}}
@keyframes swingA{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}
@keyframes swingB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-22deg)}}
@keyframes bounce{0%,50%,100%{transform:translateY(0)}25%,75%{transform:translateY(-4px)}}
.walking .legL{animation:stepA .56s ease-in-out infinite}
.walking .legR{animation:stepB .56s ease-in-out infinite}
.walking .armL{animation:swingA .56s ease-in-out infinite}
.walking .armR{animation:swingB .56s ease-in-out infinite}
.walking .hopper{animation:bounce .56s ease-in-out infinite}
.walking .head{animation:nod .56s ease-in-out infinite}
@keyframes hop{0%,100%{transform:translateY(0) scale(1,1)}20%{transform:translateY(0) scale(1.06,.92)}50%{transform:translateY(-18px) scale(.97,1.04)}80%{transform:translateY(0) scale(1.05,.94)}}
@keyframes wave{0%,100%{transform:rotate(118deg)}50%{transform:rotate(148deg)}}
@keyframes emote{0%{opacity:0;transform:translateY(8px) scale(.5)}25%{opacity:1;transform:translateY(0) scale(1.1)}80%{opacity:1;transform:translateY(-4px) scale(1)}100%{opacity:0;transform:translateY(-12px) scale(1)}}
.mood-happy .hopper,.mood-love .hopper{animation:hop .6s ease-out 2}
.mood-happy .armL,.mood-wave .armL{animation:wave .4s ease-in-out infinite}
.mood-happy .eo,.mood-love .eo,.mood-wave .eo,.mood-sleepy .eo{display:none}
.mood-happy .eh,.mood-love .eh,.mood-wave .eh{display:inline}
.mood-happy .ms,.mood-wow .ms,.mood-sing .ms,.mood-wave .ms{display:none}
.mood-happy .mo,.mood-wow .mo,.mood-sing .mo,.mood-wave .mo{display:inline}
.mood-sleepy .es{display:inline}
.mood-sleepy .head{animation:nod 5s ease-in-out infinite}
.mood-wow .eo{animation:none;transform:scale(1.35)}
.mood-wow .hopper{animation:hop .5s ease-out 1}
.mood-sing .head{animation:nod .9s ease-in-out infinite}
.mood-love .em-heart,.mood-sing .em-note,.mood-wow .em-wow,.mood-sleepy .em-zzz{display:block;animation:emote 2.4s ease-out infinite}
@keyframes twinkle{0%,100%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1)}}
.spark{position:absolute;display:block;animation:twinkle 2.8s ease-in-out infinite;pointer-events:none}
@keyframes steam{0%{opacity:0;transform:translateY(6px) scale(.7)}25%{opacity:.9}100%{opacity:0;transform:translateY(-34px) scale(1.4)}}
.steam{position:absolute;display:block;width:10px;height:16px;border-radius:50%;background:#FFFFFF;animation:steam 2.6s ease-out infinite;pointer-events:none}
@keyframes cardIn0{from{opacity:0;transform:translateY(10px) scale(.96)}}
@keyframes cardIn1{from{opacity:0;transform:translateY(10px) scale(.96)}}
.card0{animation:cardIn0 .35s cubic-bezier(.2,.9,.3,1.2) both}
.card1{animation:cardIn1 .35s cubic-bezier(.2,.9,.3,1.2) both}
.press{transition:transform .12s ease-out}
.press:active{transform:scale(.94)}
.still *,.still *::before,.still *::after{animation:none !important;transition:none !important}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important}}
'''
spark='<path d="M12 2c.7 5.3 4.7 9.3 10 10-5.3.7-9.3 4.700-10 10-.7-5.300-4.700-9.300-10-10 5.300-.7 9.300-4.700 10-10z" fill="#FFFFFF"></path>'
sparks=''.join(f'<svg class="spark" style="left: {x}px; top: {y}px; animation-delay: {d}s" width="{s}" height="{s}" viewBox="0 0 24 24" aria-hidden="true">{spark}</svg>\n' for x,y,s,d in [(40,300,12,0),(330,250,14,.8),(200,360,10,1.6),(120,560,12,2.2),(300,620,12,.4),(60,690,10,1.2)])
def tab(label,icon,active=False,soon=False):
    col='#3B2A22' if active else '#7A5C48'; bg='background: #FFE3A3;' if active else ''
    cur=' aria-current="page"' if active else ''
    if soon: return '<button class="press" onClick="{{soonTap}}" aria-label="ชุมชน ยังไม่เปิด" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; width: 64px; height: 64px; padding: 0; border: 0; background: transparent; cursor: pointer"><span style="display: flex; align-items: center; justify-content: center; width: 46px; height: 32px; border-radius: 14px; opacity: 0.45"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7A5C48" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icon+'</svg></span><span style="font-size: 12px; font-weight: 600; color: #7A5C48">เร็วๆ นี้</span></button>'
    return f'<button class="press"{cur} style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; width: 64px; height: 64px; padding: 0; border: 0; background: transparent; cursor: pointer"><span style="display: flex; align-items: center; justify-content: center; width: 46px; height: 32px; border-radius: 14px; {bg}"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="{col}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{icon}</svg></span><span style="font-size: 12px; font-weight: 600; color: {col}">{label}</span></button>'
html=f'''<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<title>ร้านอาหารของทีมเชฟ</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mali:wght@500;600;700&amp;family=IBM+Plex+Sans+Thai+Looped:wght@400;500;600;700&amp;display=swap">
<style>{css}</style>
</helmet>
<div class="{{{{motionClass}}}}" style="position: relative; width: 390px; height: 844px; overflow: hidden; background: #A9683F; font-family: 'IBM Plex Sans Thai Looped', sans-serif; color: #3B2A22">
<img src="{BG}" alt="ร้านอาหารเล็กๆ มีเคาน์เตอร์ครัวเปิด โต๊ะไม้ และต้นไม้" style="position: absolute; left: -86px; top: 0; width: 563px; height: 844px; display: block">
<span class="steam" style="left: 176px; top: 196px"></span>
<span class="steam" style="left: 190px; top: 192px; animation-delay: 1.1s"></span>
{sparks}
{bot('frog','โค้ชกบ บอทดูแลแคลอรี่')}
{bot('cat','นักชิมแมว บอทจัดอันดับเมนู')}
{bot('elephant','เชฟช้าง บอทพาทำอาหาร')}
{bot('capybara','คาปิบาระ บอทราคาตลาด')}
<div style="position: absolute; top: 50px; left: 12px; right: 12px; display: flex; justify-content: space-between; align-items: center; gap: 8px; z-index: 900">
<div style="display: flex; align-items: center; gap: 8px; height: 44px; box-sizing: border-box; padding: 0 14px; background: #FFF8EC; border-radius: 999px">
<span class="mali" style="font-weight: 700; font-size: 15px">เลเวล 3</span><span style="font-size: 12px; color: #7A5C48">เชฟฝึกหัด</span>
</div>
<div style="display: flex; align-items: center; gap: 6px; height: 44px; box-sizing: border-box; padding: 0 14px; background: #FFF8EC; border-radius: 999px">
<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.380-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.500 2 4.900 4 6.500 2 1.600 3 3.500 3 5.500a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.500 2.500 0 0 0 2.500 2.500z" fill="#F2876B"></path></svg>
<span class="mali" style="font-weight: 700; font-size: 15px">7 วัน</span>
</div>
</div>
<div class="{{{{cardClass}}}}" style="position: absolute; left: 12px; right: 12px; top: 656px; box-sizing: border-box; padding: 12px 14px; display: flex; align-items: center; gap: 12px; background: #FFF8EC; border-radius: 22px; z-index: 900">
<div style="flex: 1 1 auto; display: flex; flex-direction: column; gap: 2px; min-width: 0">
<span class="mali" style="align-self: flex-start; padding: 1px 10px; border-radius: 999px; background: {{{{talk.color}}}}; color: #3B2A22; font-weight: 700; font-size: 12px">{{{{talk.name}}}}</span>
<p class="mali" style="margin: 0; font-weight: 600; font-size: 15px; line-height: 1.45">{{{{talk.line}}}}</p>
</div>
<button class="press mali" onClick="{{{{talk.next}}}}" style="flex: 0 0 auto; height: 44px; padding: 0 16px; border: 0; border-radius: 16px; background: #C2512E; color: #FFFFFF; font-weight: 700; font-size: 14px; cursor: pointer">{{{{talk.cta}}}}</button>
</div>
<nav aria-label="เมนูหลัก" style="position: absolute; left: 12px; right: 12px; bottom: 14px; height: 72px; box-sizing: border-box; padding: 0 8px; display: flex; align-items: center; justify-content: space-between; background: #FFF8EC; border-radius: 28px; z-index: 900">
{tab('ร้าน','<path d="M3.500 10.600 12 3.600l8.500 7V19.500a1.500 1.500 0 0 1-1.500 1.500H5a1.500 1.500 0 0 1-1.500-1.500z"></path>',True)}
{tab('สูตรอาหาร','<path d="M12 6v14"></path><path d="M3.500 5h5A3.500 3.500 0 0 1 12 8.500 3.500 3.500 0 0 1 15.500 5h5v13h-5.500A2.500 2.500 0 0 0 12 20.500 2.500 2.500 0 0 0 9.500 18H3.500z"></path>')}
{tab('ทำอาหาร','<path d="M3 12h18"></path><path d="M19.500 12v6.500a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V12"></path><path d="M9.500 9V8.500a2.500 2.500 0 0 1 5 0V9"></path>')}
{tab('ชุมชน','<path d="M12 20.500s-7.500-4.600-7.500-10.200A4.300 4.300 0 0 1 12 7.600a4.300 4.300 0 0 1 7.500 2.700c0 5.600-7.500 10.200-7.500 10.200z"></path>',soon=True)}
{tab('ฉัน','<circle cx="12" cy="8.500" r="4"></circle><path d="M4.500 20.500a7.500 7.500 0 0 1 15 0"></path>')}
</nav>
<sc-if value="{{{{toast}}}}" hint-placeholder-val="{{{{false}}}}"><div class="card0" role="status" aria-live="polite" style="position: absolute; left: 24px; right: 24px; top: 104px; padding: 12px 16px; border-radius: 18px; background: #24212B; color: #FFFFFF; font-size: 15px; font-weight: 600; line-height: 1.45; text-align: center; z-index: 950">หน้าชุมชนยังไม่เปิด เร็วๆ นี้จะได้แชร์เมนูกัน</div></sc-if>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"motion":{{"editor":"boolean","default":true}},"$preview":{{"width":390,"height":844}}}}'>
class Component extends DCLogic {{
  constructor(props) {{
    super(props);
    this.state = {{
      bots: {{
        frog: {{ x: 300, y: 290, dur: 0, walking: false, face: 1, mood: 'calm' }},
        cat: {{ x: 250, y: 400, dur: 0, walking: false, face: 1, mood: 'calm' }},
        elephant: {{ x: 50, y: 360, dur: 0, walking: false, face: 1, mood: 'wave' }},
        capybara: {{ x: 262, y: 484, dur: 0, walking: false, face: 1, mood: 'calm' }},
      }},
      who: 'elephant', line: 0, n: 0,
    }};
    this.timers = {{}};
  }}
  componentDidMount() {{
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ((this.props.motion ?? true) && !reduce) {{
      this.alive = true;
      Object.keys(this.state.bots).forEach((k, i) => {{ this.timers[k] = setTimeout(() => this.walk(k), 900 + i * 700); }});
    }}
  }}
  componentWillUnmount() {{
    this.alive = false;
    Object.values(this.timers).forEach((t) => clearTimeout(t));
  }}
  setBot(k, patch) {{
    const bots = Object.assign({{}}, this.state.bots);
    bots[k] = Object.assign({{}}, bots[k], patch);
    this.setState({{ bots }});
  }}
  walk(k) {{
    if (!this.alive) return;
    const b = this.state.bots[k];
    const y = 290 + Math.random() * 210;
    const edge = y < 400 ? 70 : 10;
    const x = edge + Math.random() * (294 - 2 * edge);
    const dist = Math.hypot(x - b.x, y - b.y);
    const dur = Math.max(0.6, dist / 42);
    this.setBot(k, {{ x, y, dur: dur.toFixed(2), walking: true, face: x < b.x ? -1 : 1, mood: 'calm' }});
    this.timers[k] = setTimeout(() => {{
      if (!this.alive) return;
      const moods = ['calm', 'calm', 'happy', 'love', 'sing', 'wow', 'sleepy', 'wave'];
      const mood = moods[Math.floor(Math.random() * moods.length)];
      this.setBot(k, {{ walking: false, mood, face: 1 }});
      this.timers[k] = setTimeout(() => this.walk(k), (mood === 'sleepy' ? 4200 : 2200) + Math.random() * 2600);
    }}, dur * 1000);
  }}
  renderVals() {{
    const s = this.state;
    const info = {{
      elephant: {{ name: 'เชฟช้าง', color: '#C9D0F7', cta: 'ทำเลย', lines: ['ยินดีต้อนรับ! วันนี้ทำกะเพราหมูสับไข่ดาวกันไหม?', 'ใช้เวลา 15 นาที เดี๋ยวพาเดินเข้าครัวทำทีละขั้น', 'ดูสูตรก่อนก็ได้ ว่ามีวัตถุดิบครบไหม'] }},
      cat: {{ name: 'นักชิมแมว', color: '#F6D9C2', cta: 'ดูอันดับ', lines: ['สัปดาห์นี้กะเพราหมูสับมาแรงสุด!', 'ชิมมาแล้ว ต้มยำกุ้งอร่อยจริง', 'ทำเสร็จแล้วอย่าลืมมาให้คะแนนนะ'] }},
      capybara: {{ name: 'คาปิบาระ', color: '#F6E0A6', cta: 'ดูราคา', lines: ['วันนี้ผักบุ้งกำละ 15 บาท ถูกลงนะ', 'ไข่ไก่แผงละ 135 บาท', 'ไปตลาดมาให้แล้ว ของสดทุกอย่างเลย'] }},
      frog: {{ name: 'โค้ชกบ', color: '#D3EDB5', cta: 'ดูแคลอรี่', lines: ['วันนี้กินอะไรไปบ้าง มาบันทึกกัน', 'มื้อนี้โปรตีนกำลังดีเลย', 'ดื่มน้ำด้วยนะ!'] }},
    }};
    const out = {{}};
    Object.keys(s.bots).forEach((k) => {{
      const b = s.bots[k];
      const depth = 1.05 + 0.45 * ((b.y - 290) / 210);
      out[k] = {{
        x: Math.round(b.x), y: Math.round(b.y), dur: b.dur, z: 100 + Math.round(b.y),
        s: (depth * (k === 'frog' ? 0.8 : 1)).toFixed(3), face: b.face,
        cls: 'bot' + (b.walking ? ' walking' : '') + ' mood-' + (b.walking ? 'calm' : b.mood),
        tap: () => {{
          const same = s.who === k;
          this.setState({{ who: k, line: same ? s.line + 1 : 0, n: s.n + 1 }});
          this.setBot(k, {{ mood: 'happy' }});
        }},
      }};
    }});
    const t = info[s.who];
    out.talk = {{ name: t.name, color: t.color, cta: t.cta, line: t.lines[s.line % t.lines.length], next: () => this.setState({{ line: s.line + 1, n: s.n + 1 }}) }};
    Object.assign(out, {{ soonTap: () => {{ this.setState({{ toast: true }}); clearTimeout(this.tt); this.tt = setTimeout(() => this.setState({{ toast: false }}), 3000); }}, toast: !!s.toast, }});
    out.cardClass = s.n % 2 ? 'card1' : 'card0';
    out.motionClass = (this.props.motion ?? true) ? '' : 'still';
    return out;
  }}
}}
</script>
</body>
</html>
'''
open('../screens/Restaurant.dc.html','w',encoding='utf-8').write(html)
print(len(html))
