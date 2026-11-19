INK='#24212B'
def fl(cx,base,h,w): return f'<g class="flame"><path d="M{cx} {base} C{cx-w} {base-h*0.25:.1f} {cx-w*0.7:.1f} {base-h*0.62:.1f} {cx} {base-h} C{cx+w*0.7:.1f} {base-h*0.62:.1f} {cx+w} {base-h*0.25:.1f} {cx} {base} Z" fill="#FF8A4C"></path><path d="M{cx} {base} C{cx-w*0.5:.1f} {base-h*0.2:.1f} {cx-w*0.35:.1f} {base-h*0.4:.1f} {cx} {base-h*0.6:.1f} C{cx+w*0.35:.1f} {base-h*0.4:.1f} {cx+w*0.5:.1f} {base-h*0.2:.1f} {cx} {base} Z" fill="#FFD84D"></path></g>'
def bottle(x,body,cap): return f'<rect x="{x+4}" y="146" width="7" height="10" rx="2" fill="{body}"></rect><rect x="{x+3}" y="142" width="9" height="5" rx="2" fill="{cap}"></rect><rect x="{x}" y="154" width="15" height="24" rx="5" fill="{body}"></rect><rect x="{x+3}" y="162" width="9" height="8" rx="2.500" fill="#FFF8EE"></rect>'
BASE=('<rect x="0" y="0" width="390" height="318" fill="#CFCBFF"></rect>'
 '<rect x="104" y="128" width="286" height="108" fill="#DDDAFF"></rect>'
 +''.join(f'<rect x="{x}" y="128" width="2" height="108" fill="#CFCBFF"></rect>' for x in range(140,390,36))+'<rect x="104" y="180" width="286" height="2" fill="#CFCBFF"></rect>'
 '<rect x="0" y="318" width="390" height="152" fill="#FBEBD2"></rect><rect x="0" y="312" width="390" height="8" fill="#FFFFFF"></rect>'
 '<rect x="0" y="364" width="390" height="2" fill="#F1DDBF"></rect><rect x="0" y="412" width="390" height="2" fill="#F1DDBF"></rect>'
 '<ellipse cx="200" cy="432" rx="160" ry="24" fill="#FFD6E3" opacity="0.7"></ellipse>'
 # window
 '<rect x="116" y="18" width="96" height="88" rx="12" fill="#FFFFFF"></rect><rect x="123" y="25" width="82" height="74" rx="7" fill="#BDE7FF"></rect>'
 '<ellipse cx="148" cy="46" rx="14" ry="7" fill="#FFFFFF"></ellipse><ellipse cx="160" cy="42" rx="11" ry="7" fill="#FFFFFF"></ellipse>'
 '<path d="M123 99 V80 C140 62 160 70 172 78 C184 66 198 70 205 78 V92 Q205 99 198 99 Z" fill="#8FD79A"></path><rect x="162" y="25" width="5" height="74" fill="#FFFFFF"></rect>'
 # lamp
 '<rect x="298" y="0" width="4" height="34" fill="#8A8698"></rect><path d="M276 54 C276 36 324 36 324 54 Z" fill="#FFD84D"></path><circle cx="300" cy="56" r="6" fill="#FFF6CF"></circle>'
 # shelf + bottles
 '<rect x="108" y="178" width="92" height="8" rx="4" fill="#FFFFFF"></rect>'+bottle(114,'#8A5540','#E8505B')+bottle(134,'#4A3530','#6DCB7A')+bottle(154,'#C98B5A','#F07B5E')
 +'<path d="M174 166 H196 C196 174 192 178 185 178 C178 178 174 174 174 166 Z" fill="#FF9DBD"></path><path d="M176 166 C178 158 192 158 194 166 Z" fill="#FFFFFF"></path>'
 # knife rack
 '<rect x="208" y="150" width="76" height="10" rx="5" fill="#8A8698"></rect>'
 '<rect x="216" y="136" width="8" height="16" rx="4" fill="#8A5540"></rect><rect x="211" y="158" width="18" height="28" rx="3" fill="#F3F1FA"></rect>'
 '<rect x="242" y="136" width="8" height="16" rx="4" fill="#8A5540"></rect><path d="M240 158 H252 V190 C246 184 241 172 240 158 Z" fill="#F3F1FA"></path>'
 '<rect x="266" y="140" width="7" height="12" rx="3.500" fill="#8A5540"></rect><path d="M265 158 H274 V176 C269 172 266 166 265 158 Z" fill="#F3F1FA"></path>'
 # counter
 '<rect x="104" y="244" width="286" height="74" fill="#FFA9C6"></rect><rect x="104" y="244" width="286" height="8" fill="#F58DB1"></rect>'
 +''.join(f'<rect x="{x}" y="260" width="42" height="48" rx="7" fill="#FFBBD2"></rect><rect x="{x+17}" y="266" width="8" height="4" rx="2" fill="#FFFFFF"></rect>' for x in (112,158,206,250))
 +'<rect x="100" y="232" width="290" height="14" rx="5" fill="#FFFFFF"></rect>'
 # sink
 '<rect x="118" y="234" width="72" height="9" rx="4.500" fill="#B4B0E0"></rect><path d="M172 234 V206 Q172 192 160 192 H152 V200" stroke="#8A8698" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"></path><rect x="176" y="222" width="12" height="6" rx="3" fill="#8A8698"></rect>'
 # stove
 '<rect x="294" y="246" width="96" height="72" fill="#FFFFFF"></rect><rect x="292" y="228" width="98" height="12" rx="4" fill="#3A3642"></rect><rect x="316" y="223" width="46" height="6" rx="2" fill="#6B6777"></rect>'
 '<circle cx="314" cy="260" r="7" fill="#6B6777"></circle><circle cx="340" cy="260" r="7" fill="#6B6777"></circle><circle cx="366" cy="260" r="7" fill="#6B6777"></circle>'
 '<rect x="302" y="274" width="80" height="36" rx="7" fill="#FF8FB3"></rect><rect x="310" y="281" width="64" height="20" rx="5" fill="#FFD6E3"></rect><rect x="322" y="276" width="40" height="3" rx="1.500" fill="#FFFFFF"></rect>'
 # wok
 '<path d="M304 196 Q339 232 374 196 Z" fill="#3A3642"></path><rect x="302" y="193" width="74" height="5" rx="2.500" fill="#575270"></rect><rect x="372" y="192" width="18" height="6" rx="3" fill="#6B6777"></rect>'
 # fridge
 '<rect x="8" y="84" width="90" height="234" rx="14" fill="#A6E9D0"></rect><path d="M84 84 C92 84 98 90 98 98 V304 C98 312 92 318 84 318 H78 C84 312 86 306 86 298 V104 C86 96 84 90 78 84 Z" fill="#84D6B9" opacity="0.8"></path>'
 '<rect x="8" y="164" width="90" height="5" fill="#6CC7A8"></rect><rect x="78" y="114" width="7" height="34" rx="3.500" fill="#FFFFFF"></rect><rect x="78" y="182" width="7" height="50" rx="3.500" fill="#FFFFFF"></rect>'
 f'<circle cx="36" cy="128" r="3.200" fill="{INK}"></circle><circle cx="56" cy="128" r="3.200" fill="{INK}"></circle><ellipse cx="29" cy="136" rx="5" ry="3" fill="#F7A8A0"></ellipse><ellipse cx="63" cy="136" rx="5" ry="3" fill="#F7A8A0"></ellipse>'
 '<rect x="20" y="196" width="16" height="16" rx="4" fill="#FFD84D"></rect><rect x="42" y="204" width="14" height="14" rx="4" fill="#FF9DBD"></rect>'
 '<rect x="30" y="62" width="34" height="24" rx="8" fill="#FF8A6B"></rect><ellipse cx="38" cy="50" rx="9" ry="16" fill="#62BD6E" transform="rotate(-18 38 50)"></ellipse><ellipse cx="56" cy="48" rx="9" ry="17" fill="#4CA35C" transform="rotate(14 56 48)"></ellipse><ellipse cx="47" cy="42" rx="8" ry="16" fill="#7CC47F"></ellipse>')
