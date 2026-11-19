p='../screens/HomeAnimated.dc.html'
s=open(p,encoding='utf-8').read()
import re
def rep(a,b,count=1):
    global s
    assert a in s, a[:60]
    s=s.replace(a,b) if count==0 else s.replace(a,b,count)

# room
rep('<img src="/_blob/0808c9367c599ee94f24ff30c3b7ece5" alt="ห้องครัวสีพาสเทล ผนังม่วงอ่อน ตู้สีมิ้นต์ หน้าต่างบานโค้งมองเห็นต้นไม้" style="position: absolute; left: -52px;',
    '<img src="/_blob/cb16e629ff039d92b913042e1bcac80c" alt="ครัวกลางสวนในเรือนกระจก พื้นไม้ ต้นไม้ใบใหญ่" style="position: absolute; left: -86px;')
rep('background: #EAF4EC; font-family','background: #6B4A36; font-family')
rep('background: rgba(70,60,100,.22)','background: rgba(40,25,15,.3)',0)
# beams from top-left
rep('<span class="beam" style="left: 198px; top: 250px; width: 58px; height: 440px; transform: rotate(-16deg)"></span>',
    '<span class="beam" style="left: 30px; top: -20px; width: 70px; height: 520px; transform: rotate(-24deg)"></span>')
rep('<span class="beam" style="left: 258px; top: 238px; width: 34px; height: 400px; transform: rotate(-12deg); animation-delay: 1.8s"></span>',
    '<span class="beam" style="left: 120px; top: -20px; width: 40px; height: 460px; transform: rotate(-22deg); animation-delay: 1.8s"></span>')
# steam over the soup bowl
rep('<span class="steam" style="left: 2px; top: 236px; animation-delay: 0s"></span>\n<span class="steam" style="left: 10px; top: 232px; animation-delay: .9s"></span>\n<span class="steam" style="left: 18px; top: 238px; animation-delay: 1.8s"></span>',
    '<span class="steam" style="left: 362px; top: 322px; animation-delay: 0s"></span>\n<span class="steam" style="left: 372px; top: 318px; animation-delay: .9s"></span>')
rep('fill="#FFF6C8"','fill="#FFFFFF"',0)

# characters + badges block
a=s.index('<button class="mascot" aria-label="โค้ชกบ')
b=s.index('<svg class="spark"')
c=s.index('<button class="badge" aria-label="ราคาตลาดวันนี้"')
d=s.index('<div class="bubble')
sparks=s[b:c]
old_chars=s[a:b]
def inner(label):
    i=old_chars.index('<button class="mascot" aria-label="'+label)
    j=old_chars.index('</button>',i)
    blk=old_chars[i:j]
    k=blk.index('>')+1
    return blk[k:]
badge_baht='<span class="bob mali" style="display: flex; align-items: center; justify-content: center; box-sizing: border-box; width: 36px; height: 36px; margin: 4px; border-radius: 50%; background: #FFF4D6; border: 2px solid #E7C985; box-shadow: 0 3px 0 rgba(60,40,25,.3); font-weight: 700; font-size: 17px; color: #8A5A12">฿</span>'
badge_leaf='<span class="bob" style="display: flex; align-items: center; justify-content: center; box-sizing: border-box; width: 36px; height: 36px; margin: 4px; border-radius: 50%; background: #E2F5E5; border: 2px solid #9ED3A9; box-shadow: 0 3px 0 rgba(60,40,25,.3); animation-delay: .5s"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19c0-8 5-13 15-14-.5 9.5-6 15-14 14z" fill="#8FD19E" stroke="#2F6B3A" stroke-width="1.8" stroke-linejoin="round"></path><path d="M6 18c3-4 6-6.5 9.5-8.5" fill="none" stroke="#2F6B3A" stroke-width="1.6" stroke-linecap="round"></path></svg></span>'
badge_star='<span class="bob" style="display: flex; align-items: center; justify-content: center; box-sizing: border-box; width: 36px; height: 36px; margin: 4px; border-radius: 50%; background: #FFE6EA; border: 2px solid #F2B3C0; box-shadow: 0 3px 0 rgba(60,40,25,.3); animation-delay: 1s"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.5l-5.2 2.7 1-5.8L3.6 9.3l5.8-.8z" fill="#FFC94D" stroke="#B9822A" stroke-width="1.4" stroke-linejoin="round"></path></svg></span>'
def walker(cls,x,y,w,h,z,label,handler,delay,art,badge=None,blabel=None):
    out=f'<div class="{cls}" style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; z-index: {z}">\n'
    if badge:
        out+=f'<button class="badge" aria-label="{blabel}" onClick="{{{{{handler}}}}}" style="position: absolute; left: 50%; top: -46px; width: 44px; height: 44px; margin: 0 0 0 -22px; padding: 0; border: 0; background: transparent; cursor: pointer; z-index: 2">{badge}</button>\n'
    out+=f'<button class="mascot" aria-label="{label}" onClick="{{{{{handler}}}}}" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 0; margin: 0; border: 0; background: transparent; cursor: pointer; animation-delay: {delay}">\n'
    out+=f'<span class="{cls}Flip" style="position: absolute; inset: 0; display: block"><span class="step" style="position: absolute; inset: 0; display: block">{art}</span></span>\n</button>\n</div>\n\n'
    return out
