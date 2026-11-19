INK='#24212B'
def eyes(x1,x2,y,r=3,blush='#F7A8A0',b=True):
    o=f'<circle cx="{x1}" cy="{y}" r="{r}" fill="{INK}"></circle><circle cx="{x2}" cy="{y}" r="{r}" fill="{INK}"></circle>'
    if b: o+=f'<ellipse cx="{x1-6.5}" cy="{y+6.5}" rx="4.6" ry="2.8" fill="{blush}"></ellipse><ellipse cx="{x2+6.5}" cy="{y+6.5}" rx="4.6" ry="2.8" fill="{blush}"></ellipse>'
    return o
SH=f'<ellipse cx="60" cy="108" rx="44" ry="5" fill="{INK}" opacity="0.08"></ellipse>'
PLATE=SH+'<ellipse cx="60" cy="88" rx="54" ry="19" fill="#FFFFFF"></ellipse><ellipse cx="60" cy="86" rx="42" ry="13" fill="#ECE8F6"></ellipse>'
def bowl(soup,dark):
    return (SH+f'<path d="M14 60 H106 C106 88 86 106 60 106 C34 106 14 88 14 60 Z" fill="#FFFFFF"></path>'
      '<path d="M84 60 H106 C106 88 86 106 60 106 C80 100 94 82 94 60 Z" fill="#E4DFF2" opacity="0.8"></path>'
      f'<ellipse cx="60" cy="60" rx="46" ry="12" fill="#FFFFFF"></ellipse><ellipse cx="60" cy="60" rx="40" ry="9" fill="{soup}"></ellipse>'
      f'<path d="M24 62 C36 68 84 68 96 62 C90 70 30 70 24 62 Z" fill="{dark}" opacity="0.5"></path>')
def leaf(x,y,rot,c='#4CA35C',rx=7,ry=4): return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{c}" transform="rotate({rot} {x} {y})"></ellipse>'
def bit(x,y,c,rot=0,w=6,h=3.4): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="1.7" fill="{c}" transform="rotate({rot} {x} {y})"></rect>'
D={}
D['kaprao']=(PLATE+
 '<path d="M26 86 C24 50 86 48 90 82 Z" fill="#FFFDF8"></path>'
 '<path d="M48 86 C44 62 100 58 104 82 C100 92 56 94 48 86 Z" fill="#B5714A"></path>'
 '<path d="M82 62 C96 64 104 72 104 82 C100 90 84 92 72 92 C90 88 96 76 82 62 Z" fill="#96583A" opacity="0.7"></path>'
 +''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#96583A"></circle>' for x,y,r in [(62,74,2.6),(74,82,2.2),(90,76,2.4),(68,86,2)])
 +leaf(72,68,-25)+leaf(88,70,20)+leaf(80,80,-10,'#62BD6E')+leaf(60,80,30,'#62BD6E',6,3.4)
 +bit(94,82,'#F0584A',-30)+bit(66,66,'#F0584A',20,5,3)
 +'<path d="M14 62 C12 46 30 38 42 44 C54 36 72 46 68 60 C72 74 54 82 42 76 C28 82 14 76 14 62 Z" fill="#FFFFFF"></path>'
 '<path d="M56 44 C68 48 72 54 68 60 C72 74 54 82 42 76 C56 74 62 64 60 56 C59 51 58 47 56 44 Z" fill="#EFE7DA" opacity="0.8"></path>'
 '<circle cx="40" cy="59" r="13" fill="#FFC93D"></circle><path d="M40 46 C48 47 53 53 53 59 C53 66 48 71 40 72 C46 68 48 64 48 59 C48 53 45 49 40 46 Z" fill="#F2A91E" opacity="0.6"></path>'
 +eyes(35,45,58,2.4,'#FF9E6B'))
D['omelet']=(PLATE+
 '<path d="M20 84 C22 62 56 60 60 84 Z" fill="#FFFDF8"></path>'
 '<path d="M26 70 C20 50 44 38 64 44 C86 38 106 54 100 72 C102 88 80 94 62 90 C42 96 28 88 26 70 Z" fill="#F9C84C"></path>'
 '<path d="M80 44 C98 48 104 60 100 72 C102 88 80 94 62 90 C82 88 92 76 90 64 C89 56 86 49 80 44 Z" fill="#E9A62E" opacity="0.65"></path>'
 +''.join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="#E9A62E" opacity="0.7"></ellipse>' for x,y,rx,ry in [(42,54,6,3.5),(70,52,5,3),(50,82,6,3),(84,80,4,2.6)])
 +bit(58,48,'#62BD6E',20,5,3)+bit(36,74,'#62BD6E',-30,5,3)+bit(78,86,'#62BD6E',10,5,3)
 +eyes(54,70,66))
