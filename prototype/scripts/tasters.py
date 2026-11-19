# Candidate replacements for the taster mascot: softer shapes, bigger low-set eyes with a highlight,
# tiny nose and a "w" mouth. Each kind is drawn standing (front) and seated turned to the right.
from bots import INK, legs, toque
from botside import arm, STOOL, leg_sit, TASTE
K={
 'cat':   dict(F='#FFF4E6', P='#C9A083', cheek='#FFB3B8', nose='#F28BA0'),
 'bunny': dict(F='#FFD9C9', P='#F3B49E', cheek='#FF8FA0', nose='#F28BA0'),
 'shiba': dict(F='#F6B76C', P='#E29A4B', cheek='#FF9C8A', nose='#4A3B35'),
 'hamster': dict(F='#F8CC8A', P='#EFB267', cheek='#FF9FA8', nose='#F28BA0', chub=1),
 'pig': dict(F='#FFC6D3', P='#F59CB0', cheek='#FF8FA5', nose=None, chub=1),
 'chick': dict(F='#FFE27A', P='#FFA94D', cheek='#FFA08A', nose=None, hand='#FFD24D', chub=1),
 'penguin': dict(F='#5A66A6', P='#FFA94D', cheek='#FF9FB8', nose=None, hand='#5A66A6'),
 'redpanda': dict(F='#E9834D', P='#6E3B2A', cheek='#FF9C8A', nose='#4A3B35'),
 'panda': dict(F='#FFFFFF', P='#3A3542', cheek='#FFA8B8', nose='#3A3542', eye='#FFFFFF'),
}
def eye(x,y,r=4.6,col=INK):
    hl='#FFFFFF' if col==INK else INK
    return (f'<circle class="eo" cx="{x}" cy="{y}" r="{r}" fill="{col}"></circle><circle class="eo" cx="{x-r*0.32 if col==INK else x:.1f}" cy="{y-r*0.36 if col==INK else y:.1f}" r="{r*0.34 if col==INK else r*0.6:.1f}" fill="{hl}"></circle>'
            f'<path class="eh" d="M{x-5} {y+1.5} Q{x} {y-5.5} {x+5} {y+1.5}" fill="none" stroke="{col}" stroke-width="2.800" stroke-linecap="round"></path>'
            f'<path class="es" d="M{x-5} {y+1} L{x+5} {y+1}" fill="none" stroke="{col}" stroke-width="2.800" stroke-linecap="round"></path>')
def wmouth(x,y,col=INK):
    return (f'<path class="ms" d="M{x-5.5} {y} Q{x-2.75} {y+4.5} {x} {y} Q{x+2.75} {y+4.5} {x+5.5} {y}" fill="none" stroke="{col}" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"></path>'
            f'<ellipse class="mo" cx="{x}" cy="{y+2.5}" rx="3.400" ry="4" fill="#F28BA0"></ellipse>')