new=''
new+=walker('walkF',221,394,59,76,5,'โค้ชกบ — ดูแคลอรี่วันนี้','openCalorie','.55s',inner('โค้ชกบ'),badge_leaf,'แคลอรี่วันนี้')
new+=walker('walkC',260,435,80,140,6,'นักชิมแมว — ดูเมนูยอดฮิต','openRanking','.45s',inner('นักชิมแมว'),badge_star,'เมนูยอดฮิตสัปดาห์นี้')
new+=walker('walkE',28,399,134,186,7,'เชฟช้าง — แนะนำเมนูวันนี้','tapElephant','.25s',inner('เชฟช้าง'))
new+=walker('walkK',136,534,109,166,8,'คาปิบาระ — ดูราคาตลาดวันนี้','openMarket','.35s',inner('คาปิบาระ'),badge_baht,'ราคาตลาดวันนี้')
s=s[:a]+new+sparks+s[d:]

css='''@keyframes walkF{0%,6%{transform:translateX(0)}44%,56%{transform:translateX(-120px)}94%,100%{transform:translateX(0)}}
@keyframes walkFFlip{0%,49.9%{transform:scaleX(-1)}50%,100%{transform:scaleX(1)}}
@keyframes walkC{0%,8%{transform:translateX(0)}42%,58%{transform:translateX(-96px)}92%,100%{transform:translateX(0)}}
@keyframes walkCFlip{0%,49.9%{transform:scaleX(-1)}50%,100%{transform:scaleX(1)}}
@keyframes walkE{0%,10%{transform:translateX(0)}40%,60%{transform:translateX(44px)}90%,100%{transform:translateX(0)}}
@keyframes walkEFlip{0%,49.9%{transform:scaleX(1)}50%,100%{transform:scaleX(-1)}}
@keyframes walkK{0%,5%{transform:translateX(0)}45%,55%{transform:translateX(118px)}95%,100%{transform:translateX(0)}}
@keyframes walkKFlip{0%,49.9%{transform:scaleX(1)}50%,100%{transform:scaleX(-1)}}
.walkF{animation:walkF 11s ease-in-out 1s infinite}.walkFFlip{animation:walkFFlip 11s linear 1s infinite}
.walkC{animation:walkC 15s ease-in-out 2s infinite}.walkCFlip{animation:walkCFlip 15s linear 2s infinite}
.walkE{animation:walkE 13s ease-in-out 3s infinite}.walkEFlip{animation:walkEFlip 13s linear 3s infinite}
.walkK{animation:walkK 19s ease-in-out .5s infinite}.walkKFlip{animation:walkKFlip 19s linear .5s infinite}
@keyframes step{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-3px) rotate(1.5deg)}}
.step{transform-origin:50% 100%;animation:step .5s ease-in-out infinite}
'''
rep('@keyframes bob{',css+'@keyframes bob{')
open(p,'w',encoding='utf-8').write(s)
print(len(s), s.count('class="mascot"'), s.count('class="badge"'), s.count('<button'), s.count('</button>'))
