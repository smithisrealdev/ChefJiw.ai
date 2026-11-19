# Close-up mode: on arriving at a station the scene zooms into it and the user taps the objects themselves.
import re
import cookstage2 as c2
from cookstage import PAN,OIL,EGG,AROMA,PORK,BASIL,KNIFE
from chefrig import chef as chefsvg, POSE_CSS
from bots import svg as botsvg
def bg(inner): return f'<svg width="390" height="470" viewBox="0 0 390 470" aria-hidden="true" style="position: absolute; left: 0; top: 0; display: block">{inner}</svg>'
TILE='<rect width="390" height="470" fill="#CFCBFF"></rect><rect y="0" width="390" height="330" fill="#DDDAFF"></rect>'+''.join(f'<rect x="{x}" y="0" width="3" height="330" fill="#CFCBFF"></rect>' for x in range(64,390,65))+'<rect y="110" width="390" height="3" fill="#CFCBFF"></rect><rect y="220" width="390" height="3" fill="#CFCBFF"></rect>'
COUNTER='<rect width="390" height="470" fill="#FFFFFF"></rect><rect y="352" width="390" height="118" fill="#FFA9C6"></rect><rect y="352" width="390" height="10" fill="#F58DB1"></rect><rect y="0" width="390" height="14" fill="#DDDAFF"></rect>'
BG={
 'fridge': bg('<rect width="390" height="470" fill="#A6E9D0"></rect><rect x="12" y="12" width="366" height="446" rx="24" fill="#FFFDF2"></rect><rect x="12" y="12" width="366" height="18" rx="9" fill="#FFF3B8"></rect>'
   +''.join(f'<rect x="12" y="{y}" width="366" height="9" fill="#CFEDE2"></rect>' for y in (140,254,366))
   +'<rect x="34" y="290" width="26" height="66" rx="9" fill="#7CCBFF"></rect><rect x="40" y="278" width="14" height="14" rx="4" fill="#4FAEEA"></rect><rect x="70" y="302" width="24" height="54" rx="8" fill="#FFD84D"></rect><ellipse cx="318" cy="340" rx="34" ry="16" fill="#FF9DBD"></ellipse><ellipse cx="318" cy="332" rx="26" ry="12" fill="#FFD6E3"></ellipse>'),
 'rack': bg(TILE+'<rect x="8" y="52" width="374" height="18" rx="9" fill="#8A8698"></rect>'+''.join(f'<circle cx="{x}" cy="61" r="5" fill="#575270"></circle>' for x in (72,195,318))),
 'shelf': bg(TILE+'<rect x="0" y="238" width="390" height="16" rx="6" fill="#FFFFFF"></rect><rect x="40" y="254" width="12" height="36" rx="4" fill="#E4E0F2"></rect><rect x="338" y="254" width="12" height="36" rx="4" fill="#E4E0F2"></rect>'),
 'counter': bg(COUNTER),
 'board': bg(COUNTER+'<rect x="36" y="34" width="318" height="296" rx="34" fill="#F6CF9C"></rect><rect x="52" y="50" width="286" height="264" rx="22" fill="#FBDDB4"></rect><circle cx="318" cy="68" r="10" fill="#F6CF9C"></circle>'),
 'sink': bg(COUNTER+'<rect x="150" y="150" width="216" height="186" rx="34" fill="#B4B0E0"></rect><rect x="164" y="164" width="188" height="158" rx="24" fill="#CFCCF4"></rect><circle cx="258" cy="292" r="10" fill="#8A8698"></circle>'
   '<path d="M258 14 V70 Q258 104 230 104 H216 V128" stroke="#8A8698" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"></path><path d="M252 16 V70 Q252 96 230 96" stroke="#B9B5C9" stroke-width="6" stroke-linecap="round" fill="none"></path>'),
 'stove': bg('<rect width="390" height="470" fill="#EDEAF7"></rect><rect x="0" y="96" width="390" height="262" fill="#FFFFFF"></rect><rect x="4" y="100" width="300" height="250" rx="34" fill="#4A4654"></rect><circle cx="146" cy="226" r="96" fill="none" stroke="#6B6777" stroke-width="10"></circle><rect y="358" width="390" height="112" fill="#FFFFFF"></rect><rect y="358" width="390" height="8" fill="#E4E0F2"></rect>'),
}
def cu(k,extra=''): return '<sc-if value="{{cu.%s}}" hint-placeholder-val="{{false}}">%s%s</sc-if>'%(k,BG[k],extra)
STOVE_X='''<sc-if value="{{sc.low}}" hint-placeholder-val="{{false}}"><span class="glow" style="left: 34px; top: 114px; width: 224px; height: 224px; background: #FF8A4C"></span></sc-if>
<sc-if value="{{sc.high}}" hint-placeholder-val="{{false}}"><span class="glow" style="left: 24px; top: 104px; width: 244px; height: 244px; background: #E8303A"></span></sc-if>
<sc-if value="{{showPan}}" hint-placeholder-val="{{false}}">
<div class="{{shakeCls}}" style="position: absolute; left: 26px; top: 116px; width: 300px; height: 240px">
@@PAN@@
<sc-if value="{{pan.oil}}" hint-placeholder-val="{{false}}">@@OIL@@</sc-if>
<sc-if value="{{pan.aroma}}" hint-placeholder-val="{{false}}">@@AROMA@@</sc-if>
<sc-if value="{{pan.pork}}" hint-placeholder-val="{{false}}">@@PORK@@</sc-if>
<sc-if value="{{pan.basil}}" hint-placeholder-val="{{false}}">@@BASIL@@</sc-if>
<sc-if value="{{pan.egg}}" hint-placeholder-val="{{false}}">@@EGG@@</sc-if>
<sc-if value="{{sc.fume}}" hint-placeholder-val="{{false}}"><span class="fume" style="left: 80px; top: 40px"></span><span class="fume" style="left: 124px; top: 28px; animation-delay: .6s"></span><span class="fume" style="left: 160px; top: 44px; animation-delay: 1.1s"></span></sc-if>
</div>
</sc-if>
<sc-if value="{{plated}}" hint-placeholder-val="{{false}}"><img class="pop" src="/_blob/6c2552b0403b97e680de31c0a2deaa28" alt="กะเพราหมูสับไข่ดาวจัดจานแล้ว" width="250" height="250" style="position: absolute; left: 22px; top: 100px; display: block"></sc-if>
<sc-if value="{{timing}}" hint-placeholder-val="{{false}}"><span class="mali num" style="position: absolute; left: 12px; top: 366px; padding: 4px 12px; border-radius: 999px; background: #3B2A22; color: #FFFFFF; font-size: 15px; font-weight: 700">{{timeText}}</span></sc-if>'''
BOARD_X='''<sc-for list="{{bits}}" as="b" hint-placeholder-count="0"><span class="pop" style="position: absolute; left: {{b.x}}px; top: {{b.y}}px; width: {{b.w}}px; height: {{b.h}}px; border-radius: 999px; background: {{b.c}}; transform: rotate({{b.r}}deg)"></span></sc-for>
<div class="{{chopCls}}" style="position: absolute; left: 262px; top: 196px; width: 110px; height: 110px; transform-origin: 85% 15%"><div style="transform: scale(1.22); transform-origin: 0 0">@@KNIFE@@</div></div>'''
SINK_X='''<sc-if value="{{sinkBasil}}" hint-placeholder-val="{{false}}"><img src="{{pic.basil}}" alt="" width="110" height="110" style="position: absolute; left: 204px; top: 196px; display: block"></sc-if>
<sc-if value="{{sinkCup}}" hint-placeholder-val="{{false}}"><span style="position: absolute; left: 190px; top: 218px; width: 54px; height: 70px; border-radius: 8px 8px 18px 18px; background: #FFFFFF; box-shadow: inset 0 -{{cupFill}}px 0 #7CCBFF"></span></sc-if>
<sc-if value="{{waterOn}}" hint-placeholder-val="{{false}}"><span class="flow" style="position: absolute; left: 208px; top: 134px; width: 16px; height: 110px; border-radius: 8px; background: #7CCBFF"></span></sc-if>'''
CLOSE=('''<sc-if value="{{cu.on}}" hint-placeholder-val="{{false}}">
<div class="zoomin" style="position: absolute; left: 0; top: 0; width: 390px; height: 470px; overflow: hidden; z-index: 8; transform-origin: {{cu.origin}}; background: #FFFFFF">
'''+cu('fridge')+cu('rack')+cu('shelf')+cu('counter')+cu('board',BOARD_X)+cu('sink',SINK_X)+cu('stove',STOVE_X)+'''
<sc-for list="{{objs}}" as="o" hint-placeholder-count="3"><button class="press obj" onClick="{{o.tap}}" disabled="{{o.disabled}}" style="left: {{o.x}}px; top: {{o.y}}px; width: {{o.w}}px; background: {{o.bg}}; box-shadow: {{o.ring}}; opacity: {{o.op}}">
<img src="{{o.img}}" alt="" style="display: block; width: {{o.w}}px; height: {{o.w}}px">
<span style="display: block; padding: 0 2px; font-size: 14px; font-weight: 700; line-height: 1.25; text-align: center; color: #3B2A22">{{o.label}}</span>
<span class="num" style="display: block; font-size: 13px; font-weight: 700; color: #4F4A5C">{{o.badge}}</span>
</button></sc-for>
<div class="{{chefCls}}" style="position: absolute; left: 147px; top: 366px; width: 96px; height: 139px; transform: scale(1.3); transform-origin: 50% 0; pointer-events: none"><span class="hopper" style="display: block">@@CHEF@@</span></div>
</div>
</sc-if>
''')
PANELROW='''<sc-if value="{{showWalk}}" hint-placeholder-val="{{true}}">
<button class="press" onClick="{{walk.tap}}" disabled="{{walk.disabled}}" style="flex: 0 0 auto; display: flex; align-items: center; justify-content: center; gap: 12px; height: 92px; padding: 0 16px; border: 0; border-radius: 22px; background: #FFFFFF; box-shadow: 0 0 0 3px #3B2A22; color: #3B2A22; cursor: pointer">
<img src="{{walk.img}}" alt="" width="52" height="52" style="display: block">
<span style="display: flex; flex-direction: column; align-items: flex-start"><span class="mali" style="font-size: 18px; font-weight: 700">{{walk.label}}</span><span style="font-size: 14px; font-weight: 600; color: #4F4A5C">หรือแตะจุดที่กะพริบในครัว</span></span>
</button>
</sc-if>
<sc-if value="{{showTodo}}" hint-placeholder-val="{{false}}">
<div style="flex: 0 0 auto; display: flex; flex-direction: column; gap: 6px">
<span style="padding: 0 6px; font-size: 14px; font-weight: 600; color: #4F4A5C">แตะของในภาพด้านบนได้เลย</span>
<div style="display: flex; gap: 6px">
<sc-for list="{{todo}}" as="a" hint-placeholder-count="3"><div style="flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 1px; padding: 6px 2px; border-radius: 16px; background: {{a.bg}}"><img src="{{a.img}}" alt="" width="30" height="30" style="display: block"><span class="num" style="font-size: 13px; font-weight: 700; line-height: 1.2; text-align: center">{{a.count}}</span></div></sc-for>
</div>
</div>
</sc-if>
'''
CSS4='''@keyframes zoomIn{from{opacity:0;transform:scale(.3)}}
.zoomin{animation:zoomIn .42s cubic-bezier(.2,.8,.2,1) both}
.obj{position:absolute;display:flex;flex-direction:column;align-items:center;padding:0 0 6px;border:0;border-radius:22px;cursor:pointer}
.glow{position:absolute;display:block;border-radius:50%;opacity:.55;animation:flick .5s ease-in-out infinite}
'''
def build_block():
    b=c2.BLOCK
    a=b.index('<sc-if value="{{zoomPan}}"'); e=b.index('</div>\n<div style="position: absolute; left: 12px; right: 12px; top: 594px')
    b=b[:a]+CLOSE+b[e:]
    a=b.index('<div style="flex: 0 0 auto; display: flex; gap: 6px">\n<sc-for list="{{btns}}"'); e=b.index('</sc-for>\n</div>',a)+len('</sc-for>\n</div>')
    return b[:a]+PANELROW+b[e:]
