# Three-quarter "turned toward the work" variants of the four mascots.
# Drawn facing right; the page mirrors them when the station is on the left.
from bots import INK, eyes, mouth, blush, legs, toque
def eye2(xn,xf,y):
    """near eye full size, far eye a little smaller"""
    return eyes(xn,xn,y)[:len(eyes(xn,xn,y))//2] + eyes(xf,xf,y,3.0)[:len(eyes(xf,xf,y,3.0))//2]
def blush2(xn,xf,y,c):
    return f'<ellipse cx="{xn}" cy="{y}" rx="7" ry="4.5" fill="{c}"></ellipse><ellipse cx="{xf}" cy="{y}" rx="4.5" ry="4" fill="{c}"></ellipse>'
def arm(cls,sx,sy,rot,c,hand=None,tool='',ln=32):
    """arm that swings from the shoulder; CSS rotates the inner .armN/.armF group around (0,0)"""
    h=f'<circle cx="0" cy="{ln-8}" r="7" fill="{hand}"></circle>' if hand else ''
    return f'<g transform="translate({sx} {sy})"><g class="{cls}"><g transform="rotate({rot})">{tool}<rect x="-7" y="-4" width="14" height="{ln}" rx="7" fill="{c}"></rect>{h}</g></g></g>'
SPOON='<rect x="-2" y="20" width="4" height="30" rx="2" fill="#B9824F"></rect><ellipse cx="0" cy="52" rx="7" ry="9" fill="#B9824F"></ellipse>'
TASTE='<rect x="-1.500" y="20" width="3" height="22" rx="1.500" fill="#B9B6C9"></rect><ellipse cx="0" cy="44" rx="5.500" ry="7" fill="#D9D6E6"></ellipse>'
CLIP='<g transform="rotate(62 0 24)"><rect x="-13" y="14" width="26" height="32" rx="4" fill="#FFFFFF"></rect><rect x="-5" y="11" width="10" height="6" rx="2" fill="#6B6777"></rect><path d="M-8 24h16M-8 30h16M-8 36h10" fill="none" stroke="#7B6CF6" stroke-width="2" stroke-linecap="round"></path></g>'
PENCIL='<rect x="-1.800" y="22" width="3.600" height="18" rx="1.200" fill="#FFC93D"></rect><path d="M-1.800 40h3.600L0 45z" fill="#24212B"></path>'

STOOL=('<ellipse cx="54" cy="145" rx="27" ry="6.500" fill="#DDAA6A"></ellipse><rect x="33" y="145" width="6" height="27" rx="3" fill="#DDAA6A"></rect><rect x="69" y="145" width="6" height="27" rx="3" fill="#DDAA6A"></rect>'
       '<ellipse cx="54" cy="142" rx="27" ry="6.500" fill="#F9DDAE"></ellipse>')
def leg_sit(c,near,foot=None):
    """one bent leg of a seated mascot: thigh pointing forward, shin hanging down"""
    tx,ty,sx,sy=(54,126,73,128) if near else (62,121,79,123)
    f=f'<rect x="{sx}" y="{sy+15}" width="14" height="12" rx="6" fill="{foot}"></rect>' if foot else ''
    return f'<rect x="{tx}" y="{ty}" width="{32 if near else 30}" height="15" rx="7.500" fill="{c}"></rect><rect x="{sx}" y="{sy}" width="14" height="27" rx="7" fill="{c}"></rect>'+f
def elephant(rN=-56,rF=-74):
    C='#A9B4EE'; D='#8E9BE3'
    return (legs(C)
      +arm('armF',78,96,rF,D,'#FFFFFF')
      +f'<g class="bodyg"><ellipse cx="60" cy="106" rx="30" ry="28" fill="{C}"></ellipse>'
      '<rect x="49" y="84" width="6" height="16" fill="#F2876B"></rect><rect x="75" y="84" width="6" height="16" fill="#F2876B"></rect>'
      '<path d="M43 97 Q65 91 87 97 L89 124 Q64 138 38 124 Z" fill="#F2876B"></path><rect x="56" y="108" width="20" height="13" rx="6" fill="#F7A58E"></rect></g>'
      +f'<g class="head"><g class="earR"><circle cx="93" cy="54" r="17" fill="{C}"></circle><circle cx="92" cy="55" r="9" fill="#F6BFD3"></circle></g>'
      f'<g class="earL"><circle cx="22" cy="56" r="21" fill="{C}"></circle><circle cx="24" cy="57" r="12.500" fill="#F6BFD3"></circle></g>'
      f'<ellipse cx="60" cy="56" rx="38" ry="33" fill="{C}"></ellipse>'
      +toque(62,-6)+blush2(41,90,68,'#F7A8C0')+eye2(52,85,57)+mouth(57,77,INK,4)+
      f'<path class="trunk" d="M70 63 L70 80 Q70 92 83 87" fill="none" stroke="{D}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"></path></g>'
      +arm('armN',56,98,rN,D,'#FFFFFF',SPOON))

def cat():
    C='#F6E6CF'; B='#8A5A44'
    return ('<g transform="translate(0 -22)">'
      f'<path class="tail" d="M36 124 C14 128 8 106 19 96" fill="none" stroke="{B}" stroke-width="10" stroke-linecap="round"></path>'
      +STOOL+leg_sit(B,False)
      +arm('armF',78,97,-72,'#FFFFFF',B)
      +f'<g class="bodyg"><ellipse cx="60" cy="108" rx="30" ry="27" fill="{C}"></ellipse>'
      '<path d="M37 100 Q64 87 91 100 L92 127 Q62 138 34 127 Z" fill="#FFFFFF"></path>'
      +''.join(f'<circle cx="{x}" cy="{y}" r="2.600" fill="#8FD3B6"></circle>' for x in (60,72) for y in (111,122))+'</g>'
      +leg_sit(B,True)
      +f'<g class="head"><path class="earL" d="M30 40 L33 12 L54 28 Z" fill="{B}" stroke="{B}" stroke-width="6" stroke-linejoin="round"></path><path d="M35 34 L36 20 L46 28 Z" fill="#F4A9B8"></path>'
      f'<path class="earR" d="M96 41 L94 14 L74 29 Z" fill="{B}" stroke="{B}" stroke-width="6" stroke-linejoin="round"></path><path d="M91 35 L91 22 L82 29 Z" fill="#F4A9B8"></path>'
      f'<ellipse cx="60" cy="58" rx="38" ry="32" fill="{C}"></ellipse><ellipse cx="70" cy="66" rx="17" ry="14" fill="{B}"></ellipse>'
      +toque(62,2,0.62)+blush2(40,91,68,'#F7A8A8')+eye2(49,88,58)+
      '<ellipse cx="71" cy="62" rx="3.400" ry="2.400" fill="#F4A9B8"></ellipse>'+mouth(71,67,'#F6E6CF',4.5,'#F28BA0')+'</g>'
      '<path d="M49 86 Q65 95 81 86 L76 99 L65 93 L54 99 Z" fill="#8FD3B6"></path>'
      +arm('armN',56,99,-58,'#FFFFFF',B,TASTE)+'</g>')

BASKET=('<g transform="rotate(8 0 24)"><path d="M-12 31 Q0 12 12 31" fill="none" stroke="#A9743F" stroke-width="3" stroke-linecap="round"></path>'
        '<circle cx="-7" cy="29" r="5.500" fill="#5DBB63"></circle><circle cx="3" cy="27" r="6" fill="#86D36B"></circle><rect x="7" y="20" width="5" height="13" rx="2.500" transform="rotate(18 9 26)" fill="#FF9F43"></rect>'
        '<path d="M-16 30 H16 L13 51 Q0 54 -13 51 Z" fill="#F3C98B"></path><path d="M-15 37H15M-14 44H14" stroke="#D9A066" stroke-width="2.200"></path></g>')
LENS='<rect x="-2" y="20" width="4" height="14" rx="2" fill="#6B6777"></rect><circle cx="0" cy="43" r="10" fill="rgba(255,255,255,.55)" stroke="#6B6777" stroke-width="3.500"></circle>'
def capy():
    """standing, carrying a market basket in the near hand; the far arm does the unloading"""
    C='#C8915C'; D='#A9743F'
    return (legs(C,foot='#8A5A2E')
      +arm('armF',78,97,-58,D)
      +f'<g class="bodyg"><ellipse cx="60" cy="106" rx="31" ry="28" fill="{C}"></ellipse>'
      '<path d="M42 99 Q65 93 88 99 L90 124 Q64 138 38 124 Z" fill="#86B37F"></path><rect x="56" y="109" width="20" height="13" rx="6" fill="#A3C99C"></rect></g>'
      +f'<g class="head"><ellipse class="earL" cx="30" cy="34" rx="7" ry="6" fill="{D}"></ellipse><ellipse class="earR" cx="91" cy="33" rx="6" ry="5.500" fill="{D}"></ellipse>'
      f'<rect x="17" y="28" width="86" height="60" rx="29" fill="{C}"></rect><ellipse cx="73" cy="68" rx="20" ry="14" fill="{D}"></ellipse>'
      '<ellipse cx="75" cy="62" rx="7" ry="4" fill="#6E4526"></ellipse>'
      +blush2(39,95,66,'#F0A07E')+eye2(48,91,54)+mouth(74,71,'#6E4526',4.5)+'</g>'
      '<path d="M44 86 Q64 96 84 86 L84 93 Q64 102 44 93 Z" fill="#F2C14E"></path><path d="M40 88 L27 84 L31 98 Z" fill="#F2C14E"></path>'
      +arm('armN',50,99,-8,C,'',BASKET))

def frog():
    """standing, clipboard in the near hand, magnifying glass held up to the ingredient"""
    C='#A9D86E'; D='#93C55A'
    return (legs(C)
      +arm('armF',78,96,-100,D,'',LENS)
      +f'<g class="bodyg"><ellipse cx="60" cy="106" rx="30" ry="28" fill="{C}"></ellipse><ellipse cx="66" cy="111" rx="18" ry="17" fill="#F3F0C9"></ellipse></g>'
      +f'<g class="head"><path d="M30 44 Q64 4 98 44 Z" fill="#FFFFFF"></path><path d="M30 30 L16 26 L20 40 Z" fill="#FFFFFF"></path>'
      f'<circle cx="46" cy="36" r="13" fill="{C}"></circle><circle cx="88" cy="37" r="11.500" fill="{C}"></circle>'
      f'<ellipse cx="60" cy="62" rx="40" ry="29" fill="{C}"></ellipse>'
      +blush2(40,93,68,'#F7A8A0')+eye2(46,88,38)+mouth(70,68,INK,6.5)+'</g>'
      +arm('armN',54,98,-22,C,'',CLIP))
SIDE={'elephant_work':elephant(-90,-84),'cat_work':cat(),'capybara_work':capy(),'frog_work':frog()}
if __name__=='__main__':
    import bots
    css=open('page.py',encoding='utf-8').read().split("css='''")[1].split("'''")[0]
    cells=''.join(f'<div class="bot" style="position:relative;display:inline-block;width:96px;height:139px;margin:40px 50px;transform:scale(1.8);transform-origin:50% 0">{bots.svg(k)}</div>' for k in SIDE)
    open('../shots/side.html','w',encoding='utf-8').write('<!doctype html><meta charset="utf-8"><style>body{background:#FBEBD2}'+css+'*{animation:none !important}</style>'+cells)
