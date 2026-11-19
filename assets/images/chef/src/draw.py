# เชฟจิ๋วแบบภาพแบน รุ่นน่ารัก: ตัวกลมก้อนเดียว หน้าเล็กอยู่ต่ำ ตาจุด แก้มชมพู แขนขาเป็นปุ่มสั้น หมวกเชฟใบเล็กเอียง ผ้ากันเปื้อนส้ม
SKIN, SKIN_D, INK, CORAL, CORAL_L, HAT, HAT_D, WOOD, PINK, YEL = '#FFE3C2', '#F6CFA3', '#24212B', '#FF7A59', '#FFA58C', '#FFFFFF', '#E3DEF6', '#C98B4E', '#FF9DB0', '#FFD84D'
BODY = 'M240 132 C322 132 372 196 386 282 C400 372 344 432 240 432 C136 432 80 372 94 282 C108 196 158 132 240 132 Z'

def nub(x, y, rot, c=SKIN):  # แขนปุ่มสั้น
    return f'<ellipse cx="{x}" cy="{y}" rx="34" ry="21" fill="{c}" transform="rotate({rot} {x} {y})"/>'
def eyes(kind, dx=0, dy=0):
    L, R, Y = 196 + dx, 284 + dx, 262 + dy
    if kind == 'dot': return f'<circle cx="{L}" cy="{Y}" r="9" fill="{INK}"/><circle cx="{R}" cy="{Y}" r="9" fill="{INK}"/>'
    if kind == 'happy': return f'<path d="M{L-13} {Y+4} q13 -17 26 0 M{R-13} {Y+4} q13 -17 26 0" stroke="{INK}" stroke-width="6.5" stroke-linecap="round" fill="none"/>'
    if kind == 'squeeze': return f'<path d="M{L-11} {Y-9} l16 9 l-16 9 M{R+11} {Y-9} l-16 9 l16 9" stroke="{INK}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
def mouth(kind, dx=0, dy=0):
    X, Y = 240 + dx, 276 + dy
    if kind == 'smile': return f'<path d="M{X-10} {Y} q10 11 20 0" stroke="{INK}" stroke-width="6" stroke-linecap="round" fill="none"/>'
    if kind == 'open': return f'<path d="M{X-17} {Y-5} q17 34 34 0 z" fill="{INK}"/><path d="M{X-9} {Y+9} q9 7 18 0 q-9 -11 -18 0 z" fill="{CORAL}"/>'
    if kind == 'o': return f'<ellipse cx="{X}" cy="{Y+3}" rx="7" ry="9" fill="{INK}"/>'
    if kind == 'wavy': return f'<path d="M{X-15} {Y+3} q5 -8 10 0 t10 0 t10 0" stroke="{INK}" stroke-width="5.5" stroke-linecap="round" fill="none"/>'
    if kind == 'dash': return f'<path d="M{X-8} {Y+2} l16 0" stroke="{INK}" stroke-width="6" stroke-linecap="round"/>'
    return ''
star = lambda x, y, s, c=YEL: f'<path d="M{x} {y-s} q{s*0.18} {s*0.82} {s} {s} q-{s*0.82} {s*0.18} -{s} {s} q-{s*0.18} -{s*0.82} -{s} -{s} q{s*0.82} -{s*0.18} {s} -{s} z" fill="{c}"/>'

