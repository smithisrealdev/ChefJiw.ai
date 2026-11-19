# One continuous kitchen: the camera zooms into the same scene and the user taps the real objects in it.
import re
import cookstage2 as c2
from kitchen import BASE,OV,svgwrap,bottle,fl,INK
from chefrig import chef as chefsvg, POSE_CSS
from bots import svg as botsvg
# take the loose props out of the static base so they can be picked up
B=BASE
for cut in [bottle(114,'#8A5540','#E8505B'),bottle(134,'#4A3530','#6DCB7A'),bottle(154,'#C98B5A','#F07B5E'),
  '<path d="M174 166 H196 C196 174 192 178 185 178 C178 178 174 174 174 166 Z" fill="#FF9DBD"></path><path d="M176 166 C178 158 192 158 194 166 Z" fill="#FFFFFF"></path>',
  '<rect x="216" y="136" width="8" height="16" rx="4" fill="#8A5540"></rect><rect x="211" y="158" width="18" height="28" rx="3" fill="#F3F1FA"></rect>',
  '<rect x="242" y="136" width="8" height="16" rx="4" fill="#8A5540"></rect><path d="M240 158 H252 V190 C246 184 241 172 240 158 Z" fill="#F3F1FA"></path>',
  '<rect x="266" y="140" width="7" height="12" rx="3.500" fill="#8A5540"></rect><path d="M265 158 H274 V176 C269 172 266 166 265 158 Z" fill="#F3F1FA"></path>']:
    assert cut in B, cut[:40]; B=B.replace(cut,'')
