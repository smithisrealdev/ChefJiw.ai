# ทีมเชฟแบบภาพแบน วาดเป็น SVG ด้วยโค้ด
# สัดส่วนแบบคนตัวเล็กอ้วน: หัวเป็นทรงเหลี่ยมมน สูงราว 2.4 หัว ตัวกว้างกว่าหัว มีไหล่ แขนเรียวลงไปหามือ ขายาวพอเห็นถุงเท้ากับรองเท้า
# รันไฟล์นี้ได้ไฟล์ .svg ของทุกท่าและทุกฉาก แล้วรัน `node raster.js ..` แปลงเป็น PNG
INK, CORAL, CORAL_L, CORAL_D, HAT, HAT_D, WOOD, PINK, YEL = '#24212B', '#FF7A59', '#FFA58C', '#E9603F', '#FFFFFF', '#D8D1F0', '#C98B4E', '#FF9DB0', '#FFD84D'
GREEN, GREEN_L, STRAW, STRAW_D = '#2FB383', '#7BE0B5', '#F2C57C', '#D9A250'
SVG = lambda body: f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" width="480" height="480">\n{body}\n</svg>'

def face(look=(0, 0), mouth=True, blush=0.85, show='all'):
    """หน้าเดียวทุกท่า: ตาจุดกลมห่างกัน ปากขีดสั้นอยู่ระหว่างตา แก้มชมพูใต้ตา อารมณ์มาจากท่าทางและของรอบตัว
    look = ขยับลูกตาเวลามองไปทางอื่น mouth=False เมื่อมีของบังปาก show = 'eyes' วาดเฉพาะตา 'noeyes' วาดทุกอย่างยกเว้นตา (ชั้นแยกสำหรับกะพริบตา)"""
    L, R, Y = 196 + look[0], 284 + look[0], 262 + look[1]
    eyes = f'<circle cx="{L}" cy="{Y}" r="12.5" fill="{INK}"/><circle cx="{R}" cy="{Y}" r="12.5" fill="{INK}"/>'
    rest = (f'<ellipse cx="164" cy="290" rx="22" ry="15" fill="#FF8FB1" opacity="{blush}"/><ellipse cx="316" cy="290" rx="22" ry="15" fill="#FF8FB1" opacity="{blush}"/>'
            + (f'<path d="M229 267 h22" stroke="{INK}" stroke-width="8" stroke-linecap="round"/>' if mouth else ''))
    return f'<g transform="translate(240 178) scale(0.8) translate(-240 -262)">{eyes if show == "eyes" else rest if show == "noeyes" else rest + eyes}</g>'
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
def legs(skin, sock, accent, feet, drop, only=None):
    """ขาจากสะโพกถึงเท้า เท้าแต่ละข้างกำหนดเป็น (x, y, มุมหมุนรองเท้า) จึงยกขา ก้าว หรือนั่งแบะขาได้"""
    out = ''
    for k, ((hx, hy), (fx, fy, rot)) in enumerate(zip(((208, 372 + drop), (272, 372 + drop)), feet)):
        if only is not None and k != only: continue
        ax, ay = fx, fy - 14; mx, my = hx + (ax - hx) * 0.62, hy + (ay - hy) * 0.62  # ถุงเท้าคลุมช่วงล่างของขา
        dx, dy = ax - hx, ay - hy; n = max(1.0, (dx * dx + dy * dy) ** 0.5); px, py = -dy / n * 19, dx / n * 19
        sx, sy = hx + dx * 0.74, hy + dy * 0.74
        out += (f'<path d="M{hx} {hy} L{ax} {ay}" stroke="{skin}" stroke-width="38" stroke-linecap="round"/><path d="M{mx} {my} L{ax} {ay}" stroke="{sock}" stroke-width="38"/><circle cx="{ax}" cy="{ay}" r="19" fill="{sock}"/>'
                f'<path d="M{sx - px} {sy - py} L{sx + px} {sy + py}" stroke="{accent}" stroke-width="6"/>'
                f'<g transform="rotate({rot} {fx} {fy})"><ellipse cx="{fx}" cy="{fy}" rx="36" ry="18" fill="#FFFFFF" stroke="{HAT_D}" stroke-width="4"/>'
                f'<path d="M{fx-26} {fy+10} q26 8 52 0" stroke="{accent}" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M{fx-6} {fy-10} l9 11" stroke="{accent}" stroke-width="6" stroke-linecap="round"/></g>')
    return out
