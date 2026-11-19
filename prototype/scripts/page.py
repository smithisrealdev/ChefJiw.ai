import sys; sys.path.insert(0,'.')
from bots import svg
BG=sys.argv[1]
def bot(k,label,art=None):
    return f'''<div class="{{{{{k}.cls}}}}" style="position: absolute; left: 0; top: 0; width: 96px; height: 139px; transform: translate({{{{{k}.x}}}}px, {{{{{k}.y}}}}px); transition: transform {{{{{k}.dur}}}}s linear; z-index: {{{{{k}.z}}}}">
<div style="position: absolute; inset: 0; transform: scale({{{{{k}.s}}}}); transform-origin: 50% 100%">
<div class="emote" aria-hidden="true"><svg class="em em-heart" width="22" height="22" viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" fill="#F2687E"></path></svg><svg class="em em-note" width="22" height="22" viewBox="0 0 24 24"><path d="M9 17V5l10-2v12" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="6.5" cy="17" r="3" fill="#FFFFFF"></circle><circle cx="16.5" cy="15" r="3" fill="#FFFFFF"></circle></svg><svg class="em em-wow" width="22" height="22" viewBox="0 0 24 24"><rect x="10" y="3" width="4" height="12" rx="2" fill="#F2C14E"></rect><circle cx="12" cy="19.5" r="2.4" fill="#F2C14E"></circle></svg><svg class="em em-zzz" width="24" height="22" viewBox="0 0 26 24"><path d="M3 12h7l-7 8h7M14 4h8l-8 9h8" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg></div>
<span class="shadow"></span>
<button class="tap" aria-label="{label}" onClick="{{{{{k}.tap}}}}"><span class="rig" style="display: block; transform: scaleX({{{{{k}.face}}}})"><span class="hopper" style="display: block">{svg(art or k)}</span></span></button>
</div>
</div>
'''
css='''
body{margin:0}
a{color:#C2512E}a:hover{color:#8F3A20}
button{font-family:inherit;color:inherit;-webkit-tap-highlight-color:transparent}
.mali{font-family:'Mali','IBM Plex Sans Thai Looped',sans-serif}
.bot .tap{position:absolute;inset:0;padding:0;margin:0;border:0;background:transparent;cursor:pointer}
.bot .shadow{position:absolute;left:16%;right:16%;bottom:-5px;height:11px;border-radius:50%;background:rgba(60,35,20,.28);display:block}
.bot .emote{position:absolute;left:50%;top:-22px;width:26px;height:24px;margin-left:-13px;z-index:2}
.bot .em{display:none;position:absolute;left:0;top:0}
.bot .eh,.bot .es,.bot .mo{display:none}
.bot .legL,.bot .legR,.bot .armL,.bot .armR,.bot .head,.bot .tail,.bot .earL,.bot .earR,.bot .eo,.bot .bodyg,.bot .trunk{transform-box:fill-box}
.bot .legL,.bot .legR{transform-origin:50% 0}
.bot .armL,.bot .armR{transform-origin:50% 6%}
.bot .head{transform-origin:50% 92%;animation:nod 3.6s ease-in-out infinite}
.bot .bodyg{transform-origin:50% 100%;animation:breathe 2.6s ease-in-out infinite}
.bot .tail{transform-origin:0 100%;animation:tail 1.8s ease-in-out infinite}
.bot .earL{transform-origin:100% 50%;animation:earL 3s ease-in-out infinite}
.bot .earR{transform-origin:0 50%;animation:earR 3s ease-in-out infinite}
.bot .trunk{transform-origin:50% 0;animation:trunk 2.8s ease-in-out infinite}
.bot .eo{transform-origin:50% 50%;animation:blink 4.2s linear infinite}
.bot .armL{animation:idleArmL 2.6s ease-in-out infinite}
.bot .armR{animation:idleArmR 2.6s ease-in-out infinite}
@keyframes nod{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}
@keyframes breathe{0%,100%{transform:scale(1,1)}50%{transform:scale(1.03,.97)}}
@keyframes tail{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(14deg)}}
@keyframes earL{0%,80%,100%{transform:rotate(0)}88%{transform:rotate(-14deg)}94%{transform:rotate(6deg)}}
@keyframes earR{0%,80%,100%{transform:rotate(0)}88%{transform:rotate(14deg)}94%{transform:rotate(-6deg)}}
@keyframes trunk{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(7deg)}}
@keyframes blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
@keyframes idleArmL{0%,100%{transform:rotate(0)}50%{transform:rotate(4deg)}}
@keyframes idleArmR{0%,100%{transform:rotate(0)}50%{transform:rotate(-4deg)}}
@keyframes stepA{0%,100%{transform:rotate(24deg)}50%{transform:rotate(-24deg)}}
@keyframes stepB{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(24deg)}}
@keyframes swingA{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}
@keyframes swingB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-22deg)}}
@keyframes bounce{0%,50%,100%{transform:translateY(0)}25%,75%{transform:translateY(-4px)}}
.walking .legL{animation:stepA .56s ease-in-out infinite}
.walking .legR{animation:stepB .56s ease-in-out infinite}
.walking .armL{animation:swingA .56s ease-in-out infinite}
.walking .armR{animation:swingB .56s ease-in-out infinite}
.walking .hopper{animation:bounce .56s ease-in-out infinite}
.walking .head{animation:nod .56s ease-in-out infinite}
@keyframes hop{0%,100%{transform:translateY(0) scale(1,1)}20%{transform:translateY(0) scale(1.06,.92)}50%{transform:translateY(-18px) scale(.97,1.04)}80%{transform:translateY(0) scale(1.05,.94)}}
@keyframes wave{0%,100%{transform:rotate(118deg)}50%{transform:rotate(148deg)}}
@keyframes emote{0%{opacity:0;transform:translateY(8px) scale(.5)}25%{opacity:1;transform:translateY(0) scale(1.1)}80%{opacity:1;transform:translateY(-4px) scale(1)}100%{opacity:0;transform:translateY(-12px) scale(1)}}
.mood-happy .hopper,.mood-love .hopper{animation:hop .6s ease-out 2}
.mood-happy .armL,.mood-wave .armL{animation:wave .4s ease-in-out infinite}
.mood-happy .eo,.mood-love .eo,.mood-wave .eo,.mood-sleepy .eo{display:none}
.mood-happy .eh,.mood-love .eh,.mood-wave .eh{display:inline}
.mood-happy .ms,.mood-wow .ms,.mood-sing .ms,.mood-wave .ms{display:none}
.mood-happy .mo,.mood-wow .mo,.mood-sing .mo,.mood-wave .mo{display:inline}
.mood-sleepy .es{display:inline}
.mood-sleepy .head{animation:nod 5s ease-in-out infinite}
.mood-wow .eo{animation:none;transform:scale(1.35)}
.mood-wow .hopper{animation:hop .5s ease-out 1}
.mood-sing .head{animation:nod .9s ease-in-out infinite}
.mood-love .em-heart,.mood-sing .em-note,.mood-wow .em-wow,.mood-sleepy .em-zzz{display:block;animation:emote 2.4s ease-out infinite}
@keyframes twinkle{0%,100%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1)}}
.spark{position:absolute;display:block;animation:twinkle 2.8s ease-in-out infinite;pointer-events:none}
@keyframes steam{0%{opacity:0;transform:translateY(6px) scale(.7)}25%{opacity:.9}100%{opacity:0;transform:translateY(-34px) scale(1.4)}}
.steam{position:absolute;display:block;width:10px;height:16px;border-radius:50%;background:#FFFFFF;animation:steam 2.6s ease-out infinite;pointer-events:none}
@keyframes cardIn0{from{opacity:0;transform:translateY(10px) scale(.96)}}
@keyframes cardIn1{from{opacity:0;transform:translateY(10px) scale(.96)}}
.card0{animation:cardIn0 .35s cubic-bezier(.2,.9,.3,1.2) both}
.card1{animation:cardIn1 .35s cubic-bezier(.2,.9,.3,1.2) both}
.num{font-variant-numeric:tabular-nums}
.bot .armN,.bot .armF{animation:idleSwing 2.6s ease-in-out infinite}
@keyframes idleSwing{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
.bot.w-stir .armN{animation:stir2 .52s ease-in-out infinite}
@keyframes stir2{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(9deg)}}
.bot.w-stir .armF{animation:none}
.bot.w-taste .armN{animation:none;transition:transform .5s ease-in-out;transform:rotate(0deg)}
.bot.w-taste.p-eat .armN{transform:rotate(-80deg)}
.bot.w-taste.p-rest .armN{transform:rotate(16deg)}
.bot.w-point .armF{animation:point2 1.3s ease-in-out infinite}
@keyframes point2{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
.bot.w-place .armF{animation:place2 1.6s ease-in-out infinite}
@keyframes place2{0%,100%{transform:rotate(-16deg)}50%{transform:rotate(12deg)}}
@keyframes carryF{0%,100%{transform:rotate(44deg)}50%{transform:rotate(64deg)}}
@keyframes carryN{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
.bot.walking .armF{animation:carryF .56s ease-in-out infinite}
.bot.walking .armN{animation:carryN .56s ease-in-out infinite}
.bot.w-place .armN{animation:idleSwing 2.6s ease-in-out infinite}
.bot.steady .hopper{animation:none}
@keyframes toss{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.toss{animation:toss .52s ease-in-out infinite}.toss.t2{animation-delay:.17s}.toss.t3{animation-delay:.34s}
@keyframes wokshake{0%,100%{transform:translateX(0)}50%{transform:translateX(-2.500px)}}
.wokpan{animation:wokshake .52s ease-in-out infinite}
@keyframes dropin{0%{opacity:0;transform:translate(-10px,-12px) scale(.8)}15%{opacity:1}45%{opacity:1;transform:translate(8px,6px) scale(1)}60%,100%{opacity:0;transform:translate(8px,18px) scale(1)}}
.dropin{animation:dropin 1.6s ease-in-out infinite}
@keyframes needle{0%,100%{transform:rotate(-40deg)}50%{transform:rotate(50deg)}}
.needle{transform-box:view-box;transform-origin:32px 16.500px;animation:needle 2.6s ease-in-out infinite}
@keyframes popIn{from{opacity:0;transform:scale(.6)}}
.press{transition:transform .12s ease-out}
.press:active{transform:scale(.94)}
.still *,.still *::before,.still *::after{animation:none !important;transition:none !important}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important}}
'''
B_='/_blob/'
ING={'egg':'c6263c9b14efb6319b8350ce20511359','pork':'86fdb695be776bfd7914cdfa1c29ed25','rice':'5658e513ce137923d2aca173599a06ac','morning':'78d54072a7ea0047ddab68f6e27714f4','chili':'88051bbf2bf5bf095b12be008a28cda8','garlic':'d6b929345fd698afe2cfc77cdb952825','basil':'4083ec0fb9b6108174fd3446c825d9ae'}
def pim(src,x,y,w,z,cls='',st=''): return f'<img class="{cls}" src="{src}" alt="" width="{w}" height="{w}" style="position: absolute; left: {x}px; top: {y}px; z-index: {z}; display: block; pointer-events: none; {st}">'
def pill(x,y,z,hole,st=''): return f'<span class="mali num" aria-hidden="true" style="position: absolute; left: {x}px; top: {y}px; z-index: {z}; height: 26px; box-sizing: border-box; padding: 0 10px; display: flex; align-items: center; gap: 4px; border-radius: 999px; background: #FFFFFF; box-shadow: 0 0 0 2px #24212B; font-size: 13px; font-weight: 700; line-height: 1; white-space: nowrap; pointer-events: none; {st}">{hole}</span>'
MASK=(''.join(f'<span aria-hidden="true" style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; background: {c}; z-index: 30; pointer-events: none"></span>' for x,y,w,h,c in [(264,137,107,107,'#FFE3BF'),(264,137,4,107,'#F6CFA0')])
 +'<span aria-hidden="true" style="position: absolute; left: 280px; top: 244px; width: 110px; height: 9px; background: #E6AD68; z-index: 50; pointer-events: none"></span>'
 +f'<div aria-hidden="true" style="position: absolute; left: 0; top: 253px; width: 390px; height: 80px; overflow: hidden; z-index: 50; pointer-events: none"><img src="{BG}" alt="" style="position: absolute; left: -86px; top: -253px; width: 563px; height: 844px; display: block"></div>')