O=dict(OV)
O.update({
 'fridge': '<rect x="0" y="170" width="12" height="146" rx="5" fill="#6CC7A8"></rect><rect x="12" y="172" width="84" height="142" rx="8" fill="#FFFDF2"></rect><rect x="12" y="172" width="84" height="6" rx="3" fill="#FFF3B8"></rect><rect x="12" y="208" width="84" height="4" fill="#CFEDE2"></rect><rect x="12" y="254" width="84" height="4" fill="#CFEDE2"></rect>'
   '<rect x="20" y="276" width="12" height="34" rx="5" fill="#7CCBFF"></rect><rect x="36" y="284" width="12" height="26" rx="5" fill="#FFD84D"></rect><ellipse cx="74" cy="304" rx="14" ry="7" fill="#FF9DBD"></ellipse>',
 'rkCleaver': '<rect x="216" y="136" width="8" height="16" rx="4" fill="#8A5540"></rect><rect x="211" y="158" width="18" height="28" rx="3" fill="#F3F1FA"></rect>',
 'rkChef': '<rect x="242" y="136" width="8" height="16" rx="4" fill="#8A5540"></rect><path d="M240 158 H252 V190 C246 184 241 172 240 158 Z" fill="#F3F1FA"></path>',
 'rkParing': '<rect x="266" y="140" width="7" height="12" rx="3.500" fill="#8A5540"></rect><path d="M265 158 H274 V176 C269 172 266 166 265 158 Z" fill="#F3F1FA"></path>',
 'bOyster': bottle(108,'#8A5540','#E8505B'), 'bSoy': bottle(126.5,'#4A3530','#6DCB7A'), 'bFish': bottle(145,'#C98B5A','#F07B5E'), 'bOil': bottle(163.5,'#FFD95A','#6DCB7A'),
 'bSugar': '<path d="M182 166 H200 C200 174 197 178 191 178 C185 178 182 174 182 166 Z" fill="#FF9DBD"></path><path d="M184 166 C185 159 197 159 198 166 Z" fill="#FFFFFF"></path>',
 'boardLean': '<rect x="262" y="198" width="10" height="36" rx="5" fill="#F6CF9C" transform="rotate(8 267 216)"></rect><rect x="264" y="200" width="4" height="32" rx="2" fill="#FBDDB4" transform="rotate(8 267 216)"></rect>',
 'colander': '<path d="M138 222 H170 C170 232 164 237 154 237 C144 237 138 232 138 222 Z" fill="#FFFFFF"></path><ellipse cx="148" cy="220" rx="6" ry="4" fill="#4CA35C" transform="rotate(-20 148 220)"></ellipse><ellipse cx="158" cy="219" rx="6" ry="4" fill="#62BD6E" transform="rotate(15 158 219)"></ellipse><ellipse cx="153" cy="216" rx="5" ry="3.500" fill="#4CA35C"></ellipse>',
 'water': '<rect class="flow" x="149.500" y="202" width="5" height="18" rx="2.500" fill="#7CCBFF"></rect>',
 'h0': '<rect x="339" y="253" width="2.500" height="7" rx="1.200" fill="#FFFFFF"></rect>',
 'h1': '<rect x="339" y="253" width="2.500" height="7" rx="1.200" fill="#FFD84D" transform="rotate(60 340 260)"></rect>',
 'h2': '<rect x="339" y="253" width="2.500" height="7" rx="1.200" fill="#FF8A4C" transform="rotate(130 340 260)"></rect>',
 'pm': '<rect x="310" y="259" width="8" height="2.400" rx="1.200" fill="#FFFFFF"></rect><rect x="362" y="259" width="8" height="2.400" rx="1.200" fill="#FFFFFF"></rect><rect x="364.800" y="256.200" width="2.400" height="8" rx="1.200" fill="#FFFFFF"></rect>',
 'wOil': '<path d="M312 199 Q339 205 366 199 Q339 212 312 199 Z" fill="#FFE58A"></path>',
 'wEgg': '<ellipse cx="339" cy="196" rx="22" ry="6" fill="#FFFFFF"></ellipse><circle cx="339" cy="193" r="6" fill="#FFC93D"></circle>',
 'wAroma': '<rect x="318" y="196" width="5" height="3" rx="1.500" fill="#FFFDF4"></rect><rect x="330" y="195" width="6" height="2.500" rx="1.200" fill="#F0584A"></rect><rect x="346" y="196" width="5" height="3" rx="1.500" fill="#FFFDF4"></rect><rect x="356" y="195" width="6" height="2.500" rx="1.200" fill="#F0584A"></rect>',
 'wPork': '<path d="M312 198 Q339 182 366 198 Z" fill="{{porkColor}}"></path>',
 'wBasil': '<ellipse cx="326" cy="192" rx="6" ry="3" fill="#4CA35C" transform="rotate(-15 326 192)"></ellipse><ellipse cx="340" cy="188" rx="6" ry="3" fill="#62BD6E"></ellipse><ellipse cx="353" cy="192" rx="6" ry="3" fill="#4CA35C" transform="rotate(15 353 192)"></ellipse>',
})
def ov(k,pop=False): return '<sc-if value="{{sc.%s}}" hint-placeholder-val="{{false}}">%s</sc-if>'%(k,svgwrap(O[k],' class="pop"' if pop else ''))
ORDER=['fridge','rkCleaver','rkChef','rkParing','bOyster','bSoy','bFish','bOil','bSugar','boardLean','board','knife','bits','colander','water','low','high','pm','h0','h1','h2','wOil','wAroma','wPork','wBasil','wEgg','eggplate']
POP={'fridge','board','knife','eggplate','colander'}
CSS5='''.world{position:absolute;left:0;top:0;width:390px;height:470px;transform-origin:0 0;transition:transform .42s cubic-bezier(.3,.7,.2,1)}
.hot{position:absolute;display:block;padding:0;border:0;background:transparent;border-radius:6px;cursor:pointer;z-index:6}
.hot img{display:block;width:100%;height:100%}
@keyframes bobA{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.5px)}}
.bobs{animation:bobA 1.1s ease-in-out infinite}
@keyframes spatA{0%,100%{transform:rotate(0)}35%{transform:rotate(-28deg)}70%{transform:rotate(18deg)}}
@keyframes spatB{0%,100%{transform:rotate(0)}35%{transform:rotate(-28deg)}70%{transform:rotate(18deg)}}
.spat0{animation:spatA .36s ease-in-out}
@keyframes nopeA{0%,100%{transform:translateX(0)}25%{transform:translateX(-2px)}75%{transform:translateX(2px)}}
@keyframes nopeB{0%,100%{transform:translateX(0)}25%{transform:translateX(-2px)}75%{transform:translateX(2px)}}
.nope0{animation:nopeA .22s ease-in-out 2}.nope1{animation:nopeB .22s ease-in-out 2}.spat1{animation:spatB .36s ease-in-out}
.cup{position:absolute;left:146px;top:220px;width:12px;height:14px;border-radius:2px 2px 4px 4px;background:#FFFFFF}
'''
WORLD='''<div style="position: absolute; left: 0; top: 116px; width: 390px; height: 470px; overflow: hidden; background: #CFCBFF">
<div class="world" style="transform: {{cam}}">
@@BASE@@
@@OVS@@
<sc-if value="{{sc.cup}}" hint-placeholder-val="{{false}}"><span class="cup" style="box-shadow: inset 0 -{{cupFill}}px 0 #7CCBFF"></span></sc-if>
<sc-for list="{{bits}}" as="b" hint-placeholder-count="0"><span class="pop" style="position: absolute; left: {{b.x}}px; top: {{b.y}}px; width: {{b.w}}px; height: {{b.h}}px; border-radius: 999px; background: {{b.c}}"></span></sc-for>
<sc-if value="{{sc.dish}}" hint-placeholder-val="{{false}}"><img class="pop" src="/_blob/6c2552b0403b97e680de31c0a2deaa28" alt="กะเพราหมูสับไข่ดาวจัดจานแล้ว" width="52" height="52" style="position: absolute; left: 236px; top: 186px; display: block"></sc-if>
<sc-if value="{{sc.spat}}" hint-placeholder-val="{{false}}"><div class="{{spatCls}}" style="position: absolute; left: 344px; top: 160px; width: 14px; height: 40px; transform-origin: 50% 90%"><svg width="14" height="40" viewBox="0 0 14 40" aria-hidden="true" style="display: block"><rect x="5.500" y="14" width="3" height="24" rx="1.500" fill="#C98B5A" transform="rotate(180 7 26)"></rect><rect x="2" y="26" width="10" height="13" rx="3" fill="#8A8698"></rect></svg></div></sc-if>
<sc-if value="{{sc.fume}}" hint-placeholder-val="{{false}}"><span class="fume" style="left: 326px; top: 168px; width: 6px; height: 9px"></span><span class="fume" style="left: 340px; top: 162px; width: 6px; height: 9px; animation-delay: .6s"></span><span class="fume" style="left: 352px; top: 168px; width: 6px; height: 9px; animation-delay: 1.1s"></span></sc-if>
<sc-for list="{{spots}}" as="sp" hint-placeholder-count="6"><button class="{{sp.cls}}" onClick="{{sp.tap}}" disabled="{{sp.off}}" aria-label="{{sp.aria}}" style="left: {{sp.x}}px; top: {{sp.y}}px; width: {{sp.w}}px; height: {{sp.h}}px; box-shadow: {{sp.ring}}"><sc-if value="{{sp.target}}" hint-placeholder-val="{{false}}"><span class="tag">แตะที่นี่</span></sc-if></button></sc-for>
<div class="{{chefCls}}" style="position: absolute; left: 0; top: 292px; width: 96px; height: 139px; transform: translate({{chefX}}px, {{chefY}}px); transition: transform .7s ease-in-out; z-index: 5; pointer-events: none"><span class="shadow"></span><span class="rig" style="display: block; transform: scaleX({{chefFace}})"><span class="hopper" style="display: block">@@CHEF@@</span></span></div>
<sc-for list="{{hots}}" as="o" hint-placeholder-count="0"><button class="{{o.cls}}" onClick="{{o.tap}}" disabled="{{o.disabled}}" aria-label="{{o.aria}}" style="left: {{o.x}}px; top: {{o.y}}px; width: {{o.w}}px; height: {{o.h}}px; box-shadow: {{o.ring}}; opacity: {{o.op}}"><sc-if value="{{o.hasImg}}" hint-placeholder-val="{{false}}"><img src="{{o.img}}" alt=""></sc-if></button></sc-for>
</div>
<sc-if value="{{timing}}" hint-placeholder-val="{{false}}"><span class="mali num" style="position: absolute; right: 12px; top: 12px; padding: 4px 12px; border-radius: 999px; background: {{timerBg}}; color: #FFFFFF; font-size: 15px; font-weight: 700">{{timeText}}</span></sc-if>
<sc-if value="{{showHeat}}" hint-placeholder-val="{{false}}"><span class="mali" style="position: absolute; left: 12px; top: 12px; padding: 4px 12px; border-radius: 999px; background: #FFF8EC; font-size: 15px; font-weight: 700">{{heatText}}</span></sc-if>
</div>
'''
PANELROW='''<sc-if value="{{showWalk}}" hint-placeholder-val="{{true}}">
<button class="press" onClick="{{walk.tap}}" disabled="{{walk.disabled}}" style="flex: 0 0 auto; display: flex; align-items: center; justify-content: center; gap: 12px; height: 92px; padding: 0 16px; border: 0; border-radius: 22px; background: #FFFFFF; box-shadow: 0 0 0 3px #3B2A22; color: #3B2A22; cursor: pointer">
<img src="{{walk.img}}" alt="" width="52" height="52" style="display: block">
<span style="display: flex; flex-direction: column; align-items: flex-start"><span class="mali" style="font-size: 18px; font-weight: 700">{{walk.label}}</span><span style="font-size: 14px; font-weight: 600; color: #4F4A5C">หรือแตะจุดที่กะพริบในครัว</span></span>
</button>
</sc-if>
<sc-if value="{{showTodo}}" hint-placeholder-val="{{false}}">
<div style="flex: 0 0 auto; display: flex; gap: 6px">
<sc-for list="{{todo}}" as="a" hint-placeholder-count="3"><div style="flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; min-height: 92px; padding: 6px 2px; box-sizing: border-box; border-radius: 18px; background: {{a.bg}}; opacity: {{a.op}}"><img src="{{a.img}}" alt="" width="36" height="36" style="display: block"><span style="font-size: 14px; font-weight: 700; line-height: 1.2; text-align: center">{{a.label}}</span><span class="num" style="font-size: 14px; font-weight: 600; color: #4F4A5C">{{a.count}}</span></div></sc-for>
</div>
</sc-if>
'''
SKIPBTN='<button class="press mali" onClick="{{skip}}" style="min-width: 60px; height: 44px; padding: 0 14px; border: 0; border-radius: 999px; background: #FFF8EC; color: #3B2A22; font-size: 15px; font-weight: 700; cursor: pointer">ข้าม</button>'
FOOT='''<div style="flex: 0 0 auto; display: flex; justify-content: space-between; gap: 8px">
<button class="press" onClick="{{back}}" disabled="{{noBack}}" style="height: 44px; padding: 0 10px; border: 0; background: transparent; color: #4F4A5C; font-size: 14px; font-weight: 700; text-decoration: underline; opacity: {{backOp}}; cursor: pointer">ย้อนงานก่อนหน้า</button>
<button class="press" onClick="{{skip}}" style="height: 44px; padding: 0 10px; border: 0; background: transparent; color: #4F4A5C; font-size: 14px; font-weight: 700; text-decoration: underline; cursor: pointer">ข้ามงานนี้</button>
</div>
'''
ASK='''<sc-if value="{{asking}}" hint-placeholder-val="{{false}}">
<div style="position: absolute; inset: 0; z-index: 950; display: flex; align-items: flex-end; background: rgba(36,33,43,.55)">
<div class="screen" role="dialog" aria-modal="true" aria-label="ออกจากครัว" style="width: 100%; box-sizing: border-box; padding: 22px 16px 24px; display: flex; flex-direction: column; gap: 12px; background: #FFF8EC; border-radius: 28px 28px 0 0">
<h2 class="mali" style="margin: 0; font-size: 20px; font-weight: 700; line-height: 1.3">ออกจากครัวก่อนไหม?</h2>
<p style="margin: 0 0 4px; font-size: 16px; line-height: 1.5">เชฟช้างจะจำไว้ว่าทำถึงไหน กลับมาทำต่อได้</p>
<button class="press mali" onClick="{{stay}}" style="height: 56px; padding: 0; border: 0; border-radius: 20px; background: #C2512E; color: #FFFFFF; font-size: 18px; font-weight: 700; cursor: pointer">ทำต่อเลย</button>
<button class="press mali" onClick="{{leave}}" style="height: 56px; padding: 0; border: 0; border-radius: 20px; background: #FFFFFF; color: #3B2A22; font-size: 17px; font-weight: 700; cursor: pointer">ออกไปหน้าวัตถุดิบ</button>
</div>
</div>
</sc-if>
'''
def build_block():
    b=c2.BLOCK
    a=b.index('<div style="position: absolute; left: 0; top: 116px; width: 390px; height: 470px; overflow: hidden">'); e=b.index('<div style="position: absolute; left: 12px; right: 12px; top: 594px')
    b=b[:a]+WORLD+b[e:]
    a=b.index('<div style="flex: 0 0 auto; display: flex; gap: 6px">\n<sc-for list="{{btns}}"'); e=b.index('</sc-for>\n</div>',a)+len('</sc-for>\n</div>')
    b=b[:a]+PANELROW+FOOT+b[e:]
    for x,y in [(SKIPBTN,'<span style="width: 44px; height: 44px"></span>'),('top: 594px; height: 234px; box-sizing: border-box; padding: 12px 12px 12px; display: flex; flex-direction: column; gap: 8px;','top: 590px; height: 246px; box-sizing: border-box; padding: 10px 12px 6px; display: flex; flex-direction: column; gap: 6px;'),('aria-label="ออกจากครัว กลับไปดูวัตถุดิบ"','aria-label="ออกจากครัว"')]:
        assert b.count(x)==1,x[:40]; b=b.replace(x,y)
    e=b.rindex('</div>\n</sc-if>')
    return b[:e]+ASK+b[e:]
