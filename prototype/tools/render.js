const fs=require('fs');
const SRC=process.argv[2], OUT=process.argv[3];
const html=fs.readFileSync(SRC,'utf8');
const tpl=html.split('<x-dc>')[1].split('</x-dc>')[0];
const js=html.split('data-dc-script')[1].split('>').slice(1).join('>').split('</script>')[0];
const css=(tpl.match(/<style>([\s\S]*?)<\/style>/)||[])[1]||'';
const body=tpl.replace(/<helmet>[\s\S]*?<\/helmet>/,'');
global.matchMedia=undefined;
const real=global.setTimeout; global.setTimeout=()=>0; global.setInterval=()=>0;
const Component=new Function('DCLogic',js+'\nreturn Component;')(class{constructor(p){this.props=p||{};}setState(o){Object.assign(this.state,o);}});
const P=__dirname+'/..';
const map={};
const grab=(name,dir)=>{const m=js.match(new RegExp('const '+name+' = (\\{[^}]*\\});'));if(!m)return;const o=eval('('+m[1]+')');for(const k in o){const f=[P+'/'+dir+'/'+k+'.svg',P+'/ing/'+k+'.svg',P+'/tool/'+k+'.svg'].find(f=>fs.existsSync(f));if(f)map[o[k]]='file://'+f;}};
grab('IMG','ing');grab('X','tool');
map['/_blob/6c2552b0403b97e680de31c0a2deaa28']='file://'+P+'/dish/kaprao.svg';
const DM={'6c2552b0403b97e680de31c0a2deaa28':'kaprao','57d72c67af1ee4e1b933a4afefac4e80':'omelet','a64862a8c02a9f44b151cc9981fc09f1':'friedrice','0be76187f19ed08abc65a51059154705':'morning','841f9e64f4da943f588bffe8f5e331c1':'tomyum','56a522461fd3bec4f8eb3b88ebaecd86':'greencurry'};
for(const k in DM)map['/_blob/'+k]='file://'+P+'/dish/'+DM[k]+'.svg';
const IM={'86fdb695be776bfd7914cdfa1c29ed25':'pork','c6263c9b14efb6319b8350ce20511359':'egg','d6b929345fd698afe2cfc77cdb952825':'garlic','88051bbf2bf5bf095b12be008a28cda8':'chili','5658e513ce137923d2aca173599a06ac':'rice','05ce225d90694a189c0c4bbf2a952007':'fish','78d54072a7ea0047ddab68f6e27714f4':'morning','767838a8b05cd8c28cb1ce6f3ecfaf85':'chicken','4083ec0fb9b6108174fd3446c825d9ae':'basil','a10e54971cdb2b6586d6bb567274734e':'oil','1993ea62a5612c98d85cebbdb42ac759':'oyster','16b0afb00d2625eb9d959e40eb090198':'soy','42122d7213e3fd2b87ea71b26bad3f9f':'sugar'};
for(const k in IM)map['/_blob/'+k]='file://'+P+'/ing/'+IM[k]+'.svg';
map['/_blob/9dc673fd2eb139611211e828f85eec0f']='file://'+P+'/resto_bright.webp';
function get(scope,path){path=path.trim();if(path==='true')return true;if(path==='false')return false;let v=scope;for(const k of path.split('.')){if(v==null)return undefined;v=v[k];}return v;}
function close(s,from,tag){let depth=1,i=from;const re=new RegExp('<(/?)'+tag+'\\b','g');re.lastIndex=from;let m;while((m=re.exec(s))){depth+=m[1]?-1:1;if(depth===0)return m.index;}throw new Error('unclosed '+tag);}
function render(s,scope){let out='';for(;;){const m=/<sc-(if|for)\b([^>]*)>/.exec(s);if(!m){out+=fill(s,scope);break;}out+=fill(s.slice(0,m.index),scope);const tag='sc-'+m[1];const st=m.index+m[0].length;const en=close(s,st,tag);const inner=s.slice(st,en);const attr=m[2];
  if(m[1]==='if'){const v=get(scope,/value="\{\{([^}]*)\}\}"/.exec(attr)[1]);if(v)out+=render(inner,scope);}
  else{const list=get(scope,/list="\{\{([^}]*)\}\}"/.exec(attr)[1])||[];const as=/as="(\w+)"/.exec(attr)[1];list.forEach((it,i)=>{out+=render(inner,Object.assign({},scope,{[as]:it,$index:i}));});}
  s=s.slice(en+tag.length+3);}return out;}