WOK="""<div aria-hidden="true" style="position: absolute; left: 230px; top: 214px; width: 64px; height: 40px; z-index: 60; pointer-events: none">
<span class="steam" style="left: 14px; top: -4px"></span><span class="steam" style="left: 30px; top: -8px; animation-delay: .9s"></span><span class="steam" style="left: 22px; top: -2px; animation-delay: 1.7s"></span>
<svg width="64" height="40" viewBox="0 0 64 40" style="display: block; overflow: visible"><rect x="14" y="35" width="28" height="5" rx="2.500" fill="#6B6777"></rect><path d="M17 37l3-5 3 5zM26 37l3-6 3 6zM35 37l3-5 3 5z" fill="#FF9F43"></path><g class="wokpan"><circle class="toss" cx="16" cy="17" r="3.600" fill="#5DBB63"></circle><circle class="toss t2" cx="25" cy="15" r="3.800" fill="#B5714A"></circle><circle class="toss t3" cx="34" cy="16" r="3.400" fill="#F0584A"></circle><circle class="toss t2" cx="42" cy="17" r="3.400" fill="#5DBB63"></circle><path d="M6 19H50Q48 34 28 34Q8 34 6 19Z" fill="#3A3542"></path><rect x="4" y="17.500" width="48" height="3.600" rx="1.800" fill="#57506A"></rect><rect x="50" y="17.500" width="13" height="3.600" rx="1.800" fill="#24212B"></rect></g></svg>
</div>"""
TABLE="""<svg aria-hidden="true" width="78" height="60" viewBox="0 0 78 60" style="position: absolute; left: 212px; top: 440px; z-index: 580; display: block; pointer-events: none"><ellipse cx="39" cy="55" rx="20" ry="5" fill="rgba(60,45,70,.16)"></ellipse><rect x="35" y="14" width="8" height="40" rx="3" fill="#DDAA6A"></rect><ellipse cx="39" cy="13" rx="37" ry="9" fill="#DDAA6A"></ellipse><ellipse cx="39" cy="10" rx="37" ry="9" fill="#F9DDAE"></ellipse></svg>"""
SCALE="""<svg aria-hidden="true" width="64" height="48" viewBox="0 0 64 48" style="position: absolute; left: 110px; top: 430px; z-index: 578; display: block; pointer-events: none"><ellipse cx="32" cy="45" rx="24" ry="4" fill="rgba(60,45,70,.16)"></ellipse><rect x="10" y="28" width="6" height="16" rx="3" fill="#DDAA6A"></rect><rect x="48" y="28" width="6" height="16" rx="3" fill="#DDAA6A"></rect><rect x="4" y="24" width="56" height="7" rx="3.500" fill="#F9DDAE"></rect><rect x="12" y="8" width="40" height="17" rx="7" fill="#8FE3CF"></rect><circle cx="32" cy="16.500" r="6" fill="#FFFFFF"></circle><path class="needle" d="M32 16.500V12" stroke="#24212B" stroke-width="2" stroke-linecap="round"></path><rect x="8" y="4" width="48" height="5" rx="2.500" fill="#E4E0F2"></rect></svg>"""
def crate(x,y,w,h,z): return f'<svg aria-hidden="true" width="{w}" height="{h}" viewBox="0 0 {w} {h}" style="position: absolute; left: {x}px; top: {y}px; z-index: {z}; display: block; pointer-events: none"><rect x="1" y="0" width="{w-2}" height="{h-4}" rx="5" fill="#F3C98B"></rect><path d="M1 {h*0.36:.1f}H{w-1}M1 {h*0.66:.1f}H{w-1}" stroke="#D9A066" stroke-width="3"></path><rect x="6" y="0" width="6" height="{h-4}" fill="#DDAA6A"></rect><rect x="{w-12}" y="0" width="6" height="{h-4}" fill="#DDAA6A"></rect></svg>'
STAR14='<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.800l2.800 5.900 6.400.800-4.700 4.400 1.200 6.300L12 17.100l-5.700 3.100 1.200-6.300L2.800 9.500l6.400-.800z" fill="#FFC93D" stroke="#24212B" stroke-width="1.600" stroke-linejoin="round"></path></svg>'
SCENE=(MASK+WOK
 +bot('elephant','เชฟช้าง กำลังผัดอาหารอยู่หลังเคาน์เตอร์',art='elephant_work')
 +SCALE+pim('{{frog.img}}',125,402,34,576)+pill(64,344,579,'{{frog.read}}')
 +bot('frog','โค้ชกบ กำลังชั่งวัตถุดิบและจดแคลอรี่',art='frog_work')
 +TABLE+pim('{{cat.dish}}',226,404,50,581)
 +'<sc-if value="{{cat.scored}}" hint-placeholder-val="{{true}}">'+pill(212,373,589,STAR14+'{{cat.score}}','animation: popIn .32s cubic-bezier(.2,.9,.3,1.3) both')+'</sc-if>'
 +bot('cat','นักชิมเจี๊ยบ กำลังชิมอาหารและให้คะแนน',art='cat_work')
 +pim(B_+ING['morning'],210,542,46,718)+pim(B_+ING['basil'],246,550,34,718)+pim(B_+ING['chili'],288,560,30,718)+pim(B_+ING['garlic'],314,560,30,718)
 +'<sc-if value="{{capybara.home}}" hint-placeholder-val="{{true}}">'+pim('{{capybara.img}}',198,546,28,719,'dropin')+pill(224,512,721,'{{capybara.tag}}')+'</sc-if>'
 +crate(204,572,76,50,720)+crate(284,582,62,40,720)
 +bot('capybara','คาปิบาระ กำลังจัดของสดจากตลาด',art='capybara_work'))