JS=open('./cookstage4.js',encoding='utf-8').read()
def splice(html,mascot,CLOSEIC):
    img=re.search(r"const IMG = (\{[^}]*\});",html).group(1)
    a=html.index('<sc-if value="{{isCook}}"'); b=html.index('<sc-if value="{{isDone}}"')
    blk=c2.ENTER+build_block()
    ovs='\n'.join(ov(k,k in POP) for k in ORDER)
    for k,v in {'@@CLOSE@@':CLOSEIC,'@@BASE@@':svgwrap(B),'@@OVS@@':ovs,'@@CHEF@@':chefsvg(),'@@FROG@@':botsvg('frog'),'@@CAT@@':botsvg('cat'),'@@CAPY@@':botsvg('capybara')}.items(): blk=blk.replace(k,v)
    assert '@@' not in blk
    html=html[:a]+blk+html[b:]
    a=html.index('class Component extends DCLogic'); b=html.index('</script>',a)
    html=html[:a]+JS.replace('__IMG__',img).replace('__X__',c2.XJS)+html[b:]
    walk='.bot.back.walking .armL{animation:swingA .56s ease-in-out infinite}.bot.back.walking .armR{animation:swingB .56s ease-in-out infinite}\n'
    return html.replace('.screen{animation',c2.CSS3+POSE_CSS+walk+CSS5+'.screen{animation',1)
