// full playthrough of the cooking logic (both recipes) with fake timers and a mock app shell
const fs=require('fs');const P=process.argv[2];
const h=fs.readFileSync(P,'utf8');const js=h.split('data-dc-script')[1].split('>').slice(1).join('>').split('</script>')[0];
let timers=[],ivs=[];global.setTimeout=(f)=>{timers.push(f);return timers.length};global.clearTimeout=()=>{};global.setInterval=(f)=>{ivs.push(f);return ivs.length};global.clearInterval=(i)=>{if(i)ivs[i-1]=null};
global.matchMedia=()=>({matches:true});
const C=new Function('DCLogic',js+';return Component')(class{constructor(p){this.props=p||{}}setState(o){Object.assign(this.state,o)}});
function run(o){
  const rec=[];const c=new C(o.app?{app:{go(){},record:(r)=>rec.push(r),save:{xp:520,runs:[]}}}:{});let taps=0;
  const flush=()=>{let g=0;while(timers.length&&g++<50){const f=timers.shift();f&&f();}};
  if(o.recipe){c.renderVals().menus.find(m=>m.label.includes(o.recipe==='omelet'?'ไข่เจียว':'กะเพรา')).pick();taps++;}
  if(o.o1!=null){c.renderVals().spices[o.o1].pick();taps++;} if(o.o2!=null){c.renderVals().styles[o.o2].pick();taps++;}
  c.renderVals().start();taps++;flush();
  let guard=0,stirs=0;const seen=[];
  while(c.state.screen==='cook'&&guard++<500){
    let v=c.renderVals();const t=c.tasks()[c.state.ti];
    if(!seen.includes(t.id))seen.push(t.id);
    if(c.state.fin){v.next();taps++;flush();continue;}
    if(o.skip&&o.skip.includes(t.id)){v.skip();taps++;flush();continue;}
    if(!c.state.arrived){v.walk.tap();taps++;flush();continue;}
    if(c.state.stirring){ if(o.wait){const f=ivs.filter(x=>x).pop();let g=0;while(c.state.stirring&&g++<400)f();} else {v.stirDone();taps++;} stirs++;continue;}
    if(o.wrong&&t.kind==='pick'&&c._w!==t.id){const bad=v.hots.find((x,i)=>!t.items[i][2]);c._w=t.id;if(bad){bad.tap();taps++;continue;}}
    let en=v.hots.filter(x=>!x.disabled);if(t.kind==='pick')en=v.hots.filter((x,i)=>!x.disabled&&t.items[i][2]);
    const hot=t.kind==='pick'?en[0]:(en.find(x=>x.ring!=='none')||en[0]);
    if(!hot)throw new Error('stuck at '+t.id);
    const a=t.acts&&t.acts.find(x=>(c.state.p[x[0]]||0)<x[3]);
    if(a&&a[6]&&a[6].min&&!o.early)c.setState({sec:a[6].min+3});
    hot.tap();taps++;flush();
  }
  let v=c.renderVals();const st0={notTasted:v.notTasted};v.taste();v=c.renderVals();
  const ans=o.ans||[1,1,1];v.qs.forEach((q,i)=>q.opts[ans[i]].pick());taps+=4;v=c.renderVals();const can=v.canJudge;v.judge();v=c.renderVals();
  return {taps,stirs,n:seen.length,seen:seen.join(' '),screen:c.state.screen,can,tasted:v.tasted,score:v.scoreText,rows:v.rows.map(r=>r.score+' '+r.say).join(' | '),tip:v.tipNext,xp:v.xpTitle+' / '+v.xpLeft,rec};
}
const show=(l,r)=>console.log(l+': '+JSON.stringify(r));
show('kaprao clean',run({}));
show('kaprao timers run out',run({wait:true}));
show('kaprao slips',run({o1:2,o2:2,wrong:true,early:true,ans:[2,1,0],app:true}));
show('omelet plain',run({recipe:'omelet',app:true}));
show('omelet spicy soft skip',run({recipe:'omelet',o1:2,o2:1,skip:['whisk','mid'],ans:[1,0,1]}));