D['friedrice']=(PLATE+
 '<path d="M22 84 C18 46 100 46 98 84 C92 94 28 94 22 84 Z" fill="#FFE08A"></path>'
 '<path d="M74 52 C92 58 100 70 98 84 C92 92 76 94 62 94 C82 90 90 78 88 68 C87 62 82 56 74 52 Z" fill="#F2C257" opacity="0.7"></path>'
 +bit(36,62,'#62BD6E',25)+bit(64,54,'#62BD6E',-20)+bit(84,74,'#62BD6E',40)+bit(44,84,'#FF8A4C',10)+bit(76,60,'#FF8A4C',-35)+bit(30,74,'#FF8A4C',60,5,3)
 +''.join(f'<rect x="{x}" y="{y}" width="8" height="6" rx="3" fill="#FFC93D" transform="rotate({r} {x} {y})"></rect>' for x,y,r in [(50,54,15),(86,84,-20),(32,86,5)])
 +'<circle cx="100" cy="92" r="9" fill="#8CC25A"></circle><circle cx="100" cy="92" r="6" fill="#DDF2BE"></circle><circle cx="14" cy="88" r="8" fill="#8CC25A"></circle><circle cx="14" cy="88" r="5.4" fill="#DDF2BE"></circle>'
 +eyes(52,68,72))
D['morning']=(PLATE+
 '<path d="M24 84 C22 58 98 56 98 82 C92 92 30 94 24 84 Z" fill="#5FB66B"></path>'
 +''.join(f'<path d="{d}" stroke="{c}" stroke-width="7" stroke-linecap="round" fill="none"></path>' for d,c in [('M26 76 C44 56 70 60 96 70','#8FD79A'),('M30 86 C52 70 76 86 94 80','#7CC47F'),('M38 60 C56 52 78 52 90 60','#7CC47F')])
 +leaf(36,58,-30,'#3E9A52',10,5.5)+leaf(84,56,25,'#3E9A52',10,5.5)+leaf(62,50,0,'#4CA35C',10,5.5)
 +bit(46,66,'#F0584A',-20,8,4)+bit(78,84,'#F0584A',30,8,4)
 +''.join(f'<ellipse cx="{x}" cy="{y}" rx="3.2" ry="2.4" fill="#FFF3D6"></ellipse>' for x,y in [(72,64),(40,82),(90,74)])
 +'<rect x="44" y="68" width="32" height="18" rx="9" fill="#3E9A52" opacity="0.001"></rect>'
 +eyes(54,68,74,3,'#C9F0B8'))
D['tomyum']=(bowl('#FF8A4C','#E0602A')
 +'<path d="M40 58 C34 40 54 30 66 40 C74 47 70 58 60 58" stroke="#FFA98C" stroke-width="10" stroke-linecap="round" fill="none"></path>'
 '<path d="M40 58 C34 40 54 30 66 40" stroke="#FF8F70" stroke-width="2.5" stroke-linecap="round" fill="none" stroke-dasharray="1 7"></path>'
 '<path d="M36 60 L28 50 M36 60 L26 58" stroke="#FF7A5C" stroke-width="5" stroke-linecap="round"></path>'
 '<circle cx="62" cy="42" r="1.8" fill="#24212B"></circle>'
 '<path d="M74 60 C72 48 90 46 90 58 Z" fill="#FFF3DF"></path><rect x="79" y="56" width="6" height="8" rx="3" fill="#FFF3DF"></rect>'
 +leaf(52,62,-15,'#4CA35C',8,3.6)+bit(88,62,'#E8303A',-20,8,3.6)+bit(30,62,'#E8303A',15,7,3.4)
 +eyes(52,68,84))
D['greencurry']=(bowl('#B9DE7E','#86B84E')
 +'<path d="M36 60 C44 54 56 58 62 60 C70 62 80 56 86 60" stroke="#F4FBE6" stroke-width="3" stroke-linecap="round" fill="none"></path>'
 '<rect x="30" y="50" width="18" height="13" rx="6" fill="#FFE6D0" transform="rotate(-12 39 56)"></rect><rect x="64" y="48" width="17" height="12" rx="6" fill="#FFE6D0" transform="rotate(14 72 54)"></rect>'
 '<circle cx="56" cy="54" r="8" fill="#7CC47F"></circle><circle cx="56" cy="54" r="5.4" fill="#F0F8DC"></circle><circle cx="88" cy="58" r="6.5" fill="#7CC47F"></circle><circle cx="88" cy="58" r="4.2" fill="#F0F8DC"></circle>'
 +bit(46,64,'#E8303A',-25,8,3.6)+bit(74,64,'#E8303A',20,7,3.4)+leaf(40,46,-35,'#3E9A52',7,3.6)+leaf(78,44,30,'#3E9A52',7,3.6)
 +eyes(52,68,84))
if __name__=='__main__':
    import subprocess
    ks=list(D); tints=['#FFD9CC','#FFF0B8','#FFE2C2','#D6F5D9','#FFD6DF','#DCDCFF']
    for k in ks: open(f'../dish/{k}.svg','w',encoding='utf-8').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">{D[k]}</svg>')
    cells=''.join(f'<g transform="translate({i*250+10} 10) scale(2)"><rect width="120" height="120" rx="24" fill="{tints[i]}"/>{D[k]}</g>' for i,k in enumerate(ks))
    open('../dish/sheet.svg','w',encoding='utf-8').write(f'<svg xmlns="http://www.w3.org/2000/svg" width="1510" height="260" viewBox="0 0 1510 260"><rect width="1510" height="260" fill="#fff"/>{cells}</svg>')
    subprocess.run(['rsvg-convert','../dish/sheet.svg','-o','../dish/sheet.png'],check=True)