LAYER = ['all']  # 'all' = ภาพเต็ม  'body' = ตัดส่วนที่ขยับแยกออก  ชื่อส่วน หรือ 'legL' 'legR' = วาดเฉพาะส่วนนั้น ใช้ทำภาพแยกชั้นให้แอปขยับทีละส่วน
_n = [0]
def person(skin, top, clothes, hair, accent, look=(0, 0), mouth=True, sock='#FFFFFF', back='', under_head='', arms_back='', arms_front='', hat='', front='', blush=0.85,
           lean=0, tilt=0, feet=STAND, drop=0, ground='', legs_front=False, parts=None, bparts=None, extras=None, split_legs=False, split_ground=False):
    """lean = เอนตัวท่อนบน (องศา) tilt = เอียงคอ feet = ตำแหน่งเท้า drop = ย่อตัวลง (นั่ง) legs_front = ขาอยู่หน้าตัว (นั่งเหยียดขามาข้างหน้า) ground = ของที่พื้น การกระโดดทำเป็นแอนิเมชันในแอป"""
    _n[0] += 1; cid = f'c{_n[0]}'
    # ส่วนที่แยกชั้นได้: parts = ของหน้าตัว bparts = ของหลังตัว (ทั้งคู่เอนตามตัว) extras = ของรอบตัว เช่น ดาว ฟองความคิด split_legs = ขาแต่ละข้าง split_ground = ของที่พื้น
    layer, parts, bparts, extras = LAYER[0], parts or {}, bparts or {}, extras or {}
    fit = lambda inner: SVG(f'<g transform="translate(240 470) scale(0.92) translate(-240 -470)">{inner}</g>')
    upper = lambda inner: fit(f'<g transform="translate(0 {drop}) rotate({lean} 240 384)">{inner}</g>')
    if layer in parts: return upper(parts[layer])
    if layer in bparts: return upper(bparts[layer])
    if layer in extras: return fit(extras[layer])
    if layer == 'ground': return fit(ground)
    # หัวเป็นชั้นของตัวเอง (เอียงคอ พยักหน้าได้) ตาอยู่อีกชั้น (กะพริบได้) แขนที่อยู่หน้าหัวอยู่ชั้น front
    neck = lambda inner: f'<g transform="rotate({tilt} 240 236)">{inner}</g>'
    head = neck(f'{under_head}<path d="{HEAD}" fill="{skin}"/>{hair}{hat}{face(look, mouth, blush, "all" if layer == "all" else "noeyes")}')
    if layer == 'head': return upper(head)
    if layer == 'eyes': return upper(neck(face(look, mouth, blush, 'eyes')))
    if layer == 'front': return upper(arms_front)
    if layer in ('legL', 'legR'): return fit(legs(skin, sock, accent, feet, drop, only=('legL', 'legR').index(layer)))
    whole = layer == 'all'
    moving, moving_back, around = (''.join(d.values()) if whole else '' for d in (parts, bparts, extras))
    both_legs = '' if (split_legs and not whole) else legs(skin, sock, accent, feet, drop)
    if split_ground and not whole: ground = ''
    return SVG(f'''<g transform="translate(240 470) scale(0.92) translate(-240 -470)">{ground}<g>{'' if legs_front else both_legs}
<g transform="translate(0 {drop}) rotate({lean} 240 384)">{back}{moving_back}{arms_back}
<clipPath id="{cid}"><path d="{TORSO}"/></clipPath><path d="{TORSO}" fill="{top}"/><g clip-path="url(#{cid})">{clothes}</g>
{head if whole else ''}
{arms_front if whole else ''}{moving}</g>{both_legs if legs_front else ''}</g>{front}{around}</g>''')

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
wok = lambda x, y, r=0: f'<g transform="rotate({r} {x} {y})"><path d="M{x-66} {y} q66 56 132 0 z" fill="{INK}"/><path d="M{x+62} {y+2} l48 -12" stroke="{INK}" stroke-width="13" stroke-linecap="round"/></g>'
spatula = lambda x, y, r: (f'<g transform="rotate({r} {x} {y})"><path d="M{x} {y} H{x+70}" stroke="{WOOD}" stroke-width="10" stroke-linecap="round"/>'
                           f'<rect x="{x+64}" y="{y-15}" width="34" height="30" rx="7" fill="#A7B0C2"/><path d="M{x+72} {y-6} h18 M{x+72} {y+6} h18" stroke="#8792A8" stroke-width="4" stroke-linecap="round"/></g>')
knife = lambda x, y, r: (f'<g transform="rotate({r} {x} {y})"><rect x="{x-12}" y="{y-7}" width="30" height="14" rx="6" fill="{INK}"/>'
                         f'<path d="M{x+16} {y-10} H{x+74} Q{x+80} {y-10} {x+77} {y-2} L{x+70} {y+10} H{x+16} Z" fill="#E4E8F2" stroke="#A7B0C2" stroke-width="3" stroke-linejoin="round"/></g>')
