# ทีมเชฟแบบภาพแบน วาดเป็น SVG ด้วยโค้ด: คนตัวเล็กหัวโต มีผม เสื้อผ้า แขนขา และของใช้ประจำตัว
# รันไฟล์นี้ได้ไฟล์ .svg ของทุกท่าและทุกฉาก แล้วรัน `node raster.js ..` แปลงเป็น PNG
INK, CORAL, CORAL_L, HAT, HAT_D, WOOD, PINK, YEL = '#24212B', '#FF7A59', '#FFA58C', '#FFFFFF', '#D8D1F0', '#C98B4E', '#FF9DB0', '#FFD84D'
GREEN, GREEN_L, STRAW, STRAW_D = '#2FB383', '#7BE0B5', '#F2C57C', '#D9A250'
SVG = lambda body: f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" width="480" height="480">\n{body}\n</svg>'

def eyes(kind, dx=0, dy=0):
    L, R, Y = 196 + dx, 284 + dx, 262 + dy
    if kind == 'dot': return f'<circle cx="{L}" cy="{Y}" r="10" fill="{INK}"/><circle cx="{R}" cy="{Y}" r="10" fill="{INK}"/>'
    if kind == 'happy': return f'<path d="M{L-13} {Y+4} q13 -17 26 0 M{R-13} {Y+4} q13 -17 26 0" stroke="{INK}" stroke-width="7" stroke-linecap="round" fill="none"/>'
    if kind == 'squeeze': return f'<path d="M{L-11} {Y-9} l16 9 l-16 9 M{R+11} {Y-9} l-16 9 l16 9" stroke="{INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
def mouth(kind):
    X, Y = 240, 268
    if kind == 'smile': return f'<path d="M{X-10} {Y} q10 11 20 0" stroke="{INK}" stroke-width="6" stroke-linecap="round" fill="none"/>'
    if kind == 'open': return f'<path d="M{X-17} {Y-5} q17 34 34 0 z" fill="{INK}"/><path d="M{X-9} {Y+9} q9 7 18 0 q-9 -11 -18 0 z" fill="{CORAL}"/>'
    if kind == 'o': return f'<ellipse cx="{X}" cy="{Y+3}" rx="7" ry="9" fill="{INK}"/>'
    if kind == 'wavy': return f'<path d="M{X-15} {Y+3} q5 -8 10 0 t10 0 t10 0" stroke="{INK}" stroke-width="5.5" stroke-linecap="round" fill="none"/>'
    if kind == 'dash': return f'<path d="M{X-9} {Y+2} l18 0" stroke="{INK}" stroke-width="6.5" stroke-linecap="round"/>'
    return ''
def face(e, m, blush=0.8):  # หน้าอยู่กลางหัว: ตาจุดห่างกัน แก้มชมพู ปากเล็ก
    return (f'<g transform="translate(0 -48)"><ellipse cx="156" cy="284" rx="25" ry="15" fill="{PINK}" opacity="{blush}"/><ellipse cx="324" cy="284" rx="25" ry="15" fill="{PINK}" opacity="{blush}"/>'
            f'{eyes(*e) if isinstance(e, tuple) else eyes(e)}{mouth(m)}</g>')
star = lambda x, y, s, c=YEL: f'<path d="M{x} {y-s} q{s*0.18} {s*0.82} {s} {s} q-{s*0.82} {s*0.18} -{s} {s} q-{s*0.18} -{s*0.82} -{s} -{s} q{s*0.82} -{s*0.18} {s} -{s} z" fill="{c}"/>'
heart = lambda x, y, k=1.0, c=PINK: f'<path transform="translate({x} {y}) scale({k})" d="M0 -6 c-12 -16 -34 0 -19 17 l19 19 l19 -19 c15 -17 -7 -33 -19 -17 z" fill="{c}"/>'
note = lambda x, y, c: f'<path d="M{x} {y} v-34 l22 -6 v32" stroke="{c}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="{x-7}" cy="{y}" rx="9" ry="7" fill="{c}"/><ellipse cx="{x+15}" cy="{y-8}" rx="9" ry="7" fill="{c}"/>'

