import sys, json; sys.path.insert(0,'.')
from bots import svg
ROOT='../screens/'
CSS=open('page.py',encoding='utf-8').read().split("css='''")[1].split("'''")[0]
CSS+='''button:focus-visible,a:focus-visible{outline:3px solid #3B2A22;outline-offset:2px}
a.btn{text-decoration:none}
.num{font-variant-numeric:tabular-nums}
@keyframes screenIn{from{opacity:0;transform:translateY(12px)}}
.screen{animation:screenIn .28s ease-out both}
'''
def ic(d,col='#3B2A22',s=24): return f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="{col}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{d}</svg>'
BACK=ic('<path d="M15 5l-7 7 7 7"></path>'); CLOSE=ic('<path d="M6 6l12 12M18 6L6 18"></path>')
MINUS=ic('<path d="M6 12h12"></path>'); PLUS=ic('<path d="M12 6v12M6 12h12"></path>')
CHECK=ic('<path d="M5 12.500l4.500 4.500L19 7.500"></path>','#FFFFFF',18)
STAR='<svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.800l2.800 5.900 6.400.800-4.700 4.400 1.200 6.300L12 17.100l-5.700 3.100 1.200-6.300L2.800 9.500l6.400-.800z" fill="{{star.fill}}" stroke="#B8862B" stroke-width="1.4" stroke-linejoin="round"></path></svg>'
def chip(t): return f'<span style="display: inline-flex; align-items: center; height: 30px; padding: 0 12px; border-radius: 999px; background: #FFF8EC; font-size: 14px; font-weight: 600">{t}</span>'
def mascot(k,cls,left,top,scale): return f'<div class="{cls}" style="position: absolute; left: {left}px; top: {top}px; width: 96px; height: 139px; transform: scale({scale}); transform-origin: 50% 100%"><div class="emote" aria-hidden="true"><svg class="em em-heart" width="22" height="22" viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" fill="#F2687E"></path></svg></div><span class="hopper" style="display: block">{svg(k)}</span></div>'
P='#C2512E'
html=f'''<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<title>ทำอาหารทีละขั้น โหมดทำจริง</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mali:wght@500;600;700&amp;family=IBM+Plex+Sans+Thai+Looped:wght@400;500;600;700&amp;display=swap">
<style>{CSS}</style>
</helmet>
<div style="position: relative; width: 390px; height: 844px; overflow: hidden; background: #FFF8EC; font-family: 'IBM Plex Sans Thai Looped', sans-serif; color: #3B2A22">

<sc-if value="{{{{isRecipe}}}}" hint-placeholder-val="{{{{true}}}}">
<div class="screen" style="position: absolute; inset: 0; background: #C9D0F7">
<div style="position: absolute; top: 50px; left: 12px; right: 12px; display: flex; align-items: center; gap: 10px">
<a class="press btn" href="Restaurant.dc.html" aria-label="กลับหน้าร้าน" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 999px; background: #FFF8EC">{BACK}</a>
<span class="mali" style="flex: 1 1 auto; font-weight: 700; font-size: 16px">สูตรของเชฟช้าง</span>
<sc-if value="{{{{canResume}}}}" hint-placeholder-val="{{{{false}}}}"><button class="press mali" onClick="{{{{restart}}}}" style="height: 44px; padding: 0 14px; border: 0; border-radius: 999px; background: #FFF8EC; color: #3B2A22; font-size: 15px; font-weight: 700; cursor: pointer">เริ่มใหม่</button></sc-if>
</div>
<div style="position: absolute; left: 20px; top: 118px; width: 250px; display: flex; flex-direction: column; gap: 12px">
<h1 class="mali" style="margin: 0; font-size: 23px; line-height: 1.3; font-weight: 700; white-space: nowrap">{{{{dishName}}}}</h1>
<div style="display: flex; flex-wrap: wrap; gap: 6px">{chip('{{minsText}}')}{chip('ง่าย')}{chip('{{kcalShort}}')}</div>
</div>
{mascot('elephant','bot mood-wave',268,88,1.15)}
<div style="position: absolute; left: 0; right: 0; top: 248px; bottom: 0; overflow: hidden; background: #FFF8EC; border-radius: 28px 28px 0 0">
<div style="position: absolute; inset: 0; overflow-y: auto; box-sizing: border-box; padding: 18px 16px 112px; display: flex; flex-direction: column; gap: 10px">
<p style="flex: 0 0 auto; margin: 0; padding: 10px 12px; border-radius: 16px; background: #24212B; color: #FFFFFF; font-size: 15px; line-height: 1.5"><span class="mali" style="font-weight: 700">โหมดทำจริง</span> วางมือถือไว้ข้างเตา ทำของจริงตามทีละขั้น เสร็จแต่ละอย่างแล้วแตะในภาพเพื่อเช็ก</p>
<div role="group" aria-label="เมนูที่จะทำ" style="flex: 0 0 auto; display: flex; gap: 6px">
<sc-for list="{{{{menus}}}}" as="o" hint-placeholder-count="2"><button class="press mali" onClick="{{{{o.pick}}}}" aria-pressed="{{{{o.on}}}}" style="flex: 1 1 0; min-width: 0; height: 48px; padding: 0 4px; border: 0; border-radius: 16px; background: {{{{o.bg}}}}; color: {{{{o.fg}}}}; font-size: 15px; font-weight: 700; cursor: pointer">{{{{o.label}}}}</button></sc-for>
</div>
<h2 class="mali" style="flex: 0 0 auto; margin: 4px 0 0; font-size: 20px; font-weight: 700">เลือกสูตรที่อยากกิน</h2>
<div role="group" aria-label="ตัวเลือกสูตรข้อแรก" style="flex: 0 0 auto; display: flex; flex-direction: column; gap: 6px">
<span style="font-size: 14px; font-weight: 700; color: #4F4A5C">{{{{g1Title}}}}</span>
<div style="display: flex; gap: 6px">
<sc-for list="{{{{spices}}}}" as="o" hint-placeholder-count="3"><button class="press mali" onClick="{{{{o.pick}}}}" aria-pressed="{{{{o.on}}}}" style="flex: 1 1 0; min-width: 0; height: 48px; padding: 0 4px; border: 0; border-radius: 16px; background: {{{{o.bg}}}}; color: {{{{o.fg}}}}; font-size: 15px; font-weight: 700; cursor: pointer">{{{{o.label}}}}</button></sc-for>
</div>
<p aria-live="polite" style="margin: 0; padding: 8px 12px; border-radius: 14px; background: #FFF3B0; font-size: 15px; line-height: 1.5">{{{{spiceNote}}}}</p>
</div>
<div role="group" aria-label="ตัวเลือกสูตรข้อสอง" style="flex: 0 0 auto; display: flex; flex-direction: column; gap: 6px">
<span style="font-size: 14px; font-weight: 700; color: #4F4A5C">{{{{g2Title}}}}</span>
<div style="display: flex; gap: 6px">
<sc-for list="{{{{styles}}}}" as="o" hint-placeholder-count="3"><button class="press mali" onClick="{{{{o.pick}}}}" aria-pressed="{{{{o.on}}}}" style="flex: 1 1 0; min-width: 0; height: 48px; padding: 0 4px; border: 0; border-radius: 16px; background: {{{{o.bg}}}}; color: {{{{o.fg}}}}; font-size: 15px; font-weight: 700; cursor: pointer">{{{{o.label}}}}</button></sc-for>
</div>
<p aria-live="polite" style="margin: 0; padding: 8px 12px; border-radius: 14px; background: #FFF3B0; font-size: 15px; line-height: 1.5">{{{{styleNote}}}}</p>
</div>
<div role="group" aria-label="ให้เชฟ AI ปรับสูตร" style="flex: 0 0 auto; display: flex; flex-direction: column; gap: 6px">
<span style="font-size: 14px; font-weight: 700; color: #4F4A5C">ให้เชฟ AI ปรับสูตร</span>
<div style="display: flex; flex-wrap: wrap; gap: 6px">
<sc-for list="{{{{adapts}}}}" as="o" hint-placeholder-count="3"><button class="press mali" onClick="{{{{o.pick}}}}" aria-pressed="{{{{o.on}}}}" style="height: 44px; padding: 0 16px; border: 0; border-radius: 999px; background: {{{{o.bg}}}}; color: {{{{o.fg}}}}; font-size: 15px; font-weight: 700; cursor: pointer">{{{{o.label}}}}</button></sc-for>
</div>
<sc-if value="{{{{hasAdapt}}}}" hint-placeholder-val="{{{{false}}}}"><div aria-live="polite" style="padding: 8px 12px; display: flex; flex-direction: column; gap: 4px; border-radius: 14px; background: #E9E6FF"><span class="mali" style="font-size: 14px; font-weight: 700">เชฟ AI ปรับให้แล้ว</span><sc-for list="{{{{adaptNotes}}}}" as="n" hint-placeholder-count="1"><p style="margin: 0; font-size: 15px; line-height: 1.5">{{{{n.text}}}}</p></sc-for></div></sc-if>
<span style="font-size: 13px; line-height: 1.45; color: #4F4A5C">เป็นชุดปรับสูตรยอดนิยมที่เตรียมไว้ล่วงหน้า แอปจริงจะพิมพ์บอกเชฟเองได้ด้วย</span>
</div>
<div style="flex: 0 0 auto; margin-top: 6px; display: flex; align-items: center; justify-content: space-between; gap: 12px">
<h2 class="mali" style="margin: 0; font-size: 20px; font-weight: 700">วัตถุดิบ</h2>
<div style="display: flex; align-items: center; gap: 6px; padding: 0 2px; background: #FFE3A3; border-radius: 999px">
<button class="press" onClick="{{{{less}}}}" aria-label="ลดจำนวนจาน" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 999px; background: transparent; cursor: pointer">{MINUS}</button>
<span class="mali num" style="min-width: 54px; text-align: center; font-weight: 700; font-size: 16px">{{{{serv}}}} จาน</span>
<button class="press" onClick="{{{{more}}}}" aria-label="เพิ่มจำนวนจาน" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 999px; background: transparent; cursor: pointer">{PLUS}</button>
</div>
</div>
<p style="flex: 0 0 auto; margin: 0; font-size: 14px; line-height: 1.5; color: #4F4A5C">ใต้ชื่อบอกเหตุผลว่าทำไมใช้เท่านี้ แตะของที่มีอยู่แล้ว จะไม่ถูกนับในราคา</p>
<div style="flex: 0 0 auto; display: flex; flex-direction: column; gap: 8px">
<sc-for list="{{{{items}}}}" as="item" hint-placeholder-count="6">
<button class="press" onClick="{{{{item.toggle}}}}" aria-pressed="{{{{item.have}}}}" style="display: flex; align-items: center; gap: 10px; width: 100%; min-height: 60px; box-sizing: border-box; padding: 8px 14px 8px 12px; border: 0; border-radius: 18px; background: #FFFFFF; text-align: left; cursor: pointer">
<span style="flex: 0 0 auto; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 10px; background: {{{{item.boxBg}}}}"><sc-if value="{{{{item.have}}}}" hint-placeholder-val="{{{{false}}}}">{CHECK}</sc-if></span>
<img src="{{{{item.img}}}}" alt="" width="44" height="44" style="flex: 0 0 auto; display: block">
<span style="flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column">
<span style="font-size: 16px; font-weight: 600; line-height: 1.4">{{{{item.name}}}}</span>
<span class="num" style="font-size: 14px; font-weight: 600; line-height: 1.4; color: #4F4A5C">{{{{item.qtyText}}}}</span>
<span style="font-size: 14px; line-height: 1.45; color: #4F4A5C">{{{{item.why}}}}</span>
</span>
<span class="num" style="flex: 0 0 auto; font-size: 16px; font-weight: 700; color: {{{{item.priceColor}}}}">{{{{item.priceText}}}}</span>
</button>
</sc-for>
</div>
</div>
</div>
<div style="position: absolute; left: 12px; right: 12px; bottom: 16px; height: 72px; box-sizing: border-box; padding: 0 8px 0 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: #FFE3A3; border-radius: 26px">
<div style="display: flex; flex-direction: column">
<span style="font-size: 14px; color: #7A5C48">ต้องซื้อเพิ่ม (ราคาตัวอย่าง)</span>
<span class="mali num" style="font-size: 22px; font-weight: 700; line-height: 1.2">{{{{totalText}}}}</span>
</div>
<button class="press mali" onClick="{{{{start}}}}" style="flex: 0 0 auto; height: 56px; padding: 0 26px; border: 0; border-radius: 20px; background: {P}; color: #FFFFFF; font-weight: 700; font-size: 18px; cursor: pointer">{{{{startLabel}}}}</button>
</div>
</div>
</sc-if>

<sc-if value="{{{{isCook}}}}" hint-placeholder-val="{{{{false}}}}">
<div class="screen" style="position: absolute; inset: 0; background: #FFE3A3">
<div style="position: absolute; top: 50px; left: 12px; right: 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px">
<button class="press" onClick="{{{{toRecipe}}}}" aria-label="ออกจากการทำอาหาร กลับไปดูวัตถุดิบ" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 999px; background: #FFF8EC; cursor: pointer">{CLOSE}</button>
<span class="mali num" style="font-weight: 700; font-size: 16px">ขั้นที่ {{{{stepNo}}}} จาก {{{{stepCount}}}}</span>
<span style="width: 44px; height: 44px"></span>
</div>
<div aria-hidden="true" style="position: absolute; top: 106px; left: 16px; right: 16px; display: flex; gap: 6px">
<sc-for list="{{{{bars}}}}" as="bar" hint-placeholder-count="6"><span style="flex: 1 1 0; height: 8px; border-radius: 999px; background: {{{{bar.bg}}}}"></span></sc-for>
</div>
{mascot('elephant','{{chefCls}}',34,160,1.3)}
<div style="position: absolute; left: 168px; top: 150px; width: 204px; box-sizing: border-box; padding: 12px 14px; background: #FFF8EC; border-radius: 20px 20px 20px 6px">
<span class="mali" style="display: block; font-size: 14px; font-weight: 700; color: #7A5C48">เชฟช้างบอกว่า</span>
<p class="mali" style="margin: 2px 0 0; font-size: 16px; font-weight: 600; line-height: 1.45">{{{{tip}}}}</p>
</div>
<div style="position: absolute; left: 12px; right: 12px; top: 322px; bottom: 96px; box-sizing: border-box; padding: 20px; display: flex; flex-direction: column; gap: 10px; background: #FFF8EC; border-radius: 28px">
<h2 class="mali" style="margin: 0; font-size: 24px; font-weight: 700; line-height: 1.3">{{{{stepTitle}}}}</h2>
<p style="margin: 0; font-size: 17px; line-height: 1.65">{{{{stepBody}}}}</p>
<sc-if value="{{{{hasTimer}}}}" hint-placeholder-val="{{{{false}}}}">
<div style="margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 10px 10px 18px; background: #FFFFFF; border-radius: 22px">
<div style="display: flex; flex-direction: column">
<span class="mali num" style="font-size: 30px; font-weight: 700; line-height: 1.15">{{{{timeText}}}}</span>
<span aria-live="polite" style="font-size: 14px; color: #7A5C48">{{{{timerNote}}}}</span>
</div>
<button class="press mali" onClick="{{{{toggleTimer}}}}" style="flex: 0 0 auto; height: 48px; padding: 0 18px; border: 0; border-radius: 18px; background: #3B2A22; color: #FFFFFF; font-weight: 700; font-size: 16px; cursor: pointer">{{{{timerBtn}}}}</button>
</div>
</sc-if>
</div>
<div style="position: absolute; left: 12px; right: 12px; bottom: 16px; display: flex; gap: 10px">
<button class="press mali" onClick="{{{{prev}}}}" style="flex: 0 0 118px; height: 56px; padding: 0; border: 0; border-radius: 20px; background: #FFF8EC; color: #3B2A22; font-weight: 700; font-size: 17px; cursor: pointer">ย้อนกลับ</button>
<button class="press mali" onClick="{{{{next}}}}" style="flex: 1 1 auto; height: 56px; padding: 0; border: 0; border-radius: 20px; background: {P}; color: #FFFFFF; font-weight: 700; font-size: 18px; cursor: pointer">{{{{nextLabel}}}}</button>
</div>
</div>
</sc-if>

<sc-if value="{{{{isDone}}}}" hint-placeholder-val="{{{{false}}}}">
<div class="screen" style="position: absolute; inset: 0; background: #D3EDB5">
<div style="position: absolute; top: 54px; left: 20px; right: 20px; display: flex; flex-direction: column; align-items: center; gap: 2px; text-align: center">
<h1 class="mali" style="margin: 0; font-size: 26px; font-weight: 700; line-height: 1.25">เสร็จแล้ว เก่งมาก!</h1>
<p class="num" style="margin: 0; font-size: 15px; line-height: 1.5">{{{{dishName}}}} · {{{{choiceText}}}}</p>
<p class="num" style="margin: 0; font-size: 14px; line-height: 1.5; color: #2F4A36">{{{{minsText}}}} · ซื้อของ {{{{totalText}}}} · {{{{kcalText}}}}</p>
</div>
{mascot('elephant','bot mood-happy',18,124,1)}
{mascot('cat','{{catCls}}',276,124,1)}
<img class="pop" src="{{{{dishImg}}}}" alt="{{{{dishAlt}}}}" width="120" height="120" style="position: absolute; left: 135px; top: 146px; display: block">
<div style="position: absolute; top: 276px; left: 12px; right: 12px; bottom: 84px; display: flex; flex-direction: column; gap: 10px">
<sc-if value="{{{{notTasted}}}}" hint-placeholder-val="{{{{true}}}}">
<div style="flex: 0 0 auto; box-sizing: border-box; padding: 16px; display: flex; flex-direction: column; gap: 10px; background: #FFF8EC; border-radius: 26px">
<h2 class="mali" style="margin: 0; font-size: 19px; font-weight: 700; line-height: 1.3">นักชิมเจี๊ยบขอชิมหน่อย</h2>
<p style="margin: 0; font-size: 15px; line-height: 1.5">เจี๊ยบชิมผ่านจอไม่ได้ เลยจะถามคุณ 3 ข้อ ตามทักษะนักชิม แล้วให้คะแนนพร้อมคำแนะนำ</p>
<div style="display: flex; gap: 6px">
<span style="flex: 1 1 0; display: flex; flex-direction: column; align-items: center; padding: 8px 2px; border-radius: 16px; background: #F5F3FC"><span class="mali" style="font-size: 16px; font-weight: 700">ลิ้น</span><span style="font-size: 13px; font-weight: 600; color: #4F4A5C">แยกรสชาติ</span></span>
<span style="flex: 1 1 0; display: flex; flex-direction: column; align-items: center; padding: 8px 2px; border-radius: 16px; background: #F5F3FC"><span class="mali" style="font-size: 16px; font-weight: 700">จมูก</span><span style="font-size: 13px; font-weight: 600; color: #4F4A5C">จับกลิ่นกระทะ</span></span>
<span style="flex: 1 1 0; display: flex; flex-direction: column; align-items: center; padding: 8px 2px; border-radius: 16px; background: #F5F3FC"><span class="mali" style="font-size: 16px; font-weight: 700">ตา</span><span style="font-size: 13px; font-weight: 600; color: #4F4A5C">ดูสีและหน้าตา</span></span>
</div>
<button class="press mali" onClick="{{{{taste}}}}" style="height: 54px; padding: 0; border: 0; border-radius: 20px; background: #24212B; color: #FFFFFF; font-size: 18px; font-weight: 700; cursor: pointer">ยกจานให้ชิม</button>
</div>
</sc-if>
<sc-if value="{{{{asked}}}}" hint-placeholder-val="{{{{false}}}}">
<div class="screen" style="flex: 0 0 auto; box-sizing: border-box; padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 8px; background: #FFF8EC; border-radius: 26px">
<h2 class="mali" style="margin: 0; font-size: 18px; font-weight: 700; line-height: 1.3">ชิมจานจริงแล้วบอกเจี๊ยบหน่อย</h2>
<sc-for list="{{{{qs}}}}" as="q" hint-placeholder-count="3">
<div role="group" aria-label="{{{{q.label}}}}" style="display: flex; flex-direction: column; gap: 4px">
<span style="font-size: 14px; font-weight: 700; color: #4F4A5C">{{{{q.label}}}}</span>
<div style="display: flex; gap: 6px">
<sc-for list="{{{{q.opts}}}}" as="o" hint-placeholder-count="3"><button class="press mali" onClick="{{{{o.pick}}}}" aria-pressed="{{{{o.on}}}}" style="flex: 1 1 0; min-width: 0; height: 46px; padding: 0 2px; border: 0; border-radius: 14px; background: {{{{o.bg}}}}; color: {{{{o.fg}}}}; font-size: 14px; font-weight: 700; line-height: 1.2; cursor: pointer">{{{{o.label}}}}</button></sc-for>
</div>
</div>
</sc-for>
<button class="press mali" onClick="{{{{judge}}}}" disabled="{{{{cantJudge}}}}" style="margin-top: 4px; height: 54px; padding: 0; border: 0; border-radius: 20px; background: #24212B; color: #FFFFFF; font-size: 18px; font-weight: 700; opacity: {{{{judgeOp}}}}; cursor: pointer">ให้เจี๊ยบให้คะแนน</button>
</div>
</sc-if>
<sc-if value="{{{{tasted}}}}" hint-placeholder-val="{{{{false}}}}">
<div class="screen" aria-live="polite" style="flex: 0 0 auto; box-sizing: border-box; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; background: #FFF8EC; border-radius: 26px">
<div style="display: flex; align-items: center; justify-content: space-between; gap: 10px">
<div style="display: flex; flex-direction: column; min-width: 0"><h2 class="mali" style="margin: 0; font-size: 17px; font-weight: 700; line-height: 1.3">นักชิมเจี๊ยบให้คะแนน</h2><span style="font-size: 14px; line-height: 1.4">{{{{verdict}}}}</span></div>
<div style="flex: 0 0 auto; display: flex; align-items: baseline; gap: 4px"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" style="align-self: center"><path d="M12 2.800l2.800 5.900 6.400.800-4.700 4.400 1.200 6.300L12 17.100l-5.700 3.100 1.200-6.300L2.800 9.500l6.400-.800z" fill="#FFC93D" stroke="#24212B" stroke-width="1.600" stroke-linejoin="round"></path></svg><span class="mali num" style="font-size: 34px; font-weight: 700; line-height: 1">{{{{scoreText}}}}</span><span class="num" style="font-size: 14px; font-weight: 600; color: #4F4A5C">เต็ม 5</span></div>
</div>
<sc-for list="{{{{rows}}}}" as="r" hint-placeholder-count="3">
<div style="display: flex; flex-direction: column; gap: 3px">
<div style="display: flex; align-items: baseline; justify-content: space-between; gap: 8px"><span style="font-size: 15px; font-weight: 700">{{{{r.sense}}}} · {{{{r.label}}}}</span><span class="mali num" style="font-size: 15px; font-weight: 700">{{{{r.score}}}}</span></div>
<div aria-hidden="true" style="height: 8px; border-radius: 999px; background: #ECE8F6; overflow: hidden"><div style="width: {{{{r.pct}}}}; height: 8px; border-radius: 999px; background: #FFC93D"></div></div>
<span style="font-size: 14px; line-height: 1.4; color: #4F4A5C">{{{{r.say}}}}</span>
</div>
</sc-for>
<p style="margin: 2px 0 0; padding: 8px 12px; border-radius: 14px; background: #FFF3B0; font-size: 14px; font-weight: 600; line-height: 1.45">{{{{tipNext}}}}</p>
<span style="font-size: 13px; line-height: 1.4; color: #4F4A5C">คะแนนมาจากผลจริงที่คุณบอก หักตามขั้นที่ข้ามหรือพลาดระหว่างทำ</span>
</div>
</sc-if>
<div style="flex: 0 0 auto; box-sizing: border-box; padding: 12px 16px; display: flex; flex-direction: column; gap: 6px; background: #FFF8EC; border-radius: 22px">
<div style="display: flex; align-items: baseline; justify-content: space-between; gap: 8px"><span class="mali num" style="font-size: 16px; font-weight: 700">{{{{xpTitle}}}}</span><span class="num" style="flex: 0 0 auto; font-size: 14px; font-weight: 600; color: #4F4A5C">{{{{xpLeft}}}}</span></div>
<div role="img" aria-label="{{{{xpAria}}}}" style="height: 10px; border-radius: 999px; background: #ECE8F6; overflow: hidden"><div style="width: {{{{xpPct}}}}; height: 10px; border-radius: 999px; background: #7B6CF6"></div></div>
</div>
</div>
<div style="position: absolute; left: 12px; right: 12px; bottom: 16px; display: flex; gap: 10px">
<button class="press mali" onClick="{{{{again}}}}" style="flex: 1 1 0; height: 56px; padding: 0; border: 0; border-radius: 20px; background: #FFF8EC; color: #3B2A22; font-weight: 700; font-size: 17px; cursor: pointer">ทำอีกรอบ</button>
<a class="press btn mali" href="Restaurant.dc.html" style="flex: 1.300 1 0; display: flex; align-items: center; justify-content: center; height: 56px; border-radius: 20px; background: #C2512E; color: #FFFFFF; font-weight: 700; font-size: 18px">กลับหน้าร้าน</a>
</div>
</div>
</sc-if>

</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":390,"height":844}}}}'>
class Component extends DCLogic {{
  constructor(props) {{
    super(props);
    this.state = {{ screen: 'recipe', serv: 1, have: {{}}, step: 0, left: 0, running: false, rang: false, stars: 0 }};
  }}
  componentWillUnmount() {{ clearInterval(this.tick); }}
  steps() {{
    return [
      {{ t: 'เตรียมของ', b: 'สับหรือโขลกกระเทียมกับพริกขี้หนูแบบหยาบๆ เด็ดใบกะเพรา ล้างแล้วสะบัดน้ำให้หมาด วางของทุกอย่างไว้ใกล้เตา', tip: 'อย่าสับละเอียดเกินไป จะไหม้ง่าย', mood: 'wave' }},
      {{ t: 'ทอดไข่ดาว', b: 'ตั้งกระทะไฟกลางค่อนแรง ใส่น้ำมัน พอน้ำมันร้อนตอกไข่ลงไป ทอดจนขอบกรอบเหลือง แล้วตักพักไว้', tip: 'ชอบไข่แดงสุก ให้ตักน้ำมันราดไข่แดง', secs: 120, mood: 'sing' }},
      {{ t: 'ผัดกระเทียมกับพริก', b: 'ใช้น้ำมันที่เหลือในกระทะ ใส่กระเทียมกับพริกลงไป ผัดเร็วๆ จนหอมและกระเทียมเริ่มเหลือง', tip: 'ควันจะฉุนจมูก เปิดพัดลมดูดควันก่อนนะ', secs: 20, mood: 'wow' }},
      {{ t: 'ใส่หมูสับ', b: 'เร่งไฟแรง ใส่หมูสับ ใช้ตะหลิวกดยีให้หมูแตกเป็นก้อนเล็ก ผัดจนสุกทั่ว ไม่เหลือสีชมพู', tip: 'อย่าคนบ่อย ปล่อยให้หมูโดนกระทะจะหอม', secs: 120, mood: 'calm' }},
      {{ t: 'ปรุงรส', b: 'ใส่ซอสหอยนางรม ซีอิ๊วขาว น้ำปลา และน้ำตาล เติมน้ำเปล่า 1 ถึง 2 ช้อนโต๊ะ ผัดให้เข้ากัน แล้วชิมดู', tip: 'เค็มไปเติมน้ำ จืดไปเติมน้ำปลาทีละนิด', mood: 'calm' }},
      {{ t: 'ใส่กะเพราแล้วจัดจาน', b: 'ปิดไฟ ใส่ใบกะเพรา ผัดเร็วๆ พอใบสลด ตักราดบนข้าวสวย แล้ววางไข่ดาวไว้ด้านบน', tip: 'ใส่กะเพราตอนปิดไฟ ใบจะเขียวและหอม', mood: 'happy' }},
    ];
  }}
  goStep(i) {{
    clearInterval(this.tick);
    this.setState({{ screen: 'cook', step: i, left: this.steps()[i].secs || 0, running: false, rang: false }});
  }}
  toggleTimer() {{
    if (this.state.running) {{ clearInterval(this.tick); this.setState({{ running: false }}); return; }}
    const secs = this.steps()[this.state.step].secs || 0;
    this.setState({{ left: this.state.left > 0 ? this.state.left : secs, running: true, rang: false }});
    clearInterval(this.tick);
    this.tick = setInterval(() => {{
      const l = this.state.left - 1;
      if (l <= 0) {{ clearInterval(this.tick); this.setState({{ left: 0, running: false, rang: true }}); }}
      else this.setState({{ left: l }});
    }}, 1000);
  }}
  renderVals() {{
    const s = this.state;
    const base = [
      {{ id: 'pork', name: 'หมูสับ', q: 120, u: 'กรัม', p: 22 }},
      {{ id: 'basil', name: 'ใบกะเพรา', q: 1, u: 'กำมือ', p: 5 }},
      {{ id: 'garlic', name: 'กระเทียม', q: 4, u: 'กลีบ', p: 2 }},
      {{ id: 'chili', name: 'พริกขี้หนู', q: 4, u: 'เม็ด', p: 2 }},
      {{ id: 'egg', name: 'ไข่ไก่', q: 1, u: 'ฟอง', p: 5 }},
      {{ id: 'rice', name: 'ข้าวสวย', q: 1, u: 'จาน', p: 7 }},
      {{ id: 'oil', name: 'น้ำมันพืช', q: 2, u: 'ช้อนโต๊ะ', p: 2 }},
      {{ id: 'oyster', name: 'ซอสหอยนางรม', q: 1, u: 'ช้อนโต๊ะ', p: 2 }},
      {{ id: 'soy', name: 'ซีอิ๊วขาว', q: 1, u: 'ช้อนชา', p: 1 }},
      {{ id: 'fish', name: 'น้ำปลา', q: 1, u: 'ช้อนชา', p: 1 }},
      {{ id: 'sugar', name: 'น้ำตาลทราย', q: 0.5, u: 'ช้อนชา', p: 1 }},
    ];
    const IMG = {{ pork: '/_blob/86fdb695be776bfd7914cdfa1c29ed25', egg: '/_blob/c6263c9b14efb6319b8350ce20511359', garlic: '/_blob/d6b929345fd698afe2cfc77cdb952825', chili: '/_blob/88051bbf2bf5bf095b12be008a28cda8', rice: '/_blob/5658e513ce137923d2aca173599a06ac', fish: '/_blob/05ce225d90694a189c0c4bbf2a952007', morning: '/_blob/78d54072a7ea0047ddab68f6e27714f4', chicken: '/_blob/767838a8b05cd8c28cb1ce6f3ecfaf85', basil: '/_blob/4083ec0fb9b6108174fd3446c825d9ae', oil: '/_blob/a10e54971cdb2b6586d6bb567274734e', oyster: '/_blob/1993ea62a5612c98d85cebbdb42ac759', soy: '/_blob/16b0afb00d2625eb9d959e40eb090198', sugar: '/_blob/42122d7213e3fd2b87ea71b26bad3f9f' }};
    const num = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
    let total = 0;
    const items = base.map((it) => {{
      const have = !!s.have[it.id];
      const price = it.p * s.serv;
      if (!have) total += price;
      return {{
        name: it.name, img: IMG[it.id], have, qtyText: num(it.q * s.serv) + ' ' + it.u,
        priceText: have ? 'มีแล้ว' : '฿' + price, priceColor: have ? '#4A7443' : '#3B2A22',
        boxBg: have ? '#5E8F57' : '#F6E6CF',
        toggle: () => this.setState({{ have: Object.assign({{}}, s.have, {{ [it.id]: !have }}) }}),
      }};
    }});
    const steps = this.steps();
    const st = steps[s.step];
    const last = s.step === steps.length - 1;
    const mm = Math.floor(s.left / 60), ss = s.left % 60;
    const notes = ['', 'ต้องฝึกอีกนิด ครั้งหน้าดีขึ้นแน่', 'พอกินได้ ลองปรับรสดูนะ', 'ใช้ได้เลย', 'อร่อยมาก', 'ระดับเชฟแล้ว! ได้ 40 แต้มประสบการณ์'];
    return {{
      isRecipe: s.screen === 'recipe', isCook: s.screen === 'cook', isDone: s.screen === 'done',
      serv: s.serv, items, totalText: '฿' + total,
      less: () => this.setState({{ serv: Math.max(1, s.serv - 1) }}),
      more: () => this.setState({{ serv: Math.min(4, s.serv + 1) }}),
      start: () => this.goStep(0),
      toRecipe: () => {{ clearInterval(this.tick); this.setState({{ screen: 'recipe', running: false }}); }},
      stepNo: s.step + 1, stepCount: steps.length,
      bars: steps.map((_, i) => ({{ bg: i <= s.step ? '#C2512E' : '#FFF8EC' }})),
      chefCls: 'bot mood-' + (s.rang ? 'happy' : st.mood),
      tip: st.tip, stepTitle: st.t, stepBody: st.b,
      hasTimer: !!st.secs,
      timeText: mm + ':' + (ss < 10 ? '0' : '') + ss,
      timerNote: s.rang ? 'ครบเวลาแล้ว ไปขั้นต่อไปได้เลย' : s.running ? 'กำลังจับเวลา' : 'เวลาโดยประมาณ ดูสีอาหารประกอบด้วย',
      timerBtn: s.running ? 'หยุด' : s.rang ? 'จับใหม่' : 'เริ่มจับเวลา',
      toggleTimer: () => this.toggleTimer(),
      prev: () => (s.step === 0 ? this.setState({{ screen: 'recipe' }}) : this.goStep(s.step - 1)),
      next: () => {{ if (last) {{ clearInterval(this.tick); this.setState({{ screen: 'done', running: false }}); }} else this.goStep(s.step + 1); }},
      nextLabel: last ? 'เสร็จแล้ว!' : 'ถัดไป',
      stars: [1, 2, 3, 4, 5].map((n) => ({{ on: n <= s.stars, fill: n <= s.stars ? '#F2C14E' : '#FFFFFF', label: 'ให้ ' + n + ' ดาว', pick: () => this.setState({{ stars: n }}) }})),
      rateNote: s.stars ? notes[s.stars] : 'แตะดาวเพื่อให้คะแนนเมนูนี้',
      again: () => this.setState({{ screen: 'recipe', step: 0, stars: 0, rang: false, running: false }}),
    }};
  }}
}}
</script>
</body>
</html>
'''
from cookstage4 import splice
html=splice(html,mascot,CLOSE)
open(ROOT+'Cook.dc.html','w',encoding='utf-8').write(html)
print(len(html), html.count('{{'), 'unfilled' if '{chefCls}' in html.replace('{{chefCls}}','') else 'ok')
