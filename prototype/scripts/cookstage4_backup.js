class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { phase: 0, bad: '', stirring: false, asking: false, early: false, started: false, screen: 'recipe', serv: 1, have: {}, ti: 0, at: 'door', arrived: false, walking: false, face: 1, p: {}, fin: false, note: '', heat: 0, sec: 0, k: 0, stars: 0 };
  }
  componentWillUnmount() { clearInterval(this.tick); clearTimeout(this.t1); clearTimeout(this.t2); clearTimeout(this.t3); clearTimeout(this.t4); }
  tasks() {
    const T = (step, st, t, kind, o) => Object.assign({ step, st, t, kind }, o);
    const W = [300, 184, 80, 50], F = [146, 186, 46, 52];
    return [
      T(0, 'fridge', 'หยิบของจากตู้เย็น', 'pick', { go: 'เดินไปเปิดตู้เย็น', hint: 'แตะของในตู้: หมูสับ ไข่ กะเพรา กระเทียม พริก', fin: 'ได้ของครบแล้ว', items: [['pork', 'หมูสับ', 1, '', [14, 182, 22, 22]], ['egg', 'ไข่ไก่', 1, '', [41, 182, 22, 22]], ['basil', 'กะเพรา', 1, '', [68, 182, 22, 22]], ['garlic', 'กระเทียม', 1, '', [14, 228, 22, 22]], ['chili', 'พริก', 1, '', [41, 228, 22, 22]], ['morning', 'ผักบุ้ง', 0, 'ผักบุ้งเก็บไว้ทำเมนูอื่นนะ', [68, 228, 22, 22]]] }),
      T(0, 'board', 'วางเขียง', 'seq', { go: 'เดินไปที่เคาน์เตอร์', hint: 'แตะเขียงที่พิงผนังอยู่ เพื่อหยิบมาวาง', fin: 'เขียงพร้อมแล้ว', acts: [['board', 'หยิบเขียง', 'board', 1, [254, 194, 26, 42]]] }),
      T(0, 'rack', 'เลือกมีด', 'pick', { go: 'ไปที่ราวแขวนมีด', hint: 'แตะมีดที่เหมาะกับการสับกระเทียม', fin: 'มีดเชฟ ใช้ได้เกือบทุกงาน', items: [['knife_cleaver', 'ปังตอ', 0, 'ปังตอหนักไปสำหรับงานนี้', [207, 134, 24, 54]], ['knife_chef', 'มีดเชฟ', 1, '', [235, 134, 22, 58]], ['knife_paring', 'มีดปอก', 0, 'มีดปอกเล็กไป สับไม่ถนัด', [261, 138, 19, 40]]] }),
      T(0, 'board', 'สับกระเทียมกับพริก', 'seq', { go: 'กลับไปที่เขียง', hint: 'แตะกระเทียมบนเขียงเพื่อสับ แล้วตามด้วยพริก', fin: 'สับเสร็จ สวยเลย', acts: [['garlic', 'สับกระเทียม', 'garlic', 4, [218, 202, 22, 22], 1], ['chili', 'สับพริก', 'chili', 4, [248, 202, 22, 22], 1]] }),
      T(0, 'sink', 'ล้างใบกะเพรา', 'seq', { go: 'เดินไปที่อ่างล้างจาน', hint: 'แตะก๊อกน้ำเพื่อเปิดน้ำล้างใบกะเพรา', fin: 'สะอาดแล้ว', acts: [['wash', 'เปิดน้ำล้าง', 'water', 1, F]] }),
      T(1, 'stove', 'เปิดเตาแก๊ส', 'seq', { go: 'เดินไปที่เตา', hint: 'แตะลูกบิดเครื่องหมายบวก เพื่อจุดไฟ', fin: 'ไฟติดแล้ว', acts: [['knob', 'จุดไฟ', 'knob', 1, [355, 249, 22, 22]]] }),
      T(1, 'stove', 'หรี่ไฟเป็นกลาง', 'heat', { target: 1, hint: 'ไฟแรงไปไข่จะไหม้ แตะลูกบิดลบเพื่อหรี่ไฟ', fin: 'ไฟกำลังดี' }),
      T(1, 'stove', 'ทอดไข่ดาว', 'seq', { hint: 'แตะขวดน้ำมัน รอให้ร้อน แล้วแตะไข่', fin: 'ฉ่า! รอให้ขอบกรอบ', acts: [['oil', 'เทน้ำมัน', 'oil', 1, [234, 208, 24, 24], 1], ['egg', 'ตอกไข่', 'egg', 1, [262, 210, 22, 22], 1]] }),
      T(1, 'stove', 'ตักไข่ขึ้นพัก', 'seq', { hint: 'ราว 2 นาที ขอบกรอบเหลืองแล้วแตะกระทะเพื่อตัก', fin: 'ไข่ดาวสวยมาก', acts: [['scoop', 'ตักไข่ขึ้น', 'spatula', 1, W]] }),
      T(2, 'stove', 'ผัดกระเทียมพริก', 'seq', { hint: 'แตะกระเทียมพริกที่สับไว้ แล้วแตะกระทะหนึ่งครั้งเพื่อผัด', fin: 'หอมแล้ว', acts: [['mix', 'ใส่กระเทียมพริก', 'garlic', 1, [246, 208, 24, 24], 1], ['stir', 'ผัด', 'spatula', 5, W]] }),
      T(3, 'stove', 'เร่งไฟแรง', 'heat', { target: 2, hint: 'หมูต้องใช้ไฟแรง แตะลูกบิดบวก', fin: 'ไฟแรงแล้ว' }),
      T(3, 'stove', 'ผัดหมูสับ', 'seq', { hint: 'แตะหมูสับเพื่อใส่ แล้วแตะกระทะ เชฟจะยีและผัดจนสุก', fin: 'หมูสุกทั่วแล้ว', acts: [['pork', 'ใส่หมูสับ', 'pork', 1, [246, 208, 24, 24], 1], ['stir', 'ยีและผัด', 'spatula', 8, W]] }),
      T(4, 'shelf', 'หยิบเครื่องปรุง', 'pick', { go: 'เดินไปที่ชั้นเครื่องปรุง', hint: 'แตะซอสหอย ซีอิ๊วขาว น้ำปลา และน้ำตาล', fin: 'เครื่องปรุงครบ', items: [['oyster', 'ซอสหอย', 1, '', [108, 140, 15, 40]], ['soy', 'ซีอิ๊วขาว', 1, '', [126.5, 140, 15, 40]], ['fish', 'น้ำปลา', 1, '', [145, 140, 15, 40]], ['oil', 'น้ำมัน', 0, 'น้ำมันใส่ไปแล้วนะ', [163.5, 140, 15, 40]], ['sugar', 'น้ำตาล', 1, '', [182, 156, 18, 24]]] }),
      T(4, 'sink', 'รองน้ำ', 'seq', { go: 'เดินไปที่ก๊อกน้ำ', hint: 'แตะก๊อกน้ำ รองน้ำเปล่า 2 ช้อนโต๊ะ', fin: 'ได้น้ำแล้ว', acts: [['water', 'รองน้ำ', 'water', 1, F]] }),
      T(4, 'stove', 'ปรุงรส', 'seq', { go: 'กลับไปที่เตา', hint: 'แตะเครื่องปรุง แตะน้ำ แล้วแตะกระทะเพื่อผัด', fin: 'ชิมดู เค็มไปเติมน้ำ จืดไปเติมน้ำปลา', acts: [['season', 'ใส่เครื่องปรุง', 'oyster', 1, [234, 208, 24, 24], 1], ['addwater', 'เติมน้ำ', 'water', 1, [262, 210, 22, 22], 1], ['stir', 'ผัด', 'spatula', 4, W]] }),
      T(5, 'stove', 'ปิดไฟ', 'heat', { target: 0, hint: 'แตะลูกบิดลบจนไฟดับ ก่อนใส่กะเพรา', fin: 'ปิดไฟแล้ว' }),
      T(5, 'stove', 'ใส่กะเพรา', 'seq', { hint: 'แตะใบกะเพรา แล้วแตะกระทะผัดเร็วๆ', fin: 'หอมมาก', acts: [['basil', 'ใส่กะเพรา', 'basil', 1, [246, 208, 24, 24], 1], ['stir', 'ผัด', 'spatula', 3, W]] }),
      T(5, 'stove', 'จัดจาน', 'seq', { hint: 'แตะกระทะเพื่อตักราดข้าว', fin: 'เสร็จแล้ว!', acts: [['plate', 'ตักใส่จาน', 'rice', 1, W]] }),
    ];
  }
  chefX(at) { return ({ out: -120, door: 150, fridge: 88, shelf: 106, sink: 106, rack: 198, board: 198, stove: 262 })[at]; }
  startCook() {
    clearInterval(this.tick); clearTimeout(this.t1); clearTimeout(this.t2); clearTimeout(this.t3); clearTimeout(this.t4);
    const calm = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm) { this.setState({ started: true, asking: false }); this.enterKitchen(true); return; }
    this.setState({ screen: 'enter', phase: 0, started: true, asking: false });
    this.t3 = setTimeout(() => this.setState({ phase: 1 }), 80);
    this.t4 = setTimeout(() => this.enterKitchen(false), 1800);
  }
  enterKitchen(instant) {
    clearTimeout(this.t3); clearTimeout(this.t4); clearTimeout(this.t1);
    this.setState({ screen: 'cook', ti: 0, at: instant ? 'door' : 'out', arrived: false, walking: !instant, face: 1, p: {}, fin: false, note: '', heat: 0, sec: 0 });
    if (instant) return;
    this.t3 = setTimeout(() => this.setState({ at: 'door' }), 80);
    this.t1 = setTimeout(() => this.setState({ walking: false }), 900);
  }
  go(id) {
    const s = this.state, t = this.tasks()[s.ti];
    if (s.fin || s.walking) return;
    if (id !== t.st) { this.setState({ note: 'ตอนนี้ยังไม่ต้องไปตรงนั้นนะ', k: s.k + 1 }); return; }
    if (s.arrived) return;
    const from = this.chefX(s.at), to = this.chefX(id);
    this.setState({ at: id, walking: true, face: to < from ? -1 : 1, note: '' });
    clearTimeout(this.t1);
    this.t1 = setTimeout(() => this.setState({ walking: false, arrived: true, face: 1 }), to === from ? 60 : 720);
  }
  finish() {
    const s = this.state, all = this.tasks(), nx = all[s.ti + 1];
    this.setState({ fin: true, note: '', bad: '' });
    clearTimeout(this.t2);
    this.t2 = setTimeout(() => this.nextTask(), nx && nx.st === all[s.ti].st ? 550 : 850);
  }
  nextTask() {
    clearTimeout(this.t1); clearTimeout(this.t2); clearInterval(this.auto); this.auto = null;
    const s = this.state, all = this.tasks(), t = all[s.ti], ni = s.ti + 1;
    let heat = s.heat;
    if (t.kind === 'heat') heat = t.target;
    if (s.ti === 5) heat = 2;
    if (s.ti === 15) heat = 0;
    if (ni >= all.length) { clearInterval(this.tick); this.setState({ screen: 'done', fin: false, heat: 0, started: false }); return; }
    if (ni !== 8) clearInterval(this.tick);
    this.setState({ ti: ni, p: {}, fin: false, note: '', bad: '', stirring: false, early: false, heat, walking: false, arrived: all[ni].st === s.at });
  }
  prevTask() {
    const s = this.state;
    if (s.ti === 0) return;
    clearTimeout(this.t1); clearTimeout(this.t2); clearInterval(this.auto); this.auto = null; clearInterval(this.tick);
    const H = [0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 0, 0], ni = s.ti - 1;
    this.setState({ ti: ni, p: {}, fin: false, note: '', bad: '', stirring: false, early: false, sec: 0, heat: H[ni], walking: false, arrived: this.tasks()[ni].st === s.at });
  }
  resume() {
    this.setState({ screen: 'cook', asking: false, p: {}, fin: false, note: '', bad: '', stirring: false, early: false, walking: false, arrived: false });
  }
  doAct(t, a) {
    const s = this.state, id = a[0], n = s.p[id] || 0;
    if (s.fin || n >= a[3]) return;
    if (id === 'scoop' && s.sec < 120 && !s.early) { this.setState({ early: true, note: 'ยังไม่ถึง 2 นาที ถ้าขอบกรอบเหลืองแล้ว แตะกระทะอีกครั้งเพื่อตัก', k: s.k + 1 }); return; }
    if (id === 'stir') {
      if (this.auto) return;
      this.setState({ stirring: true, bad: '' });
      this.auto = setInterval(() => this.stirTick(t, a), 420);
      this.stirTick(t, a);
      return;
    }
    const p = Object.assign({}, s.p, { [id]: n + 1 });
    const patch = { p, k: s.k + 1, note: '' };
    if (id === 'knob') patch.heat = 2;
    if (id === 'egg') { clearInterval(this.tick); patch.sec = 0; this.tick = setInterval(() => this.setState({ sec: this.state.sec + 1 }), 1000); }
    if (id === 'scoop') clearInterval(this.tick);
    this.setState(patch);
    if (t.acts.every((x) => (p[x[0]] || 0) >= x[3])) this.finish();
  }
  stirTick(t, a) {
    const s = this.state, n = s.p.stir || 0;
    const stop = () => { clearInterval(this.auto); this.auto = null; };
    if (s.fin || s.screen !== 'cook' || n >= a[3]) { stop(); this.setState({ stirring: false }); return; }
    const p = Object.assign({}, s.p, { stir: n + 1 });
    this.setState({ p, k: s.k + 1, note: '' });
    if (n + 1 >= a[3]) { stop(); this.setState({ stirring: false }); if (t.acts.every((x) => (p[x[0]] || 0) >= x[3])) this.finish(); }
  }
  doPick(t, it) {
    const s = this.state;
    if (s.fin) return;
    if (!it[2]) { this.setState({ note: it[3], bad: it[0], k: s.k + 1 }); return; }
    const p = Object.assign({}, s.p, { [it[0]]: 1 });
    this.setState({ p, k: s.k + 1, note: '', bad: '' });
    if (t.items.every((x) => !x[2] || p[x[0]])) this.finish();
  }
  bump(t, d) {
    const s = this.state;
    if (s.fin) return;
    const i = Math.max(0, Math.min(2, s.heat + d));
    this.setState({ heat: i, k: s.k + 1, note: '' });
    if (t.kind === 'heat' && i === t.target) this.finish();
  }
  renderVals() {
    const s = this.state;
    const IMG = __IMG__;
    const X = __X__;
    const base = [
      { id: 'pork', name: 'หมูสับ', q: 120, u: 'กรัม', p: 22 },
      { id: 'basil', name: 'ใบกะเพรา', q: 1, u: 'กำมือ', p: 5 },
      { id: 'garlic', name: 'กระเทียม', q: 4, u: 'กลีบ', p: 2 },
      { id: 'chili', name: 'พริกขี้หนู', q: 4, u: 'เม็ด', p: 2 },
      { id: 'egg', name: 'ไข่ไก่', q: 1, u: 'ฟอง', p: 5 },
      { id: 'rice', name: 'ข้าวสวย', q: 1, u: 'จาน', p: 7 },
      { id: 'oil', name: 'น้ำมันพืช', q: 2, u: 'ช้อนโต๊ะ', p: 2 },
      { id: 'oyster', name: 'ซอสหอยนางรม', q: 1, u: 'ช้อนโต๊ะ', p: 2 },
      { id: 'soy', name: 'ซีอิ๊วขาว', q: 1, u: 'ช้อนชา', p: 1 },
      { id: 'fish', name: 'น้ำปลา', q: 1, u: 'ช้อนชา', p: 1 },
      { id: 'sugar', name: 'น้ำตาลทราย', q: 0.5, u: 'ช้อนชา', p: 1 },
    ];
    const num = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
    let total = 0;
    const items = base.map((it) => {
      const have = !!s.have[it.id];
      const price = it.p * s.serv;
      if (!have) total += price;
      return {
        name: it.name, img: IMG[it.id], have, qtyText: num(it.q * s.serv) + ' ' + it.u,
        priceText: have ? 'มีแล้ว' : '฿' + price, priceColor: have ? '#4A7443' : '#3B2A22',
        boxBg: have ? '#5E8F57' : '#F6E6CF',
        toggle: () => this.setState({ have: Object.assign({}, s.have, { [it.id]: !have }) }),
      };
    });
    const all = this.tasks(), ti = s.ti, t = all[ti];
    const c = (id) => s.p[id] || 0;
    const pic = (k) => X[k] || IMG[k];
    const HN = ['ไฟปิดอยู่', 'ไฟกลาง', 'ไฟแรง'];
    const SOFT = '#F5F3FC', GREEN = '#C9F2CF', RING = '0 0 0 1.5px #24212B, 0 0 0 3.5px #FFE66D';
    const goText = t.go || 'เดินไปที่เตา';
    const zoom = s.arrived;
    const hot = (r, o) => Object.assign({ x: r[0], y: r[1], w: r[2], h: r[3], img: '', hasImg: false, op: 1, ring: 'none', disabled: false, cls: 'hot' }, o);
    let hots = [], todo = [];
    if (zoom && t.kind === 'pick') {
      t.items.forEach((it) => {
        const got = c(it[0]) > 0, loose = t.st === 'fridge';
        hots.push(hot(it[4], { img: loose ? pic(it[0]) : '', hasImg: loose, op: got ? 0 : 1, ring: loose || got ? 'none' : 'inset 0 0 0 1px rgba(36,33,43,.45)', disabled: got || s.fin, cls: 'hot' + (s.bad === it[0] ? ' nope' + (s.k % 2) : got ? '' : ' bobs'), aria: 'หยิบ' + it[1], tap: () => this.doPick(t, it) }));
        if (it[2]) todo.push({ img: pic(it[0]), label: it[1], count: got ? 'หยิบแล้ว' : 'รอหยิบ', bg: got ? GREEN : SOFT, op: 1 });
      });
    } else if (zoom && t.kind === 'heat') {
      const need = t.target > s.heat ? 1 : -1;
      hots.push(hot([303, 249, 22, 22], { ring: need < 0 && !s.fin ? RING : 'none', disabled: s.fin, aria: 'หรี่ไฟลง', tap: () => this.bump(t, -1) }));
      hots.push(hot([355, 249, 22, 22], { ring: need > 0 && !s.fin ? RING : 'none', disabled: s.fin, aria: 'เร่งไฟขึ้น', tap: () => this.bump(t, 1) }));
      todo = [0, 1, 2].map((i) => ({ img: X['heat' + i], label: ['ปิด', 'กลาง', 'แรง'][i], count: s.heat === i ? 'ตอนนี้' : i === t.target ? 'เป้าหมาย' : '', bg: s.heat === i ? '#FFE66D' : SOFT, op: 1 }));
    } else if (zoom) {
      let first = -1;
      t.acts.forEach((a, i) => { if (first < 0 && c(a[0]) < a[3]) first = i; });
      t.acts.forEach((a, i) => {
        const n = c(a[0]), fin = n >= a[3], cur = i === first && !s.fin && !s.stirring;
        hots.push(hot(a[4], { img: a[5] ? pic(a[2]) : '', hasImg: !!a[5], op: fin && a[5] ? 0 : 1, ring: cur ? RING : 'none', disabled: !cur, aria: a[1], tap: () => this.doAct(t, a) }));
        todo.push({ img: pic(a[2]), label: a[1], count: fin ? 'เรียบร้อย' : a[3] > 1 ? n + ' / ' + a[3] : 'แตะในภาพ', bg: fin ? GREEN : SOFT, op: fin || i === first ? 1 : 0.55 });
      });
    }
    const walk = { label: goText, img: X.walk, disabled: s.walking, tap: () => this.go(t.st) };
    const CAM = { fridge: [2.1, 62, 238], shelf: [3, 154, 190], sink: [2.4, 154, 240], rack: [2.5, 246, 196], board: [2.5, 246, 240], stove: [2.3, 306, 244] };
    let cam = 'translate(0px, 0px) scale(1)';
    if (zoom) {
      const [S, fx, fy] = CAM[t.st];
      const tx = Math.max(390 - 390 * S, Math.min(0, 195 - fx * S)), ty = Math.max(470 - 470 * S, Math.min(0, 235 - fy * S));
      cam = 'translate(' + tx.toFixed(1) + 'px, ' + ty.toFixed(1) + 'px) scale(' + S + ')';
    }
    const hex = (a, b, r) => '#' + [1, 3, 5].map((i) => { const x = parseInt(a.substr(i, 2), 16), y = parseInt(b.substr(i, 2), 16); return ('0' + Math.round(x + (y - x) * Math.min(1, r)).toString(16)).slice(-2); }).join('');
    const plated = ti === 17 && c('plate') > 0;
    const stoveSeq = t.st === 'stove' && t.kind === 'seq' && ti >= 7;
    const took = (id, at) => ti > at || (ti === at && c(id) > 0);
    const sc = {
      fridge: ti === 0 && s.arrived,
      rkCleaver: true, rkParing: true, rkChef: !took('knife_chef', 2),
      bOyster: !took('oyster', 12), bSoy: !took('soy', 12), bFish: !took('fish', 12), bSugar: !took('sugar', 12), bOil: true,
      boardLean: !took('board', 1), board: took('board', 1),
      knife: ti > 3 && ti < 10, bits: ti > 3 && ti < 10,
      colander: ti === 4, cup: ti === 13,
      water: (ti === 4 && c('wash') > 0) || (ti === 13 && c('water') > 0),
      low: s.heat === 1, high: s.heat === 2, pm: true, h0: s.heat === 0, h1: s.heat === 1, h2: s.heat === 2,
      wOil: !plated && ti < 9 && took('oil', 7),
      wEgg: (ti === 7 && c('egg') > 0) || (ti === 8 && c('scoop') === 0),
      wAroma: !plated && took('mix', 9) && !took('pork', 11),
      wPork: !plated && took('pork', 11),
      wBasil: !plated && took('basil', 16),
      eggplate: !plated && took('scoop', 8),
      dish: plated, spat: stoveSeq && s.arrived && !plated && ti !== 7,
      fume: s.heat > 0 && ti >= 7 && !plated,
    };
    const bits = [];
    if (ti === 3) {
      for (let i = 0; i < c('garlic') * 2; i++) bits.push({ x: 216 + (i % 4) * 4.2, y: 219 + Math.floor(i / 4) * 2.4, w: 3.6, h: 2.6, c: '#FFFDF4' });
      for (let i = 0; i < c('chili') * 2; i++) bits.push({ x: 246 + (i % 4) * 4.6, y: 219.4 + Math.floor(i / 4) * 2.2, w: 4.2, h: 2, c: '#F0584A' });
    }
    const SP = [['fridge', 'ตู้เย็น', 8, 84, 90, 234], ['shelf', 'ชั้นเครื่องปรุง', 106, 136, 96, 52], ['sink', 'อ่างล้างจานและก๊อกน้ำ', 106, 192, 96, 126], ['rack', 'ราวแขวนมีด', 206, 132, 80, 62], ['board', 'เคาน์เตอร์และเขียง', 206, 198, 82, 120], ['stove', 'เตาแก๊ส', 292, 184, 96, 134]];
    const spots = SP.map(([id, label, x, y, w, h]) => {
      const target = id === t.st && !s.arrived && !s.fin && !s.walking;
      return { aria: 'เดินไปที่' + label, x, y, w, h, target, off: zoom, cls: target ? 'spot pulse' : 'spot', ring: target ? '0 0 0 4px #24212B, 0 0 0 9px #FFE66D' : 'none', tap: () => this.go(id) };
    });
    const mm = Math.floor(s.sec / 60), ss = s.sec % 60;
    const timing = (ti === 7 && c('egg') > 0) || ti === 8;
    const notes = ['', 'ต้องฝึกอีกนิด ครั้งหน้าดีขึ้นแน่', 'พอกินได้ ลองปรับรสดูนะ', 'ใช้ได้เลย', 'อร่อยมาก', 'ระดับเชฟแล้ว! ได้ 40 แต้มประสบการณ์'];
    return {
      isRecipe: s.screen === 'recipe', isCook: s.screen === 'cook', isDone: s.screen === 'done',
      serv: s.serv, items, totalText: '฿' + total,
      less: () => this.setState({ serv: Math.max(1, s.serv - 1) }),
      more: () => this.setState({ serv: Math.min(4, s.serv + 1) }),
      start: () => (s.started ? this.resume() : this.startCook()), restart: () => this.startCook(),
      startLabel: s.started ? 'ทำต่อ' : 'เริ่มทำ', canResume: s.started,
      asking: s.asking, stay: () => this.setState({ asking: false }),
      leave: () => { clearInterval(this.tick); clearTimeout(this.t1); clearTimeout(this.t2); clearTimeout(this.t3); clearTimeout(this.t4); clearInterval(this.auto); this.auto = null; this.setState({ screen: 'recipe', asking: false, stirring: false }); },
      back: () => this.prevTask(), noBack: ti === 0, backOp: ti === 0 ? 0.4 : 1,
      timerBg: s.sec >= 120 ? '#1E7A45' : '#24212B',
      toRecipe: () => this.setState({ asking: true }),
      isEnter: s.screen === 'enter', skipEnter: () => this.enterKitchen(true),
      enterT: s.phase ? 'translate(147px, 196px) scale(0.72)' : 'translate(147px, 560px) scale(1.4)',
      skip: () => this.nextTask(),
      stepNo: t.step + 1, stepCount: 6,
      bars: (() => {
        const tone = (on) => (on ? '#C2512E' : '#FFFFFF');
        const inStep = all.filter((x) => x.step === t.step), pos = inStep.indexOf(t) + (s.fin ? 1 : 0);
        const pct = Math.round((pos / inStep.length) * 100);
        return [0, 1, 2, 3, 4, 5].map((i) => ({ bg: i === t.step ? 'linear-gradient(90deg, ' + tone(1) + ' ' + pct + '%, ' + tone(0) + ' ' + pct + '%)' : tone(i < t.step) }));
      })(),
      taskTitle: t.t,
      hint: s.note || (ti === 8 && s.sec >= 120 && !s.fin ? 'ครบ 2 นาทีแล้ว แตะกระทะเพื่อตักไข่ขึ้นได้เลย' : s.fin ? t.fin : s.walking ? 'กำลังเดินไป...' : !s.arrived ? goText : t.hint),
      sc, plated, bits, spots, hots, todo, walk, cam, showWalk: !zoom, showTodo: zoom,
      timing, timeText: (s.sec >= 120 ? 'ครบเวลาแล้ว ' : 'ทอดมาแล้ว ') + mm + ':' + (ss < 10 ? '0' : '') + ss + ' / 2:00',
      showHeat: zoom && t.st === 'stove', heatText: HN[s.heat], cupFill: Math.min(12, c('water') * 10), spatCls: s.k % 2 ? 'spat1' : 'spat0',
      chefX: this.chefX(s.at), chefY: zoom ? -26 : 0, chefFace: s.face,
      chefCls: 'bot' + (s.walking ? ' walking mood-calm' : s.fin ? ' mood-happy' : s.arrived ? ' back pose-' + (t.kind === 'pick' ? 'reach' : t.kind === 'heat' || ti === 1 || ti === 5 ? 'knob' : t.st === 'sink' ? 'wash' : ti === 3 ? 'chop' : 'stir') + ' act' + (s.k % 2) : ' mood-calm'),
      porkColor: ti === 11 ? hex('#F4A7A0', '#B5714A', c('stir') / 8) : ti < 14 ? '#B5714A' : ti === 14 ? hex('#B5714A', '#96583A', c('season')) : '#96583A',
      stars: [1, 2, 3, 4, 5].map((n) => ({ on: n <= s.stars, fill: n <= s.stars ? '#F2C14E' : '#FFFFFF', label: 'ให้ ' + n + ' ดาว', pick: () => this.setState({ stars: n }) })),
      rateNote: s.stars ? notes[s.stars] : 'แตะดาวเพื่อให้คะแนนเมนูนี้',
      again: () => this.setState({ screen: 'recipe', stars: 0, started: false }),
    };
  }
}