SHOULDER = {'L': (164, 304), 'R': (316, 304)}
def arm(side, hx, hy, bx=0, by=0, skin='#FFE3C2', sleeve=None, cut=0.5):
    """แขนโค้งจากไหล่ถึงมือ ปลายมน ท่อนบนเป็นแขนเสื้อ"""
    x0, y0 = SHOULDER[side]; cx, cy = (x0 + hx) / 2 + bx, (y0 + hy) / 2 + by
    out = f'<path d="M{x0} {y0} Q{cx} {cy} {hx} {hy}" stroke="{skin}" stroke-width="44" stroke-linecap="round" fill="none"/>'
    if sleeve:
        t = cut; ax, ay = x0 + (cx - x0) * t, y0 + (cy - y0) * t; bx2, by2 = cx + (hx - cx) * t, cy + (hy - cy) * t
        out += f'<path d="M{x0} {y0} Q{ax} {ay} {ax + (bx2 - ax) * t} {ay + (by2 - ay) * t}" stroke="{sleeve}" stroke-width="52" stroke-linecap="round" fill="none"/>'
    return out

BODY = 'M160 270 Q240 246 320 270 L356 398 Q240 428 124 398 Z'
def person(skin, skin_d, legs, shoes, outfit, hair, e, m, back='', arms_back='', arms_front='', hat='', front='', blush=0.8, sock=''):
    return SVG(f'''{back}
<path d="M204 392 V430 M276 392 V430" stroke="{legs}" stroke-width="52" stroke-linecap="round"/>{sock}
<ellipse cx="198" cy="444" rx="38" ry="17" fill="{shoes}"/><ellipse cx="282" cy="444" rx="38" ry="17" fill="{shoes}"/>
{arms_back}
<clipPath id="c{abs(hash(outfit)) % 99999}"><path d="{BODY}"/></clipPath>
<path d="{BODY}" fill="{outfit[0]}"/><g clip-path="url(#c{abs(hash(outfit)) % 99999})">{outfit[1]}</g>
<ellipse cx="240" cy="190" rx="126" ry="104" fill="{skin}"/>
{hair}{hat}{face(e, m, blush)}
{arms_front}{front}''')

# ---------- เชฟจิ๋ว: หมวกเชฟ ผมสั้นสีน้ำตาล เสื้อเชฟขาว ผ้าพันคอเหลือง ผ้ากันเปื้อนส้ม ----------
S1, S1_D, JACKET, BROWN = '#FFE3C2', '#F6CFA3', '#E9E5F8', '#6B4632'
chef_outfit = (JACKET, f'<path d="M184 420 V320 Q184 296 208 296 H272 Q296 296 296 320 V420 Z" fill="{CORAL}"/><rect x="216" y="340" width="48" height="34" rx="12" fill="{CORAL_L}"/>'
               f'<path d="M206 268 Q240 300 274 268 L262 258 Q240 268 218 258 Z" fill="{YEL}"/>')
chef_hair = f'<path d="M116 204 C104 150 146 100 196 98 L284 98 C334 100 376 150 364 204 C352 176 334 160 312 154 Q256 176 212 148 Q160 150 116 204 Z" fill="{BROWN}"/>'
def toque(rot=-8):
    return (f'<g transform="translate(0 -52) rotate({rot} 240 140)"><path d="M184 152 Q240 134 296 152 L296 122 Q240 106 184 122 Z" fill="{HAT_D}" stroke="{HAT_D}" stroke-width="5" stroke-linejoin="round"/>'
            f'<path d="M180 124 C146 108 152 58 194 58 C202 20 278 20 286 58 C328 58 334 108 300 124 Q240 106 180 124 Z" fill="{HAT}" stroke="{HAT_D}" stroke-width="5" stroke-linejoin="round"/>'
            f'<path d="M214 64 q6 22 0 42 M266 64 q-6 22 0 42" stroke="{HAT_D}" stroke-width="5" stroke-linecap="round" fill="none"/></g>')
