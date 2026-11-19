from bots import legs,toque,blush,eyes,mouth,INK
C='#A9B4EE'; D='#8E9BE3'
def arm(cls,x,rot,px,extra=''):
    return f'<g class="{cls}"><g transform="rotate({rot} {px} 94)"><rect x="{x}" y="90" width="14" height="32" rx="7" fill="{D}"></rect>{extra}<circle cx="{x+7}" cy="117" r="8" fill="#FFFFFF"></circle></g></g>'
SPOON='<g class="tool-spoon"><rect x="89" y="92" width="4" height="40" rx="2" fill="#B9824F"></rect><ellipse cx="91" cy="134" rx="7" ry="9" fill="#B9824F"></ellipse></g>'
KNIFE='<g class="tool-knife"><rect x="88" y="106" width="6" height="16" rx="3" fill="#8A5540"></rect><path d="M86 122 H96 V150 C90 144 87 134 86 122 Z" fill="#F3F1FA"></path></g>'
def chef(view=None,rotL=None,rotR=None,tool='spoon'):
    """view/rot* are only for the static preview; the live rig is driven by CSS classes."""
    fr='' if view!='back' else ' style="display:none"'; bk=' style="display:none"' if view!='back' else ''
    tl=(SPOON+KNIFE) if view is None else (SPOON if tool=='spoon' else KNIFE.replace('class="tool-knife"','class="k"'))
    aL=arm('armL',22,20,29); aR=arm('armR',84,-20,91,tl)
    if rotL is not None: aL=f'<g transform="rotate({rotL} 29 92)">{aL}</g>'
    if rotR is not None: aR=f'<g transform="rotate({rotR} 91 92)">{aR}</g>'
    body=(f'<g class="bodyg"><ellipse cx="60" cy="106" rx="30" ry="28" fill="{C}"></ellipse>'
      f'<g class="fr"{fr}><rect x="44" y="84" width="6" height="16" fill="#F2876B"></rect><rect x="70" y="84" width="6" height="16" fill="#F2876B"></rect><path d="M38 97 Q60 91 82 97 L86 124 Q60 138 34 124 Z" fill="#F2876B"></path><rect x="50" y="108" width="20" height="13" rx="6" fill="#F7A58E"></rect></g>'
      f'<g class="bk"{bk}><path d="M44 84 L76 116 M76 84 L44 116" stroke="#F2876B" stroke-width="6" stroke-linecap="round" fill="none"></path><rect x="34" y="112" width="52" height="7" rx="3.500" fill="#F2876B"></rect><ellipse cx="52" cy="120" rx="8" ry="5" fill="#F7A58E"></ellipse><ellipse cx="68" cy="120" rx="8" ry="5" fill="#F7A58E"></ellipse><circle cx="60" cy="118" r="4" fill="#F2876B"></circle><path d="M60 132 Q66 138 62 144" stroke="{D}" stroke-width="4" stroke-linecap="round" fill="none"></path></g></g>')
    head=(f'<g class="head"><g class="earL"><circle cx="20" cy="56" r="21" fill="{C}"></circle><g class="fr"{fr}><circle cx="21" cy="57" r="12.5" fill="#F6BFD3"></circle></g></g>'
      f'<g class="earR"><circle cx="100" cy="56" r="21" fill="{C}"></circle><g class="fr"{fr}><circle cx="99" cy="57" r="12.5" fill="#F6BFD3"></circle></g></g>'
      f'<ellipse cx="60" cy="56" rx="38" ry="33" fill="{C}"></ellipse>'+toque(60,-6)+
      f'<g class="fr"{fr}>'+blush(31,89,68,'#F7A8C0')+eyes(41,79,57)+mouth(46,76,INK,4)+
      f'<path class="trunk" d="M60 63 L60 80 Q60 91 72 87" fill="none" stroke="{D}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"></path></g>'
      f'<g class="bk"{bk}><path d="M34 44 Q60 34 86 44" stroke="{D}" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.6"></path></g></g>')
    return f'<svg viewBox="0 -24 120 174" width="96" height="139" aria-hidden="true" style="display:block;overflow:visible">{legs(C)}{body}{head}{aL}{aR}</svg>'
