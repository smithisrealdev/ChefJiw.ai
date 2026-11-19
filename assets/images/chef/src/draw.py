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