def chef(e, m, **k):
    k.setdefault('hat', toque())
    return person(S1, S1_D, '#3B3950', INK, chef_outfit, chef_hair, e, m, **k)
A1 = lambda side, hx, hy, bx=0, by=0: arm(side, hx, hy, bx, by, S1, JACKET)
ladle = lambda x, y, r: f'<g transform="rotate({r} {x} {y})"><path d="M{x} {y+30} V{y-70}" stroke="{WOOD}" stroke-width="11" stroke-linecap="round"/><path d="M{x-24} {y-74} a24 24 0 0 0 48 0 z" fill="{WOOD}"/></g>'
wok = lambda x, y: (f'<path d="M{x-74} {y} q74 62 148 0 z" fill="{INK}"/><path d="M{x+70} {y+2} l52 -14" stroke="{INK}" stroke-width="14" stroke-linecap="round"/>'
                    f'<circle cx="{x-30}" cy="{y-26}" r="10" fill="{GREEN_L}"/><circle cx="{x+2}" cy="{y-46}" r="10" fill="{CORAL}"/><circle cx="{x+30}" cy="{y-24}" r="10" fill="{YEL}"/><circle cx="{x-8}" cy="{y-14}" r="9" fill="{GREEN}"/>'
                    f'<path d="M{x-56} {y-58} q-10 -12 0 -24 M{x+52} {y-62} q10 -12 0 -24" stroke="{HAT_D}" stroke-width="6" stroke-linecap="round" fill="none"/>')
POSES = {
  'hi': chef('dot', 'open', arms_back=A1('L', 96, 222, -22, 10), arms_front=ladle(380, 330, 14) + A1('R', 376, 350, 18, -4),
             front=f'<path d="M56 196 q-12 -14 -8 -32 M80 180 q-6 -12 -2 -26" stroke="{YEL}" stroke-width="7" stroke-linecap="round" fill="none"/>'),
  'cook': chef('dot', 'smile', arms_front=wok(262, 372) + A1('L', 196, 366, -30, 16) + A1('R', 372, 356, 26, 10)),
  'cheer': chef('happy', 'open', arms_back=A1('L', 92, 196, -18, 14) + A1('R', 388, 196, 18, 14), hat=toque(-14), front=star(54, 128, 22) + star(430, 116, 26) + star(404, 44, 13) + star(96, 60, 12)),
  'think': chef(('dot', 9, -8), 'dash', arms_front=A1('L', 214, 372, -34, 20) + A1('R', 284, 258, 46, 16), hat=toque(6), blush=0.6,
                front=f'<circle cx="384" cy="120" r="8" fill="{HAT_D}"/><circle cx="408" cy="88" r="13" fill="{HAT_D}"/><circle cx="438" cy="42" r="22" fill="{HAT_D}"/>'),
  'oops': chef('squeeze', 'wavy', arms_front=A1('L', 172, 238, -42, 26) + A1('R', 308, 238, 42, 26), hat=toque(-18), blush=0.5,
               front='<path d="M414 96 q22 34 0 46 q-22 -12 0 -46 z" fill="#6CC5F5"/><path d="M60 120 l-22 -10 M54 154 l-24 2" stroke="#6CC5F5" stroke-width="7" stroke-linecap="round"/>'),
}

