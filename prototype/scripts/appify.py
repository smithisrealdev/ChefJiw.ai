# Last build step. Makes every screen usable two ways:
#   alone on the canvas (links are <a href> between artboards), and
#   mounted inside App.dc.html, which owns the shared state (level, cooked dishes) and switches screens.
import re, json
ROOT='../screens/'
PAGES=['Restaurant','Recipes','Cook','Market','Ranking','Calories','Me']
METHODS='''  save() { const a = this.props.app; return (a && a.save) || { xp: 520, runs: [], pickN: 0 }; }
  prof() {
    const d = this.save(), runs = d.runs || [], into = d.xp % 200;
    const of = (name) => runs.filter((r) => r.name === name);
    return { runs, level: Math.floor(d.xp / 200) + 1, into, left: 200 - into, pct: Math.round(into / 2) + '%', cooked: 7 + runs.length,
      count: (name) => of(name).length, best: (name) => of(name).reduce((m, r) => Math.max(m, r.score), 0), last: runs[runs.length - 1] || null };
  }
  renderVals() {
    const v = this.pageVals(), app = this.props.app, inApp = !!(app && app.go), go = {};
    @@PAGES@@.forEach((n) => { go[n] = inApp ? () => app.go(n) : null; });
    return Object.assign(v, { inApp, solo: !inApp, go });
  }
'''.replace('@@PAGES@@',json.dumps(PAGES))
A=re.compile(r'<a\b([^>]*?)\shref="(\w+)\.dc\.html"([^>]*)>(.*?)</a>',re.S)
def dual(m):
    attrs=(m.group(1)+m.group(3)); target=m.group(2); inner=m.group(4)
    dg=re.search(r'\sdata-go="([\w.]+)"',attrs); handler=dg.group(1) if dg else 'go.'+target
    attrs=re.sub(r'\sdata-go="[\w.]+"','',attrs)
    st=re.search(r'style="([^"]*)"',attrs); style=st.group(1) if st else ''
    reset='border: 0; margin: 0; font: inherit; text-align: inherit; cursor: pointer'
    if 'padding' not in style: reset+='; padding: 0'
    if 'background' not in style: reset+='; background: transparent'
    if not re.search(r'(^|;\s*)color:',style): reset+='; color: inherit'
    battrs=attrs.replace('style="'+style+'"','style="'+reset+'; '+style+'"') if st else attrs+' style="'+reset+'"'
    return ('<sc-if value="{{solo}}" hint-placeholder-val="{{true}}"><a'+attrs+' href="'+target+'.dc.html">'+inner+'</a></sc-if>'
            '<sc-if value="{{inApp}}" hint-placeholder-val="{{false}}"><button'+battrs+' onClick="{{'+handler+'}}">'+inner+'</button></sc-if>')
for n in PAGES:
    h=open(ROOT+n+'.dc.html',encoding='utf-8').read()
    body,script=h.split('</x-dc>')
    body,k=A.subn(dual,body)
    assert script.count('  renderVals() {')==1,n
    script=script.replace('  renderVals() {',METHODS+'  pageVals() {')
    assert script.count("data-props='{")==1,n
    script=script.replace("data-props='{","data-props='{\"app\":{\"editor\":null},")
    open(ROOT+n+'.dc.html','w',encoding='utf-8').write(body+'</x-dc>'+script)
    print(n,k,'links')
frames='\n'.join(f'<sc-if value="{{{{seen.{n}}}}}" hint-placeholder-val="{{{{{"true" if n=="Restaurant" else "false"}}}}}"><div style="position: absolute; inset: 0; display: {{{{show.{n}}}}}"><dc-import name="{n}" app="{{{{app}}}}" hint-size="390px,844px"></dc-import></div></sc-if>' for n in PAGES)
app=f'''<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<title>แอปทำอาหาร เล่นต่อเนื่องทุกหน้า</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mali:wght@500;600;700&amp;family=IBM+Plex+Sans+Thai+Looped:wght@400;500;600;700&amp;display=swap">
<style>
body{{margin:0}}
</style>
</helmet>
<div style="position: relative; width: 390px; height: 844px; overflow: hidden; background: #FFFFFF; font-family: 'IBM Plex Sans Thai Looped', sans-serif; color: #24212B">
{frames}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":390,"height":844}}}}'>
class Component extends DCLogic {{
  constructor(props) {{
    super(props);
    // one shared record for the whole app: points, dishes cooked in this session, and the recipe picked to cook next
    this.state = {{ screen: 'Restaurant', seen: {{ Restaurant: true }}, save: {{ xp: 520, runs: [], pick: 'kaprao', pickN: 0 }} }};
  }}
  open(n, save) {{
    const s = this.state;
    this.setState({{ screen: n, seen: Object.assign({{}}, s.seen, {{ [n]: true }}), save: save || s.save }});
  }}
  renderVals() {{
    const s = this.state, show = {{}};
    {json.dumps(PAGES)}.forEach((n) => {{ show[n] = s.screen === n ? 'block' : 'none'; }});
    const app = {{
      save: s.save,
      go: (n) => this.open(n),
      cook: (id) => this.open('Cook', Object.assign({{}}, s.save, {{ pick: id, pickN: s.save.pickN + 1 }})),
      record: (r) => {{ const d = this.state.save; this.setState({{ save: Object.assign({{}}, d, {{ xp: d.xp + r.gain, runs: d.runs.concat([r]) }}) }}); }},
    }};
    return {{ app, show, seen: s.seen }};
  }}
}}
</script>
</body>
</html>
'''
open(ROOT+'App.dc.html','w',encoding='utf-8').write(app)
print('App',len(app))
