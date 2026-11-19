# ทีมเชฟแบบภาพแบน วาดเป็น SVG ด้วยโค้ด
# สัดส่วนแบบคนตัวเล็กอ้วน: หัวเป็นทรงเหลี่ยมมน สูงราว 2.4 หัว ตัวกว้างกว่าหัว มีไหล่ แขนเรียวลงไปหามือ ขายาวพอเห็นถุงเท้ากับรองเท้า
# รันไฟล์นี้ได้ไฟล์ .svg ของทุกท่าและทุกฉาก แล้วรัน `node raster.js ..` แปลงเป็น PNG
INK, CORAL, CORAL_L, CORAL_D, HAT, HAT_D, WOOD, PINK, YEL = '#24212B', '#FF7A59', '#FFA58C', '#E9603F', '#FFFFFF', '#D8D1F0', '#C98B4E', '#FF9DB0', '#FFD84D'
GREEN, GREEN_L, STRAW, STRAW_D = '#2FB383', '#7BE0B5', '#F2C57C', '#D9A250'
SVG = lambda body: f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" width="480" height="480">\n{body}\n</svg>'

def face(look=(0, 0), mouth=True, blush=0.85):
    """หน้าเดียวทุกท่า: ตาจุดกลมห่างกัน ปากขีดสั้นอยู่ระหว่างตา แก้มชมพูใต้ตา อารมณ์มาจากท่าทางและของรอบตัว
    look = ขยับลูกตาเวลามองไปทางอื่น mouth=False เมื่อมีของบังปาก"""
    L, R, Y = 196 + look[0], 284 + look[0], 262 + look[1]
    return (f'<g transform="translate(240 178) scale(0.8) translate(-240 -262)"><ellipse cx="164" cy="290" rx="22" ry="15" fill="#FF8FB1" opacity="{blush}"/><ellipse cx="316" cy="290" rx="22" ry="15" fill="#FF8FB1" opacity="{blush}"/>'
            f'<circle cx="{L}" cy="{Y}" r="12.5" fill="{INK}"/><circle cx="{R}" cy="{Y}" r="12.5" fill="{INK}"/>'
            + (f'<path d="M229 267 h22" stroke="{INK}" stroke-width="8" stroke-linecap="round"/>' if mouth else '') + '</g>')
star = lambda x, y, s, c=YEL: f'<path d="M{x} {y-s} q{s*0.18} {s*0.82} {s} {s} q-{s*0.82} {s*0.18} -{s} {s} q-{s*0.18} -{s*0.82} -{s} -{s} q{s*0.82} -{s*0.18} {s} -{s} z" fill="{c}"/>'
heart = lambda x, y, k=1.0, c=PINK: f'<path transform="translate({x} {y}) scale({k})" d="M0 -6 c-12 -16 -34 0 -19 17 l19 19 l19 -19 c15 -17 -7 -33 -19 -17 z" fill="{c}"/>'

HEAD = 'M146 152 C146 78 334 78 334 152 L336 194 C336 254 144 254 144 194 Z'
def hair_cap(color, fringe, key):
    return (f'<clipPath id="h{key}"><path d="{fringe}"/></clipPath>'
            f'<path d="{HEAD}" fill="{color}" stroke="{color}" stroke-width="12" stroke-linejoin="round" clip-path="url(#h{key})"/>')