# ---------- ป้างอบ: งอบ ผมมวยสีเทา เสื้อเขียวลายจุด ผ้าถุงม่วง รองเท้าแตะ ถือตะกร้า ----------
S2, S2_D, GREY, PURPLE, PURPLE_L = '#F4C79A', '#E7B07C', '#8B8089', '#8E6FD8', '#B9A4F0'
ngob_outfit = (GREEN, ''.join(f'<circle cx="{x}" cy="{y}" r="6" fill="{GREEN_L}"/>' for x, y in [(196, 292), (240, 284), (284, 292), (218, 316), (262, 316)])
               + f'<path d="M120 338 Q240 322 360 338 V430 H120 Z" fill="{PURPLE}"/><path d="M130 362 q14 -12 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 M130 390 h230" stroke="{PURPLE_L}" stroke-width="6" fill="none" stroke-linecap="round"/>')
ngob_hair = (f'<circle cx="336" cy="110" r="30" fill="{GREY}"/><path d="M116 204 C104 150 146 100 196 98 L284 98 C334 100 376 150 364 204 C348 164 304 148 240 148 C176 148 132 164 116 204 Z" fill="{GREY}"/>')
ngob_hat = (f'<path d="M84 136 Q240 -40 396 136 Q240 172 84 136 Z" fill="{STRAW}"/><path d="M146 116 Q240 16 334 116 M194 128 Q240 70 286 128" stroke="{STRAW_D}" stroke-width="6" fill="none" stroke-linecap="round"/>'
            f'<path d="M100 138 Q240 168 380 138" stroke="{STRAW_D}" stroke-width="7" fill="none" stroke-linecap="round"/>')
def auntie(e, m, **k):
    return person(S2, S2_D, S2, CORAL, ngob_outfit, ngob_hair, e, m, hat=ngob_hat, **k)
A2 = lambda side, hx, hy, bx=0, by=0: arm(side, hx, hy, bx, by, S2, GREEN, 0.42)
basket = lambda x, y: (f'<path d="M{x-46} {y} q46 -74 92 0" stroke="{STRAW_D}" stroke-width="9" fill="none" stroke-linecap="round"/>'
    f'<path d="M{x-30} {y-4} q-22 -44 6 -62 q26 20 8 62 z" fill="{GREEN}"/><path d="M{x-4} {y-4} q-8 -54 26 -66 q20 30 -4 66 z" fill="{GREEN_L}"/>'
    f'<path d="M{x+18} {y} l22 -52 q10 4 6 14 l-12 40 z" fill="{CORAL}"/>'
    f'<path d="M{x-52} {y-6} h104 l-12 62 q-40 12 -80 0 z" fill="{STRAW}"/><path d="M{x-48} {y+14} h96 M{x-44} {y+34} h88" stroke="{STRAW_D}" stroke-width="6" stroke-linecap="round"/>')
POSES.update({
  'shop': auntie('happy', 'open', arms_back=A2('L', 96, 232, -22, 12), arms_front=basket(392, 372) + A2('R', 384, 352, 22, -2), front=star(58, 176, 15)),
  'list': auntie('dot', 'smile', arms_front=f'<rect x="262" y="318" width="110" height="122" rx="14" fill="#FFFFFF" stroke="{HAT_D}" stroke-width="5"/>'
           f'<path d="M282 350 l8 8 l14 -16 M282 384 l8 8 l14 -16" stroke="{GREEN}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
           f'<path d="M318 352 h36 M318 386 h36 M284 418 h70" stroke="{HAT_D}" stroke-width="7" stroke-linecap="round"/>' + A2('R', 352, 380, 30, 0) + A2('L', 196, 372, -30, 18)),
})

