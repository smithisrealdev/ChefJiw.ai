import re, subprocess
ROOT='../screens/'
INK='#24212B'; MUTE='#6B6777'; SOFT='#F5F3FC'
def rd(n): return open(ROOT+n,encoding='utf-8').read()
def wr(n,s): open(ROOT+n,'w',encoding='utf-8').write(s)
def common(s):
    for a,b in [('#3B2A22',INK),('#7A5C48',MUTE),('#FFF8EC','#FFFFFF'),('background: #C2512E','background: '+INK)]: s=s.replace(a,b)
    return s
def must(s,a,b,n=None):
    assert a in s, a[:60]
    return s.replace(a,b) if n is None else s.replace(a,b,n)

# ---------- Restaurant ----------
subprocess.run(['python3','page.py','/_blob/9dc673fd2eb139611211e828f85eec0f'],check=True)
s=rd('Restaurant.dc.html')
s=must(s,'.press:active{transform:scale(.94)}','.press:active{transform:scale(.94)}\nbutton:focus-visible,a:focus-visible{outline:3px solid #24212B;outline-offset:2px}\na.tab{text-decoration:none}')
s=must(s,'font-weight: 600; font-size: 15px; line-height: 1.45','font-weight: 600; font-size: 16px; line-height: 1.45')
s=must(s,'color: #FFFFFF; font-weight: 700; font-size: 14px; cursor: pointer','color: #FFFFFF; font-weight: 700; font-size: 16px; cursor: pointer')
def link(s,label,href):
    pat=re.compile(r'<button class="press" style="(display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; width: 64px; height: 64px); padding: 0; border: 0; background: transparent; cursor: pointer">((?:(?!</button>).)*?>'+label+r'</span>)</button>',re.S)
    s2,n=pat.subn(lambda m:f'<a class="press tab" href="{href}" style="{m.group(1)}">{m.group(2)}</a>',s); assert n==1,(label,n); return s2
s=link(s,'สูตรอาหาร','Recipes.dc.html'); s=link(s,'ทำอาหาร','Cook.dc.html'); s=link(s,'ฉัน','Me.dc.html')
s=common(s)
s=must(s,'background: #A9683F','background: #FBEBD2')
s=must(s,'background: #FFE3A3','background: #FFE66D')
s=must(s,'rgba(60,35,20,.28)','rgba(60,45,70,.16)')
s=re.sub(r'<svg class="em em-(?:note|zzz)".*?</svg>',lambda m:m.group(0).replace('#FFFFFF','#7B6CF6'),s,flags=re.S)
s=re.sub(r'<svg class="spark".*?</svg>',lambda m:m.group(0).replace('#FFFFFF','#FFC93D'),s,flags=re.S)
for a,b in [("color: '#C9D0F7'","color: '#C5C9FF'"),("color: '#F6D9C2'","color: '#FFD3B8'"),("color: '#F6E0A6'","color: '#FFE08A'"),("color: '#D3EDB5'","color: '#C8F0A0'")]: s=must(s,a,b)

# CTA in talk card: one static link per bot
import re as _re
_m=_re.search(r'<button class="press mali" onClick="\{\{talk.next\}\}" style="([^"]*)">\{\{talk.cta\}\}</button>',s); assert _m
_st=_m.group(1)+'; display: flex; align-items: center; box-sizing: border-box'
def _a(flag,href,label,hint): return f'<sc-if value="{{{{talk.{flag}}}}}" hint-placeholder-val="{{{{{hint}}}}}"><a class="press mali tab" href="{href}" style="{_st}">{label}</a></sc-if>'
_new=_a('isElephant','Recipes.dc.html','ดูสูตร','true')+_a('isCat','Ranking.dc.html','ดูอันดับ','false')+_a('isCapy','Market.dc.html','ดูราคา','false')+_a('isFrog','Calories.dc.html','ดูแคลอรี่','false')
s=s.replace(_m.group(0),_new)
s=must(s,"out.talk = { name: t.name,","out.talk = { isElephant: s.who === 'elephant', isCat: s.who === 'cat', isCapy: s.who === 'capybara', isFrog: s.who === 'frog', name: t.name,")
wr('Restaurant.dc.html',s)

# ---------- Cook ----------
subprocess.run(['python3','cook.py'],check=True)
s=rd('Cook.dc.html')
s=must(s,'href="Restaurant.dc.html" aria-label="กลับหน้าร้าน"','href="Recipes.dc.html" aria-label="กลับไปรายการสูตรอาหาร"')
s=s.replace('background: #FFFFFF','background: '+SOFT)          # ingredient rows + timer box sit on white now
s=common(s)
s=must(s,'inset: 0; background: #C9D0F7','inset: 0; background: #FFC98A')   # warm ground so the periwinkle chef stands out
s=must(s,'inset: 0; background: #FFE3A3','inset: 0; background: #FFD84D')
s=must(s,'inset: 0; background: #D3EDB5','inset: 0; background: #8EE0A1')
s=s.replace('background: #FFE3A3','background: #FFE66D')
s=must(s,"'#C2512E' : '#FFFFFF'","'#24212B' : '#FFFFFF'")      # progress bars
s=must(s,"have ? '#4A7443' : '#24212B'","have ? '#1E7A45' : '#24212B'")
s=must(s,"have ? '#5E8F57' : '#F6E6CF'","have ? '#22A35A' : '#DDD9EC'")
s=must(s,'outline:3px solid #3B2A22','outline:3px solid #24212B') if 'outline:3px solid #3B2A22' in s else s
s=must(s,'font-size: 14px; color: #6B6777">ต้องซื้อเพิ่ม','font-size: 14px; color: #4F4A5C">ต้องซื้อเพิ่ม')
wr('Cook.dc.html',s)

# ---------- Recipes ----------
subprocess.run(['python3','recipes.py'],check=True)
s=rd('Recipes.dc.html')
s=s.replace('border-radius: 24px; background: #FFFFFF','border-radius: 24px; background: '+SOFT)   # cards
s=must(s,"? '#3B2A22' : '#FFFFFF', fg","? '#24212B' : '#F5F3FC', fg")                                # chips
s=common(s)
s=must(s,'overflow: hidden; background: #F6E0A6','overflow: hidden; background: #FFA9C6')
s=must(s,'color: #6B4E3A">ราคา','color: #4A3B47">ราคา')
s=must(s,'background: #FFE3A3; border-radius: 28px; z-index: 900','background: #FFFFFF; box-shadow: 0 0 0 2px #E4E0F2; border-radius: 28px; z-index: 900')
s=s.replace('background: #FFE3A3','background: #FFE66D')
for a,b in [('#E3A04F','#FFE2C2'),('#86B37F','#D6F5D9'),('#8E9BE3','#DCDCFF'),('#F2876B','#FFD9CC'),('#E8697A','#FFD6DF'),('#F2C14E','#FFF0B8')]:
    s=s.replace("tint: '"+a+"'","tint: '"+b+"'")
wr('Recipes.dc.html',s)
for n in ['Restaurant','Cook','Recipes']:
    t=rd(n+'.dc.html'); print(n,len(t),[c for c in ['#3B2A22','#7A5C48','#FFF8EC','#A9683F'] if c in t])