# ตัวเป็นทรงระฆังที่ขึ้นไปซ่อนใต้หัว ไหล่จึงต่อจากคางเป็นเส้นเดียว แขนเสื้อสีเดียวกับตัวเสื้อจึงกลืนเป็นก้อนเดียว
TORSO = 'M164 206 C134 246 122 310 114 384 Q240 406 366 384 C358 310 346 246 316 206 Z'
SHOULDER = {'L': (160, 268), 'R': (320, 268)}
def arm(side, hx, hy, bx=0, by=0, skin='#FFE3C2', sleeve=None, cut=0.62):
    """แขนโค้งจากไหล่ถึงมือ ท่อนบนเป็นแขนเสื้อที่กว้างกว่า ปลายแขนกับมือเรียวกว่า"""
    x0, y0 = SHOULDER[side]; cx, cy = (x0 + hx) / 2 + bx, (y0 + hy) / 2 + by
    out = f'<path d="M{x0} {y0} Q{cx} {cy} {hx} {hy}" stroke="{skin}" stroke-width="32" stroke-linecap="round" fill="none"/>'
    if sleeve:
        t = cut; ax, ay = x0 + (cx - x0) * t, y0 + (cy - y0) * t; bx2, by2 = cx + (hx - cx) * t, cy + (hy - cy) * t
        out += f'<path d="M{x0} {y0} Q{ax} {ay} {ax + (bx2 - ax) * t} {ay + (by2 - ay) * t}" stroke="{sleeve}" stroke-width="48" stroke-linecap="round" fill="none"/>'
    return out
STAND = ((202, 440, 0), (278, 440, 0))
def legs(skin, sock, accent, feet, drop):
    """ขาจากสะโพกถึงเท้า เท้าแต่ละข้างกำหนดเป็น (x, y, มุมหมุนรองเท้า) จึงยกขา ก้าว หรือนั่งแบะขาได้"""
    out = ''
    for (hx, hy), (fx, fy, rot) in zip(((208, 372 + drop), (272, 372 + drop)), feet):
        ax, ay = fx, fy - 14; mx, my = hx + (ax - hx) * 0.62, hy + (ay - hy) * 0.62  # ถุงเท้าคลุมช่วงล่างของขา
        dx, dy = ax - hx, ay - hy; n = max(1.0, (dx * dx + dy * dy) ** 0.5); px, py = -dy / n * 19, dx / n * 19
        sx, sy = hx + dx * 0.74, hy + dy * 0.74
        out += (f'<path d="M{hx} {hy} L{ax} {ay}" stroke="{skin}" stroke-width="38" stroke-linecap="round"/><path d="M{mx} {my} L{ax} {ay}" stroke="{sock}" stroke-width="38"/><circle cx="{ax}" cy="{ay}" r="19" fill="{sock}"/>'
                f'<path d="M{sx - px} {sy - py} L{sx + px} {sy + py}" stroke="{accent}" stroke-width="6"/>'
                f'<g transform="rotate({rot} {fx} {fy})"><ellipse cx="{fx}" cy="{fy}" rx="36" ry="18" fill="#FFFFFF" stroke="{HAT_D}" stroke-width="4"/>'
                f'<path d="M{fx-26} {fy+10} q26 8 52 0" stroke="{accent}" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M{fx-6} {fy-10} l9 11" stroke="{accent}" stroke-width="6" stroke-linecap="round"/></g>')
    return out
_n = [0]
def person(skin, top, clothes, hair, accent, look=(0, 0), mouth=True, sock='#FFFFFF', back='', under_head='', arms_back='', arms_front='', hat='', front='', blush=0.85,
           lean=0, tilt=0, feet=STAND, drop=0, ground='', legs_front=False):
    """lean = เอนตัวท่อนบน (องศา) tilt = เอียงคอ feet = ตำแหน่งเท้า drop = ย่อตัวลง (นั่ง) legs_front = ขาอยู่หน้าตัว (นั่งเหยียดขามาข้างหน้า) ground = ของที่พื้น การกระโดดทำเป็นแอนิเมชันในแอป"""
    _n[0] += 1; cid = f'c{_n[0]}'
    return SVG(f'''<g transform="translate(240 470) scale(0.92) translate(-240 -470)">{ground}<g>{'' if legs_front else legs(skin, sock, accent, feet, drop)}
<g transform="translate(0 {drop}) rotate({lean} 240 384)">{back}{arms_back}
<clipPath id="{cid}"><path d="{TORSO}"/></clipPath><path d="{TORSO}" fill="{top}"/><g clip-path="url(#{cid})">{clothes}</g>
<g transform="rotate({tilt} 240 236)">{under_head}<path d="{HEAD}" fill="{skin}"/>{hair}{hat}{face(look, mouth, blush)}</g>
{arms_front}</g>{legs(skin, sock, accent, feet, drop) if legs_front else ''}</g>{front}</g>''')