def head(kind,dx=0):
    k=K[kind]; F,P=k['F'],k['P']; side=dx>0
    xn,xf=(39,81) if not side else (49,88); rf=4.6 if not side else 4.0
    cx=60+dx; o=''
    if kind=='cat':
        o+=(f'<path class="earL" d="M{28+dx*0.2:.0f} 41 L{31+dx*0.2:.0f} 13 L{53+dx*0.2:.0f} 28 Z" fill="{P}" stroke="{P}" stroke-width="7" stroke-linejoin="round"></path><path d="M{34+dx*0.2:.0f} 34 L{35+dx*0.2:.0f} 21 L{45+dx*0.2:.0f} 28 Z" fill="#FFC2CC"></path>'
            f'<path class="earR" d="M{92+dx*0.4:.0f} 41 L{89+dx*0.4:.0f} 13 L{67+dx*0.4:.0f} 28 Z" fill="{P}" stroke="{P}" stroke-width="7" stroke-linejoin="round"></path><path d="M{86+dx*0.4:.0f} 34 L{85+dx*0.4:.0f} 21 L{75+dx*0.4:.0f} 28 Z" fill="#FFC2CC"></path>')
    if kind=='bunny':
        o+=(f'<g class="earL" transform="rotate(-9 {42+dx*0.3:.0f} 30)"><rect x="{33+dx*0.3:.0f}" y="-22" width="18" height="54" rx="9" fill="{F}"></rect><rect x="{38+dx*0.3:.0f}" y="-15" width="8" height="38" rx="4" fill="#FF9FB0"></rect></g>'
            f'<g class="earR" transform="rotate(9 {78+dx*0.3:.0f} 30)"><rect x="{69+dx*0.3:.0f}" y="-22" width="18" height="54" rx="9" fill="{F}"></rect><rect x="{74+dx*0.3:.0f}" y="-15" width="8" height="38" rx="4" fill="#FF9FB0"></rect></g>')
    if kind=='shiba':
        o+=(f'<path class="earL" d="M{26+dx*0.2:.0f} 42 L{30+dx*0.2:.0f} 14 L{52+dx*0.2:.0f} 29 Z" fill="{F}" stroke="{F}" stroke-width="7" stroke-linejoin="round"></path><path d="M{33+dx*0.2:.0f} 35 L{34+dx*0.2:.0f} 22 L{44+dx*0.2:.0f} 29 Z" fill="#FFF4E6"></path>'
            f'<path class="earR" d="M{94+dx*0.4:.0f} 42 L{90+dx*0.4:.0f} 14 L{68+dx*0.4:.0f} 29 Z" fill="{F}" stroke="{F}" stroke-width="7" stroke-linejoin="round"></path><path d="M{87+dx*0.4:.0f} 35 L{86+dx*0.4:.0f} 22 L{76+dx*0.4:.0f} 29 Z" fill="#FFF4E6"></path>')
    if kind in ('hamster','panda'):
        ec=F if kind=='hamster' else P; r=10 if kind=='hamster' else 12
        o+=f'<circle class="earL" cx="{30+dx*0.2:.0f}" cy="31" r="{r}" fill="{ec}"></circle><circle class="earR" cx="{90+dx*0.4:.0f}" cy="31" r="{r}" fill="{ec}"></circle>'
        if kind=='hamster': o+=f'<circle cx="{30+dx*0.2:.0f}" cy="32" r="5.500" fill="#FFC2CC"></circle><circle cx="{90+dx*0.4:.0f}" cy="32" r="5.500" fill="#FFC2CC"></circle>'
    if kind=='pig':
        o+=(f'<path class="earL" d="M{30+dx*0.2:.0f} 40 L{22+dx*0.2:.0f} 17 L{50+dx*0.2:.0f} 26 Z" fill="{P}" stroke="{P}" stroke-width="8" stroke-linejoin="round"></path>'
            f'<path class="earR" d="M{90+dx*0.4:.0f} 40 L{98+dx*0.4:.0f} 17 L{70+dx*0.4:.0f} 26 Z" fill="{P}" stroke="{P}" stroke-width="8" stroke-linejoin="round"></path>')
    if kind=='redpanda':
        o+=(f'<path class="earL" d="M{26+dx*0.2:.0f} 42 L{29+dx*0.2:.0f} 15 L{52+dx*0.2:.0f} 29 Z" fill="#FFF4E6" stroke="#FFF4E6" stroke-width="8" stroke-linejoin="round"></path><path d="M{33+dx*0.2:.0f} 36 L{34+dx*0.2:.0f} 23 L{44+dx*0.2:.0f} 30 Z" fill="{F}"></path>'
            f'<path class="earR" d="M{94+dx*0.4:.0f} 42 L{91+dx*0.4:.0f} 15 L{68+dx*0.4:.0f} 29 Z" fill="#FFF4E6" stroke="#FFF4E6" stroke-width="8" stroke-linejoin="round"></path><path d="M{87+dx*0.4:.0f} 36 L{86+dx*0.4:.0f} 23 L{76+dx*0.4:.0f} 30 Z" fill="{F}"></path>')
    o+=f'<ellipse cx="60" cy="{59 if k.get("chub") else 58}" rx="{43 if k.get("chub") else 39}" ry="{34 if k.get("chub") else 33}" fill="{F}"></ellipse>'
    if kind=='hamster':
        o+=f'<circle cx="{cx-15}" cy="72" r="15.500" fill="#FFF6E9"></circle><circle cx="{cx+(15 if not side else 13)}" cy="72" r="{15.5 if not side else 13.5}" fill="#FFF6E9"></circle>'
    if kind=='penguin':
        o+=f'<circle cx="{cx-13}" cy="60" r="17" fill="#FFFFFF"></circle><circle cx="{cx+(13 if not side else 11)}" cy="60" r="{17 if not side else 15}" fill="#FFFFFF"></circle><ellipse cx="{cx}" cy="71" rx="{25 if not side else 22}" ry="15" fill="#FFFFFF"></ellipse>'
    if kind=='redpanda':
        o+=f'<ellipse cx="{cx}" cy="72" rx="15" ry="11" fill="#FFF4E6"></ellipse><ellipse cx="{xn-9}" cy="68" rx="8" ry="7.500" fill="#FFF4E6"></ellipse><ellipse cx="{xf+(9 if not side else 4)}" cy="68" rx="{8 if not side else 5}" ry="7.500" fill="#FFF4E6"></ellipse>'
        o+=f'<ellipse cx="{xn}" cy="48" rx="5" ry="3.200" fill="#FFF4E6"></ellipse><ellipse cx="{xf}" cy="48" rx="{5 if not side else 4}" ry="3.200" fill="#FFF4E6"></ellipse>'
    if kind=='panda':
        o+=f'<ellipse cx="{xn}" cy="60" rx="9.500" ry="11.500" transform="rotate(-18 {xn} 60)" fill="{P}"></ellipse><ellipse cx="{xf}" cy="60" rx="{9.5 if not side else 8}" ry="11.500" transform="rotate(18 {xf} 60)" fill="{P}"></ellipse>'
    if kind=='cat':
        o+=f'<ellipse cx="{cx}" cy="69" rx="13" ry="9.500" fill="#F3DCC8"></ellipse>'
        for sx in ((-1,1) if not side else (-1,)):
            bx=60+sx*34; o+=f'<path d="M{bx} 66 l{sx*9} -2 M{bx} 71 l{sx*9} 1" stroke="#D9BFAA" stroke-width="1.800" stroke-linecap="round"></path>'
    if kind=='shiba':
        w=27 if not side else 24
        o+=f'<ellipse cx="{cx-(2 if side else 0)}" cy="73" rx="{w}" ry="17" fill="#FFF4E6"></ellipse>'
        o+=f'<ellipse cx="{xn}" cy="48" rx="4" ry="2.600" fill="#FFF4E6"></ellipse><ellipse cx="{xf}" cy="48" rx="{4 if not side else 3.4}" ry="2.600" fill="#FFF4E6"></ellipse>'
    if kind=='bunny':
        o+=f'<ellipse cx="{cx}" cy="70" rx="12" ry="9" fill="#FFF3EC"></ellipse>'
    o+=toque(60+dx*0.2,1,0.62)
    bn,bf=((28,92) if not side else (39,93)); by=70
    if kind in ('penguin','panda'): bn,bf,by=((31,89) if not side else (40,92)),None,74; bn,bf=bn
    o+=f'<ellipse cx="{bn}" cy="{by}" rx="7.500" ry="5" fill="{k["cheek"]}"></ellipse><ellipse cx="{bf}" cy="{by}" rx="{7.5 if not side else 4.5}" ry="{5 if not side else 4.4}" fill="{k["cheek"]}"></ellipse>'
    ec=k.get('eye',INK)
    o+=eye(xn,60,4.6,ec)+eye(xf,60,rf,ec)
    if kind=='pig':
        o+=(f'<ellipse cx="{cx}" cy="68" rx="12.500" ry="9" fill="#FF9DB4"></ellipse><ellipse cx="{cx-4.2}" cy="68" rx="1.900" ry="2.800" fill="#D9607F"></ellipse><ellipse cx="{cx+4.2}" cy="68" rx="1.900" ry="2.800" fill="#D9607F"></ellipse>'
            f'<path class="ms" d="M{cx-4.5} 79.500 Q{cx} 83.500 {cx+4.5} 79.500" fill="none" stroke="#D9607F" stroke-width="2.200" stroke-linecap="round"></path><ellipse class="mo" cx="{cx}" cy="81" rx="3.400" ry="3.200" fill="#D9607F"></ellipse>')
    elif kind=='chick':
        o+=f'<path class="ms" d="M{cx-7} 66.500 Q{cx} 62.500 {cx+7} 66.500 Q{cx} 74 {cx-7} 66.500 Z" fill="#FFA94D"></path><g class="mo"><path d="M{cx-7} 66 Q{cx} 61.500 {cx+7} 66 Q{cx} 78 {cx-7} 66 Z" fill="#FFA94D"></path><ellipse cx="{cx}" cy="69.500" rx="3.200" ry="2.600" fill="#C2512E"></ellipse></g>'
    elif kind=='penguin':
        o+=f'<ellipse class="ms" cx="{cx}" cy="68" rx="6.500" ry="4.200" fill="#FFA94D"></ellipse><g class="mo"><ellipse cx="{cx}" cy="69" rx="6.500" ry="6" fill="#FFA94D"></ellipse><ellipse cx="{cx}" cy="70.500" rx="3.600" ry="2.800" fill="#C2512E"></ellipse></g>'
    else:
        dark=kind in ('shiba','redpanda','panda')
        o+=f'<ellipse cx="{cx}" cy="65.500" rx="{3.6 if dark else 3.2}" ry="{2.7 if dark else 2.3}" fill="{k["nose"]}"></ellipse>'+wmouth(cx,68.5,'#4A3B35' if dark else '#8A6A5A')
    return f'<g class="head">{o}</g>'