# ---------- น้องชิม: ผมมวยคู่ผูกโบว์ส้ม ชุดเหลือง ผ้ากันเปื้อนขาวลายหัวใจ ถุงเท้าลาย รองเท้าชมพู ถือช้อนใหญ่ ----------
S3, S3_D, BLACK = '#FFDCCB', '#F5BFAF', '#3A2F33'
chim_outfit = (YEL, f'<path d="M190 420 L196 300 Q240 282 284 300 L290 420 Z" fill="#FFFFFF" stroke="{HAT_D}" stroke-width="5" stroke-linejoin="round"/>' + heart(240, 352, 0.9, CORAL))
chim_hair = (f'<circle cx="136" cy="100" r="40" fill="{BLACK}"/><circle cx="344" cy="100" r="40" fill="{BLACK}"/><rect x="146" y="122" width="36" height="18" rx="9" fill="{CORAL}" transform="rotate(-40 164 131)"/><rect x="298" y="122" width="36" height="18" rx="9" fill="{CORAL}" transform="rotate(40 316 131)"/>'
             f'<path d="M114 206 C98 138 160 84 240 84 C320 84 382 138 366 206 C354 170 330 154 306 152 Q270 176 240 152 Q210 176 174 152 C150 154 126 170 114 206 Z" fill="{BLACK}"/>')
chim_sock = f'<path d="M185 404 h46 M249 404 h46 M185 416 h46 M249 416 h46" stroke="{CORAL}" stroke-width="5"/>'
def chim(e, m, **k):
    k.setdefault('blush', 0.95)
    inner = person(S3, S3_D, '#FFFFFF', PINK, chim_outfit, chim_hair, e, m, sock=chim_sock, **k)
    body = inner[inner.index('>') + 1:inner.rindex('</svg>')]
    return SVG(f'<g transform="translate(240 460) scale(0.86) translate(-240 -460)">{body}</g>')  # ตัวเล็กกว่าผู้ใหญ่
A3 = lambda side, hx, hy, bx=0, by=0: arm(side, hx, hy, bx, by, S3, YEL, 0.4)
bigspoon = lambda x, y, r: f'<g transform="rotate({r} {x} {y})"><path d="M{x} {y+24} v-150" stroke="{WOOD}" stroke-width="13" stroke-linecap="round"/><ellipse cx="{x}" cy="{y-150}" rx="28" ry="38" fill="{WOOD}"/></g>'
POSES.update({
  'sip': chim('happy', '', arms_front=f'<path d="M318 244 L262 226" stroke="{WOOD}" stroke-width="12" stroke-linecap="round"/><ellipse cx="246" cy="222" rx="24" ry="15" fill="{WOOD}"/>' + A3('R', 322, 248, 44, 22) + A3('L', 200, 368, -30, 18),
              front=heart(420, 120, 1.1) + heart(66, 150, 0.7)),
  'yum': chim('happy', 'open', arms_back=A3('L', 96, 208, -18, 14), arms_front=bigspoon(384, 322, 12) + A3('R', 382, 336, 22, 0), front=star(60, 130, 20) + star(436, 60, 14) + star(110, 66, 11)),
  'hmm': chim(('dot', -8, -7), 'dash', arms_front=bigspoon(372, 372, 22) + A3('R', 366, 372, 24, 4) + A3('L', 198, 368, -30, 18), blush=0.6,
              front=f'<circle cx="118" cy="96" r="7" fill="{HAT_D}"/><circle cx="92" cy="66" r="11" fill="{HAT_D}"/><circle cx="60" cy="24" r="18" fill="{HAT_D}"/>'),
})
for n, svg in POSES.items(): open(n + '.svg', 'w').write(svg)

# ฉาก: ตัวละครอยู่ในที่ของตัวเอง พื้นหลังโปร่งใส ใช้สีอ่อนเข้มของสีหัวจอ แล้วแต้มสีสดเฉพาะของชิ้นเล็ก
inner = lambda svg: svg[svg.index('>') + 1:svg.rindex('</svg>')]
put = lambda name, x, y, s: f'<g transform="translate({x} {y}) scale({s})">{inner(POSES[name])}</g>'
scene = lambda w, h, body: f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">\n{body}\n</svg>'
steam = lambda x, y, c='#FFFFFF': f'<path d="M{x} {y} q-10 -12 0 -24 q10 -12 0 -24 M{x+24} {y+4} q-10 -12 0 -24 q10 -12 0 -24" stroke="{c}" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.9"/>'