# ---------- เชฟจิ๋ว: หมวกเชฟ ผมหน้าม้าปัดข้าง เสื้อแขนยาวฟ้า ผ้ากันเปื้อนเต็มตัวสีส้มมีกระเป๋า ----------
S1, SKY, BROWN = '#FFE3C2', '#BFD9FF', '#6B4632'
apron = (f'<path d="M204 216 V268 M276 216 V268" stroke="{CORAL_D}" stroke-width="9" stroke-linecap="round"/>'
         f'<path d="M198 264 H282 Q290 264 290 272 V300 L326 312 L338 404 H142 L154 312 L190 300 V272 Q190 264 198 264 Z" fill="{CORAL}"/><rect x="212" y="326" width="56" height="38" rx="13" fill="{CORAL_L}"/>')
chef_hair = hair_cap(BROWN, 'M100 40 H380 V182 C356 154 324 142 292 142 Q262 166 226 138 Q166 144 100 192 Z', 'chef')
def toque(rot=-8):
    return (f'<g transform="translate(240 96) rotate({rot}) scale(0.86) translate(-240 -150)"><path d="M184 152 Q240 134 296 152 L296 122 Q240 106 184 122 Z" fill="{HAT_D}" stroke="{HAT_D}" stroke-width="5" stroke-linejoin="round"/>'
            f'<path d="M180 124 C146 108 152 58 194 58 C202 20 278 20 286 58 C328 58 334 108 300 124 Q240 106 180 124 Z" fill="{HAT}" stroke="{HAT_D}" stroke-width="5" stroke-linejoin="round"/>'
            f'<path d="M214 64 q6 22 0 42 M266 64 q-6 22 0 42" stroke="{HAT_D}" stroke-width="5" stroke-linecap="round" fill="none"/></g>')
def chef(**k):
    k.setdefault('hat', toque())
    return person(S1, SKY, apron, chef_hair, CORAL, **k)
A1 = lambda side, hx, hy, bx=0, by=0: arm(side, hx, hy, bx, by, S1, SKY)
ladle = lambda x, y, r: f'<g transform="rotate({r} {x} {y})"><path d="M{x} {y+26} V{y-66}" stroke="{WOOD}" stroke-width="10" stroke-linecap="round"/><path d="M{x-22} {y-70} a22 22 0 0 0 44 0 z" fill="{WOOD}"/></g>'
wok = lambda x, y, r=0: (f'<g transform="rotate({r} {x} {y})"><path d="M{x-66} {y} q66 56 132 0 z" fill="{INK}"/><path d="M{x+62} {y+2} l48 -12" stroke="{INK}" stroke-width="13" stroke-linecap="round"/></g>'
                    f'<circle cx="{x-34}" cy="{y-40}" r="9" fill="{GREEN_L}"/><circle cx="{x-2}" cy="{y-66}" r="9" fill="{CORAL}"/><circle cx="{x+30}" cy="{y-44}" r="9" fill="{YEL}"/><circle cx="{x-10}" cy="{y-24}" r="8" fill="{GREEN}"/><circle cx="{x+16}" cy="{y-84}" r="7" fill="{GREEN_L}"/>')