def tail(kind,left=False):
    k=K[kind]
    if kind=='pig':
        x=24 if left else 96; d=-1 if left else 1
        return f'<path class="tail" d="M{x-d*8} 122 q{d*10} -1 {d*9} -8 q{-d*2} -6 {-d*7} -3 q{-d*3} 3 {d*1} 6" fill="none" stroke="{k["P"]}" stroke-width="4.500" stroke-linecap="round"></path>'
    if kind=='chick':
        x=26 if left else 94; d=-1 if left else 1
        return f'<path class="tail" d="M{x-d*6} 126 l{d*14} -10 l{-d*2} 12 z" fill="#FFD24D" stroke="#FFD24D" stroke-width="4" stroke-linejoin="round"></path>'
    if kind in ('hamster','penguin','panda'): return f'<circle class="tail" cx="{30 if left else 90}" cy="124" r="{7 if kind!="penguin" else 0}" fill="{k["F"] if kind!="hamster" else k["P"]}"></circle>'
    if kind=='redpanda':
        d="M34 124 C8 126 4 98 20 92" if left else "M86 124 C112 126 116 98 100 92"
        return f'<g class="tail"><path d="{d}" fill="none" stroke="{k["F"]}" stroke-width="14" stroke-linecap="round"></path><path d="{d}" fill="none" stroke="#B85C33" stroke-width="14" stroke-dasharray="6 10" stroke-dashoffset="-6"></path></g>'
    if kind=='bunny': return f'<circle class="tail" cx="{28 if left else 92}" cy="122" r="9" fill="#FFFFFF"></circle>'
    if kind=='shiba':
        return f'<path class="tail" d="{"M36 124 C12 124 10 98 26 98 C34 98 34 108 27 108" if left else "M84 124 C108 124 110 98 94 98 C86 98 86 108 93 108"}" fill="none" stroke="{k["F"]}" stroke-width="10" stroke-linecap="round"></path>'
    return f'<path class="tail" d="{"M36 124 C14 128 8 106 19 96" if left else "M82 122 C104 126 110 104 99 94"}" fill="none" stroke="{k["P"]}" stroke-width="10" stroke-linecap="round"></path>'