JS=open('./cookstage3.js',encoding='utf-8').read()
def splice(html,mascot,CLOSEIC):
    img=re.search(r"const IMG = (\{[^}]*\});",html).group(1)
    a=html.index('<sc-if value="{{isCook}}"'); b=html.index('<sc-if value="{{isDone}}"')
    blk=c2.ENTER+build_block()
    ovs='\n'.join(c2.ov(k) for k in ['fridge','board','knife','bits','water','low','high','eggplate','food'])
    for k,v in {'@@CLOSE@@':CLOSEIC,'@@BASE@@':c2.svgwrap(c2.BASE),'@@OVS@@':ovs,'@@CHEF@@':chefsvg(),'@@FROG@@':botsvg('frog'),'@@CAT@@':botsvg('cat'),'@@CAPY@@':botsvg('capybara'),'@@PAN@@':PAN,'@@OIL@@':OIL,'@@AROMA@@':AROMA,'@@PORK@@':PORK,'@@BASIL@@':BASIL,'@@EGG@@':EGG,'@@KNIFE@@':KNIFE}.items(): blk=blk.replace(k,v)
    assert '@@' not in blk
    html=html[:a]+blk+html[b:]
    a=html.index('class Component extends DCLogic'); b=html.index('</script>',a)
    html=html[:a]+JS.replace('__IMG__',img).replace('__X__',c2.XJS)+html[b:]
    walk='.bot.back.walking .armL{animation:swingA .56s ease-in-out infinite}.bot.back.walking .armR{animation:swingB .56s ease-in-out infinite}\n'
    return html.replace('.screen{animation',c2.CSS3+POSE_CSS+walk+CSS4+'.screen{animation',1)