POSES = {
  # โบกมือ เอนตัวนิดๆ เท้าหนึ่งเขย่ง
  'hi': chef(lean=-5, tilt=5, feet=((200, 440, 0), (292, 432, 24)), arms_back=A1('L', 92, 196, -18, 14), arms_front=ladle(378, 300, 14) + A1('R', 374, 318, 20, -6),
             front=f'<path d="M52 168 q-12 -14 -8 -32 M76 152 q-6 -12 -2 -26" stroke="{YEL}" stroke-width="7" stroke-linecap="round" fill="none"/>'),
  # เอนตัวตามกระทะ ของในกระทะลอยขึ้น
  'cook': chef(lean=9, tilt=-6, feet=((186, 440, -8), (286, 440, 10)), arms_front=wok(262, 346, -10) + A1('L', 200, 340, -34, 12) + A1('R', 356, 328, 30, 8)),
  # กระโดดตัวลอย แขนขากาง
  'cheer': chef(feet=((170, 432, -22), (310, 432, 22)), arms_back=A1('L', 88, 172, -14, 16) + A1('R', 392, 172, 14, 16), hat=toque(-14),
                front=star(50, 96, 22) + star(432, 84, 26) + star(400, 22, 13) + star(96, 30, 12)),
  # เอียงคอคิด เท้าไขว้
  'think': chef(look=(10, -8), tilt=11, lean=3, feet=((214, 440, 0), (250, 438, -24)), arms_front=A1('L', 230, 334, -38, 16) + A1('R', 262, 268, 54, 44), hat=toque(4), blush=0.6,
                front=f'<circle cx="392" cy="112" r="8" fill="{HAT_D}"/><circle cx="414" cy="82" r="13" fill="{HAT_D}"/><circle cx="442" cy="40" r="22" fill="{HAT_D}"/>'),
  # ผงะถอยหลัง ยกขาข้างหนึ่ง มือกุมแก้ม
  'oops': chef(lean=-10, tilt=-4, feet=((214, 440, 0), (318, 410, 34)), arms_front=A1('L', 170, 214, -44, 22) + A1('R', 310, 214, 44, 22), hat=toque(-20), blush=0.5,
               front='<path d="M408 96 q22 34 0 46 q-22 -12 0 -46 z" fill="#6CC5F5"/><path d="M56 122 l-22 -10 M50 156 l-24 2" stroke="#6CC5F5" stroke-width="7" stroke-linecap="round"/>'),
}

# ---------- ใบเตย: หมวกบักเก็ต ผมเปียคู่ผูกโบว์ เสื้อยืดเขียวมินต์ เอี๊ยมกระโปรงยีนส์ติดกระดุมเหลือง ถุงผ้าใส่ผัก ----------
S2, MINT, DENIM, DENIM_D, CREAM, CREAM_D, DARKHAIR = '#FFDDBE', '#A6ECCF', '#7C9BF0', '#5E7FE0', '#FFF3DC', '#EAD9B4', '#4A3A36'
pinafore = (f'<path d="M206 214 V270 M274 214 V270" stroke="{DENIM}" stroke-width="16" stroke-linecap="round"/>'
            f'<path d="M196 262 H284 Q292 262 292 270 V304 L334 314 L348 406 H132 L146 314 L188 304 V270 Q188 262 196 262 Z" fill="{DENIM}"/>'
            f'<circle cx="206" cy="276" r="7" fill="{YEL}"/><circle cx="274" cy="276" r="7" fill="{YEL}"/><path d="M216 316 H264 V340 Q240 352 216 340 Z" fill="none" stroke="{DENIM_D}" stroke-width="5" stroke-linejoin="round"/>'
            f'<path d="M150 346 Q240 336 330 346" stroke="{DENIM_D}" stroke-width="5" fill="none"/>')
braid = lambda x, d: (f'<path d="M{x} 206 q{d*14} 34 {d*4} 68 q{-d*6} 24 {d*6} 44" stroke="{DARKHAIR}" stroke-width="30" stroke-linecap="round" fill="none"/>'
                      f'<rect x="{x + d*2 - 18}" y="296" width="36" height="16" rx="8" fill="{CORAL}"/>')
toey_hair = hair_cap(DARKHAIR, 'M100 40 H380 V190 C356 160 322 150 296 148 Q240 170 184 148 C158 150 124 160 100 190 Z', 'toey')
bucket = (f'<g transform="translate(240 92) scale(0.86) translate(-240 -130)"><path d="M96 132 Q240 96 384 132 Q396 150 372 156 Q240 126 108 156 Q84 150 96 132 Z" fill="{CREAM_D}"/>'
          f'<path d="M140 136 C132 60 186 26 240 26 C294 26 348 60 340 136 Q240 110 140 136 Z" fill="{CREAM}"/><path d="M146 112 Q240 88 334 112" stroke="{CREAM_D}" stroke-width="6" fill="none"/></g>')
