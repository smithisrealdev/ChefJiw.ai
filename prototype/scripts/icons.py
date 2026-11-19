import re
ROOT='../screens/'
INK='#24212B'
src=open(ROOT+'Ingredients.dc.html',encoding='utf-8').read()
old={}
for m in re.finditer(r'<svg[^>]*aria-label="([^"]+)"[^>]*>(.*?)</svg>',src,re.S): old[m.group(1)]=re.sub(r'\s+',' ',m.group(2)).replace('#3B2F2B',INK)
def face(x1,x2,y,blush='#F7A8A0'):
    return f'<circle cx="{x1}" cy="{y}" r="3.2" fill="{INK}"></circle><circle cx="{x2}" cy="{y}" r="3.2" fill="{INK}"></circle><ellipse cx="{x1-7}" cy="{y+7}" rx="5" ry="3" fill="{blush}"></ellipse><ellipse cx="{x2+7}" cy="{y+7}" rx="5" ry="3" fill="{blush}"></ellipse>'
def sh(rx=26): return f'<ellipse cx="60" cy="110" rx="{rx}" ry="4" fill="{INK}" opacity="0.08"></ellipse>'
def bottle(body,dark,cap):
    return (sh(24)+f'<rect x="52" y="24" width="16" height="22" rx="4" fill="{body}"></rect><rect x="50" y="16" width="20" height="10" rx="3" fill="{cap}"></rect>'
     f'<rect x="40" y="40" width="40" height="64" rx="13" fill="{body}"></rect>'
     f'<path d="M70 40 H67 C73 40 80 46 80 53 V91 C80 98 74 104 67 104 H70 C76 98 72 92 72 86 V58 C72 50 76 44 70 40 Z" fill="{dark}" opacity="0.6"></path>'
     f'<rect x="45" y="60" width="30" height="24" rx="7" fill="#FFF8EE"></rect><circle cx="54" cy="71" r="2.8" fill="{INK}"></circle><circle cx="66" cy="71" r="2.8" fill="{INK}"></circle>'
     f'<path d="M57 77 Q60 79.5 63 77" stroke="{INK}" stroke-width="2" stroke-linecap="round" fill="none"></path>')
new={
 'chicken': sh(30)+'<path d="M28 58 C26 34 56 22 78 34 C98 46 100 78 82 94 C64 108 38 100 31 80 C29 73 28 66 28 58 Z" fill="#FFCDB0"></path>'
   '<path d="M70 31 C90 40 100 70 82 94 C72 102 60 104 50 100 C72 96 86 80 84 60 C83 48 78 38 70 31 Z" fill="#F5AE8C" opacity="0.7"></path>'
   '<path d="M40 44 C46 38 54 36 60 37" stroke="#FFE6D6" stroke-width="4" stroke-linecap="round" fill="none"></path>'+face(50,66,66),
 'basil': sh(22)+'<path d="M60 108 L60 84" stroke="#8C6BB1" stroke-width="5" stroke-linecap="round" fill="none"></path>'
   '<path d="M56 90 C36 92 26 78 26 64 C40 62 54 72 56 90 Z" fill="#4CA35C"></path><path d="M64 90 C84 92 94 78 94 64 C80 62 66 72 64 90 Z" fill="#4CA35C"></path>'
   '<path d="M60 16 C86 30 90 64 60 90 C30 64 34 30 60 16 Z" fill="#62BD6E"></path>'
   '<path d="M60 16 C86 30 90 64 60 90 C72 70 74 40 60 16 Z" fill="#4CA35C" opacity="0.7"></path>'
   '<path d="M60 26 L60 44" stroke="#8FD79A" stroke-width="3" stroke-linecap="round" fill="none"></path>'+face(52,68,58),
 'oil': bottle('#FFD95A','#E8B93A','#6DCB7A'),
 'oyster': bottle('#8A5540','#6B3F2E','#E8505B'),
 'soy': bottle('#4A3530','#2E211E','#6DCB7A'),
 'sugar': sh(30)+'<path d="M30 64 C34 40 86 40 90 64 Z" fill="#FFFFFF"></path><rect x="44" y="44" width="9" height="9" rx="2.5" fill="#E9E6F2" transform="rotate(-12 48 48)"></rect><rect x="62" y="40" width="9" height="9" rx="2.5" fill="#E9E6F2" transform="rotate(14 66 44)"></rect><rect x="72" y="52" width="8" height="8" rx="2.5" fill="#E9E6F2"></rect>'
   '<path d="M22 64 H98 C98 88 82 102 60 102 C38 102 22 88 22 64 Z" fill="#FF9DBD"></path><path d="M78 64 H98 C98 88 82 102 60 102 C78 96 88 82 88 64 Z" fill="#F07BA3" opacity="0.7"></path>'+face(52,68,78,'#FFD3E2'),
}
ICONS={'pork':old['หมูสับ'],'egg':old['ไข่ไก่'],'garlic':old['กระเทียม'],'chili':old['พริกขี้หนู'],'rice':old['ข้าวสวย'],'fish':old['น้ำปลา'],'morning':old['ผักบุ้ง'],**new}
if __name__=='__main__':
    import subprocess
    for k,v in ICONS.items():
        open(f'../ing/{k}.svg','w',encoding='utf-8').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">{v}</svg>')
    ks=list(ICONS); cells=''.join(f'<g transform="translate({(i%7)*130+10} {(i//7)*130+10})"><rect width="120" height="120" rx="24" fill="#F5F3FC"/>{ICONS[k]}</g>' for i,k in enumerate(ks))
    open('../ing/sheet.svg','w',encoding='utf-8').write(f'<svg xmlns="http://www.w3.org/2000/svg" width="920" height="270" viewBox="0 0 920 270"><rect width="920" height="270" fill="#fff"/>{cells}</svg>')
    subprocess.run(['rsvg-convert','../ing/sheet.svg','-o','../ing/sheet.png'],check=True); print(ks)