function fill(s,scope){s=s.replace(/\s(on[A-Z]\w*)="\{\{[^}]*\}\}"/g,'');s=s.replace(/\sdisabled="\{\{([^}]*)\}\}"/g,(_,p)=>get(scope,p)?' disabled':'');return s.replace(/\{\{([^}]*)\}\}/g,(_,p)=>{const v=get(scope,p);return v==null||typeof v==='function'?'':String(v);});}
const c=new Component(process.env.APP?{app:{go(){},cook(){},record(){},save:{xp:590,pickN:0,runs:[{id:'omelet',name:'ไข่เจียวหมูสับ',score:5,opts:'ไม่เผ็ด · ฟูกรอบ',kcal:520,gain:40},{id:'kaprao',name:'กะเพราหมูสับไข่ดาว',score:4.3,opts:'เผ็ดจัด · ผัดแห้ง',kcal:650,gain:30}]}}}:{});
const shots=JSON.parse(process.argv[4]||'[]');
const steps={
  tap(n){const v=c.renderVals();const en=(v.hots||[]).filter(o=>!o.disabled);(en.find(o=>o.ring!=='none')||en[n||0]).tap();},
  ok(){const t=c.tasks()[c.state.ti];if(t.kind==='pick'){t.items.filter(i=>i[2]).forEach(i=>c.doPick(t,i));}else if(t.kind==='heat'){let g=0;while(!c.state.fin&&g++<5)c.bump(t,t.target>c.state.heat?1:-1);}else{let g=0;while(!c.state.fin&&g++<40){if(c.state.stirring){c.stirDone();break;}const a=t.acts.find(x=>(c.state.p[x[0]]||0)<x[3]);if(a&&a[6]&&a[6].min)c.setState({sec:a[6].min+5});steps.tap();}}},
  next(){c.nextTask();}, arrive(){const t=c.tasks()[c.state.ti];c.setState({at:t.st,arrived:true,walking:false});},
  goto(n){const all=c.tasks();c.setState({screen:'cook',ti:n,at:all[n].st,arrived:true,walking:false,p:{},fin:false,note:'',bad:'',stirring:false,heat:c.heatAt(all,n),sec:0});},
  gid(){},
  bad(){const t=c.tasks()[c.state.ti];c.doPick(t,t.items.find(i=>!i[2]));},
  recipe(){c.setState({screen:'recipe'});},
  fin(){c.setState({fin:true});},
  wait(){c.setState({arrived:false,at:'door'});},
  ask(){c.renderVals().toRecipe();},
  leave(){c.renderVals().leave();},
  s120(){c.setState({sec:125});},
  early(){steps.tap();},
  st(){const o=JSON.parse(Buffer.from(process.argv[5]||'e30=','base64').toString());c.setState(o);},
  call(){},
  start(){c.setState({screen:'cook',ti:0,at:'door',arrived:false,walking:false,p:{},fin:false,note:'',heat:0,sec:0});},
  enter(){c.setState({screen:'enter',phase:1});}, done(){c.setState({screen:'done',stars:4});}, sec(){c.setState({sec:75});}, unfin(){c.setState({fin:false});},
};
const fonts=`@font-face{font-family:'Mali';font-weight:600;src:url(file://${__dirname}/node_modules/@fontsource/mali/files/mali-thai-600-normal.woff2)}@font-face{font-family:'Mali';font-weight:700;src:url(file://${__dirname}/node_modules/@fontsource/mali/files/mali-thai-700-normal.woff2)}`+[400,600,700].map(w=>`@font-face{font-family:'IBM Plex Sans Thai Looped';font-weight:${w};src:url(file://${__dirname}/node_modules/@fontsource/ibm-plex-sans-thai-looped/files/ibm-plex-sans-thai-looped-thai-${w}-normal.woff2)}`).join('');
shots.forEach(([name,seq])=>{seq.split(' ').filter(Boolean).forEach(k=>{const [f,a]=k.split(':');if(f==='at'){steps.goto(c.tasks().findIndex(t=>t.id===a));return;}steps[f](a?+a:undefined);});
  let h=render(body,c.renderVals());for(const k in map)h=h.split(k).join(map[k]);
  const freeze='*,*::before,*::after{animation-delay:-10s !important;animation-play-state:paused !important;transition:none !important}.screen,.pop,.zoomin{animation:none !important}';
  fs.writeFileSync(OUT+'/'+name+'.html','<!doctype html><meta charset="utf-8"><style>'+fonts+css+freeze+'</style>'+h);});
console.log('rendered',shots.length);