def toey(**k):
    return person(S2, MINT, pinafore, toey_hair, GREEN, back=braid(150, -1) + braid(330, 1), hat=bucket, **k)
A2 = lambda side, hx, hy, bx=0, by=0: arm(side, hx, hy, bx, by, S2, MINT, 0.4)
tote = lambda x, y: (f'<path d="M{x-24} {y-4} q24 -60 48 0" stroke="{CREAM_D}" stroke-width="8" fill="none" stroke-linecap="round"/>'
    f'<path d="M{x-26} {y+2} q-20 -42 6 -58 q24 18 8 58 z" fill="{GREEN}"/><path d="M{x-2} {y+2} q-8 -50 24 -62 q18 28 -4 62 z" fill="{GREEN_L}"/><path d="M{x+16} {y+4} l20 -50 q10 4 6 14 l-12 38 z" fill="{CORAL}"/>'
    f'<path d="M{x-44} {y} h88 l-6 68 q-38 10 -76 0 z" fill="{CREAM}" stroke="{CREAM_D}" stroke-width="4" stroke-linejoin="round"/>' + heart(x, y + 36, 0.75, CORAL))
POSES.update({
  # เดินกลับจากตลาด ก้าวขา แกว่งถุงผ้า
  'shop': toey(lean=5, tilt=-5, feet=((190, 442, -6), (300, 424, 30)), arms_back=A2('L', 96, 204, -18, 14), arms_front=tote(390, 326) + A2('R', 382, 318, 22, -4), front=star(56, 150, 15)),
  # นั่งบนลังไม้ อ่านรายการของ แกว่งขา
  'list': toey(tilt=7, feet=((196, 446, -14), (292, 434, 22)),
               ground=f'<rect x="126" y="384" width="228" height="80" rx="12" fill="{STRAW}"/><path d="M138 412 h204 M138 438 h204" stroke="{STRAW_D}" stroke-width="6" stroke-linecap="round"/>',
               arms_front=f'<rect x="262" y="292" width="104" height="116" rx="14" fill="#FFFFFF" stroke="{HAT_D}" stroke-width="5"/>'
           f'<path d="M280 322 l8 8 l14 -16 M280 354 l8 8 l14 -16" stroke="{GREEN}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
           f'<path d="M316 324 h34 M316 356 h34 M282 386 h66" stroke="{HAT_D}" stroke-width="7" stroke-linecap="round"/>' + A2('R', 348, 352, 30, 0) + A2('L', 208, 340, -34, 14)),
})

# ---------- น้องชิม: ฮู้ดหมีสีเหลืองสวมฮู้ด หน้าม้า กระโปรงพลีทชมพู ถุงเท้าชมพู ถือช้อนใหญ่ ----------
S3, BUTTER, BUTTER_D, ROSE, ROSE_D, BLACK = '#FFDCCB', '#FFE27A', '#F2C744', '#FFB3C4', '#F58CA5', '#3A2F33'
bear_hood = (f'<circle cx="162" cy="92" r="30" fill="{BUTTER}"/><circle cx="318" cy="92" r="30" fill="{BUTTER}"/><circle cx="162" cy="92" r="15" fill="{BUTTER_D}"/><circle cx="318" cy="92" r="15" fill="{BUTTER_D}"/>'
             f'<path d="M126 158 C126 50 354 50 354 158 L356 200 C356 262 310 272 240 272 C170 272 124 262 124 200 Z" fill="{BUTTER}"/>')