spark='<path d="M12 2c.7 5.3 4.7 9.3 10 10-5.3.7-9.3 4.700-10 10-.7-5.300-4.700-9.300-10-10 5.300-.7 9.300-4.700 10-10z" fill="#FFFFFF"></path>'
sparks=''.join(f'<svg class="spark" style="left: {x}px; top: {y}px; animation-delay: {d}s" width="{s}" height="{s}" viewBox="0 0 24 24" aria-hidden="true">{spark}</svg>\n' for x,y,s,d in [(40,300,12,0),(330,250,14,.8),(200,360,10,1.6),(120,560,12,2.2),(300,620,12,.4),(60,690,10,1.2)])
def tab(label,icon,active=False,soon=False):
    col='#3B2A22' if active else '#7A5C48'; bg='background: #FFE3A3;' if active else ''
    cur=' aria-current="page"' if active else ''
    if soon: return '<button class="press" onClick="{{soonTap}}" aria-label="ชุมชน ยังไม่เปิด" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; width: 64px; height: 64px; padding: 0; border: 0; background: transparent; cursor: pointer"><span style="display: flex; align-items: center; justify-content: center; width: 46px; height: 32px; border-radius: 14px; opacity: 0.45"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7A5C48" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icon+'</svg></span><span style="font-size: 12px; font-weight: 600; color: #7A5C48">เร็วๆ นี้</span></button>'
    return f'<button class="press"{cur} style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; width: 64px; height: 64px; padding: 0; border: 0; background: transparent; cursor: pointer"><span style="display: flex; align-items: center; justify-content: center; width: 46px; height: 32px; border-radius: 14px; {bg}"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="{col}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{icon}</svg></span><span style="font-size: 12px; font-weight: 600; color: {col}">{label}</span></button>'
