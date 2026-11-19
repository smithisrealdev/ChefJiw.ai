INK='#24212B'
def sh(rx=26): return f'<ellipse cx="60" cy="110" rx="{rx}" ry="4" fill="{INK}" opacity="0.08"></ellipse>'
def eyes(x1,x2,y): return f'<circle cx="{x1}" cy="{y}" r="2.8" fill="{INK}"></circle><circle cx="{x2}" cy="{y}" r="2.8" fill="{INK}"></circle>'
def flame(cx,base,h,w,c1,c2): return f'<path d="M{cx} {base} C{cx-w} {base-h*0.25:.0f} {cx-w*0.7:.0f} {base-h*0.62:.0f} {cx} {base-h} C{cx+w*0.7:.0f} {base-h*0.62:.0f} {cx+w} {base-h*0.25:.0f} {cx} {base} Z" fill="{c1}"></path><path d="M{cx} {base} C{cx-w*0.5:.0f} {base-h*0.2:.0f} {cx-w*0.35:.0f} {base-h*0.4:.0f} {cx} {base-h*0.6:.0f} C{cx+w*0.35:.0f} {base-h*0.4:.0f} {cx+w*0.5:.0f} {base-h*0.2:.0f} {cx} {base} Z" fill="{c2}"></path>'
T={
 'knife_chef': sh(34)+'<g transform="rotate(-35 60 60)"><rect x="6" y="54" width="34" height="14" rx="7" fill="#8A5540"></rect><path d="M40 52 H112 C104 74 78 80 40 72 Z" fill="#E4E0F2"></path><path d="M40 52 H112 C100 58 76 62 40 62 Z" fill="#FFFFFF"></path></g>',
 'knife_cleaver': sh(34)+'<g transform="rotate(-35 60 60)"><rect x="4" y="50" width="34" height="14" rx="7" fill="#8A5540"></rect><rect x="38" y="36" width="70" height="46" rx="6" fill="#E4E0F2"></rect><rect x="38" y="36" width="70" height="16" rx="6" fill="#FFFFFF"></rect><circle cx="98" cy="46" r="4" fill="#B9B5C9"></circle></g>',
 'knife_paring': sh(26)+'<g transform="rotate(-35 60 60)"><rect x="22" y="55" width="30" height="12" rx="6" fill="#8A5540"></rect><path d="M52 54 H92 C88 66 74 70 52 68 Z" fill="#E4E0F2"></path><path d="M52 54 H92 C84 58 70 60 52 60 Z" fill="#FFFFFF"></path></g>',
 'board': sh(36)+'<rect x="16" y="34" width="88" height="62" rx="16" fill="#F6CF9C"></rect><rect x="24" y="42" width="72" height="46" rx="10" fill="#FBDDB4"></rect><circle cx="92" cy="46" r="5" fill="#F6CF9C"></circle>'+eyes(52,68,64)+'<ellipse cx="45" cy="71" rx="5" ry="3" fill="#F7A8A0"></ellipse><ellipse cx="75" cy="71" rx="5" ry="3" fill="#F7A8A0"></ellipse>',
 'spatula': sh(20)+'<rect x="55" y="52" width="10" height="54" rx="5" fill="#C98B5A"></rect><rect x="38" y="12" width="44" height="48" rx="14" fill="#8A8698"></rect><rect x="49" y="22" width="5" height="24" rx="2.5" fill="#FFFFFF"></rect><rect x="66" y="22" width="5" height="24" rx="2.5" fill="#FFFFFF"></rect>',
 'knob': sh(30)+'<circle cx="60" cy="62" r="40" fill="#E4E0F2"></circle><circle cx="60" cy="62" r="30" fill="#6B6777"></circle><rect x="56" y="34" width="8" height="26" rx="4" fill="#FFFFFF"></rect>'+flame(96,34,26,10,'#FF8A4C','#FFD84D'),
 'heat0': sh(26)+'<circle cx="60" cy="62" r="34" fill="#E4E0F2"></circle><rect x="38" y="56" width="44" height="12" rx="6" fill="#6B6777"></rect>',
 'heat1': sh(26)+flame(60,100,64,30,'#FF8A4C','#FFD84D')+eyes(53,67,80),
 'heat2': sh(32)+flame(34,100,56,22,'#FF6A3D','#FFB03D')+flame(86,100,56,22,'#FF6A3D','#FFB03D')+flame(60,102,90,34,'#E8303A','#FFD84D')+eyes(53,67,80),
 'water': sh(24)+'<path d="M60 12 C78 40 92 56 92 74 C92 94 78 106 60 106 C42 106 28 94 28 74 C28 56 42 40 60 12 Z" fill="#7CCBFF"></path><path d="M60 12 C78 40 92 56 92 74 C92 94 78 106 60 106 C74 98 82 88 82 74 C82 56 70 36 60 12 Z" fill="#4FAEEA" opacity="0.6"></path>'+eyes(52,68,74)+'<ellipse cx="45" cy="81" rx="5" ry="3" fill="#FFFFFF" opacity="0.7"></ellipse><ellipse cx="75" cy="81" rx="5" ry="3" fill="#FFFFFF" opacity="0.7"></ellipse>',
 'walk': '<g fill="#24212B"><ellipse cx="42" cy="78" rx="13" ry="19" transform="rotate(-14 42 78)"></ellipse><circle cx="30" cy="52" r="5"></circle><circle cx="41" cy="48" r="5"></circle><circle cx="52" cy="51" r="5"></circle><ellipse cx="80" cy="48" rx="13" ry="19" transform="rotate(14 80 48)"></ellipse><circle cx="70" cy="22" r="5"></circle><circle cx="81" cy="18" r="5"></circle><circle cx="92" cy="22" r="5"></circle></g>',
}
if __name__=='__main__':
    import subprocess
    for k,v in T.items(): open(f'../tool/{k}.svg','w',encoding='utf-8').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">{v}</svg>')
    cells=''.join(f'<g transform="translate({i*130+10} 10)"><rect width="120" height="120" rx="24" fill="#F5F3FC"/>{T[k]}</g>' for i,k in enumerate(T))
    open('../tool/sheet.svg','w',encoding='utf-8').write(f'<svg xmlns="http://www.w3.org/2000/svg" width="{len(T)*130+10}" height="140"><rect width="100%" height="100%" fill="#fff"/>{cells}</svg>')
    subprocess.run(['rsvg-convert','../tool/sheet.svg','-o','../tool/sheet.png'],check=True)