# ครัวของทีมเชฟ (หัวจอหน้าร้าน สีน้ำเงิน)
W1, W2, W3, NAVY = '#5E6EF3', '#8493FA', '#B7C0FF', '#2A2F8C'
home = scene(780, 360, ''.join([
  # หน้าต่าง
  f'<rect x="28" y="30" width="156" height="128" rx="22" fill="{W2}"/><rect x="40" y="42" width="132" height="104" rx="14" fill="{W3}"/>',
  f'<circle cx="132" cy="80" r="20" fill="{YEL}"/><path d="M58 124 a16 16 0 0 1 22 -14 a20 20 0 0 1 36 6 a14 14 0 0 1 2 28 h-52 a12 12 0 0 1 -8 -20 z" fill="#FFFFFF"/>',
  f'<path d="M106 42 v104 M40 94 h132" stroke="{W2}" stroke-width="7"/>',
  # ราวแขวน: กระทะ ทัพพี ตะหลิว
  f'<path d="M214 44 h134" stroke="{W3}" stroke-width="8" stroke-linecap="round"/>',
  f'<path d="M238 44 v34 M286 44 v40 M330 44 v30" stroke="{W3}" stroke-width="5"/>',
  f'<circle cx="238" cy="104" r="27" fill="{NAVY}"/><circle cx="238" cy="104" r="17" fill="{W1}"/>',
  f'<circle cx="286" cy="100" r="15" fill="{W3}"/><rect x="321" y="74" width="18" height="34" rx="6" fill="{W3}"/>',
  # ชั้นวางของ: โหล กระถางต้นไม้
  f'<path d="M452 96 h300" stroke="{W3}" stroke-width="10" stroke-linecap="round"/>',
  f'<rect x="474" y="46" width="40" height="46" rx="10" fill="{YEL}"/><rect x="470" y="38" width="48" height="14" rx="7" fill="#FFFFFF"/>',
  f'<rect x="534" y="54" width="36" height="38" rx="10" fill="{PINK}"/><rect x="530" y="46" width="44" height="13" rx="6" fill="#FFFFFF"/>',
  f'<rect x="590" y="60" width="32" height="32" rx="9" fill="#7BE0B5"/><rect x="586" y="52" width="40" height="12" rx="6" fill="#FFFFFF"/>',
  f'<path d="M690 66 q-26 -30 -6 -44 q14 14 6 44 z M694 66 q4 -40 30 -40 q4 26 -30 40 z M692 66 q-34 -8 -34 -28 q26 0 34 28 z" fill="#7BE0B5"/><path d="M672 64 h42 l-6 28 h-30 z" fill="{CORAL}"/>',
  # เคาน์เตอร์ครัว
  f'<rect x="216" y="214" width="564" height="150" rx="18" fill="{W2}"/><rect x="204" y="198" width="590" height="24" rx="12" fill="{W3}"/>',
  f'<path d="M400 236 v110 M590 236 v110" stroke="{W1}" stroke-width="6" stroke-linecap="round"/><circle cx="378" cy="268" r="7" fill="{YEL}"/><circle cx="568" cy="268" r="7" fill="{YEL}"/>',
  # เขียงกับผัก
  f'<rect x="222" y="184" width="66" height="14" rx="7" fill="{WOOD}"/><circle cx="240" cy="176" r="10" fill="{CORAL}"/><circle cx="262" cy="174" r="11" fill="#7BE0B5"/>',
  # หม้อบนเตา
  steam(566, 130),
  f'<rect x="536" y="150" width="88" height="50" rx="14" fill="{CORAL}"/><rect x="528" y="142" width="104" height="16" rx="8" fill="#FF9B80"/><circle cx="580" cy="138" r="8" fill="#FF9B80"/>',
  f'<path d="M524 168 h12 M624 168 h12" stroke="{CORAL}" stroke-width="10" stroke-linecap="round"/>',
  # หม้อหุงข้าว
  f'<rect x="672" y="140" width="84" height="60" rx="22" fill="#FFFFFF"/><rect x="672" y="156" width="84" height="8" fill="{HAT_D}"/><circle cx="714" cy="182" r="6" fill="{CORAL}"/>',
  put('shop', 6, 166, 0.4), put('hi', 268, 100, 0.53), put('yum', 592, 190, 0.35),
]))
open('scene-home.svg', 'w').write(home)