def coat(F,dx=0,cy=106):
    return (f'<g class="bodyg"><ellipse cx="60" cy="{cy}" rx="30" ry="{28 if cy==106 else 27}" fill="{F}"></ellipse>'
      f'<path d="M{33+dx} 99 Q{60+dx} 86 {87+dx} 99 L{89+dx} 126 Q{60+dx} 138 {31+dx} 126 Z" fill="#FFFFFF"></path>'
      +''.join(f'<circle cx="{x+dx}" cy="{y}" r="2.600" fill="#8FD3B6"></circle>' for x in (54,66) for y in (110,121))+'</g>')
def bow(dx=0): return f'<path d="M{44+dx} 86 Q{60+dx} 95 {76+dx} 86 L{71+dx} 99 L{60+dx} 93 L{49+dx} 99 Z" fill="#8FD3B6"></path>'
def chub(k,body,cx=60):
    return f'<g transform="translate({cx} 0) scale(1.150 1) translate({-cx} 0)">{body}</g>' if k.get('chub') else body
def front(kind):
    k=K[kind]; F,P=k['F'],k['P']
    arms=''.join(f'<g class="{c}"><g transform="rotate({r} {px} 94)"><rect x="{x}" y="90" width="14" height="32" rx="7" fill="#FFFFFF"></rect><circle cx="{x+7}" cy="116" r="7" fill="{k.get("hand",P)}"></circle></g></g>' for c,x,r,px in (('armL',22,20,29),('armR',84,-20,91)))
    return tail(kind)+legs(P)+chub(k,coat(F))+arms+head(kind)+bow()
def seated(kind):
    k=K[kind]; F,P=k['F'],k['P']
    return ('<g transform="translate(0 -22)">'+tail(kind,True)+STOOL+leg_sit(P,False)
      +arm('armF',78,97,-72,'#FFFFFF',k.get('hand',P))+chub(k,coat(F,5,108),62)+leg_sit(P,True)+head(kind,10)+bow(5)
      +arm('armN',56,99,-58,'#FFFFFF',k.get('hand',P),TASTE)+'</g>')
if __name__=='__main__':
    import bots, botside
    bots._side()
    css=open('page.py',encoding='utf-8').read().split("css='''")[1].split("'''")[0]
    W=lambda body:f'<svg viewBox="0 -24 120 174" width="96" height="139" aria-hidden="true" style="display:block;overflow:visible">{body}</svg>'
    cell=lambda body:f'<div class="bot" style="position:relative;display:inline-block;width:96px;height:139px;margin:50px 46px 70px;transform:scale(1.7);transform-origin:50% 0">{body}</div>'
    row1=cell(bots.svg('cat'))+''.join(cell(W(front(k))) for k in K)
    row2=cell(bots.svg('cat_work'))+''.join(cell(W(seated(k))) for k in K)
    open('../shots/tasters.html','w',encoding='utf-8').write('<!doctype html><meta charset="utf-8"><style>body{background:#FBEBD2;margin:0}'+css+'*{animation:none !important}</style><div>'+row1+'</div><div>'+row2+'</div>')