html=f'''<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<title>ร้านอาหารของทีมเชฟ</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mali:wght@500;600;700&amp;family=IBM+Plex+Sans+Thai+Looped:wght@400;500;600;700&amp;display=swap">
<style>{css}</style>
</helmet>
<div class="{{{{motionClass}}}}" style="position: relative; width: 390px; height: 844px; overflow: hidden; background: #A9683F; font-family: 'IBM Plex Sans Thai Looped', sans-serif; color: #3B2A22">
<img src="{BG}" alt="ร้านอาหารเล็กๆ มีเคาน์เตอร์ครัวเปิด โต๊ะไม้ และต้นไม้" style="position: absolute; left: -86px; top: 0; width: 563px; height: 844px; display: block">
<span class="steam" style="left: 176px; top: 196px"></span>
{sparks}
{SCENE}
<div style="position: absolute; top: 50px; left: 12px; right: 12px; display: flex; justify-content: space-between; align-items: center; gap: 8px; z-index: 900">
<div style="display: flex; align-items: center; gap: 8px; height: 44px; box-sizing: border-box; padding: 0 14px; background: #FFF8EC; border-radius: 999px">
<span class="mali" style="font-weight: 700; font-size: 15px">{{{{hud.lv}}}}</span><span style="font-size: 12px; color: #7A5C48">{{{{hud.title}}}}</span>
</div>
<div style="display: flex; align-items: center; gap: 6px; height: 44px; box-sizing: border-box; padding: 0 14px; background: #FFF8EC; border-radius: 999px">
<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.380-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.500 2 4.900 4 6.500 2 1.600 3 3.500 3 5.500a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.500 2.500 0 0 0 2.500 2.500z" fill="#F2876B"></path></svg>
<span class="mali" style="font-weight: 700; font-size: 15px">{{{{hud.streak}}}}</span>
</div>
</div>
<div class="{{{{cardClass}}}}" style="position: absolute; left: 12px; right: 12px; top: 656px; box-sizing: border-box; padding: 12px 14px; display: flex; align-items: center; gap: 12px; background: #FFF8EC; border-radius: 22px; z-index: 900">
<div style="flex: 1 1 auto; display: flex; flex-direction: column; gap: 2px; min-width: 0">
<span class="mali" style="align-self: flex-start; padding: 1px 10px; border-radius: 999px; background: {{{{talk.color}}}}; color: #3B2A22; font-weight: 700; font-size: 12px">{{{{talk.name}}}}</span>
<p class="mali" style="margin: 0; font-weight: 600; font-size: 15px; line-height: 1.45">{{{{talk.line}}}}</p>
</div>
<button class="press mali" onClick="{{{{talk.next}}}}" style="flex: 0 0 auto; height: 44px; padding: 0 16px; border: 0; border-radius: 16px; background: #C2512E; color: #FFFFFF; font-weight: 700; font-size: 14px; cursor: pointer">{{{{talk.cta}}}}</button>
</div>
<nav aria-label="เมนูหลัก" style="position: absolute; left: 12px; right: 12px; bottom: 14px; height: 72px; box-sizing: border-box; padding: 0 8px; display: flex; align-items: center; justify-content: space-between; background: #FFF8EC; border-radius: 28px; z-index: 900">
{tab('ร้าน','<path d="M3.500 10.600 12 3.600l8.500 7V19.500a1.500 1.500 0 0 1-1.500 1.500H5a1.500 1.500 0 0 1-1.500-1.500z"></path>',True)}
{tab('สูตรอาหาร','<path d="M12 6v14"></path><path d="M3.500 5h5A3.500 3.500 0 0 1 12 8.500 3.500 3.500 0 0 1 15.500 5h5v13h-5.500A2.500 2.500 0 0 0 12 20.500 2.500 2.500 0 0 0 9.500 18H3.500z"></path>')}
{tab('ทำอาหาร','<path d="M3 12h18"></path><path d="M19.500 12v6.500a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V12"></path><path d="M9.500 9V8.500a2.500 2.500 0 0 1 5 0V9"></path>')}
{tab('ชุมชน','<path d="M12 20.500s-7.500-4.600-7.500-10.200A4.300 4.300 0 0 1 12 7.600a4.300 4.300 0 0 1 7.500 2.700c0 5.600-7.500 10.200-7.500 10.200z"></path>',soon=True)}
{tab('ฉัน','<circle cx="12" cy="8.500" r="4"></circle><path d="M4.500 20.500a7.500 7.500 0 0 1 15 0"></path>')}
</nav>
<sc-if value="{{{{toast}}}}" hint-placeholder-val="{{{{false}}}}"><div class="card0" role="status" aria-live="polite" style="position: absolute; left: 24px; right: 24px; top: 104px; padding: 12px 16px; border-radius: 18px; background: #24212B; color: #FFFFFF; font-size: 15px; font-weight: 600; line-height: 1.45; text-align: center; z-index: 950">หน้าชุมชนยังไม่เปิด เร็วๆ นี้จะได้แชร์เมนูกัน</div></sc-if>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"motion":{{"editor":"boolean","default":true}},"$preview":{{"width":390,"height":844}}}}'>
class Component extends DCLogic {{
  constructor(props) {{
    super(props);
    this.state = {{ beat: 0, cheer: {{}}, who: 'elephant', line: 0, n: 0 }};
  }}
  componentDidMount() {{
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ((this.props.motion ?? true) && !reduce) this.iv = setInterval(() => this.setState({{ beat: this.state.beat + 1 }}), 2600);
  }}
  componentWillUnmount() {{ clearInterval(this.iv); clearTimeout(this.tt); }}
  renderVals() {{
    const s = this.state;
    const info = {{
      elephant: {{ name: 'เชฟช้าง', color: '#C9D0F7', cta: 'ทำเลย', lines: ['ยินดีต้อนรับ! วันนี้ทำกะเพราหมูสับไข่ดาวกันไหม?', 'ใช้เวลา 15 นาที เดี๋ยวพาเดินเข้าครัวทำทีละขั้น', 'ดูสูตรก่อนก็ได้ ว่ามีวัตถุดิบครบไหม'] }},
      cat: {{ name: 'นักชิมเจี๊ยบ', color: '#F6D9C2', cta: 'ดูอันดับ', lines: ['สัปดาห์นี้กะเพราหมูสับมาแรงสุด!', 'ชิมมาแล้ว ต้มยำกุ้งอร่อยจริง', 'ทำเสร็จแล้วอย่าลืมมาให้คะแนนนะ'] }},
      capybara: {{ name: 'คาปิบาระ', color: '#F6E0A6', cta: 'ดูราคา', lines: ['วันนี้ผักบุ้งกำละ 15 บาท ถูกลงนะ', 'ไข่ไก่แผงละ 135 บาท', 'ไปตลาดมาให้แล้ว ของสดทุกอย่างเลย'] }},
      frog: {{ name: 'โค้ชกบ', color: '#D3EDB5', cta: 'ดูแคลอรี่', lines: ['วันนี้กินอะไรไปบ้าง มาบันทึกกัน', 'มื้อนี้โปรตีนกำลังดีเลย', 'ดื่มน้ำด้วยนะ!'] }},
    }};
    const out = {{}};
    const P = this.prof(), last = P.last;
    out.hud = {{ lv: 'เลเวล ' + P.level, title: P.level >= 4 ? 'เชฟมือใหม่' : 'เชฟฝึกหัด', streak: (7 + (P.runs.length ? 1 : 0)) + ' วัน' }};
    if (last) {{
      info.cat.lines = ['รอบล่าสุดให้ ' + last.name + ' ' + last.score.toFixed(1) + ' ดาว ' + (last.score >= 4.5 ? 'อร่อยมาก!' : 'ครั้งหน้าเอาใหม่นะ')].concat(info.cat.lines.slice(0, 2));
      info.elephant.lines = ['วันนี้ทำ' + last.name + 'ไปแล้ว เก่งมาก ลองอีกเมนูไหม?'].concat(info.elephant.lines.slice(1));
      info.frog.lines = ['บันทึก' + last.name + ' ราว ' + last.kcal + ' แคลให้แล้วนะ'].concat(info.frog.lines.slice(1));
    }}
    const B = '/_blob/', beat = s.beat;
    // every mascot stays at its own station and loops through a small piece of work
    const post = {{
      elephant: {{ x: 276, y: 138, s: 1, z: 40, face: -1, work: 'w-stir', off: 0, moods: ['calm', 'sing', 'calm', 'calm'] }},
      frog: {{ x: 24, y: 336, s: 0.92, z: 577, face: 1, work: 'w-point', off: 1, moods: ['wow', 'calm', 'calm', 'calm'] }},
      cat: {{ x: 268, y: 352, s: 1.1, z: 588, face: -1, work: 'w-taste', off: 2, moods: ['calm', 'wow', 'love', 'calm'] }},
      capybara: {{ x: 118, y: 478, s: 1.2, z: 717, face: 1, work: 'w-place', off: 3, moods: ['calm', 'calm', 'calm', 'calm'] }},
    }};
    Object.keys(post).forEach((k) => {{
      const p = post[k], ph = (beat + p.off) % 4;
      const mood = s.cheer[k] === beat ? 'happy' : p.moods[ph];
      const pose = k === 'cat' ? (ph === 1 ? ' p-eat' : ph === 2 ? ' p-rest' : '') : '';
      out[k] = {{
        x: p.x, y: p.y, dur: 0, z: p.z, s: p.s, face: p.face,
        cls: 'bot ' + p.work + pose + ' mood-' + mood + (k === 'cat' || s.cheer[k] !== beat ? ' steady' : ''),
        tap: () => this.setState({{ who: k, line: s.who === k ? s.line + 1 : 0, n: s.n + 1, cheer: Object.assign({{}}, s.cheer, {{ [k]: beat }}) }}),
      }};
    }});
    const weigh = [['c6263c9b14efb6319b8350ce20511359', 'ไข่ 1 ฟอง ราว 80 แคล'], ['86fdb695be776bfd7914cdfa1c29ed25', 'หมูสับ 120 ก. ราว 300 แคล'], ['5658e513ce137923d2aca173599a06ac', 'ข้าว 1 จาน ราว 260 แคล']][Math.floor((beat + 1) / 4) % 3];
    out.frog.img = B + weigh[0]; out.frog.read = weigh[1];
    const taste = [['6c2552b0403b97e680de31c0a2deaa28', '4.8'], ['841f9e64f4da943f588bffe8f5e331c1', '4.6'], ['57d72c67af1ee4e1b933a4afefac4e80', '4.7']][Math.floor((beat + 2) / 4) % 3];
    out.cat.dish = B + taste[0]; out.cat.score = taste[1]; out.cat.scored = (beat + 2) % 4 >= 2;
    // capybara: unloads at the crates, walks off to the market, and comes back with a full basket
    const trip = beat % 8, leaving = trip === 4, gone = trip === 5, back = trip === 6;
    const stock = [['78d54072a7ea0047ddab68f6e27714f4', 'ผักบุ้ง กำละ ฿15'], ['88051bbf2bf5bf095b12be008a28cda8', 'พริกขี้หนู ขีดละ ฿12'], ['c6263c9b14efb6319b8350ce20511359', 'ไข่ไก่ แผงละ ฿135']][Math.floor((beat + 2) / 8) % 3];
    Object.assign(out.capybara, {{
      x: leaving || gone ? -130 : 118, dur: leaving || back ? 2.4 : 0, face: leaving ? -1 : 1,
      cls: 'bot ' + (leaving || back ? 'walking' : 'w-place') + ' mood-' + (s.cheer.capybara === beat ? 'happy' : 'calm') + (s.cheer.capybara === beat || leaving || back ? '' : ' steady'),
      home: !(leaving || gone || back), img: B + stock[0], tag: stock[1],
    }});
    const t = info[s.who];
    out.talk = {{ name: t.name, color: t.color, cta: t.cta, line: t.lines[s.line % t.lines.length], next: () => this.setState({{ line: s.line + 1, n: s.n + 1 }}) }};
    Object.assign(out, {{ soonTap: () => {{ this.setState({{ toast: true }}); clearTimeout(this.tt); this.tt = setTimeout(() => this.setState({{ toast: false }}), 3000); }}, toast: !!s.toast, }});
    out.cardClass = s.n % 2 ? 'card1' : 'card0';
    out.motionClass = (this.props.motion ?? true) ? '' : 'still';
    return out;
  }}
}}
</script>
</body>
</html>
'''
open('../screens/Restaurant.dc.html','w',encoding='utf-8').write(html)
print(len(html))
