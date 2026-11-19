INK='#2E2A28'
def eyes(x1,x2,y,r=3.4):
    o=''
    for x in (x1,x2):
        o+=f'<circle class="eo" cx="{x}" cy="{y}" r="{r}" fill="{INK}"></circle>'
        o+=f'<path class="eh" d="M{x-4.5} {y+1.5} Q{x} {y-5} {x+4.5} {y+1.5}" fill="none" stroke="{INK}" stroke-width="2.6" stroke-linecap="round"></path>'
        o+=f'<path class="es" d="M{x-4.5} {y+1} L{x+4.5} {y+1}" fill="none" stroke="{INK}" stroke-width="2.6" stroke-linecap="round"></path>'
    return o
def mouth(x,y,col=INK,w=5,openc='#E8697A'):
    return (f'<path class="ms" d="M{x-w} {y} Q{x} {y+w} {x+w} {y}" fill="none" stroke="{col}" stroke-width="2.4" stroke-linecap="round"></path>'
            f'<ellipse class="mo" cx="{x}" cy="{y+2}" rx="{w-0.5}" ry="{w}" fill="{openc}"></ellipse>')
def blush(x1,x2,y,c):
    return ''.join(f'<ellipse cx="{x}" cy="{y}" rx="7" ry="4.5" fill="{c}"></ellipse>' for x in (x1,x2))
def legs(c,foot=None):
    o=''
    for cls,x in (('legL',41),('legR',63)):
        o+=f'<g class="{cls}"><rect x="{x}" y="116" width="16" height="30" rx="8" fill="{c}"></rect>'
        if foot: o+=f'<rect x="{x}" y="134" width="16" height="12" rx="6" fill="{foot}"></rect>'
        o+='</g>'
    return o
def arms(c,hand=None,extraR=''):
    o=''
    for cls,x,rot,px in (('armL',22,20,29),('armR',84,-20,91)):
        o+=f'<g class="{cls}"><g transform="rotate({rot} {px} 94)"><rect x="{x}" y="90" width="14" height="32" rx="7" fill="{c}"></rect>'
        if cls=='armR': o+=extraR
        if hand: o+=f'<circle cx="{x+7}" cy="116" r="7" fill="{hand}"></circle>'
        o+='</g></g>'
    return o
def toque(cx=60,top=4,s=1.0):
    return (f'<g transform="translate({cx} {top}) scale({s})"><circle cx="-14" cy="12" r="11" fill="#FFFFFF"></circle><circle cx="0" cy="8" r="13" fill="#FFFFFF"></circle><circle cx="14" cy="12" r="11" fill="#FFFFFF"></circle><rect x="-17" y="12" width="34" height="16" rx="4" fill="#FFFFFF"></rect></g>')

def elephant():
    C='#A9B4EE'; D='#8E9BE3'
    spoon='<rect x="89" y="92" width="4" height="40" rx="2" fill="#B9824F"></rect><ellipse cx="91" cy="134" rx="7" ry="9" fill="#B9824F"></ellipse>'
    return (legs(C)+
      f'<g class="bodyg"><ellipse cx="60" cy="106" rx="30" ry="28" fill="{C}"></ellipse>'
      '<rect x="44" y="84" width="6" height="16" fill="#F2876B"></rect><rect x="70" y="84" width="6" height="16" fill="#F2876B"></rect>'
      '<path d="M38 97 Q60 91 82 97 L86 124 Q60 138 34 124 Z" fill="#F2876B"></path><rect x="50" y="108" width="20" height="13" rx="6" fill="#F7A58E"></rect></g>'
      +
      f'<g class="head"><g class="earL"><circle cx="20" cy="56" r="21" fill="{C}"></circle><circle cx="21" cy="57" r="12.5" fill="#F6BFD3"></circle></g>'
      f'<g class="earR"><circle cx="100" cy="56" r="21" fill="{C}"></circle><circle cx="99" cy="57" r="12.5" fill="#F6BFD3"></circle></g>'
      f'<ellipse cx="60" cy="56" rx="38" ry="33" fill="{C}"></ellipse>'
      +toque(60,-6)+blush(31,89,68,'#F7A8C0')+eyes(41,79,57)+mouth(46,76,INK,4)+
      f'<path class="trunk" d="M60 63 L60 80 Q60 91 72 87" fill="none" stroke="{D}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"></path></g>'
      +arms(D,hand='#FFFFFF',extraR=spoon))