chim_clothes = (f'<path d="M222 268 v26 M258 268 v26" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/><circle cx="222" cy="298" r="5" fill="#FFFFFF"/><circle cx="258" cy="298" r="5" fill="#FFFFFF"/>'
                + heart(240, 328, 0.8, CORAL) + f'<path d="M106 356 Q240 344 374 356 V420 H106 Z" fill="{ROSE}"/><path d="M160 354 V410 M214 350 V410 M266 350 V410 M320 354 V410" stroke="{ROSE_D}" stroke-width="5" stroke-linecap="round"/>')
chim_hair = f'<path d="M158 160 C158 92 322 92 322 160 Q296 138 268 158 Q240 136 212 158 Q184 138 158 160 Z" fill="{BLACK}"/>'
def chim(**k):
    k.setdefault('blush', 0.95)
    inner = person(S3, BUTTER, chim_clothes, chim_hair, ROSE_D, sock=ROSE, under_head=bear_hood, **k)
    body = inner[inner.index('>') + 1:inner.rindex('</svg>')]
    return SVG(f'<g transform="translate(240 464) scale(0.88) translate(-240 -464)">{body}</g>')  # ตัวเล็กกว่าพี่ๆ
A3 = lambda side, hx, hy, bx=0, by=0: arm(side, hx, hy, bx, by, S3, BUTTER, 0.8)
bigspoon = lambda x, y, r: f'<g transform="rotate({r} {x} {y})"><path d="M{x} {y+22} v-136" stroke="{WOOD}" stroke-width="12" stroke-linecap="round"/><ellipse cx="{x}" cy="{y-136}" rx="26" ry="35" fill="{WOOD}"/></g>'
POSES.update({
  # นั่งแบะขาบนเบาะ ชิมจากช้อน
  'sip': chim(mouth=False, tilt=-6, drop=40, legs_front=True, feet=((112, 448, -62), (368, 448, 62)), ground=f'<ellipse cx="240" cy="456" rx="214" ry="22" fill="#CFE3FF"/>',
              arms_front=f'<path d="M312 206 L262 192" stroke="{WOOD}" stroke-width="11" stroke-linecap="round"/><ellipse cx="248" cy="188" rx="22" ry="14" fill="{WOOD}"/>' + A3('R', 316, 212, 46, 18) + A3('L', 208, 338, -34, 14),
              front=heart(420, 150, 1.1) + heart(62, 184, 0.7)),
  # กระโดดชูช้อน ขาข้างหนึ่งเตะไปข้างหลัง
  'yum': chim(lean=7, tilt=-6, feet=((184, 436, -14), (318, 408, 46)), arms_back=A3('L', 96, 176, -14, 16), arms_front=bigspoon(384, 286, 14) + A3('R', 382, 300, 22, -2),
              front=star(52, 96, 20) + star(436, 26, 14) + star(108, 30, 11)),
  # เอียงคอสงสัย เท้าเขี่ยพื้น
  'hmm': chim(look=(-9, -7), tilt=-13, lean=-4, feet=((204, 440, 0), (296, 434, 30)), arms_front=bigspoon(368, 340, 22) + A3('R', 362, 340, 26, 2) + A3('L', 208, 338, -34, 14), blush=0.6,
              front=f'<circle cx="100" cy="92" r="7" fill="{HAT_D}"/><circle cx="76" cy="64" r="11" fill="{HAT_D}"/><circle cx="46" cy="28" r="16" fill="{HAT_D}"/>'),
})
for n, svg in POSES.items(): open(n + '.svg', 'w').write(svg)

# ฉาก: วาดเฉพาะของในฉาก ตัวละครวางทับในแอปเพื่อให้ขยับได้ (ตำแหน่งอยู่ใน SCENE ที่ src/data/images.ts) พื้นหลังโปร่งใส ใช้สีอ่อนเข้มของสีหัวจอ แล้วแต้มสีสดเฉพาะของชิ้นเล็ก
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
]))
open('scene-home.svg', 'w').write(home)

# แผงตลาดที่ใบเตยไปซื้อของ (หัวจอแผนวันอาทิตย์ สีส้ม)
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
  star(248, 120, 13, '#FFFFFF'),
]))
open('scene-plan.svg', 'w').write(market)