food = lambda x, y: f'<circle cx="{x-34}" cy="{y-30}" r="9" fill="{GREEN_L}"/><circle cx="{x-2}" cy="{y-50}" r="9" fill="{CORAL}"/><circle cx="{x+30}" cy="{y-34}" r="9" fill="{YEL}"/><circle cx="{x-10}" cy="{y-20}" r="8" fill="{GREEN}"/><circle cx="{x+16}" cy="{y-62}" r="7" fill="{GREEN_L}"/>'
def build():
    P = {
      # เอนตัวตามกระทะ ของในกระทะลอยขึ้น
      'cook': chef(lean=9, tilt=-6, feet=((186, 440, -8), (286, 440, 10)),
                   parts={'food': food(262, 346), 'wok': wok(262, 346, -10) + A1('L', 200, 340, -34, 12) + A1('R', 356, 328, 30, 8)}),
      # กระโดดตัวลอย แขนขากาง
      'cheer': chef(feet=((170, 432, -22), (310, 432, 22)), bparts={'armL': A1('L', 88, 172, -14, 16), 'armR': A1('R', 392, 172, 14, 16)}, hat=toque(-14),
                    extras={'stars': star(50, 96, 22) + star(432, 84, 26) + star(400, 22, 13) + star(96, 30, 12)}),
      # เอียงคอคิด เท้าไขว้
      'think': chef(look=(10, -8), tilt=11, lean=3, feet=((214, 440, 0), (250, 438, -24)), arms_front=A1('L', 230, 334, -38, 16), parts={'hand': A1('R', 262, 268, 54, 44)}, hat=toque(4), blush=0.6,
                    extras={'bubbles': f'<circle cx="392" cy="112" r="8" fill="{HAT_D}"/><circle cx="414" cy="82" r="13" fill="{HAT_D}"/><circle cx="442" cy="40" r="22" fill="{HAT_D}"/>'}),
      # ผงะถอยหลัง ยกขาข้างหนึ่ง มือกุมแก้ม
      'oops': chef(lean=-10, tilt=-4, feet=((214, 440, 0), (318, 410, 34)), arms_front=A1('L', 170, 214, -44, 22) + A1('R', 310, 214, 44, 22), hat=toque(-20), blush=0.5,
                   extras={'sweat': '<path d="M408 96 q22 34 0 46 q-22 -12 0 -46 z" fill="#6CC5F5"/>', 'lines': '<path d="M56 122 l-22 -10 M50 156 l-24 2" stroke="#6CC5F5" stroke-width="7" stroke-linecap="round"/>'}),
      # ---- ท่าทำงานในครัวจำลอง: ตัวหันเข้าหาของที่อยู่ทางขวา มือทั้งสองอยู่ระดับเคาน์เตอร์ ----
      # เดิน: ก้าวขาสลับ แขนแกว่งสวนขา มองไปทางที่เดิน
      'walk': chef(lean=3, tilt=-4, look=(7, 0), feet=((196, 442, -6), (290, 440, 14)), split_legs=True, hat=toque(-6),
                   parts={'armL': A1('L', 134, 352, -14, 4), 'armR': A1('R', 346, 352, 14, 4)}),
      # ผัด: มือขวาถือตะหลิวคนในกระทะ มือซ้ายจับขอบเคาน์เตอร์ ก้มมองกระทะ
      'stir': chef(lean=5, tilt=-8, look=(9, 7), feet=((198, 440, -4), (284, 440, 8)), arms_front=A1('L', 214, 344, -32, 14),
                   parts={'spatula': spatula(374, 330, -4) + A1('R', 374, 330, 22, 2)}),
      # หั่น: มือขวาถือมีดสับขึ้นลง มือซ้ายจับของบนเขียง
      'chop': chef(lean=4, tilt=-10, look=(8, 9), arms_front=A1('L', 318, 346, -16, 24),
                   parts={'knife': knife(378, 326, 16) + A1('R', 378, 326, 20, -2)}, hat=toque(-4)),
      # ล้าง: สองมือถูของใต้น้ำทางขวา
      'wash': chef(lean=4, tilt=-8, look=(8, 8), parts={'hands': A1('L', 334, 348, -8, 24) + A1('R', 384, 338, 22, 2)}, hat=toque(-4)),
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
        return person(S2, MINT, pinafore, toey_hair, GREEN, bparts={'braids': braid(150, -1) + braid(330, 1)}, hat=bucket, **k)
    A2 = lambda side, hx, hy, bx=0, by=0: arm(side, hx, hy, bx, by, S2, MINT, 0.4)
    tote = lambda x, y: (f'<path d="M{x-24} {y-4} q24 -60 48 0" stroke="{CREAM_D}" stroke-width="8" fill="none" stroke-linecap="round"/>'
        f'<path d="M{x-26} {y+2} q-20 -42 6 -58 q24 18 8 58 z" fill="{GREEN}"/><path d="M{x-2} {y+2} q-8 -50 24 -62 q18 28 -4 62 z" fill="{GREEN_L}"/><path d="M{x+16} {y+4} l20 -50 q10 4 6 14 l-12 38 z" fill="{CORAL}"/>'
        f'<path d="M{x-44} {y} h88 l-6 68 q-38 10 -76 0 z" fill="{CREAM}" stroke="{CREAM_D}" stroke-width="4" stroke-linejoin="round"/>' + heart(x, y + 36, 0.75, CORAL))
    P.update({
      # เดินกลับจากตลาด ก้าวขา มือหนึ่งหิ้วถุงผ้า อีกมือแกว่งข้างตัว
      'shop': toey(lean=5, tilt=-5, feet=((196, 442, -6), (290, 440, 14)), split_legs=True, arms_back=A2('L', 122, 336, -26, 4), arms_front=tote(390, 326) + A2('R', 382, 318, 22, -4), front=star(56, 150, 15)),
      # นั่งบนลังไม้ อ่านรายการของ แกว่งขา
      'list': toey(tilt=7, feet=((196, 446, -14), (292, 434, 22)), split_legs=True, split_ground=True,
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
    P.update({
      # นั่งแบะขาบนเบาะ ชิมจากช้อน (ช้อนกับแขนเป็นชั้นแยก ยกขึ้นลงได้)
      'sip': chim(tilt=-6, drop=40, legs_front=True, feet=((112, 448, -62), (368, 448, 62)), ground=f'<ellipse cx="240" cy="456" rx="214" ry="22" fill="#CFE3FF"/>',
                  arms_front=A3('L', 208, 338, -34, 14),
                  parts={'spoon': f'<path d="M312 206 L262 192" stroke="{WOOD}" stroke-width="11" stroke-linecap="round"/><ellipse cx="248" cy="188" rx="22" ry="14" fill="{WOOD}"/>' + A3('R', 316, 212, 46, 18)},
                  extras={'hearts': heart(420, 150, 1.1) + heart(62, 184, 0.7)}),
      # กระโดดชูช้อน ขาข้างหนึ่งเตะไปข้างหลัง
      'yum': chim(lean=7, tilt=-6, feet=((184, 436, -14), (318, 408, 46)), bparts={'arm': A3('L', 96, 176, -14, 16)}, parts={'spoon': bigspoon(384, 286, 14) + A3('R', 382, 300, 22, -2)},
                  extras={'stars': star(52, 96, 20) + star(436, 26, 14) + star(108, 30, 11)}),
      # เอียงคอสงสัย เท้าเขี่ยพื้น
      'hmm': chim(look=(-9, -7), tilt=-13, lean=-4, feet=((204, 440, 0), (296, 434, 30)), arms_front=A3('L', 208, 338, -34, 14), parts={'spoon': bigspoon(368, 340, 22) + A3('R', 362, 340, 26, 2)}, blush=0.6,
                  extras={'bubbles': f'<circle cx="100" cy="92" r="7" fill="{HAT_D}"/><circle cx="76" cy="64" r="11" fill="{HAT_D}"/><circle cx="46" cy="28" r="16" fill="{HAT_D}"/>'}),
    })
    return P

POSES = build()
# ท่าที่ขยับทีละส่วนทำเป็นหลายชั้น: ตัว (-body) กับส่วนที่ขยับ แอปวางซ้อนกันแล้วขยับแต่ละชั้นตาม LAYERS ที่ src/data/images.ts
SPLIT = {
    'walk': ('body', 'head', 'eyes', 'armL', 'armR', 'legL', 'legR'), 'stir': ('body', 'head', 'eyes', 'front', 'spatula'),
    'chop': ('body', 'head', 'eyes', 'front', 'knife'), 'wash': ('body', 'head', 'eyes', 'hands'),
    'cook': ('body', 'head', 'eyes', 'wok', 'food'), 'cheer': ('body', 'head', 'eyes', 'armL', 'armR', 'stars'),
    'think': ('body', 'head', 'eyes', 'front', 'hand', 'bubbles'), 'oops': ('body', 'head', 'eyes', 'front', 'sweat', 'lines'),
    'shop': ('body', 'head', 'eyes', 'front', 'braids', 'legL', 'legR'), 'list': ('body', 'head', 'eyes', 'front', 'braids', 'ground', 'legL', 'legR'),
    'sip': ('body', 'head', 'eyes', 'front', 'spoon', 'hearts'), 'yum': ('body', 'head', 'eyes', 'arm', 'spoon', 'stars'), 'hmm': ('body', 'head', 'eyes', 'front', 'spoon', 'bubbles'),
}
for name, layers in SPLIT.items():
    for layer in layers:
        LAYER[0] = layer; POSES[f'{name}-{layer}'] = build()[name]
LAYER[0] = 'all'
for n, svg in POSES.items(): open(n + '.svg', 'w').write(svg)

# ฉาก: วาดเฉพาะของในฉาก แอปเลิกใช้ฉากบนหัวจอแล้ว ภาพชุดนี้เก็บไว้สำหรับงานโปรโมต พื้นหลังโปร่งใส ใช้สีอ่อนเข้มของสีหัวจอ แล้วแต้มสีสดเฉพาะของชิ้นเล็ก
scene = lambda w, h, body: f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">\n{body}\n</svg>'
floor = lambda y, c, h=360: f'<rect x="0" y="{y}" width="780" height="{h - y}" fill="{c}"/>'
beam = lambda x1, x2, y, fx1, fx2, h=360: f'<path d="M{x1} {y} L{x2} {y} L{fx2} {h} L{fx1} {h} Z" fill="#FFFFFF" opacity="0.1"/>'
shade = lambda cx, cy, rx, ry=9: f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#24212B" opacity="0.13"/>'
leaves = lambda x, c, h=360: f'<path d="M{x} {h + 6} q-44 -70 -12 -104 q30 34 12 104 z M{x + 8} {h + 6} q16 -92 64 -90 q0 60 -64 90 z M{x - 6} {h + 6} q-70 -26 -72 -70 q52 6 72 70 z" fill="{c}"/>'
steam = lambda x, y, c='#FFFFFF': f'<path d="M{x} {y} q-10 -12 0 -24 q10 -12 0 -24 M{x+24} {y+4} q-10 -12 0 -24 q10 -12 0 -24" stroke="{c}" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.9"/>'

# ครัวของทีมเชฟ (หัวจอหน้าร้าน สีน้ำเงิน)
W1, W2, W3, NAVY = '#5E6EF3', '#8493FA', '#B7C0FF', '#2A2F8C'
home = scene(780, 360, ''.join([
  floor(296, '#1AAE7B'),
  floor(292, '#3F4DDC'),
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
  beam(44, 170, 150, 150, 372) + shade(498, 352, 270, 8) + leaves(742, '#3643C9'),
]))
open('scene-home.svg', 'w').write(home)

# แผงตลาดที่ใบเตยไปซื้อของ (หัวจอแผนวันอาทิตย์ สีส้ม)
O1, O2 = '#EE7F22', '#FFC98A'
crate = lambda x, y, w: f'<rect x="{x}" y="{y}" width="{w}" height="78" rx="10" fill="{STRAW}"/><path d="M{x+6} {y+26} h{w-12} M{x+6} {y+52} h{w-12}" stroke="{STRAW_D}" stroke-width="6" stroke-linecap="round"/>'
market = scene(780, 300, ''.join([
  floor(250, '#F58A2C', 300),
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
  shade(520, 292, 240, 7) + leaves(748, '#E0741A', 300),
]))
open('scene-plan.svg', 'w').write(market)

# ---------- ฉากของแท็บที่เหลือ: ของในฉากเยอะขึ้น มีพรม ต้นไม้ ของแขวนผนัง ให้ตัวละครดูอยู่ในห้องจริง ----------
plant = lambda x, y, pot, leaf='#7BE0B5': (f'<path d="M{x} {y} q-30 -34 -8 -52 q18 16 8 52 z M{x+4} {y} q6 -46 34 -46 q4 30 -34 46 z M{x+2} {y} q-40 -10 -40 -32 q30 0 40 32 z" fill="{leaf}"/>'
                                          f'<path d="M{x-22} {y-2} h48 l-7 32 h-34 z" fill="{pot}"/>')
frame = lambda x, y, w, h, inner: f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#FFFFFF"/><rect x="{x+8}" y="{y+8}" width="{w-16}" height="{h-16}" rx="6" fill="{inner}"/>'
sparkle = lambda x, y, s=10, c='#FFFFFF': star(x, y, s, c)

# ห้องอ่านสูตร (แท็บสูตร สีชมพู): ชั้นหนังสือสูตร ธงราว รูปจานบนผนัง ตู้เย็น พรม และหนังสือสูตรเล่มใหญ่กางอยู่
P1, P2, P3 = '#EE5075', '#FF93AB', '#FFC6D3'
book = lambda x, y, w, h, c, tilt=0: f'<rect x="{x}" y="{y - h}" width="{w}" height="{h}" rx="5" fill="{c}" transform="rotate({tilt} {x + w / 2} {y})"/>'
recipes = scene(780, 360, ''.join([
  floor(296, '#F0557A'),
  # ธงราว
  f'<path d="M250 26 Q420 70 590 26" stroke="#FFFFFF" stroke-width="4" fill="none"/>',
  ''.join(f'<path d="M{x} {y} l22 4 l-14 26 z" fill="{c}"/>' for x, y, c in [(268, 31, YEL), (312, 40, '#FFFFFF'), (358, 46, '#7BE0B5'), (404, 49, YEL), (450, 47, '#FFFFFF'), (496, 42, '#7BE0B5'), (540, 33, YEL)]),
  # รูปจานในกรอบ
  frame(292, 96, 84, 70, P3) + f'<circle cx="334" cy="131" r="18" fill="#FFFFFF"/><circle cx="334" cy="131" r="10" fill="{YEL}"/>',
  frame(396, 110, 64, 56, P3) + f'<circle cx="428" cy="138" r="14" fill="#FFFFFF"/><circle cx="428" cy="138" r="8" fill="#7BE0B5"/>',
  frame(478, 92, 76, 74, P3) + f'<circle cx="516" cy="129" r="18" fill="#FFFFFF"/><circle cx="516" cy="129" r="10" fill="{CORAL}"/>',
  # ชั้นหนังสือสูตร
  f'<rect x="24" y="56" width="196" height="296" rx="18" fill="{P2}"/><rect x="38" y="70" width="168" height="270" rx="10" fill="{P1}"/>',
  f'<path d="M38 158 h168 M38 248 h168" stroke="{P2}" stroke-width="12"/>',
  book(50, 152, 22, 62, YEL) + book(76, 152, 18, 70, '#FFFFFF') + book(98, 152, 26, 54, '#7BE0B5') + book(128, 152, 20, 66, NAVY) + book(156, 152, 22, 58, '#FFFFFF', 14),
  book(50, 242, 26, 64, '#FFFFFF') + book(80, 242, 20, 56, CORAL) + book(104, 242, 22, 70, YEL) + f'<rect x="140" y="214" width="54" height="28" rx="8" fill="#FFFFFF"/><rect x="146" y="204" width="42" height="14" rx="6" fill="{P3}"/>',
  book(52, 334, 22, 60, '#7BE0B5') + book(78, 334, 24, 68, '#FFFFFF') + book(106, 334, 18, 52, YEL) + book(128, 334, 26, 62, NAVY, -12),
  plant(120, 26, '#FFFFFF'),
  # ตู้เย็น
  f'<rect x="612" y="52" width="144" height="300" rx="22" fill="#FFFFFF"/><path d="M612 156 h144" stroke="{HAT_D}" stroke-width="6"/>',
  f'<path d="M634 96 v36 M634 186 v60" stroke="{HAT_D}" stroke-width="8" stroke-linecap="round"/>',
  heart(700, 100, 0.8, CORAL) + star(716, 208, 12) + f'<rect x="672" y="234" width="50" height="42" rx="6" fill="{P3}"/><path d="M682 248 h30 M682 260 h20" stroke="{P1}" stroke-width="4" stroke-linecap="round"/>',
  # พรมกับหนังสือสูตรเล่มใหญ่
  f'<ellipse cx="410" cy="338" rx="186" ry="22" fill="{P2}"/>',
  sparkle(586, 190, 10) + sparkle(248, 214, 8) + sparkle(566, 232, 6),
  shade(122, 352, 100, 7) + shade(684, 352, 76, 7) + leaves(566, '#D94068'),
]))
open('scene-recipes.svg', 'w').write(recipes)

# หน้าเตา (แท็บทำอาหาร สีส้ม): ผนังกระเบื้อง เครื่องดูดควัน เตากับเตาอบ หม้อ กา โหลใส่ตะหลิว นาฬิกา
O3 = '#FFE1BD'
stove = scene(780, 360, ''.join([
  floor(312, '#F58A2C'),
  # กระเบื้องผนัง
  ''.join(f'<rect x="{236 + c * 68}" y="{92 + r * 52}" width="56" height="40" rx="8" fill="{O2}" opacity="{0.55 if (r + c) % 2 else 0.9}"/>' for r in range(2) for c in range(8)),
  # เครื่องดูดควัน
  f'<rect x="424" y="0" width="60" height="34" fill="{O1}"/><path d="M360 78 L392 30 H516 L548 78 Z" fill="{O1}"/><rect x="352" y="72" width="204" height="16" rx="8" fill="#D96F17"/>',
  # นาฬิกา ชั้นวางชาม ต้นไม้
  f'<circle cx="96" cy="84" r="44" fill="#FFFFFF"/><circle cx="96" cy="84" r="36" fill="{O3}"/><path d="M96 84 V58 M96 84 L114 94" stroke="{INK}" stroke-width="6" stroke-linecap="round"/><circle cx="96" cy="84" r="5" fill="{CORAL}"/>',
  f'<path d="M40 190 h150" stroke="{O3}" stroke-width="10" stroke-linecap="round"/><path d="M56 184 a28 22 0 0 0 56 0 z" fill="#FFFFFF"/><path d="M62 172 a22 16 0 0 0 44 0 z" fill="{O3}"/>',
  plant(156, 156, CORAL),
  # เตา: ตัวตู้ หน้าเตา เตาอบ ปุ่ม
  f'<rect x="212" y="232" width="568" height="140" rx="18" fill="{O2}"/><rect x="200" y="214" width="592" height="26" rx="13" fill="{O3}"/>',
  f'<rect x="404" y="262" width="176" height="84" rx="14" fill="{O1}"/><rect x="418" y="276" width="148" height="56" rx="10" fill="{YEL}" opacity="0.85"/><path d="M430 262 h124" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>',
  ''.join(f'<circle cx="{x}" cy="252" r="8" fill="#FFFFFF"/>' for x in (250, 282, 314, 640, 672, 704)),
  f'<path d="M236 214 h96 M612 214 h96" stroke="{INK}" stroke-width="10" stroke-linecap="round"/>',
  # หม้อมีฝา กาน้ำ
  steam(262, 142, '#FFFFFF'),
  f'<rect x="240" y="164" width="92" height="50" rx="12" fill="#FFFFFF"/><rect x="232" y="154" width="108" height="16" rx="8" fill="#7BE0B5"/><circle cx="286" cy="150" r="8" fill="#7BE0B5"/><path d="M228 182 h12 M332 182 h12" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>',
  f'<path d="M622 214 q-10 -50 38 -50 q48 0 38 50 z" fill="{YEL}"/><path d="M696 190 q30 -4 30 -30" stroke="{YEL}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M640 166 q20 -30 40 0" stroke="{INK}" stroke-width="7" fill="none" stroke-linecap="round"/>',
  # โหลใส่ตะหลิว
  f'<path d="M742 150 v-50 M756 152 v-62 M768 150 v-44" stroke="{WOOD}" stroke-width="7" stroke-linecap="round"/><ellipse cx="756" cy="84" rx="11" ry="15" fill="{WOOD}"/><rect x="730" y="150" width="50" height="64" rx="12" fill="#FFFFFF"/><path d="M730 172 h50" stroke="{HAT_D}" stroke-width="5"/>',
  sparkle(208, 120, 9) + sparkle(596, 120, 7),
  beam(60, 132, 128, 20, 190) + shade(112, 350, 86, 7) + leaves(4, '#E0741A'),
]))
open('scene-cook.svg', 'w').write(stove)

# มุมรางวัล (แท็บฉัน สีเขียว): หน้าต่าง ชั้นถ้วยรางวัล ไฟประดับ รูปจานที่เคยทำ เก้าอี้นวม พรม
G1, G2, G3 = '#14A572', '#63DDB1', '#B8F1DA'
me = scene(780, 360, ''.join([
  # ไฟประดับ
  f'<path d="M230 20 Q400 74 780 22" stroke="#FFFFFF" stroke-width="4" fill="none"/>',
  ''.join(f'<circle cx="{x}" cy="{y}" r="9" fill="{c}"/>' for x, y, c in [(262, 30, YEL), (322, 42, '#FFFFFF'), (386, 50, CORAL), (452, 53, YEL), (518, 51, '#FFFFFF'), (584, 46, CORAL), (650, 39, YEL), (716, 31, '#FFFFFF')]),
  # หน้าต่าง
  f'<rect x="32" y="44" width="176" height="150" rx="22" fill="{G2}"/><rect x="44" y="56" width="152" height="126" rx="14" fill="{G3}"/>',
  f'<circle cx="150" cy="96" r="20" fill="{YEL}"/><path d="M62 150 a16 16 0 0 1 22 -14 a20 20 0 0 1 36 6 a14 14 0 0 1 2 28 h-52 a12 12 0 0 1 -8 -20 z" fill="#FFFFFF"/>',
  f'<path d="M120 56 v126 M44 119 h152" stroke="{G2}" stroke-width="7"/>',
  # ชั้นถ้วยรางวัล
  f'<path d="M286 164 h228" stroke="{G3}" stroke-width="10" stroke-linecap="round"/>',
  f'<path d="M312 100 h52 q0 40 -26 44 q-26 -4 -26 -44 z" fill="{YEL}"/><path d="M312 108 q-18 0 -14 18 q4 12 18 12 M364 108 q18 0 14 -18" stroke="{YEL}" stroke-width="7" fill="none"/><rect x="330" y="142" width="16" height="10" fill="{YEL}"/><rect x="318" y="150" width="40" height="12" rx="5" fill="{WOOD}"/>',
  f'<path d="M398 92 l10 28 M430 92 l-10 28" stroke="{CORAL}" stroke-width="12"/><circle cx="414" cy="136" r="24" fill="{YEL}"/>' + star(414, 136, 12, '#FFFFFF'),
  star(478, 124, 26) + f'<rect x="462" y="148" width="32" height="14" rx="5" fill="{WOOD}"/>',
  # รูปจานที่เคยทำ
  frame(560, 84, 78, 78, G3) + f'<circle cx="599" cy="123" r="20" fill="#FFFFFF"/><circle cx="599" cy="123" r="11" fill="{CORAL}"/>',
  frame(654, 100, 68, 62, G3) + f'<circle cx="688" cy="131" r="16" fill="#FFFFFF"/><circle cx="688" cy="131" r="9" fill="{YEL}"/>',
  # เก้าอี้นวมกับต้นไม้
  f'<rect x="596" y="214" width="170" height="130" rx="40" fill="{G1}"/><rect x="620" y="260" width="122" height="84" rx="26" fill="{G2}"/><rect x="644" y="236" width="74" height="48" rx="14" fill="{YEL}"/>',
  plant(250, 312, '#FFFFFF', G3),
  # พรม
  f'<ellipse cx="400" cy="340" rx="190" ry="20" fill="{G2}"/>',
  sparkle(536, 208, 9) + sparkle(246, 222, 7) + sparkle(566, 252, 6),
  beam(44, 196, 190, 110, 420) + shade(682, 348, 86, 7) + leaves(560, '#0F8F62'),
]))
open('scene-me.svg', 'w').write(me)


# ---------- ครัวจำลองในหน้าทำอาหาร: ครัวยาว 1200 x 320 เชฟเดินไปทีละจุด (ตู้เย็น อ่างล้าง เขียง เตา) ----------
# ของที่เปลี่ยนตามขั้น (ประตูตู้เย็น น้ำไหล ของบนเขียง กระทะ ไฟ ไอร้อน) แอปวาดทับเอง ตำแหน่งอยู่ที่ src/components/kitchen-stage.tsx
# พื้นที่เท้าเชฟอยู่ y=296 ขอบบนเคาน์เตอร์อยู่ y=242 ตรงกับระดับมือของเชฟ
K_WALL, K_TILE, K_FLOOR, K_FLOOR_D, K_TOP, K_FRONT, K_FRONT_D = '#FFE9A8', '#FFF5D6', '#F4B54E', '#E59F35', '#FFF1D9', '#FFB86B', '#F29E4C'
counter = lambda x, w: (f'<rect x="{x}" y="242" width="{w}" height="60" fill="{K_FRONT}"/><rect x="{x-6}" y="234" width="{w+12}" height="14" rx="7" fill="{K_TOP}"/>'
                        + ''.join(f'<path d="M{x + i * w / 3 + 14} 258 h{w / 3 - 28}" stroke="{K_FRONT_D}" stroke-width="5" stroke-linecap="round"/><circle cx="{x + i * w / 3 + w / 6}" cy="276" r="5" fill="{K_TOP}"/>' for i in range(3)))
kitchen = scene(1200, 320, ''.join([
  f'<rect x="0" y="0" width="1200" height="320" fill="{K_WALL}"/>',
  # กระเบื้องหลังเคาน์เตอร์
  ''.join(f'<rect x="{262 + c * 44}" y="{150 + r * 30}" width="38" height="24" rx="5" fill="{K_TILE}"/>' for r in range(3) for c in range(18)),
  f'<rect x="0" y="296" width="1200" height="24" fill="{K_FLOOR}"/><path d="M0 300 H1200" stroke="{K_FLOOR_D}" stroke-width="4"/>',
  # หน้าต่างเหนืออ่าง แสงตกลงพื้น
  f'<rect x="356" y="34" width="170" height="100" rx="18" fill="#FFFFFF"/><rect x="366" y="44" width="150" height="80" rx="12" fill="#CDEBFF"/>',
  f'<circle cx="480" cy="72" r="16" fill="{YEL}"/><path d="M380 112 a14 14 0 0 1 20 -12 a18 18 0 0 1 32 6 a12 12 0 0 1 2 24 h-46 a10 10 0 0 1 -8 -18 z" fill="#FFFFFF"/><path d="M441 44 v80 M366 84 h150" stroke="#FFFFFF" stroke-width="6"/>',
  f'<path d="M366 134 L516 134 L600 296 L300 296 Z" fill="#FFFFFF" opacity="0.18"/>',
  # ตู้เย็น
  f'<rect x="40" y="42" width="132" height="254" rx="20" fill="#FFFFFF" stroke="{HAT_D}" stroke-width="5"/><path d="M42 130 h128" stroke="{HAT_D}" stroke-width="5"/>',
  f'<path d="M150 78 v30 M150 152 v54" stroke="{HAT_D}" stroke-width="8" stroke-linecap="round"/>' + heart(92, 86, 0.6, CORAL) + star(104, 180, 10) + f'<rect x="70" y="200" width="40" height="32" rx="5" fill="#CDEBFF"/>',
  # อ่างล้าง: เคาน์เตอร์ อ่าง ก๊อก
  counter(282, 252),
  f'<ellipse cx="432" cy="240" rx="46" ry="7" fill="#9AA6BD"/><path d="M470 236 V202 Q470 190 458 190 H444 Q436 190 436 198 V204" stroke="#A7B0C2" stroke-width="9" fill="none" stroke-linecap="round"/><rect x="474" y="222" width="14" height="10" rx="4" fill="#A7B0C2"/>',
  # เคาน์เตอร์เตรียม: เขียง ราวแขวนของ
  counter(552, 236),
  f'<rect x="626" y="230" width="112" height="10" rx="5" fill="{WOOD}"/><rect x="620" y="232" width="124" height="6" rx="3" fill="#B97A3E"/>',
  f'<path d="M596 72 h168" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/><path d="M620 72 v28 M672 72 v36 M728 72 v24" stroke="#FFFFFF" stroke-width="4"/>',
  f'<circle cx="620" cy="122" r="23" fill="{INK}"/><circle cx="620" cy="122" r="14" fill="#4B4757"/>' + f'<path d="M672 106 V146" stroke="{WOOD}" stroke-width="8" stroke-linecap="round"/><rect x="660" y="144" width="24" height="26" rx="6" fill="#A7B0C2"/>' + f'<rect x="719" y="96" width="18" height="34" rx="6" fill="#A7B0C2"/>',
  # เตา: ตู้ เตาอบ ปุ่ม หัวเตา เครื่องดูดควัน
  f'<rect x="806" y="242" width="236" height="60" fill="{K_FRONT_D}"/><rect x="800" y="234" width="248" height="14" rx="7" fill="#6C6878"/>',
  f'<rect x="846" y="254" width="156" height="40" rx="9" fill="#E58E3F"/><rect x="858" y="262" width="132" height="24" rx="6" fill="{YEL}" opacity="0.8"/>',
  ''.join(f'<circle cx="{x}" cy="248" r="6" fill="#FFFFFF"/>' for x in (826, 1022)),
  f'<ellipse cx="930" cy="236" rx="40" ry="5" fill="#3A3644"/>',
  f'<path d="M866 92 L894 44 H966 L994 92 Z" fill="{K_FRONT_D}"/><rect x="858" y="88" width="144" height="12" rx="6" fill="#E58E3F"/><rect x="910" y="0" width="40" height="46" fill="{K_FRONT_D}"/>',
  # ชั้นเครื่องปรุงกับต้นไม้
  f'<path d="M1066 132 h120" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>',
  f'<rect x="1078" y="88" width="16" height="40" rx="5" fill="#7A4526"/><rect x="1081" y="80" width="10" height="10" rx="3" fill="{CORAL}"/>',
  f'<rect x="1102" y="94" width="18" height="34" rx="5" fill="#C8782E"/><rect x="1105" y="86" width="12" height="10" rx="3" fill="#FFFFFF"/>',
  f'<rect x="1130" y="100" width="34" height="28" rx="8" fill="#FFFFFF"/><rect x="1128" y="94" width="38" height="10" rx="5" fill="{PINK}"/>',
  plant(1140, 266, CORAL),
  shade(106, 300, 76, 6) + shade(408, 300, 140, 6) + shade(670, 300, 130, 6) + shade(924, 300, 136, 6),
]))
open('kitchen.svg', 'w').write(kitchen)

# จุดหมุนของส่วนที่หมุนรอบข้อต่อ (หัวไหล่ สะโพก) เป็นสัดส่วนของภาพ ใส่ใน LAYERS ที่ src/data/images.ts แอปจึงหมุนแขนขารอบข้อต่อจริง ไม่ใช่เลื่อนทั้งท่อน
import math
def pivot(x, y, lean=0, drop=0, upper=True, small=False):
    if upper:
        a = math.radians(lean); dx, dy = x - 240, y - 384
        x, y = 240 + dx * math.cos(a) - dy * math.sin(a), 384 + dx * math.sin(a) + dy * math.cos(a)
    y += drop
    x, y = 240 + (x - 240) * 0.92, 470 + (y - 470) * 0.92
    if small: x, y = 240 + (x - 240) * 0.88, 464 + (y - 464) * 0.88
    return [round(x / 480, 3), round(y / 480, 3)]
def head_points(lean=0, tilt=0, drop=0, look=(0, 0), small=False):
    """คอ (จุดที่หัวเอียง) กับกึ่งกลางระหว่างตา (แกนที่ตาหุบตอนกะพริบ)"""
    a = math.radians(tilt); ex, ey = 240 + 0.8 * look[0] - 240, 178 + 0.8 * look[1] - 236
    eye = (240 + ex * math.cos(a) - ey * math.sin(a), 236 + ex * math.sin(a) + ey * math.cos(a))
    return pivot(240, 236, lean, drop, small=small), pivot(*eye, lean, drop, small=small)
for label, kw in [('walk', dict(lean=3, tilt=-4, look=(7, 0))), ('stir', dict(lean=5, tilt=-8, look=(9, 7))), ('chop', dict(lean=4, tilt=-10, look=(8, 9))), ('wash', dict(lean=4, tilt=-8, look=(8, 8))), ('cook', dict(lean=9, tilt=-6)), ('cheer', {}), ('think', dict(lean=3, tilt=11, look=(10, -8))), ('oops', dict(lean=-10, tilt=-4)), ('shop', dict(lean=5, tilt=-5)), ('list', dict(tilt=7)),
                  ('sip', dict(tilt=-6, drop=40, small=True)), ('yum', dict(lean=7, tilt=-6, small=True)), ('hmm', dict(lean=-4, tilt=-13, look=(-9, -7), small=True))]:
    print(label, 'neck, eyes', *head_points(**kw))
L, R = SHOULDER['L'], SHOULDER['R']
for label, p in [('walk armL', pivot(*L, lean=3)), ('walk armR', pivot(*R, lean=3)), ('walk legL', pivot(208, 372, upper=False)), ('stir arm', pivot(*R, lean=5)), ('chop arm', pivot(*R, lean=4)), ('wash arms', pivot(*R, lean=4)), ('cook wok', pivot(262, 346, lean=9)), ('cheer armL', pivot(*L)), ('cheer armR', pivot(*R)), ('think hand', pivot(*R, lean=3)),
                 ('list legL', pivot(208, 372, upper=False)), ('list legR', pivot(272, 372, upper=False)), ('sip spoon', pivot(*R, drop=40, small=True)),
                 ('yum arm', pivot(*L, lean=7, small=True)), ('yum spoon', pivot(*R, lean=7, small=True)), ('hmm spoon', pivot(*R, lean=-4, small=True))]:
    print(label, p)
