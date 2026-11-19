# Kitchen-room cooking flow: the chef walks between stations; the user taps the station, then does the task there.
import re
from cookstage import PAN,OIL,EGG,AROMA,PORK,BASIL,KNIFE,CSS2
from kitchen import BASE,OV,svgwrap
from chefrig import chef as chefsvg, POSE_CSS
from bots import svg as botsvg
X={'knife_chef':'d011e278f5b1bbe0d26a6f654038fb5f','knife_cleaver':'18dfddd7e8431c1a2422f88d84d97dfb','knife_paring':'7c75be98b50eb9d518112da7acc9f113','board':'2c34b1a08066f48aea18e6a0c8032dc0','spatula':'7f31934c92713647cfb4da1fdb54b83b','knob':'a125423735995931306d874c3b727ea5','heat0':'954563a8796a175e05c57680041c6b57','heat1':'6aa2956a4c5be7654371f46d00bd2849','heat2':'df0ac742a833c8eaf5335ef43c09c8e0','water':'de74d1dcc07d2d32ffa24faa5cbb623a','walk':'f1d4d702f72f3381843230d04f34b678','morning':'78d54072a7ea0047ddab68f6e27714f4'}
XJS='{ '+', '.join(f"{k}: '/_blob/{v}'" for k,v in X.items())+' }'
CSS3=CSS2+'''.spot{position:absolute;padding:0;border:0;background:transparent;border-radius:18px;cursor:pointer;z-index:6}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
.pulse{animation:pulse .9s ease-in-out infinite}
@keyframes tagBob{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,-6px)}}
.tag{position:absolute;left:50%;top:-34px;transform:translate(-50%,0);white-space:nowrap;padding:4px 12px;border-radius:999px;background:#24212B;color:#FFFFFF;font-size:14px;font-weight:700;animation:tagBob .9s ease-in-out infinite;pointer-events:none}
@keyframes flowA{0%,100%{opacity:1}50%{opacity:.55}}
.flow{animation:flowA .45s linear infinite}
'''
def ov(k): return '<sc-if value="{{sc.%s}}" hint-placeholder-val="{{false}}">%s</sc-if>'%(k,svgwrap(OV[k],' class="pop"' if k in('board','knife','eggplate','fridge') else ''))
BLOCK='''<sc-if value="{{isCook}}" hint-placeholder-val="{{false}}">
<div class="screen" style="position: absolute; inset: 0; background: #FFE3A3">
<div style="position: absolute; top: 50px; left: 12px; right: 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px">
<button class="press" onClick="{{toRecipe}}" aria-label="ออกจากครัว กลับไปดูวัตถุดิบ" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 999px; background: #FFF8EC; cursor: pointer">@@CLOSE@@</button>
<span class="mali num" style="font-weight: 700; font-size: 16px">ขั้นที่ {{stepNo}} จาก {{stepCount}}</span>
<button class="press mali" onClick="{{skip}}" style="min-width: 60px; height: 44px; padding: 0 14px; border: 0; border-radius: 999px; background: #FFF8EC; color: #3B2A22; font-size: 15px; font-weight: 700; cursor: pointer">ข้าม</button>
</div>
<div aria-hidden="true" style="position: absolute; top: 102px; left: 16px; right: 16px; display: flex; gap: 6px">
<sc-for list="{{bars}}" as="bar" hint-placeholder-count="6"><span style="flex: 1 1 0; height: 8px; border-radius: 999px; background: {{bar.bg}}"></span></sc-for>
</div>
<div style="position: absolute; left: 0; top: 116px; width: 390px; height: 470px; overflow: hidden">
@@BASE@@
@@OVS@@
<sc-if value="{{sc.fume}}" hint-placeholder-val="{{false}}"><span class="fume" style="left: 322px; top: 164px"></span><span class="fume" style="left: 340px; top: 156px; animation-delay: .6s"></span><span class="fume" style="left: 356px; top: 166px; animation-delay: 1.1s"></span></sc-if>
<sc-for list="{{spots}}" as="sp" hint-placeholder-count="6"><button class="{{sp.cls}}" onClick="{{sp.tap}}" aria-label="{{sp.aria}}" style="left: {{sp.x}}px; top: {{sp.y}}px; width: {{sp.w}}px; height: {{sp.h}}px; box-shadow: {{sp.ring}}"><sc-if value="{{sp.target}}" hint-placeholder-val="{{false}}"><span class="tag">แตะที่นี่</span></sc-if></button></sc-for>
<div class="{{chefCls}}" style="position: absolute; left: 0; top: 292px; width: 96px; height: 139px; transform: translateX({{chefX}}px); transition: transform .7s ease-in-out; z-index: 5; pointer-events: none"><span class="shadow"></span><span class="rig" style="display: block; transform: scaleX({{chefFace}})"><span class="hopper" style="display: block">@@CHEF@@</span></span></div>
<sc-if value="{{zoomPan}}" hint-placeholder-val="{{false}}">
<div class="pop" style="position: absolute; right: 10px; top: 8px; width: 164px; height: 160px; background: #FFF8EC; border-radius: 28px; box-shadow: 0 0 0 4px #3B2A22; z-index: 7; pointer-events: none">
<span class="mali num" style="position: absolute; left: 12px; top: 8px; font-size: 14px; font-weight: 700">{{zoomLabel}}</span>
<div class="{{shakeCls}}" style="position: absolute; left: 7px; top: 32px; width: 150px; height: 120px"><div style="position: absolute; left: 0; top: 0; width: 300px; height: 240px; transform: scale(0.5); transform-origin: 0 0">
@@PAN@@
<sc-if value="{{pan.oil}}" hint-placeholder-val="{{false}}">@@OIL@@</sc-if>
<sc-if value="{{pan.aroma}}" hint-placeholder-val="{{false}}">@@AROMA@@</sc-if>
<sc-if value="{{pan.pork}}" hint-placeholder-val="{{false}}">@@PORK@@</sc-if>
<sc-if value="{{pan.basil}}" hint-placeholder-val="{{false}}">@@BASIL@@</sc-if>
<sc-if value="{{pan.egg}}" hint-placeholder-val="{{false}}">@@EGG@@</sc-if>
</div></div>
</div>
</sc-if>
<sc-if value="{{zoomBoard}}" hint-placeholder-val="{{false}}">
<div class="pop" style="position: absolute; right: 10px; top: 8px; width: 164px; height: 160px; background: #FFF8EC; border-radius: 28px; box-shadow: 0 0 0 4px #3B2A22; z-index: 7; pointer-events: none">
<span class="mali" style="position: absolute; left: 12px; top: 8px; font-size: 14px; font-weight: 700">บนเขียง</span>
<div style="position: absolute; left: 12px; top: 34px; width: 140px; height: 114px; background: #F6CF9C; border-radius: 18px"><div style="position: absolute; left: 8px; top: 8px; right: 8px; bottom: 8px; background: #FBDDB4; border-radius: 12px"></div>
<sc-for list="{{bits}}" as="b" hint-placeholder-count="0"><span class="pop" style="position: absolute; left: {{b.x}}px; top: {{b.y}}px; width: {{b.w}}px; height: {{b.h}}px; border-radius: 999px; background: {{b.c}}; transform: rotate({{b.r}}deg)"></span></sc-for>
<div class="{{chopCls}}" style="position: absolute; right: -14px; bottom: -18px; width: 90px; height: 90px; transform-origin: 85% 15%">@@KNIFE@@</div>
</div>
</div>
</sc-if>
<sc-if value="{{plated}}" hint-placeholder-val="{{false}}">
<div class="pop" style="position: absolute; right: 10px; top: 8px; width: 164px; height: 160px; background: #FFF8EC; border-radius: 28px; box-shadow: 0 0 0 4px #3B2A22; z-index: 7; pointer-events: none"><img src="/_blob/6c2552b0403b97e680de31c0a2deaa28" alt="กะเพราหมูสับไข่ดาวจัดจานแล้ว" width="150" height="150" style="position: absolute; left: 7px; top: 5px; display: block"></div>
</sc-if>
</div>
<div style="position: absolute; left: 12px; right: 12px; top: 594px; height: 234px; box-sizing: border-box; padding: 12px 12px 12px; display: flex; flex-direction: column; gap: 8px; background: #FFF8EC; border-radius: 28px">
<div style="flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; justify-content: center; gap: 2px; padding: 0 6px">
<h2 class="mali" style="margin: 0; font-size: 18px; font-weight: 700; line-height: 1.3">{{taskTitle}}</h2>
<p class="mali" aria-live="polite" style="margin: 0; font-size: 16px; font-weight: 600; line-height: 1.4">{{hint}}</p>
</div>
<div style="flex: 0 0 auto; display: flex; gap: 6px">
<sc-for list="{{btns}}" as="a" hint-placeholder-count="3">
<button class="press" onClick="{{a.tap}}" disabled="{{a.disabled}}" style="flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; height: 116px; box-sizing: border-box; padding: 6px 2px; border: 0; border-radius: 20px; background: {{a.bg}}; box-shadow: {{a.ring}}; opacity: {{a.op}}; color: #3B2A22; cursor: pointer">
<img src="{{a.img}}" alt="" width="46" height="46" style="display: block">
<span style="font-size: 14px; font-weight: 700; line-height: 1.25; text-align: center">{{a.label}}</span>
<span class="num" style="font-size: 13px; font-weight: 700; color: #4F4A5C">{{a.count}}</span>
</button>
</sc-for>
</div>
</div>
</div>
</sc-if>

'''
ENTER='''<sc-if value="{{isEnter}}" hint-placeholder-val="{{false}}">
<div class="screen" style="position: absolute; inset: 0; overflow: hidden; background: #FBEBD2">
<img src="/_blob/9dc673fd2eb139611211e828f85eec0f" alt="หน้าร้าน มองเห็นครัวอยู่หลังเคาน์เตอร์" style="position: absolute; left: -86px; top: 0; width: 563px; height: 844px; display: block">
<div class="bot mood-wave" style="position: absolute; left: 0; top: 0; width: 96px; height: 139px; transform: translate(262px, 318px) scale(0.85); transform-origin: 50% 100%"><span class="shadow"></span><span class="hopper" style="display: block">@@FROG@@</span></div>
<div class="bot mood-wave" style="position: absolute; left: 0; top: 0; width: 96px; height: 139px; transform: translate(18px, 430px) scale(1.2); transform-origin: 50% 100%"><span class="shadow"></span><span class="hopper" style="display: block">@@CAT@@</span></div>
<div class="bot mood-wave" style="position: absolute; left: 0; top: 0; width: 96px; height: 139px; transform: translate(276px, 500px) scale(1.3); transform-origin: 50% 100%"><span class="shadow"></span><span class="hopper" style="display: block">@@CAPY@@</span></div>
<div class="bot back walking" style="position: absolute; left: 0; top: 0; width: 96px; height: 139px; transform: {{enterT}}; transform-origin: 50% 100%; transition: transform 1.6s ease-in"><span class="shadow"></span><span class="hopper" style="display: block">@@CHEF@@</span></div>
<div style="position: absolute; left: 12px; right: 12px; top: 50px; display: flex; align-items: center; justify-content: space-between; gap: 10px">
<span class="mali" style="display: flex; align-items: center; height: 44px; padding: 0 16px; background: #FFF8EC; border-radius: 999px; font-size: 16px; font-weight: 700">เชฟช้างกำลังเดินเข้าครัว</span>
<button class="press mali" onClick="{{skipEnter}}" style="min-width: 60px; height: 44px; padding: 0 14px; border: 0; border-radius: 999px; background: #FFF8EC; color: #3B2A22; font-size: 15px; font-weight: 700; cursor: pointer">ข้าม</button>
</div>
<p class="mali" style="position: absolute; left: 12px; right: 12px; bottom: 28px; margin: 0; padding: 14px 16px; background: #FFF8EC; border-radius: 22px; font-size: 16px; font-weight: 600; line-height: 1.45; text-align: center">เพื่อนๆ โบกมือส่ง สู้ๆ นะเชฟ!</p>
</div>
</sc-if>

'''
JS=open('./cookstage2.js',encoding='utf-8').read()
def splice(html,mascot,CLOSE):
    img=re.search(r"const IMG = (\{[^}]*\});",html).group(1)
    a=html.index('<sc-if value="{{isCook}}"'); b=html.index('<sc-if value="{{isDone}}"')
    blk=ENTER+BLOCK
    ovs='\n'.join(ov(k) for k in ['fridge','board','knife','bits','water','low','high','eggplate','food'])
    for k,v in {'@@CLOSE@@':CLOSE,'@@BASE@@':svgwrap(BASE),'@@OVS@@':ovs,'@@CHEF@@':chefsvg(),'@@FROG@@':botsvg('frog'),'@@CAT@@':botsvg('cat'),'@@CAPY@@':botsvg('capybara'),'@@PAN@@':PAN,'@@OIL@@':OIL,'@@AROMA@@':AROMA,'@@PORK@@':PORK,'@@BASIL@@':BASIL,'@@EGG@@':EGG,'@@KNIFE@@':KNIFE}.items(): blk=blk.replace(k,v)
    assert '@@' not in blk
    html=html[:a]+blk+html[b:]
    a=html.index('class Component extends DCLogic'); b=html.index('</script>',a)
    html=html[:a]+JS.replace('__IMG__',img).replace('__X__',XJS)+html[b:]
    return html.replace('.screen{animation',CSS3+POSE_CSS+'.bot.back.walking .armL{animation:swingA .56s ease-in-out infinite}.bot.back.walking .armR{animation:swingB .56s ease-in-out infinite}\n'+'.screen{animation',1)