OV={
 'fridge': '<rect x="0" y="170" width="12" height="146" rx="5" fill="#6CC7A8"></rect><rect x="12" y="172" width="84" height="142" rx="8" fill="#FFFDF2"></rect><rect x="12" y="214" width="84" height="4" fill="#DDF3EA"></rect><rect x="12" y="262" width="84" height="4" fill="#DDF3EA"></rect>'
   '<ellipse cx="34" cy="202" rx="12" ry="9" fill="#F4A7A0"></ellipse><ellipse cx="62" cy="200" rx="8" ry="11" fill="#FFF8EE"></ellipse><ellipse cx="78" cy="201" rx="7" ry="10" fill="#FFF8EE"></ellipse>'
   '<ellipse cx="32" cy="248" rx="9" ry="12" fill="#62BD6E"></ellipse><ellipse cx="46" cy="250" rx="8" ry="10" fill="#4CA35C"></ellipse><rect x="62" y="240" width="22" height="8" rx="4" fill="#F0584A" transform="rotate(-20 73 244)"></rect>'
   '<ellipse cx="34" cy="296" rx="12" ry="14" fill="#FFF8EE"></ellipse><rect x="56" y="278" width="14" height="34" rx="5" fill="#7CCBFF"></rect><rect x="74" y="284" width="14" height="28" rx="5" fill="#FFD84D"></rect>',
 'board': '<rect x="212" y="224" width="66" height="10" rx="5" fill="#F6CF9C"></rect><rect x="212" y="224" width="66" height="4" rx="2" fill="#FBDDB4"></rect>',
 'knife': '<rect x="252" y="216" width="14" height="6" rx="3" fill="#8A5540" transform="rotate(-8 259 219)"></rect><path d="M224 221 H254 V226 C242 228 232 226 224 221 Z" fill="#F3F1FA" transform="rotate(-8 240 222)"></path>',
 'bits': '<rect x="220" y="219" width="5" height="4" rx="2" fill="#FFFDF4"></rect><rect x="228" y="218" width="5" height="4" rx="2" fill="#FFFDF4"></rect><rect x="236" y="220" width="6" height="3" rx="1.500" fill="#F0584A"></rect><rect x="216" y="220" width="6" height="3" rx="1.500" fill="#F0584A"></rect>',
 'water': '<rect class="flow" x="149.500" y="202" width="5" height="33" rx="2.500" fill="#7CCBFF"></rect><ellipse cx="152" cy="236" rx="10" ry="3" fill="#BDE7FF"></ellipse>',
 'low': fl(330,224,9,5)+fl(339,224,11,5)+fl(348,224,9,5),
 'high': fl(322,224,12,5)+fl(331,224,16,6)+fl(339,224,19,6)+fl(347,224,16,6)+fl(356,224,12,5),
 'eggplate': '<ellipse cx="266" cy="231" rx="16" ry="4" fill="#E4E0F2"></ellipse><ellipse cx="266" cy="228" rx="11" ry="4" fill="#FFFFFF"></ellipse><circle cx="266" cy="226" r="4" fill="#FFC93D"></circle>',
 'food': '<path d="M312 197 Q339 186 366 197 Z" fill="#B5714A"></path><ellipse cx="330" cy="193" rx="5" ry="2.500" fill="#4CA35C"></ellipse><ellipse cx="350" cy="194" rx="5" ry="2.500" fill="#4CA35C"></ellipse>',
}
def svgwrap(inner,extra=''): return f'<svg width="390" height="470" viewBox="0 0 390 470" aria-hidden="true" style="position: absolute; left: 0; top: 0; display: block; pointer-events: none"{extra}>{inner}</svg>'
if __name__=='__main__':
    import subprocess,sys; sys.path.insert(0,'.')
    from bots import BOTS
    chef=f'<g transform="translate(286 300) scale(0.8)"><style>.eh,.es,.mo{{display:none}}</style><svg viewBox="0 -24 120 174" width="96" height="139" style="overflow:visible">{BOTS["elephant"]}</svg></g>'
    def frame(keys,dx): return f'<g transform="translate({dx} 0)">{BASE}{"".join(OV[k] for k in keys)}{chef}</g>'
    open('../tool/kitchen.svg','w',encoding='utf-8').write(f'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="470" viewBox="0 0 800 470">{frame([],0)}{frame(["fridge","board","knife","bits","water","high","eggplate","food"],410)}</svg>')
    subprocess.run(['rsvg-convert','../tool/kitchen.svg','-o','../tool/kitchen.png'],check=True)