def cat():
    C='#F6E6CF'; B='#8A5A44'
    return (f'<path class="tail" d="M82 122 C104 126 110 104 99 94" fill="none" stroke="{B}" stroke-width="10" stroke-linecap="round"></path>'
      +legs(B)+
      f'<g class="bodyg"><ellipse cx="60" cy="106" rx="30" ry="28" fill="{C}"></ellipse>'
      '<path d="M33 99 Q60 86 87 99 L89 126 Q60 138 31 126 Z" fill="#FFFFFF"></path>'
      +''.join(f'<circle cx="{x}" cy="{y}" r="2.6" fill="#8FD3B6"></circle>' for x in (54,66) for y in (110,121))+'</g>'
      +arms('#FFFFFF',hand=B)+
      f'<g class="head"><path class="earL" d="M28 40 L31 12 L52 28 Z" fill="{B}" stroke="{B}" stroke-width="6" stroke-linejoin="round"></path><path d="M33 34 L34 20 L44 28 Z" fill="#F4A9B8"></path>'
      f'<path class="earR" d="M92 40 L89 12 L68 28 Z" fill="{B}" stroke="{B}" stroke-width="6" stroke-linejoin="round"></path><path d="M87 34 L86 20 L76 28 Z" fill="#F4A9B8"></path>'
      f'<ellipse cx="60" cy="58" rx="38" ry="32" fill="{C}"></ellipse><ellipse cx="60" cy="66" rx="17" ry="14" fill="{B}"></ellipse>'
      +toque(60,2,0.62)+blush(31,89,68,'#F7A8A8')+eyes(38,82,58)+
      '<ellipse cx="60" cy="62" rx="3.4" ry="2.4" fill="#F4A9B8"></ellipse>'+mouth(60,67,'#F6E6CF',4.5,'#F28BA0')+'</g>'
      '<path d="M44 86 Q60 95 76 86 L71 99 L60 93 L49 99 Z" fill="#8FD3B6"></path>')

def capy():
    C='#C8915C'; D='#A9743F'
    return (legs(C,foot='#8A5A2E')+
      f'<g class="bodyg"><ellipse cx="60" cy="106" rx="31" ry="28" fill="{C}"></ellipse>'
      '<path d="M37 99 Q60 93 83 99 L87 124 Q60 138 33 124 Z" fill="#86B37F"></path><rect x="50" y="109" width="20" height="13" rx="6" fill="#A3C99C"></rect></g>'
      +arms(C)+
      f'<g class="head"><ellipse class="earL" cx="27" cy="34" rx="7" ry="6" fill="{D}"></ellipse><ellipse class="earR" cx="93" cy="34" rx="7" ry="6" fill="{D}"></ellipse>'
      f'<rect x="17" y="28" width="86" height="60" rx="29" fill="{C}"></rect><ellipse cx="60" cy="68" rx="20" ry="14" fill="{D}"></ellipse>'
      '<ellipse cx="60" cy="62" rx="7" ry="4" fill="#6E4526"></ellipse>'
      +blush(29,91,66,'#F0A07E')+eyes(36,84,54)+mouth(60,71,'#6E4526',4.5)+'</g>'
      '<path d="M40 86 Q60 96 80 86 L80 93 Q60 102 40 93 Z" fill="#F2C14E"></path><path d="M78 88 L92 84 L88 98 Z" fill="#F2C14E"></path>')

def frog():
    C='#A9D86E'
    return (legs(C)+
      f'<g class="bodyg"><ellipse cx="60" cy="106" rx="30" ry="28" fill="{C}"></ellipse><ellipse cx="60" cy="111" rx="18" ry="17" fill="#F3F0C9"></ellipse></g>'
      +arms(C)+
      f'<g class="head"><path d="M26 44 Q60 4 94 44 Z" fill="#FFFFFF"></path><path d="M90 30 L104 26 L100 40 Z" fill="#FFFFFF"></path>'
      f'<circle cx="38" cy="36" r="13" fill="{C}"></circle><circle cx="82" cy="36" r="13" fill="{C}"></circle>'
      f'<ellipse cx="60" cy="62" rx="40" ry="29" fill="{C}"></ellipse>'
      +blush(30,90,68,'#F7A8A0')+eyes(38,82,38)+mouth(60,68,INK,7)+'</g>')

BOTS={'elephant':elephant(),'cat':cat(),'capybara':capy(),'frog':frog()}
def svg(k,static=False):
    body=BOTS[k]
    style='<style>.eh,.es,.mo{display:none}</style>' if static else ''
    return f'<svg viewBox="0 -24 120 174" width="96" height="139" aria-hidden="true" style="display:block;overflow:visible">{style}{body}</svg>'
if __name__=='__main__':
    for k in BOTS:
        open(f'bots/{k}.svg','w').write(svg(k,True).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '))