# แผงตลาดของป้างอบ (หัวจอแผนวันอาทิตย์ สีส้ม)
O1, O2 = '#EE7F22', '#FFC98A'
crate = lambda x, y, w: f'<rect x="{x}" y="{y}" width="{w}" height="78" rx="10" fill="{STRAW}"/><path d="M{x+6} {y+26} h{w-12} M{x+6} {y+52} h{w-12}" stroke="{STRAW_D}" stroke-width="6" stroke-linecap="round"/>'
market = scene(780, 300, ''.join([
  # เสากับกันสาดลายทาง
  f'<path d="M292 60 v230 M748 60 v230" stroke="{O1}" stroke-width="12" stroke-linecap="round"/>',
  ''.join(f'<path d="M{262 + i * 86} 22 h86 v52 a43 26 0 0 1 -86 0 z" fill="{"#FFFFFF" if i % 2 else CORAL}"/>' for i in range(6)),
  f'<rect x="258" y="14" width="524" height="18" rx="9" fill="{O1}"/>',
  # ของแขวน: กล้วย กระเทียม
  f'<path d="M352 100 v26" stroke="{O1}" stroke-width="5"/><path d="M330 128 q22 -10 44 0 q4 34 -14 50 q-6 -22 -8 -30 q-2 12 -10 30 q-16 -18 -12 -50 z" fill="{YEL}"/>',
  f'<path d="M690 100 v22" stroke="{O1}" stroke-width="5"/><circle cx="690" cy="136" r="15" fill="#FFFFFF"/><circle cx="676" cy="158" r="15" fill="#FFFFFF"/><circle cx="704" cy="160" r="15" fill="#FFFFFF"/>',
  # ลังผัก
  f'<circle cx="352" cy="200" r="30" fill="#7BE0B5"/><circle cx="398" cy="204" r="26" fill="#2FB383"/><circle cx="372" cy="188" r="20" fill="#A9EBCB"/>', crate(312, 212, 128),
  f'<circle cx="490" cy="204" r="19" fill="{CORAL}"/><circle cx="526" cy="200" r="19" fill="#FF9B80"/><circle cx="560" cy="206" r="19" fill="{CORAL}"/><circle cx="508" cy="186" r="17" fill="#FF9B80"/><circle cx="544" cy="186" r="17" fill="{CORAL}"/>', crate(458, 212, 128),
  f'<ellipse cx="634" cy="204" rx="15" ry="19" fill="#FFFFFF"/><ellipse cx="664" cy="200" rx="15" ry="19" fill="#FFF3DC"/><ellipse cx="694" cy="204" rx="15" ry="19" fill="#FFFFFF"/><ellipse cx="650" cy="186" rx="14" ry="18" fill="#FFF3DC"/><ellipse cx="680" cy="186" rx="14" ry="18" fill="#FFFFFF"/>', crate(604, 212, 128),
  # ป้ายราคา
  ''.join(f'<rect x="{x}" y="238" width="44" height="26" rx="8" fill="#FFFFFF"/><path d="M{x+10} 251 h24" stroke="{O1}" stroke-width="5" stroke-linecap="round"/>' for x in (354, 500, 646)),
  put('shop', 30, 70, 0.48), star(248, 120, 13, '#FFFFFF'),
]))
open('scene-plan.svg', 'w').write(market)