def chef(e, m, arms, back='', front='', hat=-9, blush=0.8, face=(0, 0)):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" width="480" height="480">
<ellipse cx="198" cy="436" rx="36" ry="16" fill="{SKIN_D}"/><ellipse cx="282" cy="436" rx="36" ry="16" fill="{SKIN_D}"/>
{back}{arms}
<path d="{BODY}" fill="{SKIN}"/>
<clipPath id="b"><path d="{BODY}"/></clipPath>
<g clip-path="url(#b)"><path d="M146 470 L146 348 Q146 318 176 318 L304 318 Q334 318 334 348 L334 470 Z" fill="{CORAL}"/>
<rect x="212" y="356" width="56" height="40" rx="14" fill="{CORAL_L}"/></g>
<g transform="rotate({hat} 240 140)">
<path d="M186 150 Q240 132 294 150 L294 122 Q240 106 186 122 Z" fill="{HAT_D}" stroke="{HAT_D}" stroke-width="5" stroke-linejoin="round"/>
<path d="M182 124 C150 108 156 62 196 62 C204 26 276 26 284 62 C324 62 330 108 298 124 Q240 106 182 124 Z" fill="{HAT}" stroke="{HAT_D}" stroke-width="5" stroke-linejoin="round"/>
<path d="M214 66 q6 22 0 40 M266 66 q-6 22 0 40" stroke="{HAT_D}" stroke-width="5" stroke-linecap="round" fill="none"/></g>
<g transform="translate({face[0]} {face[1]})">
<ellipse cx="160" cy="288" rx="23" ry="14" fill="{PINK}" opacity="{blush}"/><ellipse cx="320" cy="288" rx="23" ry="14" fill="{PINK}" opacity="{blush}"/>
{eyes(*e) if isinstance(e, tuple) else eyes(e)}{mouth(m)}</g>
{front}
</svg>'''

spoon = lambda x, y, x2, y2, r: f'<path d="M{x} {y} L{x2} {y2}" stroke="{WOOD}" stroke-width="11" stroke-linecap="round"/><ellipse cx="{x2}" cy="{y2}" rx="17" ry="23" fill="{WOOD}" transform="rotate({r} {x2} {y2})"/>'
down_l, down_r = nub(100, 330, 62), nub(380, 330, -62)
POSES = {
  'hi': chef('dot', 'open', nub(92, 250, -52) + down_r, front=f'<path d="M48 214 q-12 -14 -8 -32 M70 196 q-6 -12 -2 -26" stroke="{YEL}" stroke-width="7" stroke-linecap="round" fill="none"/>' + spoon(396, 356, 420, 276, 18) + nub(386, 336, -70)),
  'cook': chef('dot', 'smile', '', front=f'<path d="M290 380 q70 50 140 0 z" fill="{INK}"/><path d="M296 382 l-40 -10" stroke="{INK}" stroke-width="13" stroke-linecap="round"/>'
               f'<ellipse cx="362" cy="378" rx="34" ry="13" fill="#FFFFFF"/><circle cx="362" cy="375" r="12" fill="{YEL}"/>'
               f'<path d="M410 340 q-12 -14 0 -28 q12 -14 0 -28 M444 346 q-12 -14 0 -28 q12 -14 0 -28" stroke="{HAT_D}" stroke-width="7" stroke-linecap="round" fill="none"/>'
               + nub(104, 334, 58) + nub(262, 366, 12)),
  'cheer': chef('happy', 'open', nub(98, 232, -58) + nub(382, 232, 58), front=star(62, 150, 22) + star(424, 138, 28) + star(398, 62, 14) + star(96, 80, 13), hat=-13),
  'think': chef(('dot', 9, -9), 'dash', down_l, front=nub(318, 318, -150) + f'<circle cx="386" cy="170" r="8" fill="{HAT_D}"/><circle cx="408" cy="134" r="13" fill="{HAT_D}"/><circle cx="436" cy="84" r="22" fill="{HAT_D}"/>', hat=7, blush=0.6),
  'oops': chef('squeeze', 'wavy', '', front=nub(128, 308, -64) + nub(352, 308, 64) + '<path d="M410 150 q22 34 0 46 q-22 -12 0 -46 z" fill="#6CC5F5"/><path d="M62 170 l-22 -10 M56 204 l-24 2" stroke="#6CC5F5" stroke-width="7" stroke-linecap="round"/>', hat=-16, blush=0.5),
  'taste': chef('happy', '', down_l, front=f'<path d="M318 300 L262 284" stroke="{WOOD}" stroke-width="11" stroke-linecap="round"/><ellipse cx="248" cy="281" rx="21" ry="13" fill="{WOOD}"/>' + nub(340, 310, -28)
               + f'<path d="M398 150 c-14 -18 -40 0 -22 20 l22 22 l22 -22 c18 -20 -8 -38 -22 -20 z" fill="{PINK}"/><path d="M84 176 c-9 -12 -26 0 -14 13 l14 14 l14 -14 c12 -13 -5 -25 -14 -13 z" fill="{PINK}"/>', blush=1),
}
def face(e, m, blush=0.8, tx=0, ty=0):
    return (f'<g transform="translate({tx} {ty})"><ellipse cx="160" cy="288" rx="23" ry="14" fill="{PINK}" opacity="{blush}"/><ellipse cx="320" cy="288" rx="23" ry="14" fill="{PINK}" opacity="{blush}"/>'
            f'{eyes(*e) if isinstance(e, tuple) else eyes(e)}{mouth(m)}</g>')
SVG = lambda body: f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" width="480" height="480">\n{body}\n</svg>'

# ป้างอบ คนจ่ายตลาด: ตัวเตี้ยกว้าง ผิวเข้มกว่า ใส่งอบกับเสื้อเขียว ถือตะกร้า ดูแลรายการของที่ต้องซื้อ
S2, S2_D, GREEN, GREEN_L, STRAW, STRAW_D = '#F4C79A', '#E7B07C', '#2FB383', '#7BE0B5', '#F2C57C', '#D9A250'
BODY2 = 'M240 178 C342 178 402 236 406 314 C410 392 342 432 240 432 C138 432 70 392 74 314 C78 236 138 178 240 178 Z'
basket = lambda x, y: (f'<path d="M{x-46} {y} q46 -74 92 0" stroke="{STRAW_D}" stroke-width="9" fill="none" stroke-linecap="round"/>'
    f'<path d="M{x-30} {y-4} q-22 -44 6 -62 q26 20 8 62 z" fill="{GREEN}"/><path d="M{x-4} {y-4} q-8 -54 26 -66 q20 30 -4 66 z" fill="{GREEN_L}"/>'
    f'<path d="M{x+18} {y} l22 -52 q10 4 6 14 l-12 40 z" fill="{CORAL}"/>'
    f'<path d="M{x-52} {y-6} h104 l-12 62 q-40 12 -80 0 z" fill="{STRAW}"/><path d="M{x-48} {y+14} h96 M{x-44} {y+34} h88" stroke="{STRAW_D}" stroke-width="6" stroke-linecap="round"/>')
def shopper(e, m, arms='', front='', blush=0.8):
    return SVG(f'<ellipse cx="196" cy="436" rx="38" ry="16" fill="{S2_D}"/><ellipse cx="284" cy="436" rx="38" ry="16" fill="{S2_D}"/>'
        f'{arms}<path d="{BODY2}" fill="{S2}"/><clipPath id="b2"><path d="{BODY2}"/></clipPath>'
        f'<g clip-path="url(#b2)"><path d="M40 352 Q240 318 440 352 L440 470 L40 470 Z" fill="{GREEN}"/>'
        + ''.join(f'<circle cx="{x}" cy="{y}" r="7" fill="{GREEN_L}"/>' for x, y in [(160, 392), (240, 384), (320, 392), (200, 420), (280, 420)]) + '</g>'
        f'<path d="M96 214 Q240 44 384 214 Q240 246 96 214 Z" fill="{STRAW}"/><path d="M150 196 Q240 100 330 196 M196 206 Q240 150 284 206" stroke="{STRAW_D}" stroke-width="6" fill="none" stroke-linecap="round"/>'
        f'<path d="M112 216 Q240 244 368 216" stroke="{STRAW_D}" stroke-width="7" fill="none" stroke-linecap="round"/>'
        f'{face(e, m, blush, 0, 32)}{front}')

# น้องชิม นักชิม: ตัวเล็กกลม ผิวอมชมพู ผมหยิกเส้นเดียว ผ้ากันเปื้อนขาวผูกคอ ถือช้อนใหญ่ ให้คะแนนตอนทำจบจาน
S3, S3_D, BIB = '#FFD8CB', '#F5BFAF', '#FFFFFF'
BODY3 = 'M240 204 C318 204 366 258 366 324 C366 392 318 432 240 432 C162 432 114 392 114 324 C114 258 162 204 240 204 Z'
bigspoon = lambda x, y, r: f'<g transform="rotate({r} {x} {y})"><path d="M{x} {y} v-120" stroke="{WOOD}" stroke-width="13" stroke-linecap="round"/><ellipse cx="{x}" cy="{y-146}" rx="27" ry="36" fill="{WOOD}"/></g>'
def taster(e, m, arms='', front='', blush=0.9):
    return SVG(f'<ellipse cx="204" cy="436" rx="32" ry="14" fill="{S3_D}"/><ellipse cx="276" cy="436" rx="32" ry="14" fill="{S3_D}"/>'
        f'{arms}<path d="M240 206 q-8 -40 22 -44 q26 -2 20 22 q-4 12 -16 8" stroke="{INK}" stroke-width="9" fill="none" stroke-linecap="round"/>'
        f'<path d="{BODY3}" fill="{S3}"/><clipPath id="b3"><path d="{BODY3}"/></clipPath>'
        f'<g clip-path="url(#b3)"><path d="M168 352 Q240 330 312 352 L300 420 Q240 446 180 420 Z" fill="{BIB}" stroke="{HAT_D}" stroke-width="5" stroke-linejoin="round"/>'
        f'<path d="M240 372 c-9 -12 -26 0 -14 13 l14 14 l14 -14 c12 -13 -5 -25 -14 -13 z" fill="{CORAL}"/></g>'
        f'<g transform="translate(240 300) scale(0.86) translate(-240 -300)">{face(e, m, blush, 0, 22)}</g>{front}')

POSES.pop('taste')  # การชิมเป็นหน้าที่ของน้องชิม
POSES.update({
  'shop': shopper('happy', 'open', nub(86, 286, -50, S2), front=star(52, 226, 16) + basket(392, 356) + nub(378, 344, -64, S2)),
  'list': shopper('dot', 'smile', '', front=f'<rect x="262" y="318" width="112" height="124" rx="14" fill="#FFFFFF" stroke="{HAT_D}" stroke-width="5"/>'
           f'<path d="M282 350 l8 8 l14 -16 M282 384 l8 8 l14 -16" stroke="{GREEN}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
           f'<path d="M318 352 h38 M318 386 h38 M284 418 h72" stroke="{HAT_D}" stroke-width="7" stroke-linecap="round"/>' + nub(262, 372, 80, S2) + nub(100, 348, 62, S2)),
  'sip': taster('happy', '', nub(124, 348, 60, S3), front=f'<path d="M330 330 L270 322" stroke="{WOOD}" stroke-width="12" stroke-linecap="round"/><ellipse cx="252" cy="320" rx="24" ry="15" fill="{WOOD}"/>' + nub(346, 336, -24, S3)
           + f'<path d="M388 214 c-12 -16 -34 0 -19 17 l19 19 l19 -19 c15 -17 -7 -33 -19 -17 z" fill="{PINK}"/>'),
  'yum': taster('happy', 'open', nub(122, 286, -56, S3), front=bigspoon(372, 318, 14) + nub(362, 316, 60, S3) + star(86, 214, 20) + star(416, 132, 15) + star(128, 150, 11)),
  'hmm': taster(('dot', -8, -7), 'dash', nub(124, 348, 60, S3), front=bigspoon(356, 372, 24) + nub(344, 352, -60, S3) + f'<circle cx="150" cy="196" r="7" fill="{HAT_D}"/><circle cx="124" cy="166" r="11" fill="{HAT_D}"/><circle cx="92" cy="124" r="18" fill="{HAT_D}"/>', blush=0.6),
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