POSE_CSS='''.bot .bk,.bot .tool-knife{display:none}
.bot.back .fr{display:none}.bot.back .bk{display:inline}
.bot.back .armL,.bot.back .armR{animation:none}
.bot.back .head{animation:none;transform:translateY(-2px)}
.bot.pose-chop .tool-knife{display:inline}.bot.pose-chop .tool-spoon{display:none}
.bot.pose-reach .tool-spoon,.bot.pose-wash .tool-spoon,.bot.pose-knob .tool-spoon{display:none}
.bot.pose-reach .armL{transform:rotate(150deg)}.bot.pose-reach .armR{transform:rotate(0deg)}
@keyframes grabA{0%,100%{transform:rotate(150deg)}45%{transform:rotate(172deg) translateY(-7px)}}
@keyframes grabB{0%,100%{transform:rotate(150deg)}45%{transform:rotate(172deg) translateY(-7px)}}
.bot.pose-reach.act0 .armL{animation:grabA .34s ease-out}.bot.pose-reach.act1 .armL{animation:grabB .34s ease-out}
.bot.pose-chop .armL{transform:rotate(125deg)}.bot.pose-chop .armR{transform:rotate(-150deg)}
@keyframes chopArmA{0%,100%{transform:rotate(-150deg)}40%{transform:rotate(-108deg)}}
@keyframes chopArmB{0%,100%{transform:rotate(-150deg)}40%{transform:rotate(-108deg)}}
.bot.pose-chop.act0 .armR{animation:chopArmA .24s ease-in}.bot.pose-chop.act1 .armR{animation:chopArmB .24s ease-in}
@keyframes scrubL{0%,100%{transform:rotate(118deg)}50%{transform:rotate(140deg)}}
@keyframes scrubR{0%,100%{transform:rotate(-140deg)}50%{transform:rotate(-118deg)}}
.bot.pose-wash .armL{animation:scrubL .5s ease-in-out infinite}.bot.pose-wash .armR{animation:scrubR .5s ease-in-out infinite}
.bot.pose-knob .armL{transform:rotate(100deg)}.bot.pose-knob .armR{transform:rotate(0deg)}
@keyframes twistA{0%,100%{transform:rotate(100deg)}50%{transform:rotate(130deg)}}
@keyframes twistB{0%,100%{transform:rotate(100deg)}50%{transform:rotate(130deg)}}
.bot.pose-knob.act0 .armL{animation:twistA .3s ease-out}.bot.pose-knob.act1 .armL{animation:twistB .3s ease-out}
.bot.pose-stir .armL{transform:rotate(15deg)}.bot.pose-stir .armR{transform:rotate(-140deg)}
@keyframes stirA{0%,100%{transform:rotate(-140deg)}30%{transform:rotate(-166deg)}65%{transform:rotate(-116deg)}}
@keyframes stirB{0%,100%{transform:rotate(-140deg)}30%{transform:rotate(-166deg)}65%{transform:rotate(-116deg)}}
.bot.pose-stir.act0 .armR{animation:stirA .36s ease-in-out}.bot.pose-stir.act1 .armR{animation:stirB .36s ease-in-out}
@keyframes swayA{0%,100%{transform:translateX(0)}35%{transform:translateX(-3px)}70%{transform:translateX(3px)}}
@keyframes swayB{0%,100%{transform:translateX(0)}35%{transform:translateX(-3px)}70%{transform:translateX(3px)}}
.bot.back.act0 .hopper{animation:swayA .36s ease-in-out}.bot.back.act1 .hopper{animation:swayB .36s ease-in-out}
'''
if __name__=='__main__':
    import subprocess
    P=[('front',dict()),('reach',dict(view='back',rotL=150,rotR=0)),('chop',dict(view='back',rotL=125,rotR=-150,tool='knife')),('wash',dict(view='back',rotL=128,rotR=-128)),('knob',dict(view='back',rotL=100,rotR=0)),('stir',dict(view='back',rotL=15,rotR=-140))]
    cells=''
    for i,(n,kw) in enumerate(P):
        s=chef(view=kw.pop('view','front'),**kw).replace('<svg ','<svg x="24" y="30" ')
        s=s.replace('class="eh"','display="none"').replace('class="es"','display="none"').replace('class="mo"','display="none"')
        if n in('reach','wash','knob'): s=s.replace('<g class="tool-spoon">','<g display="none">')
        cells+=f'<g transform="translate({i*150} 0)"><rect x="6" y="6" width="138" height="188" rx="24" fill="#DDDAFF"/>{s}</g>'
    open('../tool/poses.svg','w',encoding='utf-8').write(f'<svg xmlns="http://www.w3.org/2000/svg" width="900" height="200">{cells}</svg>')
    subprocess.run(['rsvg-convert','../tool/poses.svg','-o','../tool/poses.png'],check=True)
