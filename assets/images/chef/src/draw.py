# เชฟจิ๋วแบบภาพแบน รุ่นน่ารัก: ตัวกลมก้อนเดียว หน้าเล็กอยู่ต่ำ ตาจุด แก้มชมพู แขนขาเป็นปุ่มสั้น หมวกเชฟใบเล็กเอียง ผ้ากันเปื้อนส้ม
SKIN, SKIN_D, INK, CORAL, CORAL_L, HAT, HAT_D, WOOD, PINK, YEL = '#FFE3C2', '#F6CFA3', '#24212B', '#FF7A59', '#FFA58C', '#FFFFFF', '#E3DEF6', '#C98B4E', '#FF9DB0', '#FFD84D'
BODY = 'M240 132 C322 132 372 196 386 282 C400 372 344 432 240 432 C136 432 80 372 94 282 C108 196 158 132 240 132 Z'

def nub(x, y, rot):  # แขนปุ่มสั้น
    return f'<ellipse cx="{x}" cy="{y}" rx="34" ry="21" fill="{SKIN}" transform="rotate({rot} {x} {y})"/>'
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
for n, svg in POSES.items(): open(n + '.svg', 'w').write(svg)
